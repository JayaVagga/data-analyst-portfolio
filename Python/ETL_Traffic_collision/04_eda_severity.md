# EDA 3.1 — Collision Severity Distribution

[← Back to README](../README.md) | [← EDA Overview](03_eda_overview.md)

---

## Analysis Type: Univariate

**Question:** What is the distribution of collision severity across all recorded incidents?

## Code

```python
from pyspark.sql.functions import col
import matplotlib.pyplot as plt

# Full dataset — no sampling needed for aggregation
severity_df = df_dict["collisions"].select("collision_severity")
severity_pd = severity_df.toPandas()

severity_pd["collision_severity"].value_counts().plot(kind="bar", figsize=(10, 6), color="steelblue")
plt.xlabel("Collision Severity")
plt.ylabel("Number of Collisions")
plt.title("Distribution of Collision Severity")
plt.xticks(rotation=45)
plt.tight_layout()
plt.show()
```

---

## Result

| Severity Level | Count (approx.) |
|---|---|
| Property damage only | ~390,000 |
| Pain | ~155,000 |
| Other injury | ~65,000 |
| Severe injury | ~18,000 |
| Fatal | < 5,000 |

---

## Insight

High-frequency low-severity crashes dominate overall collision statistics. Fatal and severe collisions are statistically rare but carry disproportionate societal cost — each fatality represents lost life, not just a data point.

## Outcome

> Road safety policies should **not** be designed around reducing total collision counts alone. A 10% reduction in fatal collisions delivers more societal value than a 10% reduction in property-damage-only incidents. Severity-weighted metrics should guide resource allocation.

---

[← Back to README](../README.md) | [Next: Weather Conditions →](05_eda_weather.md)
