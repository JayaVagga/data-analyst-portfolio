# EDA 3.9 — Collision Trends Over Time

[← Back to README](../README.md) | [← EDA Overview](03_eda_overview.md)

---

## Analysis Type: Segmented Time-Series

**Question:** How have collision volumes changed year-over-year, month-by-month, and hour-by-hour?

---

## Setup: Extract Time Components

```python
from pyspark.sql.functions import year, month, hour, to_timestamp, col

time_df = df_dict["collisions"] \
    .withColumn("year",  year("collision_date")) \
    .withColumn("month", month("collision_date")) \
    .withColumn("hour",  hour(to_timestamp("collision_time", "HH:mm:ss")))
```

---

## 3.9.1 — Yearly Trend

```python
yearly_counts = time_df.groupBy("year").count().orderBy("year")
yearly_pd = yearly_counts.toPandas()

plt.figure(figsize=(12, 5))
plt.plot(yearly_pd["year"], yearly_pd["count"], marker="o", color="steelblue")
plt.xlabel("Year")
plt.ylabel("Number of Collisions")
plt.title("Yearly Trend of Collisions")
plt.tight_layout()
plt.show()
```

**Result:**
- **Peak period: ~2001–2005** (~33,000–35,000 collisions per year)
- **2008–2012:** Gradual decline — consistent with reduced driving during the financial crisis
- **2014–2019:** Moderate recovery
- **2020:** Sharp drop — COVID-19 lockdowns dramatically reduced traffic volume

**Insight:** Collision frequency tracks traffic volume closely. Economic conditions, fuel prices, and mobility restrictions all influence annual totals. The 2020 drop is a natural experiment demonstrating that volume reduction is the single most effective collision reducer.

---

## 3.9.2 — Monthly Trend

```python
monthly_counts = time_df.groupBy("month").count().orderBy("month")
monthly_pd = monthly_counts.toPandas()

plt.figure(figsize=(10, 5))
plt.plot(monthly_pd["month"], monthly_pd["count"], marker="o", color="steelblue")
plt.xlabel("Month")
plt.ylabel("Number of Collisions")
plt.title("Monthly Trend of Collisions")
plt.xticks(range(1, 13), ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"])
plt.tight_layout()
plt.show()
```

**Result:**
- Collision counts are relatively stable across months (~49,000–56,000)
- **October shows a consistent spike** — school return, daylight reduction begins, holiday travel ramps up
- **February is consistently lowest** — shorter month, winter slowdown

**Insight:** Seasonal variation is moderate, not extreme. This means month-specific traffic management can target specific risk windows without requiring year-round resource reallocation.

---

## 3.9.3 — Hourly Trend

```python
hourly_counts = time_df.groupBy("hour").count().orderBy("hour")
hourly_pd = hourly_counts.toPandas()

plt.figure(figsize=(12, 5))
plt.plot(hourly_pd["hour"], hourly_pd["count"], marker="o", color="steelblue")
plt.xlabel("Hour of Day")
plt.ylabel("Number of Collisions")
plt.title("Hourly Trend of Collisions")
plt.xticks(range(0, 24))
plt.tight_layout()
plt.show()
```

**Result:**

| Time Window | Pattern | Count Range |
|---|---|---|
| 00:00–05:00 | Night minimum | ~8,000–10,000 |
| 07:00–09:00 | Morning commute spike | ~30,000–35,000 |
| 10:00–14:00 | Mid-day plateau | ~35,000–40,000 |
| **15:00–18:00** | **Evening commute peak** | **~45,000–50,000** |
| 18:00–22:00 | Evening decline | ~25,000–35,000 |
| 22:00–00:00 | Late-night drop | ~15,000 |

**Insight:** The **evening commute (15:00–18:00) is the highest-risk window** — combining maximum traffic volume with driver fatigue at the end of the working day. This is a consistent, predictable risk window that can be targeted with precision enforcement.

## Outcome

> **Time-indexed enforcement strategy:**
> - **Daily:** Concentrate patrol resources between 15:00–18:00 (peak hour)
> - **Weekly:** Prioritise Friday deployments (highest day of week)
> - **Monthly:** Increase presence in October (peak month)
> - **Yearly:** Adjust strategies in line with economic and mobility trends

---

[← Back to README](../README.md) | [Next: ETL Queries →](13_etl_queries.md)
