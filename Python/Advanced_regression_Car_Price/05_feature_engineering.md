[← Back to README](../README.md)

---

# 05 — Feature Engineering

## Objective
Transform, derive, and encode features to maximise predictive signal, reduce redundancy, and prepare the dataset for regularised regression modelling.

---

## i. New Features Created

### 1. Log-Transformed Target
```python
df['log_price'] = np.log(df['price'])
df.drop(columns=['price'], inplace=True)
```
Reason: Normalises skewness (1.23 → ~0), stabilises variance, satisfies linear regression assumptions.

---

### 2. km_per_year — Usage Intensity
```python
df['km_per_year'] = df['km'] / (df['age'] + 1)
```
**Why:** Raw mileage doesn't reflect how hard a vehicle was driven. A 10-year-old car with 100,000 km has been used less intensively than a 3-year-old car with the same mileage. Normalising by age captures **wear and tear intensity** more accurately.

---

### 3. power_to_weight — Performance Efficiency
```python
df['power_to_weight'] = df['hp_kW'] / df['Weight_kg']
```
**Why:** This ratio captures how efficiently a vehicle uses its power — a better proxy for driving experience and market segment than raw power alone. Showed **stronger correlation with price** than `hp_kW` individually.

---

### 4. engine_efficiency
```python
df['engine_efficiency'] = df['hp_kW'] / df['Displacement_cc']
```
**Why:** Captures engine optimisation quality — modern turbocharged engines produce more power per cc, which is a premium signal.

---

### 5. owner_category — Binned Ownership
```python
df['owner_category'] = pd.cut(df['Previous_Owners'],
                               bins=[0, 1, 3, 100],
                               labels=['Low', 'Medium', 'High'])
```
**Why:** Reduces skewness of `Previous_Owners`, improves interpretability, and converts a noisy continuous variable into meaningful ordinal groups.

---

### 6. Specification Count Features
```python
spec_cols = {
    'Comfort_Convenience': 'Comfort_count',
    'Entertainment_Media': 'Entertainment_count',
    'Extras':              'Extras_count',
    'Safety_Security':     'Safety_count'
}

for orig, new in spec_cols.items():
    df[new] = df[orig].apply(lambda x: len(str(x).split(',')) if pd.notna(x) else 0)
    df.drop(columns=[orig], inplace=True)
```
**Why:** Direct one-hot encoding of bundled string columns would produce thousands of sparse dummy columns — intractable for regression. Count features **preserve information richness** while controlling dimensionality.

---

### 7. total_features — Overall Equipment Score
```python
df['total_features'] = (df['Comfort_count'] + df['Entertainment_count'] +
                         df['Extras_count'] + df['Safety_count'])
```
**Why:** Represents the overall "feature richness" of a vehicle — a single composite score for equipment level, which correlates with premium positioning.

---

### 8. High-Cardinality make_model Grouping
```python
top_models = df['make_model'].value_counts().nlargest(15).index
df['make_model'] = df['make_model'].apply(lambda x: x if x in top_models else 'Other')
```
**Why:** Retains the most commercially significant models while preventing dummy explosion and overfitting on rare categories.

---

## ii. Feature Encoding
```python
df_encoded = pd.get_dummies(df, drop_first=True)
```
**Why `drop_first=True`:** Prevents the dummy variable trap (perfect multicollinearity) — essential for linear regression validity.

---

## iii. Train-Test Split
```python
from sklearn.model_selection import train_test_split

X = df_encoded.drop(columns=['log_price'])
y = df_encoded['log_price']

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)
# Training set: 12,732 rows | Test set: 3,183 rows
```

---

## iv. Feature Scaling
```python
from sklearn.preprocessing import StandardScaler

scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled  = scaler.transform(X_test)
```
**Critical for Ridge & Lasso:** Both penalise coefficient magnitude. Without scaling, variables with larger numeric ranges dominate the penalty term — producing unfair regularisation. Scaling ensures **equal treatment across all predictors**.

> Scaler is **fit only on training data** and applied to test data — preventing data leakage.

---

## Feature Engineering Impact Summary

| Feature | Type | Purpose |
|---------|------|---------|
| `log_price` | Transformation | Normalise target distribution |
| `km_per_year` | Derived | Capture usage intensity |
| `power_to_weight` | Derived | Performance efficiency metric |
| `engine_efficiency` | Derived | Engine optimisation signal |
| `owner_category` | Binned | Simplify ownership skewness |
| `*_count` columns | Aggregated | Control spec column dimensionality |
| `total_features` | Composite | Overall equipment richness score |
| make_model grouping | Cleaned | Prevent dummy explosion |

---

## Overall Takeaway

> Feature engineering contributed **more to model performance** than the choice of algorithm. The strong baseline R² of 0.92 on test data validates the effectiveness of this preprocessing pipeline.

---

[← Back to README](../README.md) | [← Prev: Outlier Handling](04_outlier_handling.md) | [Next: Baseline Linear Regression →](06_baseline_linear_regression.md)
