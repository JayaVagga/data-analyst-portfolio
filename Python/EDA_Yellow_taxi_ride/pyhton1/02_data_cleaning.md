# Section 2 — Data Cleaning

[← Back to README](../README.md)

---

## Overview

Cleaning was applied in five stages: column fixes → missing value imputation → negative value correction → outlier removal → validation checks.

---

## 2.1 — Column Fixes

### 2.1.1 Drop unnecessary columns
```python
df.reset_index(drop=True, inplace=True)
df.drop(columns=['store_and_fwd_flag'], inplace=True)
df.columns = df.columns.str.lower()
```

### 2.1.2 Combine duplicate airport fee columns
Two columns existed for airport fee (`airport_fee`, `Airport_fee`) due to vendor naming inconsistency:
```python
df['airport_fee_final'] = df[['airport_fee', 'Airport_fee']].max(axis=1)
df.drop(columns=['airport_fee', 'Airport_fee'], inplace=True)
df.rename(columns={'airport_fee_final': 'airport_fee'}, inplace=True)
```

### 2.1.3 Fix negative monetary values
```python
monetary_cols = ['mta_tax', 'improvement_surcharge', 'total_amount',
                 'congestion_surcharge', 'airport_fee']
for col in monetary_cols:
    median_val = df[col].median()
    df.loc[df[col] < 0, col] = median_val
```
> Negative values in monetary columns are physically impossible. Column medians used as replacement to preserve distribution shape.

---

## 2.2 — Handling Missing Values

| Column | Method | Rationale |
|---|---|---|
| `passenger_count` | Mode imputation (=1) | Most trips are single-passenger |
| `ratecodeid` | Mode imputation | Categorical; mode is most representative value |
| `congestion_surcharge` | Fill with 0 | Missing = surcharge not applicable |
| `airport_fee` | Fill with 0 | Missing = not an airport trip |

```python
# passenger_count
mode_value = df['passenger_count'].mode()[0]
df['passenger_count'].fillna(mode_value, inplace=True)

# ratecodeid
mode_value = df['ratecodeid'].mode()[0]
df['ratecodeid'].fillna(mode_value, inplace=True)

# surcharges
df['congestion_surcharge'].fillna(0, inplace=True)
df['airport_fee'].fillna(0, inplace=True)
```

---

## 2.3 — Outlier Handling

```python
# Passenger count: TLC max = 6
df = df[df['passenger_count'] <= 6]

# Trip distance: 250 miles is unrealistic for NYC taxi
df = df[df['trip_distance'] <= 250]

# Zero distance + high fare (contradictory)
df = df[~((df['trip_distance'] <= 0.5) & (df['fare_amount'] > 300))]

# Zero distance + zero fare + different zones
df = df[~(
    (df['trip_distance'] == 0) &
    (df['fare_amount'] == 0) &
    (df['pulocationid'] != df['dolocationid'])
)]

# Invalid payment type
df = df[df['payment_type'] != 0]

# Extreme total amounts
df = df[df['total_amount'] <= 500]

# Tip percentage > 30%
df['tip_pct'] = df['tip_amount'] / df['fare_amount'].replace(0, np.nan)
df = df[df['tip_pct'] <= 0.30]
```

---

## 2.4 — Filtered Working Dataset

For financial and distance-based analyses, a filtered subset was created:
```python
df_filtered = df[
    (df['trip_distance'] > 0) &
    (df['fare_amount'] > 0) &
    (df['total_amount'] > 0)
].copy()
```

Zero-distance trips were retained in the main dataset for operational analyses — they represent legitimate events (immediate cancellations, minimum charges, repositioning).

---

[← Back to README](../README.md) | [Next: Temporal Analysis →](03_temporal_analysis.md)
