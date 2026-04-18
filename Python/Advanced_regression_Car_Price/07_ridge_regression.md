[← Back to README](README.md)

---

# 07 — Ridge Regression (L2 Regularisation)

## Objective
Apply Ridge regression to address potential multicollinearity and stabilise coefficient estimates through L2 regularisation. Tune the hyperparameter alpha using cross-validation.

---

## What is Ridge Regression?

Ridge adds an **L2 penalty** to the OLS loss function:

```
Loss = RSS + α × Σ(βᵢ²)
```

- **Small α** → behaves like ordinary linear regression
- **Large α** → heavy coefficient shrinkage (high bias, low variance)
- Ridge **never eliminates** features — all coefficients are shrunk but remain non-zero

---

## i. Define Alpha Search Range

```python
import numpy as np
from sklearn.linear_model import Ridge
from sklearn.model_selection import GridSearchCV

# Logarithmic range: 10^-4 to 10^4 (50 values)
alphas = np.logspace(-4, 4, 50)

ridge = Ridge()
param_grid = {'alpha': alphas}

grid_search = GridSearchCV(
    ridge,
    param_grid,
    cv=5,                        # 5-fold cross-validation
    scoring='neg_mean_absolute_error',
    n_jobs=-1
)
grid_search.fit(X_train_scaled, y_train)
```

**Why logarithmic spacing?** It covers multiple orders of magnitude systematically, ensuring we don't miss the optimal region.

---

## ii. Initial Grid Search Results

```python
best_alpha_initial = grid_search.best_params_['alpha']
print(f"Best Alpha: {best_alpha_initial:.4f}")
print(f"CV MAE: {-grid_search.best_score_:.4f}")
```

| Result | Value |
|--------|-------|
| **Best Alpha (initial)** | ≈ 24.42 |
| **Cross-Validated MAE** | ≈ 0.0856 |

### R² vs Alpha Curve Analysis

```python
train_r2, test_r2 = [], []
for alpha in alphas:
    model = Ridge(alpha=alpha)
    model.fit(X_train_scaled, y_train)
    train_r2.append(r2_score(y_train, model.predict(X_train_scaled)))
    test_r2.append(r2_score(y_test, model.predict(X_test_scaled)))

plt.semilogx(alphas, train_r2, label='Train R²')
plt.semilogx(alphas, test_r2, label='Test R²')
plt.xlabel('Alpha')
plt.ylabel('R² Score')
plt.title('Ridge: Train vs Test R²')
plt.legend()
plt.show()
```

**Observations from curve:**
- Performance stable for small and moderate alpha values
- Significant R² drop at very large alpha (over-regularised)
- Train and Test curves remain closely aligned → no overfitting

---

## iii. Fine-Tuned Search

```python
# Refined range around best_alpha_initial
alphas_refined = np.linspace(10, 40, 100)

grid_refined = GridSearchCV(Ridge(), {'alpha': alphas_refined},
                             cv=5, scoring='neg_mean_absolute_error')
grid_refined.fit(X_train_scaled, y_train)

best_alpha_refined = grid_refined.best_params_['alpha']
print(f"Refined Best Alpha: {best_alpha_refined:.4f}")
```

| Result | Value |
|--------|-------|
| **Refined Best Alpha** | ≈ 25.15 |

Performance stable within this range — further tuning yields no meaningful improvement.

---

## Ridge Model — Final Evaluation

```python
ridge_final = Ridge(alpha=25.15)
ridge_final.fit(X_train_scaled, y_train)
y_pred_ridge = ridge_final.predict(X_test_scaled)
```

| Metric | Score |
|--------|-------|
| **Test R²** | 0.9217 |
| **Test MAE** | 0.007806 |
| **Test RMSE** | 0.010463 |

---

## Coefficient Behaviour

- **All coefficients retained** (none set to zero)
- Coefficients slightly shrunk vs OLS baseline
- Correlated predictors (`hp_kW`, `Displacement_cc`) stabilised

---

## Key Analytical Insight

> Ridge regression confirms that **multicollinearity is moderate but not harmful**. The baseline OLS model was already well-conditioned. Ridge acted here as a **stability enhancer** rather than a performance booster — improving coefficient interpretability for correlated engine features without changing predictive accuracy.

---

[← Back to README](../README.md) | [← Prev: Baseline Linear Regression](06_baseline_linear_regression.md) | [Next: Lasso Regression →](08_lasso_regression.md)
