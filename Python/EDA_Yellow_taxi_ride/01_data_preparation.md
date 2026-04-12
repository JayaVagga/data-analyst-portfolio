# Section 1 — Data Preparation & Loading

[← Back to README](../README.md)

---

## Objective

Load 12 monthly Parquet files from NYC TLC (2023), sample them strategically for computational feasibility, and produce a single consolidated CSV for analysis.

---

## 1.1 — Libraries Used

```python
import warnings
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import geopandas as gpd
import glob, os
from datetime import datetime
```

---

## 1.2 — Sampling Strategy

The 12 monthly Parquet files collectively contain tens of millions of rows. Loading all data into memory is impractical. Instead, an **8% stratified hourly sample** was drawn:

```python
# For each monthly file:
# → Read day-by-day
# → For each hour of each day, sample 8% of records
# → Append to combined DataFrame
sample_fraction = 0.08
```

**Why stratified hourly sampling?**  
Randomly sampling at dataset level risks over-representing common hours (afternoon) and under-representing rare hours (4 AM). Hourly stratification ensures the sample represents the full temporal distribution of trips — preserving peak/off-peak patterns accurately.

```python
import os, glob
import pandas as pd

os.chdir('/path/to/trip_records')
file_list = sorted(glob.glob("*.parquet"))

combined_df = []
for f in file_list:
    df_month = pd.read_parquet(f, engine='pyarrow')
    df_month['date'] = pd.to_datetime(df_month['tpep_pickup_datetime']).dt.date
    df_month['hour'] = pd.to_datetime(df_month['tpep_pickup_datetime']).dt.hour
    
    sample = df_month.groupby(['date', 'hour'], group_keys=False).apply(
        lambda x: x.sample(frac=0.08, random_state=42)
    )
    combined_df.append(sample)

df = pd.concat(combined_df, ignore_index=True)
df.to_csv('sampled_taxi_data.csv', index=False)
```

---

## 1.3 — Dataset Overview

| Attribute | Detail |
|---|---|
| Source | NYC Taxi & Limousine Commission (TLC) |
| Format | Parquet (.parquet) — 12 monthly files |
| Coverage | January–December 2023 |
| Sample Rate | 8% stratified hourly |
| Final Dataset Size | ~300,000 rows |

---

## 1.4 — Column Reference

| Field | Type | Description |
|---|---|---|
| `VendorID` | Categorical | 1 = Creative Mobile Technologies; 2 = VeriFone Inc. |
| `tpep_pickup_datetime` | DateTime | Trip pickup timestamp |
| `tpep_dropoff_datetime` | DateTime | Trip dropoff timestamp |
| `passenger_count` | Numeric | Driver-reported passenger count |
| `trip_distance` | Numeric | Miles travelled (metered) |
| `PULocationID` | Categorical | TLC pickup zone ID (1–265) |
| `DOLocationID` | Categorical | TLC dropoff zone ID (1–265) |
| `RatecodeID` | Categorical | 1=Standard, 2=JFK, 3=Newark, 4=Nassau/Westchester, 5=Negotiated, 6=Group ride |
| `payment_type` | Categorical | 1=Credit Card, 2=Cash, 3=No Charge, 4=Dispute |
| `fare_amount` | Numeric | Metered fare in USD |
| `tip_amount` | Numeric | Tip amount (auto-populated for card; 0 for cash) |
| `total_amount` | Numeric | Total charged including all surcharges |
| `congestion_surcharge` | Numeric | $2.75 for Manhattan trips below 96th Street |
| `airport_fee` | Numeric | $1.75 for JFK/LGA pickups |

---

[← Back to README](../README.md) | [Next: Data Cleaning →](02_data_cleaning.md)
