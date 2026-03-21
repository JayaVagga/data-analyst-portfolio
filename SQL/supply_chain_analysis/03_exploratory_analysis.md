# Part 3 — Exploratory Data Analysis (Q1–Q5)

[← Back to README](../README.md)

---

## Q1. How many valid orders are in the dataset?

```sql
SELECT COUNT(*) AS total_valid_orders
FROM order_lists
WHERE data_issue_flag IS NULL;
```
> **Result: 15,396 valid orders** (2 excluded due to `Invalid Weight` flag)

---

## Q2. What is the date range of the orders?

```sql
SELECT MIN(order_date) AS start_date,
       MAX(order_date) AS end_date
FROM order_lists;
```

---

## Q3. How many unique plants (warehouses) exist?

```sql
SELECT COUNT(DISTINCT plant_id) AS total_plants
FROM wh_capacities;
```
> **Result: 7 plants**

---

## Q4. What distinct service levels are offered?

```sql
SELECT DISTINCT service_level
FROM order_lists;
```
> **Result: DTD, DTP**

---

## Q5. Which carriers operate in this network?

```sql
SELECT DISTINCT carrier
FROM order_lists;
```
> **Result: V444_0, V444_1**

---

[← Back to README](../README.md) | [Next: Data Validation →](04_data_validation.md)
