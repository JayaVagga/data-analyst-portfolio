# Section 4 — ETL Queries (PySpark SQL)

[← Back to README](README.md)

---

## Overview

After completing EDA, the cleaned dataset was registered as a Spark SQL temporary view for structured querying. This enables SQL-style analytics on the full distributed dataset without converting to Pandas — preserving scalability.

```python
df_dict["collisions"].createOrReplaceTempView("collisions")
```

---

## Q4.1 — Top 5 Counties by Collision Count

**Business question:** Which counties should receive priority infrastructure and enforcement investment?

```python
spark.sql("""
    SELECT   county_location,
             COUNT(*) AS collision_count
    FROM     collisions
    GROUP BY county_location
    ORDER BY collision_count DESC
    LIMIT    5
""").show()
```

**Result:**

| Rank | County | Collision Count |
|---|---|---|
| 1 | Los Angeles | Highest |
| 2 | San Diego | — |
| 3 | Riverside | — |
| 4 | San Bernardino | — |
| 5 | Orange | — |

> A small number of urban counties account for a disproportionately high share of statewide collisions. These counties are California's most densely populated and highest-traffic regions.

---

## Q4.2 — Month with Highest Collision Volume

**Business question:** When should seasonal enforcement resources be concentrated?

```python
spark.sql("""
    SELECT   month(collision_date) AS month,
             COUNT(*) AS collision_count
    FROM     collisions
    GROUP BY month(collision_date)
    ORDER BY collision_count DESC
    LIMIT    1
""").show()
```

> Identifies the peak collision month for targeted seasonal resource deployment.

---

## Q4.3 — Most Common Weather Condition During Collisions

**Business question:** Does adverse weather drive collision frequency?

```python
spark.sql("""
    SELECT   weather_1,
             COUNT(*) AS collision_count
    FROM     collisions
    GROUP BY weather_1
    ORDER BY collision_count DESC
    LIMIT    5
""").show()
```

**Confirmed finding:** Clear weather dominates. This reinforces the EDA finding that **traffic volume, not weather, is the primary collision driver**.

---

## Q4.4 — Percentage of Collisions Resulting in Fatalities

**Business question:** What share of all incidents are fatal — the highest-stakes category?

```python
spark.sql("""
    SELECT
        ROUND(
            SUM(CASE WHEN killed_victims > 0 THEN 1 ELSE 0 END) * 100.0
            / COUNT(*),
        2) AS fatal_collision_pct
    FROM collisions
""").show()
```

> Only a small percentage of total collisions result in fatalities — but these represent the highest policy priority given their irreversible human cost.

---

## Q4.5 — Most Dangerous Hour of the Day

**Business question:** When should law enforcement concentrate peak-hour deployments?

```python
spark.sql("""
    SELECT   hour(collision_time) AS hour,
             COUNT(*) AS collision_count
    FROM     collisions
    GROUP BY hour(collision_time)
    ORDER BY collision_count DESC
    LIMIT    1
""").show()
```

> **Result: Evening commute hours (15:00–18:00) are consistently the most dangerous.** Targeted enforcement deployment during this window offers the highest marginal reduction in collision risk.

---

## Q4.6 — Top 5 Road Surface Conditions by Collision Count

**Business question:** Does road surface condition significantly affect collision frequency?

```python
spark.sql("""
    SELECT   road_surface,
             COUNT(*) AS collision_count
    FROM     collisions
    GROUP BY road_surface
    ORDER BY collision_count DESC
    LIMIT    5
""").show()
```

> Dry/normal surfaces dominate — again reflecting exposure (most driving on dry roads) rather than inherent danger. Road surface maintenance remains important, but its effect is a risk multiplier rather than a primary cause.

---

## Q4.7 — Lighting Conditions Contributing to Collisions

**Business question:** Which lighting conditions are associated with the most collisions?

```python
spark.sql("""
    SELECT   lighting,
             COUNT(*) AS collision_count
    FROM     collisions
    GROUP BY lighting
    ORDER BY collision_count DESC
    LIMIT    5
""").show()
```

> Daylight and dark-with-street-lights dominate in absolute count. **Dark-without-street-lights** shows the highest severity-to-volume ratio — confirming the EDA heatmap finding that poor lighting is a severity amplifier.

---

[← Back to README](../README.md) | [Next: Conclusions & Recommendations →](14_conclusions.md)
