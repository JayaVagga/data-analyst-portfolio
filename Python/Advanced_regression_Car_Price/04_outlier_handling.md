[← Back to README](README.md)

---

# 04 — Outlier Handling

## Objective
Identify extreme values that could disproportionately influence regression coefficients, and handle them in a way that preserves market realism while maintaining statistical robustness.

---

## i. Identifying Potential Outliers

Outliers were detected using the **Interquartile Range (IQR) method**:

```python
def detect_outliers_iqr(df, col):
    Q1 = df[col].quantile(0.25)
    Q3 = df[col].quantile(0.75)
    IQR = Q3 - Q1
    lower = Q1 - 1.5 * IQR
    upper = Q3 + 1.5 * IQR
    outliers = df[(df[col] < lower) | (df[col] > upper)]
    return outliers, lower, upper

# Visualise with boxplots
numerical_cols = ['price', 'km', 'hp_kW', 'Displacement_cc', 'cons_comb', 'Previous_Owners']
fig, axes = plt.subplots(2, 3, figsize=(15, 8))
for ax, col in zip(axes.flatten(), numerical_cols):
    df.boxplot(column=col, ax=ax)
    ax.set_title(col)
plt.tight_layout()
plt.show()
```

### Outlier Summary by Feature

| Feature | Nature of Outliers | Economic Interpretation |
|---------|--------------------|------------------------|
| `price` | Strong right tail | Genuine luxury/premium segment listings |
| `km` | Extremely high mileage | High-usage commercial or fleet vehicles |
| `hp_kW` | High-performance upper tail | Sports and performance cars |
| `Displacement_cc` | Large-engine upper tail | Premium segment with big engines |
| `cons_comb` | Few extremely inefficient vehicles | Older or performance-focused models |
| `Previous_Owners` | Unusually high ownership counts | Rental/fleet vehicles |

> **Key insight:** These outliers represent **real market segments**. They are **not data entry errors**. Removing them would bias the model toward budget vehicles only.

---

## ii. Handling Outliers — Multi-Strategy Approach

### Strategy 1 — Log Transformation of Target
```python
df['log_price'] = np.log(df['price'])
# Skewness reduced: 1.23 → ~0.03
```

### Strategy 2 — Feature Scaling
```python
from sklearn.preprocessing import StandardScaler
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)
```

### Strategy 3 — Regularisation (Ridge & Lasso)
Penalises large coefficients directly, reducing sensitivity to extreme predictor values.

### Strategy 4 — Ratio Feature Engineering
```python
df['km_per_year'] = df['km'] / (df['age'] + 1)
df['power_to_weight'] = df['hp_kW'] / df['Weight_kg']
```

### Why Outliers Were NOT Removed

| Reason | Detail |
|--------|--------|
| Market realism | Observations represent real transactions |
| Bias risk | Removing luxury vehicles skews model toward budget range |
| Dataset size | 15,915 observations absorb extremes well |
| Log transformation | Significantly reduces leverage of high-price vehicles |

---

## Overall Takeaway

> Log transformation + scaling + regularisation preserved market realism while maintaining statistical robustness — supporting generalisable modelling rather than artificial data trimming.

---

[← Back to README](../README.md) | [← Prev: Correlation Analysis](03_correlation_analysis.md) | [Next: Feature Engineering →](05_feature_engineering.md)
