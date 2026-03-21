# Part 9 — Constraint & Compliance Checks (Q31–Q35)

[← Back to README](../README.md)

---

## Q31. Plants exceeding daily capacity limits

```sql
SELECT
    o.plant_code, o.order_date,
    COUNT(*)                    AS orders_that_day,
    c.daily_capacity,
    COUNT(*) - c.daily_capacity AS excess_orders
FROM order_lists o
JOIN wh_capacities c ON o.plant_code = c.plant_id
WHERE o.data_issue_flag IS NULL
GROUP BY o.plant_code, o.order_date, c.daily_capacity
HAVING COUNT(*) > c.daily_capacity
ORDER BY excess_orders DESC;
```

---

## Q32. VMI rule violations — customers served from unauthorised plants

Two equivalent approaches shown. Method 1 (`NOT EXISTS`) is cleaner in expressing the intent. Method 2 (`LEFT JOIN`) is often faster at scale.

**Method 1 — NOT EXISTS:**
```sql
SELECT o.order_id, o.plant_code, o.customer
FROM order_lists o
WHERE o.plant_code IN (SELECT DISTINCT plant_code FROM vmi_customers)
  AND NOT EXISTS (
    SELECT 1 FROM vmi_customers v
    WHERE v.plant_code = o.plant_code
      AND v.customers  = o.customer
  );
```

**Method 2 — LEFT JOIN:**
```sql
SELECT o.order_id, o.plant_code, o.customer
FROM order_lists o
LEFT JOIN vmi_customers v
  ON o.plant_code = v.plant_code
 AND o.customer   = v.customers
WHERE o.plant_code IN (SELECT plant_code FROM vmi_customers)
  AND v.customers IS NULL;
```

---

## Q33. Weight band violations — orders with no carrier matching their weight

Count first, then detail view:

```sql
-- Count
SELECT COUNT(*) AS total_weight_band_violations
FROM order_lists o
LEFT JOIN freight_rates f
  ON o.carrier = f.carrier AND o.origin_port = f.orig_port_cd
 AND o.destination_port = f.dest_port_cd AND o.service_level = f.svc_cd
 AND o.weight BETWEEN f.minm_wgh_qty AND f.max_wgh_qty
WHERE f.freight_id IS NULL
  AND o.data_issue_flag IS NULL;

-- Detail
SELECT o.order_id, o.carrier, o.origin_port,
       o.destination_port, o.service_level, o.weight
FROM order_lists o
LEFT JOIN freight_rates f
  ON o.carrier = f.carrier AND o.origin_port = f.orig_port_cd
 AND o.destination_port = f.dest_port_cd AND o.service_level = f.svc_cd
 AND o.weight BETWEEN f.minm_wgh_qty AND f.max_wgh_qty
WHERE f.freight_id IS NULL
  AND o.data_issue_flag IS NULL;
```

---

## Q34. Orders referencing carriers absent from the freight rate master

Detects orders using carriers that no longer have active rate records — these would be shipped at undocumented spot rates.

```sql
SELECT DISTINCT o.order_id, o.carrier AS orphaned_carrier
FROM order_lists o
LEFT JOIN freight_rates f ON o.carrier = f.carrier
WHERE f.carrier IS NULL;
```

---

## Q35. Orders with service levels not found in the freight rate master

```sql
SELECT COUNT(*) AS invalid_service_level_orders
FROM order_lists o
LEFT JOIN freight_rates f
  ON o.origin_port      = f.orig_port_cd
 AND o.destination_port = f.dest_port_cd
 AND o.service_level    = f.svc_cd
 AND o.weight BETWEEN f.minm_wgh_qty AND f.max_wgh_qty
WHERE f.freight_id IS NULL
  AND o.data_issue_flag IS NULL;
```

---

[← Back to README](../README.md) | [Next: Optimization Simulation →](10_optimization_simulation.md)
