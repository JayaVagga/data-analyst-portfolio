[← Back to README](../README.md)

---

# 08 — Lasso Regression (L1 Regularisation)

## Objective
Apply Lasso regression to perform both regularisation and **automatic feature selection**. Unlike Ridge, Lasso can shrink coefficients exactly to zero — effectively removing weak predictors from the model.

---

## What is Lasso Regression?

Lasso adds an **L1 penalty** to the OLS loss function:

```
Loss = RSS + α × Σ|βᵢ|
```

- **Small α** → behaves like ordinary linear regression
- **Large α** → aggressive coefficient elimination (sparse model)
- Lasso **can set coefficients exactly to zero** — built-in feature selection

| | Ridge | Lasso |
|--|-------|-------|
| Penalty type | L2 (squared) | L1 (absolute) |
| Feature selection | ❌ Keeps all | ✅ Eliminates weak features |
| Best for | Multicollinearity | Sparse, interpretable models |

---

## i. Define Alpha Search Range

```python
from sklearn.linear_model import Lasso

# Logarithmic range: 10^-4 to 10^1
alphas_lasso = np.logspace(-4, 1, 50)

lasso = Lasso(max_iter=10000)
grid_lasso = GridSearchCV(
    lasso,
    {'alpha': alphas_lasso},
    cv=5,
    scoring='neg_mean_absolute_error',
    n_jobs=-1
)
grid_lasso.fit(X_train_scaled, y_train)
```

---

## ii. Initial Grid Search Results

| Result | Value |
|--------|-------|
| **Best Alpha (initial)** | ≈ 0.0001 |
| **Cross-Validated MAE** | ≈ 0.00799 |

### MAE vs Alpha Curve

```python
train_mae, test_mae = [], []
for alpha in alphas_lasso:
    model = Lasso(alpha=alpha, max_iter=10000)
    model.fit(X_train_scaled, y_train)
    train_mae.append(mean_absolute_error(y_train, model.predict(X_train_scaled)))
    test_mae.append(mean_absolute_error(y_test, model.predict(X_test_scaled)))

plt.semilogx(alphas_lasso, train_mae, label='Train MAE')
plt.semilogx(alphas_lasso, test_mae, label='Test MAE')
plt.xlabel('Alpha')
plt.ylabel('MAE')
plt.title('Lasso: MAE vs Alpha')
plt.legend()
plt.show()
```

**Curve observations:**
- Very small alpha values produce lowest MAE
- MAE rises sharply as alpha increases
- Large alpha severely degrades performance
- Train and test MAE remain closely aligned → no overfitting

---

## iii. Fine-Tuned Search

```python
# Refined range around best alpha
log_best = np.log10(0.0001)
alphas_refined = np.logspace(log_best - 0.5, log_best + 0.5, 100)

grid_refined_lasso = GridSearchCV(Lasso(max_iter=10000),
                                   {'alpha': alphas_refined},
                                   cv=5, scoring='neg_mean_absolute_error')
grid_refined_lasso.fit(X_train_scaled, y_train)

best_alpha_lasso = grid_refined_lasso.best_params_['alpha']
print(f"Refined Best Alpha: {best_alpha_lasso:.6f}")
```

| Result | Value |
|--------|-------|
| **Refined Best Alpha** | ≈ 0.00084 |
| **Test MAE** | ≈ 0.0834 |

---

## Lasso Model — Final Evaluation

```python
lasso_final = Lasso(alpha=0.00084, max_iter=10000)
lasso_final.fit(X_train_scaled, y_train)
y_pred_lasso = lasso_final.predict(X_test_scaled)
```

| Metric | Score |
|--------|-------|
| **Test R²** | 0.9215 |
| **Test MAE** | 0.007804 |
| **Test RMSE** | 0.010477 |

---

## Feature Elimination by Lasso

```python
lasso_coefs = pd.Series(lasso_final.coef_, index=X_train.columns)
eliminated = lasso_coefs[lasso_coefs == 0].index.tolist()
print(f"Features eliminated: {eliminated}")
```

**5 features set to exactly zero (eliminated):**

| Eliminated Feature | Why Lasso Dropped It |
|--------------------|----------------------|
| `Displacement_cc` | Captured by `power_to_weight` and `engine_efficiency` |
| `total_features` | Redundant with individual `*_count` columns |
| `age_group_Old` | Marginal additional signal beyond `age` continuous variable |
| `owner_category_Medium` | Limited predictive distinction from baseline |
| `owner_category_High` | Limited predictive distinction from baseline |

> **Insight:** All eliminated features were either redundant with engineered counterparts or had marginal explanatory power. This confirms that **feature engineering was well-executed** — Lasso only removed truly weak signals.

---

## Key Analytical Insight

> Lasso's optimal alpha being near-zero (≈ 0.00084) signals that **most features in the dataset are genuinely informative**. Unlike Ridge, Lasso provides automatic feature selection — improving model interpretability without sacrificing predictive performance. The dataset does not benefit from heavy regularisation; it was already well-prepared.

---

[← Back to README](../README.md) | [← Prev: Ridge Regression](07_ridge_regression.md) | [Next: Model Comparison →](09_model_comparison.md)
