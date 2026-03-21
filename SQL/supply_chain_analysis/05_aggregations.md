# Part 5 — Aggregations (Q11–Q15)

[← Back to README](../README.md)

---

## Q11. Total orders per plant

```sql
SELECT plant_code,
       COUNT(*) AS total_orders
FROM order_lists
WHERE data_issue_flag IS NULL
GROUP BY plant_code
ORDER BY total_orders DESC;
```
> **Result: PLANT03 handles 14,500 orders — 94% of all network volume.**

---

## Q12. Total orders per customer (top customers by volume)

```sql
SELECT customer,
       COUNT(*) AS total_orders
FROM order_lists
WHERE data_issue_flag IS NULL
GROUP BY customer
ORDER BY total_orders DESC;
```

---

## Q13. Order count and % share per service level

Uses a **window function** inside an aggregation query to compute percentage share without a subquery.

```sql
SELECT service_level,
       COUNT(*) AS total_orders,
       ROUND(COUNT(*) / SUM(COUNT(*)) OVER () * 100, 2) AS pct_share
FROM order_lists
WHERE data_issue_flag IS NULL
GROUP BY service_level;
```
> **Result: DTD = 3,000 orders (19.5%) | DTP = 12,398 orders (80.5%)**

---

## Q14. Average and total weight by plant

```sql
SELECT plant_code,
       ROUND(AVG(weight), 4) AS avg_weight_kg,
       ROUND(SUM(weight), 2) AS total_weight_kg,
       COUNT(*)              AS total_orders
FROM order_lists
WHERE data_issue_flag IS NULL
GROUP BY plant_code
ORDER BY total_weight_kg DESC;
```

---

## Q15. Order count per carrier with % share

```sql
SELECT carrier,
       COUNT(order_id)                                       AS total_orders,
       ROUND(COUNT(*) / SUM(COUNT(*)) OVER () * 100, 2)     AS pct_of_orders
FROM order_lists
WHERE data_issue_flag IS NULL
GROUP BY carrier;
```

---

[← Back to README](../README.md) | [Next: Joins & Route Matching →](06_joins_route_matching.md)
