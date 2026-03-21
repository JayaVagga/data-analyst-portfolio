# Part 7 — Window Functions & Rankings (Q21–Q25)

[← Back to README](../README.md)

---

## Q21. Rank all freight options per order by total cost (low → high)

**Foundation of the optimization simulation in Part 10.** By relaxing the carrier constraint (joining to all carriers on the route, not just the historical one), every available option is ranked. `RANK() = 1` per order is the optimal choice.

```sql
SELECT
    o.order_id, o.plant_code, f.carrier, f.tpt_day_cnt,
    GREATEST(o.weight * f.rate, f.minimum_cost)           AS freight_cost,
    ROUND(o.unit_quantity * w.cost_per_unit, 4)           AS warehouse_cost,
    GREATEST(o.weight * f.rate, f.minimum_cost)
        + (o.unit_quantity * w.cost_per_unit)             AS total_network_cost,
    RANK() OVER (
        PARTITION BY o.order_id
        ORDER BY
            GREATEST(o.weight * f.rate, f.minimum_cost)
            + (o.unit_quantity * w.cost_per_unit) ASC
    )                                                     AS cost_rank
FROM order_lists o
JOIN freight_rates f
  ON o.origin_port      = f.orig_port_cd
 AND o.destination_port = f.dest_port_cd
 AND o.weight BETWEEN f.minm_wgh_qty AND f.max_wgh_qty
JOIN wh_costs w ON o.plant_code = w.wh
WHERE o.data_issue_flag IS NULL;
```

---

## Q22. Top 3 cheapest freight options per order (CTE + RANK filter)

```sql
WITH ranked_options AS (
    SELECT
        o.order_id, o.plant_code, f.carrier, f.tpt_day_cnt,
        GREATEST(o.weight * f.rate, f.minimum_cost)       AS freight_cost,
        ROUND(o.unit_quantity * w.cost_per_unit, 4)       AS warehouse_cost,
        GREATEST(o.weight * f.rate, f.minimum_cost)
            + (o.unit_quantity * w.cost_per_unit)         AS total_network_cost,
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
SELECT * FROM ranked_options WHERE cost_rank <= 3;
```

---

## Q23. Daily min and max freight cost — with the specific orders at each extreme

Two `RANK()` windows in one CTE — one ascending (cheapest), one descending (costliest) — then filtered to surface both extremes per day.

```sql
WITH daily_costs AS (
    SELECT
        o.order_date, o.order_id,
        GREATEST(o.weight * f.rate, f.minimum_cost)         AS freight_cost,
        RANK() OVER (PARTITION BY o.order_date
                     ORDER BY GREATEST(o.weight * f.rate, f.minimum_cost) ASC)  AS min_rank,
        RANK() OVER (PARTITION BY o.order_date
                     ORDER BY GREATEST(o.weight * f.rate, f.minimum_cost) DESC) AS max_rank
    FROM order_lists o
    JOIN freight_rates f
      ON o.carrier = f.carrier AND o.origin_port = f.orig_port_cd
     AND o.destination_port = f.dest_port_cd AND o.service_level = f.svc_cd
     AND o.weight BETWEEN f.minm_wgh_qty AND f.max_wgh_qty
    WHERE o.data_issue_flag IS NULL
)
SELECT * FROM daily_costs
WHERE min_rank = 1 OR max_rank = 1
ORDER BY order_date;
```

---

## Q24. Running total of shipments by date — network-wide and per plant

**Network-wide:**
```sql
SELECT
    order_date,
    COUNT(*) AS daily_shipments,
    SUM(COUNT(*)) OVER (
        ORDER BY order_date
        ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
    ) AS cumulative_shipments
FROM order_lists
WHERE data_issue_flag IS NULL
GROUP BY order_date
ORDER BY order_date;
```

**Per plant** (adds `PARTITION BY` to reset the running total for each plant):
```sql
SELECT
    plant_code, order_date,
    COUNT(*) AS daily_shipments,
    SUM(COUNT(*)) OVER (
        PARTITION BY plant_code
        ORDER BY order_date
        ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
    ) AS cumulative_by_plant
FROM order_lists
WHERE data_issue_flag IS NULL
GROUP BY plant_code, order_date
ORDER BY plant_code, order_date;
```

---

## Q25. Percent cost spread between cheapest and costliest option per order

Identifies orders with the widest available pricing range — these are the highest-priority targets for carrier switching.

```sql
WITH freight_options AS (
    SELECT
        o.order_id,
        GREATEST(o.weight * f.rate, f.minimum_cost) AS freight_cost
    FROM order_lists o
    JOIN freight_rates f
      ON o.origin_port = f.orig_port_cd AND o.destination_port = f.dest_port_cd
     AND o.weight BETWEEN f.minm_wgh_qty AND f.max_wgh_qty
    WHERE o.data_issue_flag IS NULL
),
cost_range AS (
    SELECT order_id,
           MIN(freight_cost) AS cheapest,
           MAX(freight_cost) AS costliest
    FROM freight_options GROUP BY order_id
)
SELECT
    order_id,
    ROUND(cheapest, 4)                                  AS cheapest_cost,
    ROUND(costliest, 4)                                 AS costliest_cost,
    ROUND(costliest - cheapest, 4)                      AS absolute_gap,
    ROUND((costliest - cheapest) / cheapest * 100, 2)  AS pct_spread
FROM cost_range
WHERE cheapest > 0
ORDER BY pct_spread DESC;
```

---

[← Back to README](../README.md) | [Next: Cost Calculations →](08_cost_calculations.md)
