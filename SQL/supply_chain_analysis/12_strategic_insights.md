# Part 12 — Strategic Business Insights (Q46–Q50)

[← Back to README](../README.md)

---

## Q46. Which plant has the highest average warehouse cost per order?

**Step 1 — Raw cost per unit by plant:**
```sql
SELECT
    wh                                        AS plant_code,
    ROUND(cost_per_unit, 6)                   AS cost_per_unit,
    RANK() OVER (ORDER BY cost_per_unit DESC) AS unit_cost_rank
FROM wh_costs
ORDER BY cost_per_unit DESC;
```
> **Result: PLANT18 has the highest raw cost per unit.**

**Step 2 — Avg warehouse spend per order vs network average, with flag:**
```sql
WITH plant_costs AS (
    SELECT
        o.plant_code,
        ROUND(AVG(o.unit_quantity * w.cost_per_unit), 2) AS avg_cost_per_order
    FROM order_lists o
    JOIN wh_costs w ON o.plant_code = w.wh
    WHERE o.data_issue_flag IS NULL
    GROUP BY o.plant_code
),
network_avg AS (
    SELECT ROUND(AVG(avg_cost_per_order), 2) AS network_avg_cost FROM plant_costs
)
SELECT
    pc.plant_code,
    pc.avg_cost_per_order,
    na.network_avg_cost,
    ROUND(pc.avg_cost_per_order - na.network_avg_cost, 2) AS diff_from_avg,
    CASE
        WHEN pc.avg_cost_per_order > na.network_avg_cost THEN 'ABOVE AVERAGE — Review'
        ELSE 'Within Average'
    END                                                   AS status_flag
FROM plant_costs pc
CROSS JOIN network_avg na
ORDER BY diff_from_avg DESC;
```
> **Result: PLANT09 = $8,674/order (4× avg) | PLANT16 = $2,720/order | Network avg = $2,174.80**

---

## Q47. Most cost-effective carrier for high-weight orders

Uses `ROW_NUMBER()` to compute P75 weight threshold (MySQL-compatible alternative to `PERCENTILE_CONT`):

```sql
WITH p75_threshold AS (
    SELECT MAX(weight) AS p75
    FROM (
        SELECT weight,
               ROW_NUMBER() OVER (ORDER BY weight) AS rn,
               COUNT(*) OVER ()                    AS total
        FROM order_lists WHERE data_issue_flag IS NULL
    ) ranked
    WHERE rn <= CEIL(0.75 * total)
),
high_weight_orders AS (
    SELECT o.order_id, o.carrier, o.weight,
           GREATEST(o.weight * f.rate, f.minimum_cost)        AS freight_cost,
           ROUND(GREATEST(o.weight * f.rate, f.minimum_cost)
                 / NULLIF(o.weight, 0), 4)                    AS cost_per_kg
    FROM order_lists o
    JOIN freight_rates f
      ON o.carrier = f.carrier AND o.origin_port = f.orig_port_cd
     AND o.destination_port = f.dest_port_cd AND o.service_level = f.svc_cd
     AND o.weight BETWEEN f.minm_wgh_qty AND f.max_wgh_qty
    JOIN p75_threshold pt ON o.weight >= pt.p75
    WHERE o.data_issue_flag IS NULL
)
SELECT
    carrier,
    COUNT(*)                    AS high_weight_orders,
    ROUND(AVG(weight), 2)       AS avg_weight_kg,
    ROUND(AVG(freight_cost), 2) AS avg_freight_cost,
    ROUND(AVG(cost_per_kg), 4)  AS avg_cost_per_kg,
    RANK() OVER (ORDER BY AVG(cost_per_kg) ASC) AS efficiency_rank
FROM high_weight_orders
GROUP BY carrier
ORDER BY avg_cost_per_kg ASC;
```
> **Result: V444_1 = $0.098/kg | V444_0 = $0.1207/kg — V444_0 is 23% more expensive per kg**

**Savings if all high-weight orders switched to V444_1:**
> **Result: $55,595.47 — an 83.17% reduction on the heavy-order freight segment**

---

## Q48. Which destination ports contribute the highest logistics cost?

