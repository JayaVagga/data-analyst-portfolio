[← Back to README](README.md)

---

# 02 — Preliminary Analysis & Frequency Distributions

## Objective
Perform initial data quality checks, identify variable types, and analyse distributions to understand the shape and spread of all features before modelling.

---

## i. Missing Value Check

```python
df.isnull().sum()
```

**Result:** 0 missing values across all 23 columns.

No imputation required. Dataset is fully complete — this improves model stability and avoids bias introduced by artificial data replacement.

---

## ii. Numerical Predictors — Distribution Insights

10 numerical variables identified via `int64` / `float64` dtypes:

```python
numerical_cols = df.select_dtypes(include=['int64', 'float64']).columns.tolist()
```

| Feature | Distribution Shape | Key Observation |
|---------|--------------------|-----------------|
| `price` | Strong right skew | Majority in lower-mid range; premium outliers in upper tail → **log transformation needed** |
| `km` | Highly right skewed | Extreme high-mileage vehicles present → outlier treatment required |
| `age` | Slight right skew | Higher concentration of newer vehicles |
| `hp_kW` | Moderate right skew | Few high-performance vehicles form upper tail |
| `Displacement_cc` | Right skewed | Luxury vehicles drive upper tail |
| `Weight_kg` | Approximately normal | Slight positive skew; likely correlated with engine size |
| `cons_comb` | Slight right skew | Most vehicles in moderate efficiency range |
| `Gears` | Discrete | Majority around 5–6 gears |
| `Previous_Owners` | Strong right skew | Most vehicles have 1–2 owners |
| `Inspection_new` | Binary (0/1) | Though numeric, behaves categorically |

**Modelling Implications:**
- Log transformation of `price` is necessary to stabilise variance
- Scaling is essential before applying regularised regression (Ridge/Lasso)
- Presence of outliers suggests benefit from regularisation

---

## iii. Categorical Predictors — Distribution Insights

13 categorical predictors identified:

```python
categorical_cols = df.select_dtypes(include='object').columns.tolist()
```

| Feature | Key Observation |
|---------|-----------------|
| `make_model` | High cardinality — many rare categories; few dominant models |
| `Type` | Heavily skewed toward "Used" |
| `Fuel` | Diesel and Benzin dominate; minor categories very small |
| `Drive_chain` | Front-wheel drive dominates; 4WD relatively rare |
| `body_type` | SUVs and sedans most frequent |
| Specification columns | Bundled string lists — extremely high uniqueness; not true categoricals |

---

## iv. Fixing Low Frequency Values & Class Imbalance

```python
# Group rare make_model into 'Other'
top_models = df['make_model'].value_counts().nlargest(15).index
df['make_model'] = df['make_model'].apply(lambda x: x if x in top_models else 'Other')

# Simplify vehicle Type
df['Type'] = df['Type'].apply(lambda x: 'New-like' if x in ['New', 'Pre-registered'] else 'Used')

# Combine rare Fuel types
top_fuels = df['Fuel'].value_counts().nlargest(3).index
df['Fuel'] = df['Fuel'].apply(lambda x: x if x in top_fuels else 'Other')

# Convert specification columns to count features
for col, new_col in [('Comfort_Convenience', 'Comfort_count'),
                      ('Entertainment_Media', 'Entertainment_count'),
                      ('Extras', 'Extras_count'),
                      ('Safety_Security', 'Safety_count')]:
    df[new_col] = df[col].apply(lambda x: len(str(x).split(',')) if pd.notna(x) else 0)

# Bin Previous_Owners into owner_category
df['owner_category'] = pd.cut(df['Previous_Owners'], bins=[0,1,3,100],
                               labels=['Low','Medium','High'])
```

**Why this matters:**
- Prevents dummy variable explosion during one-hot encoding
- Reduces overfitting from sparse categories
- Improves coefficient stability in linear models

---

## v. Target Variable — Price Distribution

**Initial Skewness:** 1.23 (positively skewed)

```python
import numpy as np
df['log_price'] = np.log(df['price'])
```

**After Log Transformation — Skewness:** ≈ 0 (approximately symmetric)

| Metric | Before Transformation | After Log Transformation |
|--------|-----------------------|--------------------------|
| Skewness | 1.23 | ~0.03 |
| Distribution shape | Right-skewed | Approximately normal |
| Variance | Unstable | Stabilised |

**Why log transformation?**
- Reduces impact of extreme high-price luxury vehicles
- Improves linearity assumption for regression
- Stabilises variance (addresses heteroscedasticity)
- `log_price` was used as the target variable for **all modelling**

---

## Overall Section Takeaway

> The dataset is structurally complete. Skewness, class imbalance, and bundled specification columns required targeted transformations before any modelling could begin. Feature transformation significantly improved model readiness.

---

[← Back to README](../README.md) | [← Prev: Data Understanding](01_data_understanding.md) | [Next: Correlation Analysis →](03_correlation_analysis.md)
