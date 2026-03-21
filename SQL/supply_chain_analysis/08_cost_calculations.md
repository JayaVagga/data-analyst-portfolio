# Part 8 — Cost Calculations (Q26–Q30)

[← Back to README](../README.md)

---

## The Cost Formula

Applied consistently across all 50 queries in this project:

```
Freight cost   = GREATEST(weight × rate, minimum_cost)
Warehouse cost = unit_quantity × cost_per_unit
Total cost     = freight_cost + warehouse_cost
```

`GREATEST()` is essential — carrier contracts have a minimum charge. If `weight × rate` falls below the minimum, the minimum applies. Ignoring this would systematically understate freight costs for small orders.

---

## Q26. End-to-end cost breakdown for every order

```sql
SELECT
    o.order_id, o.plant_code, o.carrier,
    o.origin_port, o.destination_port, o.service_level,
    o.weight, o.unit_quantity,
    ROUND(GREATEST(o.weight * f.rate, f.minimum_cost), 4)   AS freight_cost,
    ROUND(o.unit_quantity * w.cost_per_unit, 4)             AS warehouse_cost,
    ROUND(
        GREATEST(o.weight * f.rate, f.minimum_cost)
        + (o.unit_quantity * w.cost_per_unit), 4
    )                                                       AS total_network_cost
FROM order_lists o
JOIN freight_rates f
  ON o.carrier = f.carrier AND o.origin_port = f.orig_port_cd
 AND o.destination_port = f.dest_port_cd AND o.service_level = f.svc_cd
 AND o.weight BETWEEN f.minm_wgh_qty AND f.max_wgh_qty
JOIN wh_costs w ON o.plant_code = w.wh
WHERE o.data_issue_flag IS NULL
ORDER BY total_network_cost DESC;
```

---

## Q27. Carrier efficiency ranking — average freight cost per carrier

```sql
SELECT
    o.carrier,
    COUNT(*)                                                AS total_orders,
    ROUND(AVG(GREATEST(o.weight * f.rate, f.minimum_cost)), 4) AS avg_freight_cost,
    RANK() OVER (
        ORDER BY AVG(GREATEST(o.weight * f.rate, f.minimum_cost)) ASC
    )                                                       AS efficiency_rank
FROM order_lists o
JOIN freight_rates f
  ON o.carrier = f.carrier AND o.origin_port = f.orig_port_cd
 AND o.destination_port = f.dest_port_cd AND o.service_level = f.svc_cd
 AND o.weight BETWEEN f.minm_wgh_qty AND f.max_wgh_qty
WHERE o.data_issue_flag IS NULL
GROUP BY o.carrier
ORDER BY avg_freight_cost ASC;
```

---

## Q28. Average cost per order by plant — ranked

```sql
SELECT
    o.plant_code,
    COUNT(*)                                                AS total_orders,
    ROUND(AVG(
        GREATEST(o.weight * f.rate, f.minimum_cost)
        + (o.unit_quantity * w.cost_per_unit)
    ), 2)                                                   AS avg_cost_per_order,
    RANK() OVER (
        ORDER BY AVG(
            GREATEST(o.weight * f.rate, f.minimum_cost)
            + (o.unit_quantity * w.cost_per_unit)
        ) DESC
    )                                                       AS cost_rank
FROM order_lists o
JOIN freight_rates f
  ON o.carrier = f.carrier AND o.origin_port = f.orig_port_cd
 AND o.destination_port = f.dest_port_cd AND o.service_level = f.svc_cd
 AND o.weight BETWEEN f.minm_wgh_qty AND f.max_wgh_qty
JOIN wh_costs w ON o.plant_code = w.wh
WHERE o.data_issue_flag IS NULL
GROUP BY o.plant_code
ORDER BY avg_cost_per_order DESC;
```
> **Result: PLANT09 = $8,674/order — 4× the network average of $2,174**

---

## Q29. Monthly and quarterly network cost trend

**Monthly:**
```sql
SELECT
    YEAR(o.order_date)      AS order_year,
    MONTH(o.order_date)     AS order_month,
    MONTHNAME(o.order_date) AS month_name,
    ROUND(SUM(
        GREATEST(o.weight * f.rate, f.minimum_cost)
        + (o.unit_quantity * w.cost_per_unit)
    ), 2)                   AS total_network_cost
FROM order_lists o
JOIN freight_rates f
  ON o.carrier = f.carrier AND o.origin_port = f.orig_port_cd
 AND o.destination_port = f.dest_port_cd AND o.service_level = f.svc_cd
 AND o.weight BETWEEN f.minm_wgh_qty AND f.max_wgh_qty
JOIN wh_costs w ON o.plant_code = w.wh
WHERE o.data_issue_flag IS NULL
GROUP BY order_year, order_month, month_name
ORDER BY order_year, order_month;
```

**Quarterly:**
```sql
SELECT
    YEAR(o.order_date)    AS order_year,
    QUARTER(o.order_date) AS quarter,
    ROUND(SUM(
        GREATEST(o.weight * f.rate, f.minimum_cost)
        + (o.unit_quantity * w.cost_per_unit)
    ), 2)                 AS total_network_cost
FROM order_lists o
JOIN freight_rates f
  ON o.carrier = f.carrier AND o.origin_port = f.orig_port_cd
 AND o.destination_port = f.dest_port_cd AND o.service_level = f.svc_cd
 AND o.weight BETWEEN f.minm_wgh_qty AND f.max_wgh_qty
JOIN wh_costs w ON o.plant_code = w.wh
WHERE o.data_issue_flag IS NULL
GROUP BY order_year, quarter
ORDER BY order_year, quarter;
```

---

## Q30. Freight vs warehouse cost split — network-wide and by plant

**Network-wide:**
```sql
WITH cost_components AS (
    SELECT
        GREATEST(o.weight * f.rate, f.minimum_cost) AS freight_cost,
        o.unit_quantity * w.cost_per_unit           AS warehouse_cost
    FROM order_lists o
    JOIN freight_rates f
      ON o.carrier = f.carrier AND o.origin_port = f.orig_port_cd
     AND o.destination_port = f.dest_port_cd AND o.service_level = f.svc_cd
     AND o.weight BETWEEN f.minm_wgh_qty AND f.max_wgh_qty
    JOIN wh_costs w ON o.plant_code = w.wh
    WHERE o.data_issue_flag IS NULL
)
SELECT
    ROUND(SUM(freight_cost), 2)                                              AS total_freight,
    ROUND(SUM(warehouse_cost), 2)                                            AS total_warehouse,
    ROUND(SUM(freight_cost + warehouse_cost), 2)                             AS total_network,
    ROUND(SUM(freight_cost)   / SUM(freight_cost + warehouse_cost) * 100, 2) AS freight_pct,
    ROUND(SUM(warehouse_cost) / SUM(freight_cost + warehouse_cost) * 100, 2) AS warehouse_pct
FROM cost_components;
```

---

[← Back to README](../README.md) | [Next: Constraint & Compliance Checks →](09_constraint_checks.md)
