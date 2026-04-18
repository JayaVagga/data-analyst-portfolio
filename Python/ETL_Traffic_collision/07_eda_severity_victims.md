# EDA 3.4 — Collision Severity vs Number of Victims

[← Back to README](README.md) | [← EDA Overview](03_eda_overview.md)

---

## Analysis Type: Bivariate

**Question:** Is there a measurable relationship between collision severity and the number of victims involved?

## Code

```python
sev_vict_df = df_dict["collisions"].select(
    "collision_severity", "killed_victims", "injured_victims"
)
sev_vict_pd = sev_vict_df.toPandas()
sev_vict_pd["total_victims"] = (
    sev_vict_pd["killed_victims"] + sev_vict_pd["injured_victims"]
)

sev_vict_pd.boxplot(
    column="total_victims",
    by="collision_severity",
    figsize=(12, 6)
)
plt.xlabel("Collision Severity")
plt.ylabel("Total Number of Victims")
plt.title("Collision Severity vs Number of Victims")
plt.suptitle("")
plt.xticks(rotation=45)
plt.tight_layout()
plt.show()
```

---

## Result

| Severity Level | Median Victims | Distribution |
|---|---|---|
| Property damage only | ~0 | Tight, near-zero |
| Pain | ~1 | Narrow spread |
| Other injury | ~1 | Wider spread |
| Severe injury | ~1–2 | Wider, higher median |
| Fatal | ~1–2+ | Widest spread, highest outliers |

---

## Insight

Higher severity collisions consistently show **higher median victim counts and wider spread**. Multi-victim crashes escalate injury severity and place greater strain on emergency response systems. A single event with multiple severe victims has cascading effects on hospital capacity, traffic clearance, and insurance claims.

## Outcome

> Emergency response planning should **prioritise rapid deployment to multi-victim incidents**. Dispatch algorithms that factor in estimated victim count — not just incident type — would improve triage efficiency and reduce time-to-treatment for severe collisions.

---

[← Back to README](../README.md) | [Next: Weather vs Severity →](08_eda_weather_severity.md)
