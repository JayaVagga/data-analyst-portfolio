# Section 3 — Exploratory Data Analysis: Setup & Variable Classification

[← Back to README](README.md)

---

## 3.1 — Variable Classification

Variables were classified before analysis to determine appropriate visualisation and modelling techniques.

**Numerical Variables:**

```python
numerical_cols = [
    "killed_victims",
    "injured_victims",
    "party_count",
    "latitude",
    "longitude"
]
```

**Categorical Variables:**

```python
categorical_cols = [
    "collision_severity",
    "weather_1",
    "lighting",
    "road_surface",
    "primary_collision_factor",
    "type_of_collision",
    "hit_and_run"
]
```

---

## 3.2 — Categorical Encoding (StringIndexer)

Categorical variables were encoded using `StringIndexer` from PySpark MLlib to convert string labels into numeric indices — required for any downstream machine learning or correlation analysis.

```python
from pyspark.ml.feature import StringIndexer
from pyspark.ml import Pipeline

indexers = [
    StringIndexer(
        inputCol=c,
        outputCol=f"{c}_idx",
        handleInvalid="keep"
    )
    for c in categorical_cols
]

pipeline = Pipeline(stages=indexers)
collisions_encoded = pipeline.fit(df_dict["collisions"]).transform(df_dict["collisions"])
```

`handleInvalid="keep"` ensures unseen labels during transform do not cause failures — important when the pipeline is applied to new data.

---

## 3.3 — Final Feature Set

```python
final_cols = (
    ["case_id"] +
    numerical_cols +
    [f"{c}_idx" for c in categorical_cols]
)

final_df = collisions_encoded.select(final_cols)
final_df.show(5)
```

---

## 3.4 — EDA Structure

All EDA analyses follow a consistent four-part pattern:

| Component | Content |
|---|---|
| **Visualisation** | Chart type and what it shows |
| **Analysis type** | Univariate / Segmented univariate / Bivariate |
| **Result** | Factual finding from the data |
| **Insight** | What the result means in context |
| **Outcome** | Actionable implication for policy or planning |

---

## EDA Sections

| # | Analysis | Type | Key Finding |
|---|---|---|---|
| [3.1](04_eda_severity.md) | Collision Severity Distribution | Univariate | Property damage dominates; fatal collisions are rare but high-impact |
| [3.2](05_eda_weather.md) | Weather Conditions | Segmented Univariate | 80%+ of collisions occur in clear weather |
| [3.3](06_eda_victim_age.md) | Victim Age Distribution | Univariate | Ages 20–40 most affected |
| [3.4](07_eda_severity_victims.md) | Severity vs Number of Victims | Bivariate | Higher severity → more victims |
| [3.5](08_eda_weather_severity.md) | Weather vs Severity | Bivariate | Clear weather produces most severe collisions |
| [3.6](09_eda_lighting_severity.md) | Lighting vs Severity | Bivariate | Poor lighting correlates with higher severity |
| [3.7](10_eda_weekday_trends.md) | Weekday Trends | Segmented Time-Series | Fridays peak; Sundays lowest |
| [3.8](11_eda_spatial.md) | Spatial Distribution | Spatial | Urban counties dominate collision counts |
| [3.9](12_eda_time_trends.md) | Collision Trends Over Time | Time-Series | Peak ~2002; sharp 2020 drop (COVID) |

---

[← Back to README](../README.md) | [Next: Collision Severity Distribution →](04_eda_severity.md)
