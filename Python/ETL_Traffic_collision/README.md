# California Traffic Collision Analysis — PySpark Project

[![PySpark](https://img.shields.io/badge/PySpark-3.5-E25A1C?style=flat&logo=apachespark&logoColor=white)](https://spark.apache.org/)
[![Python](https://img.shields.io/badge/Python-3.10-3776AB?style=flat&logo=python&logoColor=white)](https://python.org)
[![Dataset](https://img.shields.io/badge/Dataset-SWITRS%20California-blue?style=flat)](https://iswitrs.chp.ca.gov/)
[![Analyses](https://img.shields.io/badge/EDA%20Analyses-11-brightgreen?style=flat)]()
[![Status](https://img.shields.io/badge/Status-Complete-success?style=flat)]()

---

## The Safety Question

> **Where, when, and under what conditions do the most dangerous traffic collisions occur in California — and what does that tell us about where policy investment will have the greatest impact?**

This project processes large-scale California traffic collision data (SWITRS) using **Apache PySpark** for distributed computation, combined with Pandas and Matplotlib/Seaborn for exploratory visualisation. The analysis uncovers spatial, temporal, and environmental patterns to support data-driven road safety policy.

---

## Why PySpark?

The SWITRS dataset contains hundreds of thousands of records across four relational tables. Standard Pandas processing would be memory-constrained on the full dataset. PySpark enables:

- **Distributed in-memory computation** across the full dataset
- **Lazy evaluation** — transformations are only executed when an action is called
- **Spark SQL** — structured querying over DataFrames using familiar SQL syntax
- **MLlib integration** — StringIndexer pipeline for categorical encoding, ready for downstream ML

Sampling (`fraction=0.05`) was applied **only for visualisations** when converting to Pandas — all aggregations and SQL queries run on the full dataset.

---

## Key Findings

| Finding | Detail |
|---|---|
| Most collisions occur in clear weather | 80%+ of incidents — traffic volume, not weather, is the primary risk factor |
| Fatal collisions are rare but high-impact | < 1% of total; severity-weighted metrics matter more than raw counts |
| Ages 20–40 most affected | Working-age commuters face highest exposure |
| Evening commute is peak risk window | 15:00–18:00 is consistently the highest-collision period |
| Friday is the highest-risk weekday | End-of-week volume + fatigue combination |
| Dark/unlit conditions amplify severity | Lighting is a severity multiplier, not a frequency driver |
| Urban counties dominate geographically | LA, San Diego, Riverside, San Bernardino, Orange account for majority of statewide collisions |
| 2020 COVID drop confirms traffic volume = primary lever | Mobility restriction reduced collisions more than any enforcement measure |

---

## Dataset

**Source:** Statewide Integrated Traffic Records System (SWITRS), California Highway Patrol

**Structure:** SQLite database → 4 CSV tables

| Table | Rows (approx.) | Key Attributes |
|---|---|---|
| `collisions` | ~600,000+ | Date, severity, weather, lighting, road surface, county |
| `parties` | ~1.2M+ | Driver/passenger/pedestrian details, violation codes |
| `victims` | ~800,000+ | Age, injury degree, protective equipment |
| `locations` | ~600,000+ | Latitude, longitude, road type, intersection flag |

---

## 🔗 Analysis — Click Any Section to See Code, Charts & Findings

### Data Pipeline

| # | Section | What It Covers |
|---|---|---|
| 1 | [Data Preparation](traffic_analysis/01_data_preparation.md) | SparkSession setup, CSV loading, schema inspection, sampling strategy |
| 2 | [Data Cleaning](traffic_analysis/02_data_cleaning.md) | Missing value treatment, type conversion, duplicate removal, IQR outlier detection |

### Exploratory Data Analysis

| # | Section | Analysis Type | Key Finding |
|---|---|---|---|
| 3 | [EDA Setup & Variable Classification](traffic_analysis/03_eda_overview.md) | Setup | StringIndexer pipeline, variable taxonomy |
| 4 | [Collision Severity Distribution](traffic_analysis/04_eda_severity.md) | Univariate | Property damage dominates; fatal collisions < 1% |
| 5 | [Weather Conditions](traffic_analysis/05_eda_weather.md) | Segmented Univariate | 80%+ in clear weather — volume drives frequency |
| 6 | [Victim Age Distribution](traffic_analysis/06_eda_victim_age.md) | Univariate | Ages 20–40 peak — working commuters most at risk |
| 7 | [Severity vs Number of Victims](traffic_analysis/07_eda_severity_victims.md) | Bivariate | Higher severity → more victims, wider spread |
| 8 | [Weather vs Collision Severity](traffic_analysis/08_eda_weather_severity.md) | Bivariate | Clear weather produces most severe collisions |
| 9 | [Lighting vs Collision Severity](traffic_analysis/09_eda_lighting_severity.md) | Bivariate Heatmap | Unlit conditions amplify severity rates |
| 10 | [Weekday Collision Trends](traffic_analysis/10_eda_weekday_trends.md) | Time-Series | Friday peak (~104K); Sunday lowest (~65K) |
| 11 | [Spatial Distribution](traffic_analysis/11_eda_spatial.md) | Spatial | Urban corridors dominate; I-5 / I-405 hotspots |
| 12 | [Collision Trends Over Time](traffic_analysis/12_eda_time_trends.md) | Time-Series (3 scales) | Peak ~2001–05; COVID 2020 drop; 15:00–18:00 daily peak |

### ETL & Conclusions

| # | Section | What It Covers |
|---|---|---|
| 13 | [ETL Queries (PySpark SQL)](traffic_analysis/13_etl_queries.md) | Top counties, peak month, fatal %, dangerous hours, road/lighting conditions |
| 14 | [Conclusions & Recommendations](traffic_analysis/14_conclusions.md) | 6 strategic recommendation categories + predictive modelling roadmap |

> Each section page shows the question, full code, result table, insight, and actionable outcome.

---

## Tech Stack

| Tool | Purpose |
|---|---|
| **Apache PySpark 3.5** | Distributed DataFrame processing, Spark SQL |
| **PySpark MLlib** | StringIndexer pipeline for categorical encoding |
| **Pandas** | Visualisation-side data handling (sampled data) |
| **Matplotlib** | Bar charts, line charts, histograms, scatter plots |
| **Seaborn** | Heatmap for lighting × severity cross-tabulation |
| **GeoPandas** | California county choropleth map |
| **SQLite → CSV** | Source data format (SWITRS database) |

---

## Project Structure

```
california-traffic-analysis/
│
├── README.md                                    <- This page
├── etl_traffic_data_analysis.ipynb              <- Full Jupyter notebook
│
├── traffic_analysis/                            <- One page per section
│   ├── 01_data_preparation.md
│   ├── 02_data_cleaning.md
│   ├── 03_eda_overview.md
│   ├── 04_eda_severity.md
│   ├── 05_eda_weather.md
│   ├── 06_eda_victim_age.md
│   ├── 07_eda_severity_victims.md
│   ├── 08_eda_weather_severity.md
│   ├── 09_eda_lighting_severity.md
│   ├── 10_eda_weekday_trends.md
│   ├── 11_eda_spatial.md
│   ├── 12_eda_time_trends.md
│   ├── 13_etl_queries.md
│   └── 14_conclusions.md
│
└── data/
    ├── collisions.csv
    ├── parties.csv
    ├── victims.csv
    ├── locations.csv
    └── sample_case_ids.csv
```

---

## How to Run

```bash
# Install dependencies
pip install pyspark==3.5.4 pandas==2.2.2 geopandas matplotlib seaborn

# Launch Jupyter
jupyter notebook etl_traffic_data_analysis.ipynb
```

**Important:** Update `base_path` in Cell 10 to your local data directory before running.

```python
base_path = Path("/your/local/path/to/data/")
```

---

## Conclusion

The central insight of this analysis is that **traffic volume, not environmental conditions, is the dominant driver of collision frequency**. The 2020 COVID lockdown data provides a natural experiment confirming this: when driving volume dropped, collisions dropped proportionally — more than any enforcement or infrastructure change could achieve in that timeframe.

This means the highest-leverage road safety interventions target:
1. **When and where volume is highest** (weekday evening commutes, urban corridors, Friday afternoons)
2. **Severity multipliers** (poor lighting, speed on clear-weather roads) rather than rare adverse conditions
3. **The highest-risk demographic** (20–40 age group, working-age commuters)

Predictive models built on time, location, and environmental features can shift California's traffic safety strategy from reactive response to proactive prevention.

---

*Dataset: [SWITRS — Statewide Integrated Traffic Records System](https://iswitrs.chp.ca.gov/)*
*Processing: Apache PySpark 3.5 | Python 3.10*
