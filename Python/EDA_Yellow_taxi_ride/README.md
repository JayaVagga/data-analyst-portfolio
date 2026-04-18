# NYC Yellow Taxi — Exploratory Data Analysis (2023)

[![Python](https://img.shields.io/badge/Python-3.10-3776AB?style=flat&logo=python&logoColor=white)](https://python.org)
[![Pandas](https://img.shields.io/badge/Pandas-2.2.2-150458?style=flat&logo=pandas&logoColor=white)](https://pandas.pydata.org)
[![Seaborn](https://img.shields.io/badge/Seaborn-0.13.2-4C72B0?style=flat)](https://seaborn.pydata.org)
[![GeoPandas](https://img.shields.io/badge/GeoPandas-Spatial-228B22?style=flat)](https://geopandas.org)
[![Dataset](https://img.shields.io/badge/Dataset-NYC%20TLC-F6C90A?style=flat)](https://www.nyc.gov/site/tlc/about/tlc-trip-record-data.page)
[![Charts](https://img.shields.io/badge/Charts-35-brightgreen?style=flat)]()
[![Status](https://img.shields.io/badge/Status-Complete-success?style=flat)]()

---

## The Business Question

> **As an analyst at a new NYC taxi operation, how can 2023 trip data be used to optimise fleet deployment, maximise revenue, and improve passenger experience?**

This project performs end-to-end EDA on 2023 NYC Yellow Taxi trip records — 12 monthly Parquet files containing millions of trips — using an 8% stratified sample for computational feasibility. The analysis spans temporal patterns, financial correlations, geographic clustering, operational efficiency, pricing strategy, and customer behaviour across 35 visualisations.

---

## Key Findings

| Dimension | Finding |
|---|---|
| **Peak demand hour** | 3 PM (15:00) — stronger than traditional 5 PM rush |
| **Busiest day** | Friday — end-of-week commute + leisure combined |
| **Highest revenue months** | May and October |
| **Fare predictor** | Trip distance (r = 0.87) — strongest correlation |
| **Tip predictor** | Trip distance (r = 0.61) — moderate positive |
| **Top pickup zone** | Midtown Manhattan dominates all hours |
| **Night revenue** | 17% of total despite covering 7 hours (high per-trip value) |
| **Surcharge prevalence** | Near 100% across all hours — virtually universal |
| **Fare vs passenger count** | r = 0.045 — negligible (flat-rate structure) |
| **Group ride value** | 2–3 passenger trips tip more per person than solo rides |

---

## Dataset

**Source:** [NYC Taxi & Limousine Commission (TLC)](https://www.nyc.gov/site/tlc/about/tlc-trip-record-data.page)

| Attribute | Detail |
|---|---|
| Format | Parquet (.parquet) — 12 monthly files |
| Period | January–December 2023 |
| Sampling | 8% stratified hourly sample |
| Final rows | ~300,000 after cleaning |
| Geometry | taxi_zones.shp (263 TLC zones, 5 boroughs) |

---

## 🔗 Analysis — Click Any Section to See Code & Findings

| # | Section | What It Covers |
|---|---|---|
| 1 | [Data Preparation](01_data_preparation.md) | Parquet loading, 8% stratified sampling strategy, dataset schema |
| 2 | [Data Cleaning](02_data_cleaning.md) | Column fixes, missing values, negative values, outlier removal |
| 3 | [Temporal Analysis](03_temporal_analysis.md) | Hourly, daily, monthly pickup trends |
| 4 | [Financial Analysis](04_financial_analysis.md) | Revenue trends, quarterly split, fare/tip correlations, payment types |
| 5 | [Geographical Analysis](05_geographical_analysis.md) | Zone shapefile, choropleth pickup density map |
| 6 | [Operational Efficiency](06_operational_efficiency.md) | Trips per hour scaled, weekday vs weekend, top zones, night operations |
| 7 | [Pricing Strategy](07_pricing_strategy.md) | Fare per mile per passenger, hourly/daily fare, vendor comparison, distance tiers |
| 8 | [Customer Experience](08_customer_experience.md) | Tip % by distance/passenger/hour, KDE comparison, surcharge prevalence |
| 9 | [Conclusions & Recommendations](09_conclusions.md) | Routing, positioning, pricing strategy — all actionable with data evidence |

> Each section shows the full Python code, the chart produced, and a Result / Insight / Outcome breakdown.

---

## 35 Charts Across 9 Analysis Areas

| Section | Charts |
|---|---|
| Temporal | Hourly pickups, daily pickups, monthly pickups |
| Financial | Monthly revenue, quarterly pie, distance-fare scatter, fare-duration/passenger scatter, tip-distance scatter, payment types |
| Geographical | NYC zones base map, choropleth trip density |
| Operational | Trips/hour (line + bar), weekday vs weekend (line + seaborn), top 10 pickup/dropoff hourly trends, night pickup/dropoff zones, night vs day revenue pie |
| Pricing | Fare/mile per passenger, fare/mile by hour + day, vendor fare by hour, vendor fare by tier |
| Customer | Tip % by distance/passengers/hour, low vs high tip KDE (hour + distance), passenger count by hour + day + zone, surcharge frequency |

---

## Tech Stack

| Tool | Purpose |
|---|---|
| **Pandas 2.2.2** | Data loading, cleaning, aggregation |
| **NumPy 1.26.4** | Numerical operations |
| **Matplotlib 3.10.0** | Base plotting |
| **Seaborn 0.13.2** | Statistical visualisations, heatmaps, KDE |
| **GeoPandas** | Shapefile loading, choropleth map |
| **PyArrow** | Parquet file reading |

---

## Project Structure

```
nyc-taxi-eda-2023/
│
├── README.md                            <- This page
├── EDA_NYC_Taxi_Analysis.ipynb          <- Full Jupyter notebook (35 charts)
│
├──                         <- One page per section
│   ├── 01_data_preparation.md
│   ├── 02_data_cleaning.md
│   ├── 03_temporal_analysis.md
│   ├── 04_financial_analysis.md
│   ├── 05_geographical_analysis.md
│   ├── 06_operational_efficiency.md
│   ├── 07_pricing_strategy.md
│   ├── 08_customer_experience.md
│   └── 09_conclusions.md
│
└── data/
    ├── yellow_tripdata_2023-01.parquet  (not included — download from NYC TLC)
    ├── ... (12 monthly files)
    └── taxi_zones/
        └── taxi_zones.shp               (+ supporting shapefile components)
```

---

## How to Run

```python
# 1. Install dependencies
pip install pandas numpy matplotlib seaborn geopandas pyarrow fastparquet

# 2. Download data from NYC TLC
# https://www.nyc.gov/site/tlc/about/tlc-trip-record-data.page
# Download all 12 yellow taxi files for 2023 + taxi_zones shapefile

# 3. Update the base_path in the notebook
base_path = Path("/your/local/path/to/trip_records/")

# 4. Run the notebook
jupyter notebook EDA_NYC_Taxi_Analysis.ipynb
```

---

## Conclusion

The three highest-leverage operational improvements identified are:

1. **Time-indexed fleet deployment** — matching supply to the 3 PM peak, Friday volume, and May/October seasonal demand
2. **Zone-specific positioning** — concentrating fleet in Midtown business hours, rotating to airports at 4 PM, and coverage near entertainment zones at night
3. **Transparent dynamic pricing** — surge multipliers during proven peak windows, flat rates for high-frequency short routes, and group ride packages to compete with app-based alternatives

All three require no capital investment — only data-driven scheduling and policy changes.

---

## Author

**Vagga Jayalakshmi**  
[LinkedIn](https://linkedin.com/in/vagga-jai-1206inn)

---

*Dataset: [NYC TLC Trip Record Data](https://www.nyc.gov/site/tlc/about/tlc-trip-record-data.page)*
*Geometry: [NYC TLC Taxi Zone Shapefile](https://data.cityofnewyork.us/Transportation/NYC-Taxi-Zones/d3c5-ddgc)*
