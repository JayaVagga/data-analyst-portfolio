# Section 2 — Data Cleaning

[← Back to README](README.md)

---

## Overview

Three-stage cleaning pipeline: missing value handling → duplicate removal → outlier detection. A **rule-based approach** was deliberately chosen over statistical imputation — for event-based data like collision records, replacing a missing severity with the mean would introduce false certainty about incidents where information was simply not recorded.

---

## 2.1 — Missing Value Analysis

Missing values were quantified column-wise using a reusable function:

```python
from pyspark.sql.functions import col, sum

def null_count_per_column(df):
    return df.select([
        sum(col(c).isNull().cast("int")).alias(c)
        for c in df.columns
    ])
```

Priority columns checked in the collisions table:

```python
key_cols = [
    "collision_severity", "weather_1", "lighting",
    "road_surface", "killed_victims", "injured_victims"
]
```

---

## 2.2 — Missing Value Treatment

| Column Type | Strategy | Rationale |
|---|---|---|
| Numeric count fields (`killed_victims`, `injured_victims`) | Fill with `0` | Missing count = no recorded victims, not an unknown quantity |
| Categorical fields (`weather_1`, `lighting`, `road_surface`) | Fill with `'Unknown'` | Preserves record while flagging missing context |
| Critical identifier fields | Drop record | Cannot analyse an incident with no identifying information |

```python
# Numerical → 0
df_dict["collisions"] = df_dict["collisions"].fillna({
    "killed_victims": 0,
    "injured_victims": 0
})

# Categorical → 'Unknown'
df_dict["collisions"] = df_dict["collisions"].fillna({
    "weather_1"    : "Unknown",
    "lighting"     : "Unknown",
    "road_surface" : "Unknown"
})

# Drop records missing critical identifiers
df_dict["collisions"] = df_dict["collisions"].dropna(
    subset=["case_id", "collision_date", "collision_severity"]
)
```

---

## 2.3 — Columns Dropped (>50% Missing)

Columns with over 50% missing values and limited analytical value were removed before analysis:

```python
df_dict["collisions"] = df_dict["collisions"].drop(
    "cnty_city_loc", "special_cond", "mviw", "ped_action",
    "not_private_property", "primary_ramp", "secondary_ramp"
)
```

**Rationale:** These columns were administrative or geographic sub-fields with negligible coverage. Retaining near-empty columns adds noise to schema inspection without contributing analytical value.

---

## 2.4 — Data Type Conversion

```python
from pyspark.sql.functions import col

df_dict["collisions"] = df_dict["collisions"] \
    .withColumn("case_id",          col("case_id").cast("long")) \
    .withColumn("killed_victims",   col("killed_victims").cast("int")) \
    .withColumn("injured_victims",  col("injured_victims").cast("int")) \
    .withColumn("party_count",      col("party_count").cast("int")) \
    .withColumn("collision_date",   col("collision_date").cast("date"))
```

---

## 2.5 — Duplicate Removal

```python
df_dict["collisions"] = df_dict["collisions"].dropDuplicates(["case_id"])
df_dict["victims"]    = df_dict["victims"].dropDuplicates(["case_id", "party_number", "victim_number"])
df_dict["parties"]    = df_dict["parties"].dropDuplicates(["case_id", "party_number"])
```

Each table uses the most granular available key — `case_id` alone for collisions (one record per incident), composite keys for victims and parties (multiple per incident).

---

## 2.6 — Outlier Detection and Handling (IQR Method)

```python
def detect_outliers(df, column):
    q1, q3 = df.approxQuantile(column, [0.25, 0.75], 0.05)
    iqr = q3 - q1
    lower = q1 - 1.5 * iqr
    upper = q3 + 1.5 * iqr
    return df.filter(
        (col(column) < lower) | (col(column) > upper)
    ).count()

def remove_outliers(df, column):
    q1, q3 = df.approxQuantile(column, [0.25, 0.75], 0.05)
    iqr = q3 - q1
    lower = q1 - 1.5 * iqr
    upper = q3 + 1.5 * iqr
    return df.filter(
        (col(column) >= lower) & (col(column) <= upper)
    )
```

**Columns checked:**

| Column | Table | Decision |
|---|---|---|
| `killed_victims` | collisions | Removed extreme outliers (mass-casualty events skew distributions) |
| `injured_victims` | collisions | Removed extreme outliers |
| `party_count` | collisions | Removed extreme outliers |
| `victim_age` | victims | Removed biologically implausible ages |
| `party_age` | parties | Removed biologically implausible ages |

> **Note on retention vs removal:** Outliers were initially detected and flagged. Extreme values that were biologically impossible (age < 0, age > 100) or statistically impossible (killed victims in hundreds for a single incident) were removed. Rare but plausible severe events were retained to avoid understating tail risk.

---

[← Back to README](../README.md) | [Next: Exploratory Data Analysis →](03_eda_overview.md)
