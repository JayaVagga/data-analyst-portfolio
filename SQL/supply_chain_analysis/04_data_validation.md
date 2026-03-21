# Part 4 — Data Validation (Q6–Q10)

[← Back to README](../README.md)

---

## Q6. Orders with missing or invalid weights

```sql
SELECT order_id, weight, data_issue_flag
FROM order_lists
WHERE weight = 0 OR weight IS NULL;
```
> **Result: 2 records** — both flagged as `'Invalid Weight'` and excluded from all cost calculations.

---

## Q7. Do all orders have valid parseable dates?

```sql
SELECT COUNT(*) AS orders_with_valid_dates
FROM order_lists
WHERE order_date IS NOT NULL;
```

---

## Q8. Products ordered from plants they are not mapped to

Uses a `LEFT JOIN` pattern — if `products_per_plant` has no matching row, the product is not authorised at that plant.

```sql
SELECT DISTINCT o.product_id
FROM order_lists o
LEFT JOIN products_per_plant p ON o.product_id = p.product_id
WHERE p.product_id IS NULL;
```

---

## Q9. Orders using origin ports not authorised for their plant

Validates against the `plant_ports` bridge table. A missing match means the order shipped from a port that was not in the plant's approved routing list.

```sql
SELECT o.order_id, o.plant_code, o.origin_port
FROM order_lists o
LEFT JOIN plant_ports p
  ON o.plant_code = p.plant_code
 AND o.origin_port = p.port
WHERE p.plant_code IS NULL;
```

---

## Q10. Orders with no matching freight lane in the rate master

**The most important validation query.** Uses a 5-condition JOIN — carrier + origin + destination + service level + weight band must all match simultaneously. If no row returns, the order has no valid rate and its cost cannot be calculated.

```sql
SELECT o.order_id,
       o.carrier,
       o.origin_port,
       o.destination_port,
       o.service_level,
       o.weight
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

> This same 5-condition JOIN is the foundation of every cost calculation in Parts 6–12.

---

[← Back to README](../README.md) | [Next: Aggregations →](05_aggregations.md)