```sql
SELECT
    o.destination_port,
    COUNT(*)                                                           AS total_orders,
    ROUND(SUM(
        GREATEST(o.weight * f.rate, f.minimum_cost)
        + (o.unit_quantity * w.cost_per_unit)
    ), 2)                                                              AS total_network_cost,
    ROUND(AVG(
        GREATEST(o.weight * f.rate, f.minimum_cost)
        + (o.unit_quantity * w.cost_per_unit)
    ), 2)                                                              AS avg_cost_per_order,
    RANK() OVER (ORDER BY SUM(
        GREATEST(o.weight * f.rate, f.minimum_cost)
        + (o.unit_quantity * w.cost_per_unit)
    ) DESC)                                                            AS cost_rank
FROM order_lists o
JOIN freight_rates f
  ON o.carrier = f.carrier AND o.origin_port = f.orig_port_cd
 AND o.destination_port = f.dest_port_cd AND o.service_level = f.svc_cd
 AND o.weight BETWEEN f.minm_wgh_qty AND f.max_wgh_qty
JOIN wh_costs w ON o.plant_code = w.wh
WHERE o.data_issue_flag IS NULL
GROUP BY o.destination_port
ORDER BY total_network_cost DESC;
```
> **Result: PORT09 is the ONLY destination port — 100% of $25,968,428.98 in a single port.**
> **Critical risk: Any disruption at PORT09 halts 100% of shipments with no fallback.**

---

## Q49. Speed premium — how much more expensive is ≤3-day delivery?

```sql
WITH all_options AS (
    SELECT o.order_id, o.plant_code, f.tpt_day_cnt,
           GREATEST(o.weight * f.rate, f.minimum_cost)
               + (o.unit_quantity * w.cost_per_unit)   AS total_cost
    FROM order_lists o
    JOIN freight_rates f
      ON o.origin_port = f.orig_port_cd AND o.destination_port = f.dest_port_cd
     AND o.weight BETWEEN f.minm_wgh_qty AND f.max_wgh_qty
    JOIN wh_costs w ON o.plant_code = w.wh
    WHERE o.data_issue_flag IS NULL
),
cheapest_standard AS (
    SELECT order_id, plant_code, MIN(total_cost) AS std_cost
    FROM all_options GROUP BY order_id, plant_code
),
cheapest_fast AS (
    SELECT order_id, plant_code, MIN(total_cost) AS fast_cost
    FROM all_options WHERE tpt_day_cnt <= 3
    GROUP BY order_id, plant_code
)
SELECT
    COUNT(cs.order_id)                                     AS orders_with_std_option,
    COUNT(cf.order_id)                                     AS orders_with_fast_option,
    COUNT(cs.order_id) - COUNT(cf.order_id)                AS orders_no_fast_option,
    ROUND(SUM(cs.std_cost), 2)                             AS total_standard_cost,
    ROUND(SUM(cf.fast_cost), 2)                            AS total_fast_cost,
    ROUND(SUM(cf.fast_cost) - SUM(cs.std_cost), 2)         AS cost_premium,
    ROUND((SUM(cf.fast_cost) - SUM(cs.std_cost))
          / SUM(cs.std_cost) * 100, 2)                     AS premium_pct
FROM cheapest_standard cs
LEFT JOIN cheapest_fast cf ON cs.order_id = cf.order_id;
```
> **Result: 100% of orders have a fast option | Premium = $1,492.96 (0.01%)**
> **Conclusion: Express SLAs can be offered at virtually no cost.**

---

## Q50. HEADLINE — Total network savings summary

> Full query logic shown in [Q39 and Q40](10_optimization_simulation.md).

```
┌─────────────────────────────────────────────────────────────┐
│  Total orders analyzed        :  15,398                     │
│  Total historical network cost:  $25,968,428.98             │
│  Total optimal network cost   :  $25,910,366.82             │
│  TOTAL POTENTIAL SAVINGS      :  $58,062.17  (0.22%)        │
│  Avg saving per order         :  $3.77                      │
│  Orders overpaying            :  6,368  (41.36%)            │
│  Plant with most savings      :  PLANT16 — $55,312.61       │
│  95.3% of all savings from    :  34 orders at PLANT16       │
└─────────────────────────────────────────────────────────────┘
```

---

[← Back to README](../README.md)
