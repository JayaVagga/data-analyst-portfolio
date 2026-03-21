# EDA 3.6 — Lighting Conditions vs Collision Severity

[← Back to README](../README.md) | [← EDA Overview](03_eda_overview.md)

---

## Analysis Type: Bivariate Categorical (Heatmap)

**Question:** How does lighting condition affect the severity of collision outcomes?

## Code

```python
import seaborn as sns

lighting_sev_df = df_dict["collisions"].select("lighting", "collision_severity")
lighting_sev_pd = lighting_sev_df.toPandas()

lighting_sev_ct = pd.crosstab(
    lighting_sev_pd["lighting"],
    lighting_sev_pd["collision_severity"]
)

plt.figure(figsize=(10, 6))
sns.heatmap(
    lighting_sev_ct,
    annot=True,
    fmt="d",
    cmap="YlOrRd"
)
plt.xlabel("Collision Severity")
plt.ylabel("Lighting Condition")
plt.title("Lighting Conditions vs Collision Severity")
plt.tight_layout()
plt.show()
```

---

## Result

| Lighting Condition | Property Damage | Pain | Other Injury | Severe Injury |
|---|---|---|---|---|
| Daylight | 44,034 | 111,030 | **278,277** | 6,020 |
| Dark — street lights | 12,065 | 28,856 | 77,779 | 3,026 |
| Dark — no street lights | 2,967 | 5,425 | 21,646 | **950** |
| Dusk or dawn | 2,265 | 5,214 | 13,240 | 453 |
| Dark — lights not functioning | 106 | 247 | 608 | 37 |

---

## Insight

Two distinct patterns emerge:

1. **Daylight produces the highest absolute volume** of collisions across all severity levels — simply because most driving occurs in daylight
2. **Dark conditions without street lighting show the highest severity rate per incident** — the `severe_injury` proportion relative to total collisions is significantly elevated in unlit conditions

Visibility is a key risk multiplier. A collision that occurs in darkness with no street lighting is more likely to be severe than the same collision in daylight, as driver reaction time is reduced and post-crash visibility for emergency services is worse.

## Outcome

> Targeted **street lighting upgrades in high-collision, poorly-lit zones** would reduce severe collision rates with a relatively contained infrastructure investment. Priority locations can be identified by overlaying the spatial collision heatmap with lighting condition data.

---

[← Back to README](../README.md) | [Next: Weekday Trends →](10_eda_weekday_trends.md)
