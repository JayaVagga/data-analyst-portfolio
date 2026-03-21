# Part 10 — Optimization Simulation (Q36–Q40)

[← Back to README](../README.md)

---

## How the Simulation Works

The key insight is a **single change to the JOIN condition**:

| Historical JOIN | Optimization JOIN |
|---|---|
| Matches on the **carrier the order actually used** | Matches on **all carriers** serving the same route and weight band |
| Returns 1 option per order | Returns all available options per order |
| Shows what was paid | Shows what could have been paid |

`RANK() OVER (PARTITION BY order_id ORDER BY total_cost ASC) = 1` then selects the cheapest per order. Comparing this to historical cost reveals savings.

---

## Q36. All feasible freight options per order (relaxed carrier JOIN)

```sql
WITH feasible_options AS (
    SELECT
        o.order_id, o.order_date, o.plant_code,
        o.origin_port, o.destination_port, o.weight, o.unit_quantity,
        f.carrier                                         AS available_carrier,
        f.svc_cd, f.mode_dsc, f.tpt_day_cnt,
        GREATEST(o.weight * f.rate, f.minimum_cost)       AS freight_cost,
        ROUND(o.unit_quantity * w.cost_per_unit, 4)       AS warehouse_cost,
        GREATEST(o.weight * f.rate, f.minimum_cost)
            + (o.unit_quantity * w.cost_per_unit)         AS total_cost
    FROM order_lists o
    JOIN products_per_plant p
      ON o.plant_code = p.plant_code AND o.product_id = p.product_id
    JOIN plant_ports pp
      ON o.plant_code = pp.plant_code AND o.origin_port = pp.port
    JOIN freight_rates f                    -- NO carrier constraint here
      ON o.origin_port      = f.orig_port_cd
     AND o.destination_port = f.dest_port_cd
     AND o.service_level    = f.svc_cd
     AND o.weight BETWEEN f.minm_wgh_qty AND f.max_wgh_qty
    JOIN wh_costs w ON o.plant_code = w.wh
    WHERE o.data_issue_flag IS NULL
)
SELECT * FROM feasible_options ORDER BY order_id, total_cost;
```

---

## Q37. The cheapest feasible option per order (RANK = 1)

```sql
WITH feasible_options AS (
    SELECT
        o.order_id, o.plant_code,
        o.origin_port, o.destination_port, o.weight, o.unit_quantity,
        f.carrier                                         AS optimal_carrier,
        f.tpt_day_cnt,
        GREATEST(o.weight * f.rate, f.minimum_cost)       AS freight_cost,
        ROUND(o.unit_quantity * w.cost_per_unit, 4)       AS warehouse_cost,
        GREATEST(o.weight * f.rate, f.minimum_cost)
            + (o.unit_quantity * w.cost_per_unit)         AS optimal_total_cost,
        RANK() OVER (
            PARTITION BY o.order_id
            ORDER BY
                GREATEST(o.weight * f.rate, f.minimum_cost)
                + (o.unit_quantity * w.cost_per_unit) ASC
        )                                                 AS cost_rank
    FROM order_lists o
    JOIN freight_rates f
      ON o.origin_port      = f.orig_port_cd
     AND o.destination_port = f.dest_port_cd
     AND o.weight BETWEEN f.minm_wgh_qty AND f.max_wgh_qty
    JOIN wh_costs w ON o.plant_code = w.wh
    WHERE o.data_issue_flag IS NULL
)
SELECT * FROM feasible_options WHERE cost_rank = 1;
```

---

## Q38. Order-level: historical vs optimal cost with action flag

```sql
WITH historical AS (
    SELECT o.order_id, o.plant_code,
           o.carrier                                                  AS historical_carrier,
           GREATEST(o.weight * f.rate, f.minimum_cost)
               + (o.unit_quantity * w.cost_per_unit)                  AS historical_cost
    FROM order_lists o
    JOIN freight_rates f
      ON o.carrier = f.carrier AND o.origin_port = f.orig_port_cd
     AND o.destination_port = f.dest_port_cd AND o.service_level = f.svc_cd
     AND o.weight BETWEEN f.minm_wgh_qty AND f.max_wgh_qty
    JOIN wh_costs w ON o.plant_code = w.wh
    WHERE o.data_issue_flag IS NULL
),
optimal AS (
    SELECT o.order_id,
           MIN(GREATEST(o.weight * f.rate, f.minimum_cost)
               + (o.unit_quantity * w.cost_per_unit))                 AS optimal_cost
    FROM order_lists o
    JOIN freight_rates f
      ON o.origin_port = f.orig_port_cd AND o.destination_port = f.dest_port_cd
     AND o.weight BETWEEN f.minm_wgh_qty AND f.max_wgh_qty
    JOIN wh_costs w ON o.plant_code = w.wh
    WHERE o.data_issue_flag IS NULL
    GROUP BY o.order_id
)
SELECT
    h.order_id, h.plant_code, h.historical_carrier,
    ROUND(h.historical_cost, 2)                          AS historical_cost,
    ROUND(o.optimal_cost, 2)                             AS optimal_cost,
    ROUND(h.historical_cost - o.optimal_cost, 2)         AS saving,
    ROUND((h.historical_cost - o.optimal_cost)
          / h.historical_cost * 100, 2)                  AS saving_pct,
    CASE
        WHEN h.historical_cost > o.optimal_cost THEN 'Overpaying — Switch Carrier'
        ELSE 'Already Optimal'
    END                                                  AS action_flag
FROM historical h
JOIN optimal o ON h.order_id = o.order_id
ORDER BY saving DESC;
```

