# EDA 3.7 — Weekday-Wise Collision Trends

[← Back to README](README.md) | [← EDA Overview](03_eda_overview.md)

---

## Analysis Type: Segmented Time-Series

**Question:** On which days of the week do collisions peak, and what drives the pattern?

## Code

```python
from pyspark.sql.functions import date_format

weekday_df = df_dict["collisions"] \
    .withColumn("weekday", date_format("collision_date", "EEEE"))

weekday_counts = weekday_df.groupBy("weekday").count()
weekday_pd = weekday_counts.toPandas()

# Enforce calendar order
weekday_order = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
weekday_pd["weekday"] = pd.Categorical(weekday_pd["weekday"], categories=weekday_order, ordered=True)
weekday_pd = weekday_pd.sort_values("weekday")

plt.figure(figsize=(10, 5))
plt.plot(weekday_pd["weekday"], weekday_pd["count"], marker="o", color="steelblue")
plt.xlabel("Day of the Week")
plt.ylabel("Number of Collisions")
plt.title("Weekday-Wise Collision Trends")
plt.tight_layout()
plt.show()
```

---

## Result

| Day | Collision Count (approx.) |
|---|---|
| Monday | ~89,000 |
| Tuesday | ~95,000 |
| Wednesday | ~95,000 |
| Thursday | ~95,000 |
| **Friday** | **~104,000** ← peak |
| Saturday | ~81,000 |
| **Sunday** | **~65,000** ← lowest |

---

## Insight

**Friday is the highest-collision day** — combining end-of-week commuter volume, social travel, and potential fatigue accumulation. Weekend days (especially Sunday) show significantly lower counts, consistent with reduced commuting and commercial driving.

The pattern confirms that **commuting behaviour, not inherently dangerous road conditions, drives collision frequency**. Mid-week stability reflects routine patterns; Friday's spike reflects both volume increase and behavioural factors.

## Outcome

> **Weekday-focused traffic enforcement** — particularly on Fridays during evening commute hours (16:00–19:00) — offers the highest return on enforcement resource deployment. Signal timing optimisation for Friday afternoon congestion corridors is a direct, implementable recommendation.

---

[← Back to README](../README.md) | [Next: Spatial Distribution →](11_eda_spatial.md)
