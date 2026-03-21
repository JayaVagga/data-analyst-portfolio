# EDA 3.2 — Weather Conditions During Collisions

[← Back to README](../README.md) | [← EDA Overview](03_eda_overview.md)

---

## Analysis Type: Segmented Univariate

**Question:** How are collisions distributed across different weather conditions?

## Code

```python
weather_df = df_dict["collisions"].select("weather_1")
weather_pd = weather_df.toPandas()

weather_pd["weather_1"].value_counts().plot(kind="bar", figsize=(10, 6), color="steelblue")
plt.xlabel("Weather Condition")
plt.ylabel("Number of Collisions")
plt.title("Weather Conditions During Collisions")
plt.xticks(rotation=45)
plt.tight_layout()
plt.show()
```

---

## Result

| Weather Condition | Collision Count (approx.) |
|---|---|
| Clear | ~500,000 |
| Cloudy | ~80,000 |
| Raining | ~35,000 |
| Unknown | ~25,000 |
| Fog | ~8,000 |
| Snowing | < 2,000 |
| Wind | < 2,000 |

---

## Insight

Over **80% of collisions occur under clear weather conditions** — not because clear weather is dangerous, but because most driving happens when weather is clear. Traffic *exposure* is the dominant variable, not atmospheric conditions.

Adverse weather conditions (rain, fog, snow) together account for fewer than 10% of total collisions, despite conventional assumptions about their danger.

## Outcome

> Road safety planning must **focus on normal driving conditions**, not only adverse weather. Speed enforcement, road marking maintenance, and driver behaviour campaigns during clear-weather, high-volume periods will have greater impact than weather-specific interventions alone.

---

[← Back to README](../README.md) | [Next: Victim Age Distribution →](06_eda_victim_age.md)
