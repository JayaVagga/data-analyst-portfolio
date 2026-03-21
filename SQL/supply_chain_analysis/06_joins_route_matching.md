# Part 6 — Joins & Route Matching (Q16–Q20)

[← Back to README](../README.md)

---

## The Core Freight JOIN

Every cost calculation in this project depends on this 5-condition JOIN. All five conditions must match simultaneously for an order to receive a freight rate:

```sql
JOIN freight_rates f
  ON o.carrier          = f.carrier          -- same carrier
 AND o.origin_port      = f.orig_port_cd     -- same origin port
 AND o.destination_port = f.dest_port_cd     -- same destination
 AND o.service_level    = f.svc_cd           -- same service level
 AND o.weight BETWEEN f.minm_wgh_qty         -- weight falls within
               AND f.max_wgh_qty             -- the carrier's band
```

---

## Q16. All orders with their matched freight rate details

```sql
SELECT
    o.order_id, o.order_date, o.plant_code, o.customer,
    o.origin_port, o.destination_port, o.carrier, o.service_level, o.weight,
    f.minm_wgh_qty, f.max_wgh_qty, f.rate, f.minimum_cost,
    f.tpt_day_cnt, f.mode_dsc, f.carrier_type
FROM order_lists o
JOIN freight_rates f
  ON o.carrier          = f.carrier
 AND o.origin_port      = f.orig_port_cd
 AND o.destination_port = f.dest_port_cd
 AND o.service_level    = f.svc_cd
 AND o.weight BETWEEN f.minm_wgh_qty AND f.max_wgh_qty
WHERE o.data_issue_flag IS NULL
ORDER BY o.order_id;
```

---

## Q17. Unroutable orders — no matching freight record

Changing the `JOIN` to `LEFT JOIN` and filtering where the right side is `NULL` isolates every order that the freight master cannot price.

```sql
SELECT o.order_id, o.carrier, o.origin_port,
       o.destination_port, o.service_level, o.weight
FROM order_lists o
LEFT JOIN freight_rates f
  ON o.carrier          = f.carrier
 AND o.origin_port      = f.orig_port_cd
 AND o.destination_port = f.dest_port_cd
 AND o.service_level    = f.svc_cd
 AND o.weight BETWEEN f.minm_wgh_qty AND f.max_wgh_qty
WHERE f.freight_id IS NULL
  AND o.data_issue_flag IS NULL;
```

---

## Q18. Orders with warehouse cost calculated

```sql
SELECT
    o.order_id, o.order_date, o.plant_code, o.customer,
    o.unit_quantity, w.cost_per_unit,
    ROUND(o.unit_quantity * w.cost_per_unit, 4) AS warehouse_cost
FROM order_lists o
JOIN wh_costs w ON o.plant_code = w.wh
WHERE o.data_issue_flag IS NULL
ORDER BY warehouse_cost DESC;
```

---

## Q19. Products at plants with daily capacity > 500

```sql
SELECT
    p.plant_code, p.product_id, c.daily_capacity
FROM products_per_plant p
JOIN wh_capacities c ON p.plant_code = c.plant_id
WHERE c.daily_capacity > 500
ORDER BY c.daily_capacity DESC;
```

---

## Q20. Daily freight lane match rate — valid vs invalid per order date

Uses `CASE WHEN` inside `COUNT()` to produce a pivot-style summary — valid and invalid orders counted side by side per date without a self-join.

```sql
SELECT
    o.order_date,
    COUNT(CASE WHEN f.freight_id IS NOT NULL THEN 1 END) AS valid_freight_orders,
    COUNT(CASE WHEN f.freight_id IS NULL     THEN 1 END) AS invalid_freight_orders,
    COUNT(*)                                             AS total_orders,
    ROUND(
        COUNT(CASE WHEN f.freight_id IS NULL THEN 1 END)
        / COUNT(*) * 100, 2
    )                                                    AS invalid_pct
FROM order_lists o
LEFT JOIN freight_rates f
  ON o.carrier          = f.carrier
 AND o.origin_port      = f.orig_port_cd
 AND o.destination_port = f.dest_port_cd
 AND o.service_level    = f.svc_cd
 AND o.weight BETWEEN f.minm_wgh_qty AND f.max_wgh_qty
WHERE o.data_issue_flag IS NULL
GROUP BY o.order_date
ORDER BY o.order_date;
```

---

[← Back to README](../README.md) | [Next: Window Functions & Rankings →](07_window_functions.md)