---

## Q39. HEADLINE — Total network savings if all orders used optimal routes

```sql
WITH historical AS (
    SELECT o.order_id,
           GREATEST(o.weight * f.rate, f.minimum_cost)
               + (o.unit_quantity * w.cost_per_unit)     AS hist_cost
    FROM order_lists o
    JOIN freight_rates f
      ON o.carrier = f.carrier AND o.origin_port = f.orig_port_cd
     AND o.destination_port = f.dest_port_cd AND o.service_level = f.svc_cd
     AND o.weight BETWEEN f.minm_wgh_qty AND f.max_wgh_qty
    JOIN wh_costs w ON o.plant_code = w.wh
    WHERE o.data_issue_flag IS NULL
),
optimal AS (
    SELECT o.order_id,
           MIN(GREATEST(o.weight * f.rate, f.minimum_cost)
               + (o.unit_quantity * w.cost_per_unit))    AS opt_cost
    FROM order_lists o
    JOIN freight_rates f
      ON o.origin_port = f.orig_port_cd AND o.destination_port = f.dest_port_cd
     AND o.weight BETWEEN f.minm_wgh_qty AND f.max_wgh_qty
    JOIN wh_costs w ON o.plant_code = w.wh
    WHERE o.data_issue_flag IS NULL
    GROUP BY o.order_id
)
SELECT
    COUNT(*)                                              AS total_orders,
    ROUND(SUM(h.hist_cost), 2)                           AS total_historical_cost,
    ROUND(SUM(o.opt_cost), 2)                            AS total_optimal_cost,
    ROUND(SUM(h.hist_cost - o.opt_cost), 2)              AS total_savings,
    ROUND(SUM(h.hist_cost - o.opt_cost)
          / SUM(h.hist_cost) * 100, 2)                   AS savings_pct,
    ROUND(AVG(h.hist_cost - o.opt_cost), 2)              AS avg_saving_per_order,
    COUNT(CASE WHEN h.hist_cost > o.opt_cost THEN 1 END) AS orders_overpaying,
    ROUND(COUNT(CASE WHEN h.hist_cost > o.opt_cost THEN 1 END)
          / COUNT(*) * 100, 2)                           AS pct_overpaying
FROM historical h
JOIN optimal o ON h.order_id = o.order_id;
```

> **Result: $58,062.17 total savings | 0.22% | 6,368 orders overpaying (41.36%)**

---

## Q40. Savings potential ranked by plant

```sql
WITH historical AS (
    SELECT o.order_id, o.plant_code,
           GREATEST(o.weight * f.rate, f.minimum_cost)
               + (o.unit_quantity * w.cost_per_unit)     AS hist_cost
    FROM order_lists o
    JOIN freight_rates f
      ON o.carrier = f.carrier AND o.origin_port = f.orig_port_cd
     AND o.destination_port = f.dest_port_cd AND o.service_level = f.svc_cd
     AND o.weight BETWEEN f.minm_wgh_qty AND f.max_wgh_qty
    JOIN wh_costs w ON o.plant_code = w.wh
    WHERE o.data_issue_flag IS NULL
),
optimal AS (
    SELECT o.order_id, o.plant_code,
           MIN(GREATEST(o.weight * f.rate, f.minimum_cost)
               + (o.unit_quantity * w.cost_per_unit))    AS opt_cost
    FROM order_lists o
    JOIN freight_rates f
      ON o.origin_port = f.orig_port_cd AND o.destination_port = f.dest_port_cd
     AND o.weight BETWEEN f.minm_wgh_qty AND f.max_wgh_qty
    JOIN wh_costs w ON o.plant_code = w.wh
    WHERE o.data_issue_flag IS NULL
    GROUP BY o.order_id, o.plant_code
)
SELECT
    h.plant_code,
    COUNT(*)                                              AS total_orders,
    ROUND(SUM(h.hist_cost), 2)                           AS total_historical,
    ROUND(SUM(o.opt_cost), 2)                            AS total_optimal,
    ROUND(SUM(h.hist_cost - o.opt_cost), 2)              AS total_savings,
    ROUND(SUM(h.hist_cost - o.opt_cost)
          / SUM(h.hist_cost) * 100, 2)                   AS savings_pct,
    RANK() OVER (ORDER BY SUM(h.hist_cost - o.opt_cost) DESC) AS savings_rank
FROM historical h
JOIN optimal o ON h.order_id = o.order_id AND h.plant_code = o.plant_code
GROUP BY h.plant_code
ORDER BY total_savings DESC;
```

> **Result: PLANT16 = $55,312.61 (69.24%) — 95.3% of ALL network savings in just 34 orders**

---

[← Back to README](../README.md) | [Next: Time Series & Trend Analytics →](11_time_series.md)
