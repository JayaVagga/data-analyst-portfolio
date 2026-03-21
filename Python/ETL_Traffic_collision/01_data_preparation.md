# Section 1 — Data Preparation

[← Back to README](../README.md)

---

## Objective

Load California traffic collision data from CSV files derived from a SQLite database into PySpark DataFrames, inspect schema correctness, and prepare the data for large-scale processing.

---

## 1.1 — SparkSession Initialisation

```python
from pyspark.sql import SparkSession

spark = SparkSession.builder \
    .appName("Traffic-Collision-Analysis") \
    .config('spark.driver.memory', '4g') \
    .getOrCreate()
```

**Why PySpark?** The California SWITRS dataset contains hundreds of thousands of records across multiple relational tables. PySpark enables distributed in-memory processing that would be impractical with Pandas alone on the full dataset.

---

## 1.2 — File Path Organisation

```python
from pathlib import Path

base_path = Path("/path/to/Crash_Data_Analysis_Data")

csv_files = {
    "case_ids"   : base_path / "sample_case_ids.csv",
    "collisions" : base_path / "collisions.csv",
    "parties"    : base_path / "parties.csv",
    "victims"    : base_path / "victims.csv",
    "locations"  : base_path / "locations.csv"
}
```

All dataset paths are centralised in a dictionary so a single loop can load every table — no repeated `pd.read_csv()` calls scattered through the notebook.

---

## 1.3 — Loading All Tables into PySpark DataFrames

```python
df_dict = {}

for table, file_path in csv_files.items():
    df_dict[table] = spark.read.csv(
        str(file_path),
        header=True,
        inferSchema=True
    )
    print(f"Loaded: {table} → {df_dict[table].count()} rows")
```

**Schema inspection** was run immediately after loading to validate column types and confirm inferred schemas matched expectations:

```python
for name, df in df_dict.items():
    print(f"\nSchema for {name}")
    df.printSchema()
```

**Sample records** were reviewed per table:

```python
for name, df in df_dict.items():
    print(f"\nSample data from {name}")
    df.show(5, truncate=False)
```

---

## 1.4 — Dataset Structure

| Table | Description | Key Columns |
|---|---|---|
| `collisions` | Core incident records | `case_id`, `collision_date`, `collision_severity`, `weather_1`, `lighting`, `county_location` |
| `parties` | Drivers, passengers, pedestrians | `case_id`, `party_type`, `party_age`, `violation_code` |
| `victims` | Injury detail per person | `case_id`, `victim_age`, `victim_degree_of_injury` |
| `locations` | Geographic coordinates | `case_id`, `latitude`, `longitude`, `road_type` |
| `case_ids` | Linking key across tables | `case_id` |

---

## 1.5 — Sampling Strategy

Full-dataset computation was used for all aggregations and Spark SQL queries. Sampling (`fraction=0.05`) was applied **only for visualisations** to prevent memory overflow when converting Spark DataFrames to Pandas:

```python
samples = {
    "collisions": df_dict["collisions"].sample(0.05, seed=42),
    "victims"   : df_dict["victims"].sample(0.05, seed=42),
    "parties"   : df_dict["parties"].sample(0.05, seed=42)
}
```

This preserves representative distributions for EDA while keeping Pandas memory usage manageable.

---

[← Back to README](../README.md) | [Next: Data Cleaning →](02_data_cleaning.md)
