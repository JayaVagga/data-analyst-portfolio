# EDA 3.5 — Weather Conditions vs Collision Severity

[← Back to README](../README.md) | [← EDA Overview](03_eda_overview.md)

---

## Analysis Type: Bivariate

**Question:** Do adverse weather conditions produce more severe collisions?

## Code

```python
weather_sev_df = df_dict["collisions"].select("weather_1", "collision_severity")
weather_sev_pd = weather_sev_df.toPandas()

# Cross-tabulation: rows = weather, columns = severity level
weather_sev_ct = pd.crosstab(
    weather_sev_pd["weather_1"],
    weather_sev_pd["collision_severity"]
)

weather_sev_ct.plot(kind="bar", figsize=(12, 6))
plt.xlabel("Weather Condition")
plt.ylabel("Number of Collisions")
plt.title("Weather Conditions vs Collision Severity")
plt.xticks(rotation=45)
plt.tight_layout()
plt.show()
```

---

## Result

- Clear weather produces the **highest absolute count of severe and fatal collisions**
- Rain and fog produce more severe collisions *proportionally*, but far fewer in absolute terms
- Adverse weather accounts for a small share of total collision volume at all severity levels

---

## Insight

This is a **counterintuitive finding**: most of the most dangerous collisions happen in good weather. The mechanism is speed — drivers travel faster in clear conditions, increasing both impact energy and the likelihood of fatalities when accidents do occur. Adverse weather naturally reduces speeds and traffic volume, partially offsetting its inherent danger.

## Outcome

> Road safety interventions should **not be concentrated on adverse weather periods**. Speed control programmes, intelligent speed adaptation systems, and awareness campaigns during clear-weather, high-volume conditions are where policy investment will have the greatest impact on severe collision rates.

---

[← Back to README](../README.md) | [Next: Lighting vs Severity →](09_eda_lighting_severity.md)
