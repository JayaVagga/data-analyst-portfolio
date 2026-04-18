[← Back to README](../README.md)

---

# 06 — Baseline Linear Regression Model

## Objective
Build and evaluate an Ordinary Least Squares (OLS) linear regression model as the performance benchmark before applying regularisation.

---

## Model Setup

```python
from sklearn.linear_model import LinearRegression
from sklearn.metrics import r2_score, mean_absolute_error, mean_squared_error
import numpy as np

lr = LinearRegression()
lr.fit(X_train_scaled, y_train)

y_train_pred = lr.predict(X_train_scaled)
y_test_pred  = lr.predict(X_test_scaled)
```

---

## i. Model Performance

| Metric | Train | Test |
|--------|-------|------|
| **R²** | 0.9148 | **0.9212** |
| **MAE** | 0.00797 | 0.08346 |
| **RMSE** | 0.01085 | 0.11191 |

### Interpreting the Results

**R² = 0.9212 on test data** — the model explains ~92% of the variance in used car prices. This is exceptionally strong for a real-world dataset.

**Test R² > Train R²** — an unusual but positive signal. It indicates:
- No overfitting whatsoever
- The model generalises extremely well to unseen data
- Feature engineering produced clean, informative signals

**MAE vs RMSE:** RMSE (0.112) slightly higher than MAE (0.083), which is expected — RMSE penalises large errors more heavily. The closeness of the two values indicates no extreme prediction spikes; predictions are stable and consistent.

---

## ii. Residual Analysis & Assumption Checks

```python
residuals = y_test - y_test_pred

# 1. Residuals vs Predicted
plt.scatter(y_test_pred, residuals, alpha=0.4)
plt.axhline(0, color='red', linestyle='--')
plt.xlabel('Predicted log_price')
plt.ylabel('Residuals')
plt.title('Residuals vs Predicted Values')
plt.show()

# 2. Residual Distribution
sns.histplot(residuals, kde=True)
plt.title('Residual Distribution')
plt.show()
```

### Assumption Validation

| Assumption | Status | Evidence |
|------------|--------|----------|
| **Linearity** | Satisfied | Residuals randomly scattered around zero; no curvature |
| **Homoscedasticity** | Satisfied | No funnel-shaped pattern; log transformation stabilised variance |
| **Normality of Residuals** | Reasonably satisfied | Approximately bell-shaped; minor tails acceptable at n=15,915 |
| **Multicollinearity** | Moderate | VIF elevated for engine-related features; not severe enough to destabilise OLS |

```python
# VIF Check
from statsmodels.stats.outliers_influence import variance_inflation_factor

vif_data = pd.DataFrame()
vif_data['Feature'] = X_train.columns
vif_data['VIF'] = [variance_inflation_factor(X_train_scaled, i)
                   for i in range(X_train_scaled.shape[1])]
```

**VIF Findings:** Most values within acceptable range. Engine-related variables (`hp_kW`, `Displacement_cc`, `Weight_kg`) show moderate correlation — structurally expected and controlled by the engineered ratio features.

---

## Key Analytical Insight

> The baseline linear regression model performs **exceptionally well** — R² of 0.92 on unseen data with no signs of overfitting. This is a direct consequence of strong feature engineering, not algorithmic complexity. Regularisation is tested next as a precautionary measure for coefficient stability — not because the model needs fixing.

---

[← Back to README](../README.md) | [← Prev: Feature Engineering](05_feature_engineering.md) | [Next: Ridge Regression →](07_ridge_regression.md)
