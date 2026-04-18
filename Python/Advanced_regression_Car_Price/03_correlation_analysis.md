[← Back to README](../README.md)

---

# 03 — Correlation Analysis

## Objective
Understand the strength and direction of relationships between all predictors and the log-transformed target variable (`log_price`). Numerical and categorical variables analysed separately.

---

## i. Numerical Correlation with log_price

```python
import seaborn as sns
import matplotlib.pyplot as plt

corr = df.select_dtypes(include='number').corr()['log_price'].drop('log_price').sort_values()
corr.plot(kind='barh', figsize=(10, 8), color='steelblue')
plt.title('Correlation of Numerical Features with Log(Price)')
plt.tight_layout()
plt.show()
```

### Results Summary

| Feature | Correlation Direction | Strength | Insight |
|---------|-----------------------|----------|---------|
| `age` | **Negative** | Strong (≈ −0.55) | Strongest depreciation driver in the dataset |
| `km` | Negative | Moderate | Higher mileage → lower resale value |
| `km_per_year` | Negative | Moderate | Usage intensity more predictive than raw mileage |
| `hp_kW` | **Positive** | Strong (≈ +0.60) | Engine power is a key price driver |
| `power_to_weight` | Positive | Strong | Performance efficiency — stronger than hp_kW alone |
| `Displacement_cc` | Positive | Moderate | Larger engines linked to higher prices |
| `Weight_kg` | Positive | Slight | Likely proxy for vehicle size/segment |
| `Comfort_count` | Positive | Moderate | Equipment richness adds value |
| `Extras_count` | Positive | Moderate | More extras → higher price |
| `Safety_count` | Positive | Slight | Safety features mildly priced-in |
| `Entertainment_count` | Positive | Slight | Minor direct influence |
| `Gears` | Positive | Weak | Minimal direct impact |
| `Inspection_new` | Positive | Weak | Limited influence on price variation |
| `Previous_Owners` | Negative | Weak | Fewer owners → marginally higher price |

---

## Internal Feature Correlations (Multicollinearity Check)

High correlations observed **between** predictors:

| Feature Pair | Correlation | Implication |
|-------------|-------------|-------------|
| `hp_kW` ↔ `Displacement_cc` | High | Engine power and size are structurally linked |
| `hp_kW` ↔ `Weight_kg` | Moderate | Larger, more powerful vehicles weigh more |
| `Displacement_cc` ↔ `Weight_kg` | Moderate | Size-weight relationship |

> **This justifies testing Ridge regression** — L2 regularisation is specifically designed to handle correlated predictors by shrinking their coefficients proportionally.

---

## ii. Categorical Correlation with log_price

Since Pearson correlation doesn't apply to categoricals, **mean log_price per category** was used:

```python
for col in categorical_cols:
    group_means = df.groupby(col)['log_price'].mean().sort_values()
    group_means.plot(kind='barh')
    plt.title(f'Mean Log Price by {col}')
    plt.show()
```

### Key Findings

| Feature | Insight |
|---------|---------|
| `make_model` | Significant price variation across brands — brand identity is a dominant driver |
| `body_type` | Vans and Station Wagons → higher average prices; Compact cars → lower |
| `Type` | New-like vehicles command notably higher prices than Used |
| `Drive_chain` | 4WD vehicles priced higher than front-wheel drive |
| `Fuel` | Diesel and Benzin show comparable average prices |
| `Gearing_Type` | Automatic transmissions tend toward higher price segments |
| `owner_category` | Fewer previous owners → slightly higher average prices |

---

## Overall Correlation Insight

> Price variation is primarily driven by:
> 1. **Age** — strongest negative effect (depreciation)
> 2. **Performance indicators** — `hp_kW`, `power_to_weight` (positive)
> 3. **Brand/Model** — dominant categorical driver
> 4. **Usage intensity** — `km_per_year` (negative)
> 5. **Equipment richness** — count-engineered features (positive)

The correlation structure confirms that **linear regression is statistically appropriate** for this dataset.

---

[← Back to README](../README.md) | [← Prev: Preliminary Analysis](02_preliminary_analysis.md) | [Next: Outlier Handling →](04_outlier_handling.md)
