# Section 5 — Conclusions & Strategic Recommendations

[← Back to README](README.md)

---

## Final Insights Summary

| Theme | Key Finding | Policy Signal |
|---|---|---|
| Severity | 85%+ of collisions are low-severity; <1% are fatal | Prioritise severity-weighted metrics, not raw counts |
| Weather | 80%+ of collisions occur in clear weather | Target normal conditions, not adverse weather |
| Demographics | Ages 20–40 most affected | Commuter-focused campaigns |
| Time of day | Peak: 15:00–18:00 (evening commute) | Time-indexed enforcement |
| Day of week | Friday highest; Sunday lowest | Weekday enforcement priority |
| Lighting | Dark/unlit conditions amplify severity | Targeted street lighting upgrades |
| Geography | Urban counties dominate collision totals | Hotspot-based investment |
| Long-term | 2020 COVID drop shows volume = primary lever | Mobility management as safety tool |

---

## (a) Improving Road Safety — Infrastructure & Enforcement

- Identify high-risk locations using county-level and coordinate-level density analysis
- Prioritise high-collision counties (Los Angeles, San Diego, Riverside, San Bernardino, Orange) for infrastructure upgrades
- Deploy targeted enforcement during peak hours — specifically **15:00–18:00 on Fridays**
- Improve intersection design, lane markings, and signage in identified hotspot zones
- Use historical collision data to rank locations by risk rather than spreading resources uniformly across the state

---

## (b) Traffic Management Optimisation

- Adjust traffic signal timing dynamically during peak weekday hours to reduce congestion-related collisions
- Prioritise street lighting upgrades in dark, high-severity zones — particularly unlit rural sections of major corridors
- Incorporate seasonal and monthly trends into traffic planning — October represents a consistent peak requiring additional resource allocation
- Design road safety campaigns assuming collisions occur mostly under normal driving conditions, not just adverse weather — this is the counterintuitive but data-supported conclusion

---

## (c) Pedestrian and Cyclist Safety

- Expand dedicated pedestrian crossings and protected bicycle lanes in dense urban areas where spatial analysis confirms high pedestrian collision density
- Enforce reduced speed limits in zones with elevated pedestrian and cyclist collision rates
- Improve visibility measures near schools, markets, and transit hubs — reflective signage and improved lighting have measurable impact on outcome severity
- Launch behavioural awareness campaigns targeting both drivers (speeding, distraction) and vulnerable road users (visibility gear, crossing compliance)

---

## (d) High-Risk Zone Identification Framework

```
Level 1 — County ranking (ETL Q4.1)
    ↓
Level 2 — Coordinate-level hotspot clustering (spatial scatter)
    ↓
Level 3 — Time-of-day overlay (hourly trend + weekday)
    ↓
Level 4 — Severity overlay (lighting condition heatmap)
    ↓
Output: Priority intervention matrix by location × time × severity
```

Classify zones into high / medium / low risk tiers for proactive rather than reactive intervention. Focus resources on areas with persistent multi-year collision patterns, not only recent spikes.

---

## (e) Environmental Factors — Correcting the Narrative

| Assumption | Data Reality |
|---|---|
| Adverse weather causes most collisions | **False** — clear weather produces 80%+ of collisions |
| Poor roads are primary danger | **Partially false** — dry roads are most common collision surface (exposure effect) |
| Night driving is always more dangerous | **Nuanced** — dark/unlit conditions amplify severity but not necessarily frequency |
| Weather conditions determine severity | **Partially false** — traffic volume and speed are stronger determinants |

Environmental factors should be treated as **risk multipliers**, not sole causes. The dominant variable in collision frequency is **traffic exposure** — how many vehicles are on the road and at what speed.

---

## (f) Predictive Modelling Roadmap

A data-driven predictive safety model should incorporate:

**Feature set:**
- Time: hour, day of week, month, year
- Location: county, latitude/longitude cluster
- Environmental: lighting condition, weather, road surface
- Historical: collision severity history by location

**Use cases:**
- Anticipate collision hotspots before incidents occur
- Dynamically adjust patrol schedules based on risk prediction
- Feed predictions into traffic signal control systems
- Enable preventive infrastructure maintenance scheduling

> Moving from **reactive response** (deploy after a crash) to **proactive prevention** (deploy before predicted risk window) is the highest-leverage transition available to California traffic safety authorities.

---

## Analytical Methods Summary

| Method | Applied To |
|---|---|
| Univariate analysis | Severity distribution, victim age, weather conditions |
| Segmented univariate | Weekday trends, monthly trends, county-level counts |
| Bivariate analysis | Severity vs victims, weather vs severity, lighting vs severity |
| Spatial analysis | County choropleth, coordinate scatter |
| Time-series analysis | Yearly, monthly, hourly trends |
| IQR outlier detection | Numerical variables across all tables |
| StringIndexer encoding | Categorical variables for ML preparation |
| PySpark SQL | ETL queries on full distributed dataset |

---

[← Back to README](../README.md)
