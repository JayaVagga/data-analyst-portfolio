# Part 2 — Data Loading & Cleaning

[← Back to README](../README.md)

---

## The Core Strategy: Staging Tables

All raw data is loaded first into `*_raw` tables with every column typed as `VARCHAR` — no constraints, no import failures. Then data is inspected, cleaned, and migrated to typed production tables.

**Why this matters:** If you load directly into a typed table with `CHECK` constraints and `DATE` columns, MySQL silently drops rows that fail validation. You'd never know data was missing. The staging pattern makes every failure visible.

---

## Step 2.1 — Create Staging Table (All VARCHAR)

```sql
CREATE TABLE order_lists_raw (
    order_id             VARCHAR(50),
    order_date           VARCHAR(50),
    origin_port          VARCHAR(50),
    carrier              VARCHAR(50),
    tpt                  VARCHAR(50),
    service_level        VARCHAR(50),
    ship_ahead_day_count VARCHAR(50),
    ship_late_day_count  VARCHAR(50),
    customer             VARCHAR(50),
    product_id           VARCHAR(50),
    plant_code           VARCHAR(50),
    destination_port     VARCHAR(50),
    unit_quantity        VARCHAR(50),
    weight               VARCHAR(50)
);

SET GLOBAL local_infile = 1;

LOAD DATA LOCAL INFILE '/your/path/order_lists.csv'
INTO TABLE order_lists_raw
FIELDS TERMINATED BY ','
ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS;
```

---

## Step 2.2 — Identify Missing Rows After Import

After loading the staging table, compare it against the production table using a `LEFT JOIN` to surface any rows that were rejected.

```sql
SELECT r.order_id AS missing_order_id
FROM order_lists_raw r
LEFT JOIN order_lists o ON r.order_id = o.order_id
WHERE o.order_id IS NULL;
```

> **Result:** Two rows with `weight = 0` were rejected by the `CHECK (weight > 0)` constraint.
> **Decision:** Retain them in the base table with a flag. Do NOT delete.

---

## Step 2.3 — Date Format Conversion

Source CSV used `MM/DD/YYYY`. MySQL expects `YYYY-MM-DD`. Loaded as VARCHAR first, then converted.

```sql
UPDATE order_lists
SET order_date = STR_TO_DATE(order_date, '%m/%d/%Y');

ALTER TABLE order_lists
MODIFY order_date DATE;
```

---

## Step 2.4 — Numeric Column Cleaning (freight_rates)

Source data had comma-formatted numbers like `"1,500.00"` inside quoted fields. Two-pass cleaning: remove commas first, then strip any remaining non-numeric characters.

```sql
-- Pass 1: Remove comma separators
UPDATE freight_rates
SET minm_wgh_qty  = REPLACE(minm_wgh_qty, ',', ''),
    max_wgh_qty   = REPLACE(max_wgh_qty,  ',', ''),
    minimum_cost  = REPLACE(minimum_cost, ',', ''),
    rate          = REPLACE(rate,         ',', '');

-- Pass 2: Strip any remaining non-numeric characters
UPDATE freight_rates
SET minm_wgh_qty  = REGEXP_REPLACE(minm_wgh_qty,  '[^0-9.]', ''),
    max_wgh_qty   = REGEXP_REPLACE(max_wgh_qty,   '[^0-9.]', ''),
    minimum_cost  = REGEXP_REPLACE(minimum_cost,  '[^0-9.]', ''),
    rate          = REGEXP_REPLACE(rate,          '[^0-9.]', '');

-- Convert to proper types
ALTER TABLE freight_rates
MODIFY minm_wgh_qty DECIMAL(12,2),
MODIFY max_wgh_qty  DECIMAL(12,2),
MODIFY minimum_cost DECIMAL(12,4),
MODIFY rate         DECIMAL(12,4),
MODIFY tpt_day_cnt  INT;
```

---

## Step 2.5 — Flag Data Quality Issues

Two records have `weight = 0` — logistically invalid (you cannot ship a weightless order). Instead of deleting them, they are flagged and retained. All downstream analytical queries use `WHERE data_issue_flag IS NULL`.

```sql
ALTER TABLE order_lists
ADD COLUMN data_issue_flag VARCHAR(50);

UPDATE order_lists
SET data_issue_flag = 'Invalid Weight'
WHERE weight = 0;

-- Confirm: should return 2
SELECT COUNT(*) AS flagged_records
FROM order_lists
WHERE data_issue_flag IS NOT NULL;
```

---

## Step 2.6 — Populate ports Reference Table

```sql
INSERT INTO ports (port_code)
SELECT DISTINCT origin_port      FROM order_lists   UNION
SELECT DISTINCT destination_port FROM order_lists   UNION
SELECT DISTINCT orig_port_cd     FROM freight_rates UNION
SELECT DISTINCT dest_port_cd     FROM freight_rates UNION
SELECT DISTINCT port             FROM plant_ports;
```

---

## Step 2.7 — Row Count Validation

Confirm every table loaded the expected number of rows.

```sql
SELECT 'order_lists'      AS table_name, COUNT(*) AS loaded_rows FROM order_lists  UNION ALL
SELECT 'freight_rates',                  COUNT(*) FROM freight_rates               UNION ALL
SELECT 'wh_costs',                       COUNT(*) FROM wh_costs                    UNION ALL
SELECT 'wh_capacities',                  COUNT(*) FROM wh_capacities               UNION ALL
SELECT 'products_per_plant',             COUNT(*) FROM products_per_plant          UNION ALL
SELECT 'plant_ports',                    COUNT(*) FROM plant_ports                 UNION ALL
SELECT 'vmi_customers',                  COUNT(*) FROM vmi_customers;
```

---

## Step 2.8 — Duplicate Check

```sql
SELECT order_id, COUNT(*) AS occurrences
FROM order_lists
GROUP BY order_id
HAVING COUNT(*) > 1;
-- Expected: empty result
```

> **Design note:** In production logistics systems, one order can contain multiple product lines — requiring a composite PK of `(order_id, product_id)`. This dataset has one product per order, so `order_id` alone is the PK. A production schema would separate order headers and order lines.

---

## Step 2.9 — Remove Orphan Reference Data

```sql
-- Find plant codes in bridge table with no matching entry in wh_capacities
SELECT DISTINCT plant_code
FROM products_per_plant
WHERE plant_code NOT IN (SELECT plant_id FROM wh_capacities);
-- Result: CND9

DELETE FROM products_per_plant
WHERE plant_code = 'CND9';
```

---

## Terminal Debugging (when MySQL warnings were insufficient)

When import warnings were missing or unclear, bash tools identified the root cause directly in the CSV:

```bash
# Confirm actual CSV row count
wc -l order_lists.csv

# Find rows with wrong number of fields (should be 14)
awk -F"," 'NF!=14 {print NR, $0}' order_lists.csv

# Strip commas inside quoted numeric fields
sed 's/"\([0-9]\+\),\([0-9]\+\.\)/\1\2/g' freight_rates.csv > freight_rates_clean.csv
```

---

[← Back to README](../README.md) | [Next: Exploratory Data Analysis →](03_exploratory_analysis.md)
