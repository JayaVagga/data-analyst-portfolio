[← Back to README](README.md)

---

# 09 — Regularisation Comparison & Analysis

## Objective
Compare Linear Regression, Ridge, and Lasso across evaluation metrics and coefficient behaviour to understand the practical impact of regularisation on this dataset.

---

## i. Evaluation Metrics — All Three Models

```python
models = {
    'Linear Regression': lr_final,
    'Ridge Regression':  ridge_final,
    'Lasso Regression':  lasso_final
}

results = []
for name, model in models.items():
    y_pred = model.predict(X_test_scaled)
    results.append({
        'Model': name,
        'Test R²':   round(r2_score(y_test, y_pred), 6),
        'Test MAE':  round(mean_absolute_error(y_test, y_pred), 6),
        'Test RMSE': round(np.sqrt(mean_squared_error(y_test, y_pred)), 6)
    })

pd.DataFrame(results)
```

### Results Table

| Model | Test R² | Test MAE | Test RMSE |
|-------|---------|----------|-----------|
| **Linear Regression** | 0.921685 | 0.007806 | 0.010465 |
| **Ridge Regression** | 0.921709 | 0.007806 | 0.010463 |
| **Lasso Regression** | 0.921513 | 0.007804 | 0.010477 |

### What the Numbers Tell Us

**R² Comparison:**
All three models explain ≈ 92.17% of variance in vehicle prices. The difference between best and worst is < 0.0002 — statistically negligible.

**MAE Comparison:**
Differences at the 6th decimal place. No model meaningfully outperforms another in prediction accuracy.

**RMSE Comparison:**
All models produce RMSE ≈ 0.01046. Consistent, stable predictions with no extreme spikes.

> **Conclusion:** The baseline linear model was already highly optimal. Regularisation did not improve predictive power — it improved **stability and interpretability**.

---

## ii. Coefficient Comparison

```python
coef_df = pd.DataFrame({
    'Linear':  lr_final.coef_,
    'Ridge':   ridge_final.coef_,
    'Lasso':   lasso_final.coef_
}, index=X_train.columns)

# Plot top 10 by absolute magnitude
top10 = coef_df['Linear'].abs().nlargest(10).index
coef_df.loc[top10].plot(kind='barh', figsize=(12, 7))
plt.title('Top 10 Coefficients: Linear vs Ridge vs Lasso')
plt.axvline(0, color='black', linewidth=0.8)
plt.tight_layout()
plt.show()
```

### Coefficient Behaviour Summary

| Model | Behaviour | Key Effect |
|-------|-----------|------------|
| **Linear Regression** | Full OLS magnitude retained | Sensitive to correlated predictors |
| **Ridge Regression** | All coefficients slightly shrunk | Stabilises multicollinear features; no elimination |
| **Lasso Regression** | 5 coefficients set to exactly zero | Built-in feature selection; sparser model |

### Most Influential Predictors (Stable Across All Models)

| Rank | Feature | Direction | Insight |
|------|---------|-----------|---------|
| 1 | `age` | 🔻 Strong negative | Depreciation — the dominant price driver |
| 2 | `make_model_*` | 🔺 Positive | Brand identity commands premium |
| 3 | `power_to_weight` | 🔺 Positive | Performance efficiency — engineered feature |
| 4 | `km_per_year` | 🔻 Negative | Usage intensity reduces resale value |
| 5 | `Comfort_count` | 🔺 Positive | Equipment richness adds value |
| 6 | `Weight_kg` | 🔺 Positive | Proxy for vehicle size/segment |
| 7 | `Gearing_Type_Manual` | 🔻 Negative | Automatic transmissions command premium |

> These structural drivers remained **robust and consistent** across all three regularisation approaches — confirming model reliability.

---

## Visual Summary

```
Model Performance (Test R²):
─────────────────────────────────────────
Linear Regression  ████████████████ 0.9217
Ridge Regression   ████████████████ 0.9217
Lasso Regression   ████████████████ 0.9215
─────────────────────────────────────────
Difference: < 0.0002 (negligible)

Features Used:
─────────────────────────────────
Linear Regression  → All features (n)
Ridge Regression   → All features (n), shrunk
Lasso Regression   → n - 5 features (5 eliminated)
─────────────────────────────────
```

---

## When to Choose Which Model

| Objective | Recommended Model |
|-----------|-------------------|
| Maximum raw accuracy | Any — all equivalent here |
| Coefficient stability under multicollinearity | **Ridge** |
| Interpretability & feature selection | **Lasso** |
| Simplest, most transparent model | **Linear Regression** |

---

## Overall Section Takeaway

> The dataset is well-conditioned. Regularisation confirmed structural stability rather than correcting instability. Feature engineering contributed far more to performance than algorithm selection — the most important lesson from this project.

---

[← Back to README](../README.md) | [← Prev: Lasso Regression](08_lasso_regression.md) | [Next: Conclusions →](10_conclusions.md)
