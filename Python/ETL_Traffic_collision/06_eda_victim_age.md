# EDA 3.3 — Victim Age Distribution

[← Back to README](README.md) | [← EDA Overview](03_eda_overview.md)

---

## Analysis Type: Univariate

**Question:** What is the age distribution of collision victims in California?

## Code

```python
victim_age_df = df_dict["victims"].select("victim_age")
victim_age_pd = victim_age_df.toPandas()

plt.figure(figsize=(10, 6))
plt.hist(victim_age_pd["victim_age"].dropna(), bins=20, color="steelblue", edgecolor="white")
plt.xlabel("Victim Age")
plt.ylabel("Number of Victims")
plt.title("Distribution of Victim Ages")
plt.tight_layout()
plt.show()
```

---

## Result

| Age Group | Relative Frequency |
|---|---|
| 0–10 (children) | Low |
| 15–25 (young adults) | High |
| 20–40 (working age) | Peak — highest frequency |
| 40–60 (middle age) | Moderate-high |
| 60+ (elderly) | Declining |
| 70–80 | Low |

---

## Insight

The **20–40 age group represents the highest collision victim concentration**, reflecting this group's high driving frequency as the core commuting population. The active working population faces greatest road risk simply due to daily travel exposure.

## Outcome

> Targeted safety campaigns should focus on **commuters and working-age drivers** — particularly young adult males in the 18–35 range who statistically exhibit higher risk-taking behaviour. Workplace commute safety programmes and digital awareness targeting this demographic would yield the highest return.

---

[← Back to README](../README.md) | [Next: Severity vs Victims →](07_eda_severity_victims.md)
