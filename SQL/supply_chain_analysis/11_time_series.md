# Part 11 — Time Series & Trend Analytics (Q41–Q45)

[← Back to README](../README.md)

---

## Q41. Monthly order volume with cumulative running total

```sql
SELECT
    YEAR(order_date)      AS order_year,
    MONTH(order_date)     AS order_month,
    MONTHNAME(order_date) AS month_name,
    COUNT(*)              AS monthly_orders,
    SUM(COUNT(*)) OVER (
        ORDER BY YEAR(order_date), MONTH(order_date)
    )                     AS cumulative_orders
FROM order_lists
WHERE data_issue_flag IS NULL
GROUP BY order_year, order_month, month_name
ORDER BY order_year, order_month;
```

---

## Q42. Average delivery time by service level

```sql
SELECT
    o.service_level,
    ROUND(AVG(f.tpt_day_cnt), 2) AS avg_transit_days,
    MIN(f.tpt_day_cnt)            AS min_transit_days,
    MAX(f.tpt_day_cnt)            AS max_transit_days,
    COUNT(*)                      AS total_orders
FROM order_lists o
JOIN freight_rates f
  ON o.carrier = f.carrier AND o.origin_port = f.orig_port_cd
 AND o.destination_port = f.dest_port_cd AND o.service_level = f.svc_cd
 AND o.weight BETWEEN f.minm_wgh_qty AND f.max_wgh_qty
WHERE o.data_issue_flag IS NULL
GROUP BY o.service_level
ORDER BY avg_transit_days ASC;
```
> **Result: DTD = 1.53 days avg | DTP = 2.49 days avg** — both already under 3 days, making express SLAs effectively free (see Q49).

---

## Q43. Monthly network cost with 3-month moving average

The `ROWS BETWEEN 2 PRECEDING AND CURRENT ROW` frame includes the current month and the 2 months before it — a standard 3-month rolling window.

```sql
WITH monthly_costs AS (
    SELECT
        DATE_FORMAT(o.order_date, '%Y-%m') AS year_month,
        ROUND(SUM(
            GREATEST(o.weight * f.rate, f.minimum_cost)
            + (o.unit_quantity * w.cost_per_unit)
        ), 2)                              AS total_cost
    FROM order_lists o
    JOIN freight_rates f
      ON o.carrier = f.carrier AND o.origin_port = f.orig_port_cd
     AND o.destination_port = f.dest_port_cd AND o.service_level = f.svc_cd
     AND o.weight BETWEEN f.minm_wgh_qty AND f.max_wgh_qty
    JOIN wh_costs w ON o.plant_code = w.wh
    WHERE o.data_issue_flag IS NULL
    GROUP BY year_month
)
SELECT
    year_month,
    total_cost,
    ROUND(AVG(total_cost) OVER (
        ORDER BY year_month
        ROWS BETWEEN 2 PRECEDING AND CURRENT ROW
    ), 2) AS moving_avg_3_month
FROM monthly_costs
ORDER BY year_month;
```

---

## Q44. Most commonly used weight band per month

Identifies dominant shipment size patterns month by month. `RANK()` per month-year partition, then filtered to show only the top band.

```sql
WITH band_usage AS (
    SELECT
        YEAR(o.order_date)                          AS yr,
        MONTH(o.order_date)                         AS mn,
        CONCAT(f.minm_wgh_qty, '–', f.max_wgh_qty) AS weight_band,
        COUNT(*)                                    AS usage_count,
        RANK() OVER (
            PARTITION BY YEAR(o.order_date), MONTH(o.order_date)
            ORDER BY COUNT(*) DESC
        )                                           AS band_rank
    FROM order_lists o
    JOIN freight_rates f
      ON o.origin_port = f.orig_port_cd AND o.destination_port = f.dest_port_cd
     AND o.service_level = f.svc_cd AND o.weight BETWEEN f.minm_wgh_qty AND f.max_wgh_qty
    WHERE o.data_issue_flag IS NULL
    GROUP BY yr, mn, f.minm_wgh_qty, f.max_wgh_qty
)
SELECT * FROM band_usage WHERE band_rank = 1 ORDER BY yr, mn;
```

---

## Q45. Seasonality in demand by origin port (% share per month)

Two-CTE approach: first aggregate yearly totals per port, then compute each month's share.

```sql
WITH total_per_port AS (
    SELECT origin_port, COUNT(*) AS yearly_total
    FROM order_lists WHERE data_issue_flag IS NULL
    GROUP BY origin_port
),
monthly AS (
    SELECT origin_port, MONTH(order_date) AS month, COUNT(*) AS monthly_total
    FROM order_lists WHERE data_issue_flag IS NULL
    GROUP BY origin_port, month
)
SELECT
    m.origin_port, m.month, m.monthly_total,
    ROUND(m.monthly_total / t.yearly_total * 100, 2) AS seasonality_pct
FROM monthly m
JOIN total_per_port t ON m.origin_port = t.origin_port
ORDER BY origin_port, month;
```

---

[← Back to README](../README.md) | [Next: Strategic Business Insights →](12_strategic_insights.md)
