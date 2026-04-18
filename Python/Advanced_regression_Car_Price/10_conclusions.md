[← Back to README](README.md)

---

# 10 — Conclusions & Key Takeaways

## Objective
Synthesise all findings into actionable insights — both technical and business-oriented — and draw final conclusions on model selection, regularisation strategy, and pricing dynamics.

---

## Project Summary

This project built, tuned, and compared three regression models to predict used car prices from AutoScout24 data. The full pipeline covered:

- Structural EDA on 15,915 records × 23 features
- Log transformation of target, ratio feature engineering, dimensionality control
- Baseline Linear Regression → Ridge → Lasso with cross-validated hyperparameter tuning
- Residual diagnostics, VIF analysis, and coefficient comparison

---

## Final Model Performance

| Model | Test R² | Test MAE | Test RMSE | Features Used |
|-------|---------|----------|-----------|---------------|
| Linear Regression | 0.9217 | 0.007806 | 0.010465 | All |
| Ridge Regression | 0.9217 | 0.007806 | 0.010463 | All (shrunk) |
| Lasso Regression | 0.9215 | 0.007804 | 0.010477 | All − 5 |

All models explain **~92% of used car price variance** on unseen data.

---

## Key Question Answers

### 1. Did regularisation improve performance?
**No** — and that's a positive finding. All three models achieved near-identical metrics. This confirms:
- The baseline model was already optimal
- Multicollinearity was present but not harmful
- The dataset does not require aggressive penalisation

### 2. Was there overfitting?
**No.** Test R² (0.9212) slightly exceeds Train R² (0.9148). With ~16,000 observations and well-engineered features, the model generalises strongly.

### 3. What did Ridge reveal?
Ridge slightly shrunk coefficients of correlated engine features (`hp_kW`, `Displacement_cc`, `Weight_kg`) — confirming moderate multicollinearity exists but is structurally expected, not harmful. Ridge acted as a **diagnostic tool**, not a performance enhancer.

### 4. What did Lasso reveal?
Lasso eliminated 5 features — all of which were either redundant with engineered counterparts or categorically marginal. This confirms that **feature engineering was effective**: only truly weak signals were removed.

### 5. What truly drives used car prices?

| Driver | Direction | Strength |
|--------|-----------|----------|
| Vehicle age | Negative | ⭐⭐⭐⭐⭐ Strongest |
| Engine power (`hp_kW`, `power_to_weight`) | Positive | ⭐⭐⭐⭐ |
| Brand / Make-Model | Positive | ⭐⭐⭐⭐ |
| Usage intensity (`km_per_year`) | Negative | ⭐⭐⭐ |
| Equipment richness (`Comfort_count`) | Positive | ⭐⭐⭐ |
| Vehicle weight | Positive | ⭐⭐ |
| Transmission type | Positive (Auto) | ⭐⭐ |

---

## Strategic Business Insights

### For Used Car Resellers
1. **Age is the #1 depreciation signal** — stock younger vehicles for higher margin potential
2. **Performance matters more than size** — `power_to_weight` outperforms raw `Displacement_cc` as a value signal
3. **Equipment level adds measurable value** — vehicles with more comfort/safety features command higher prices
4. **Brand positioning is structural** — premium brands resist depreciation better regardless of age

### For Pricing Strategy
1. **Younger + fewer owners + higher power = strongest price support**
2. **Mileage intensity (km/year) matters more than total km** — a 3-year-old with 90k km is priced lower than a 10-year-old with 90k km
3. **4WD and Automatic transmissions carry a measurable premium** over equivalent FWD/Manual vehicles

---

## Modelling Principles Validated

| Principle | Evidence |
|-----------|----------|
| Feature engineering > algorithm complexity | Baseline R² of 0.92 from preprocessing alone |
| Log transformation is essential for skewed targets | Skewness reduced from 1.23 to ~0.03 |
| Regularisation is not always necessary | No meaningful improvement over OLS |
| Large, clean datasets support linear modelling | Residuals well-behaved; assumptions satisfied |
| Ratio features outperform raw variables | `power_to_weight` > `hp_kW` alone |

---

## When to Choose Each Model (Decision Guide)

```
Is multicollinearity severe? (VIF > 10)
    → YES: Use Ridge
    → NO: Continue...

Is interpretability / feature reduction needed?
    → YES: Use Lasso
    → NO: Continue...

Is the baseline model already performing well?
    → YES: Use Linear Regression (simplest, most transparent)
```

**For this dataset:** Linear Regression is the recommended production model. Ridge for coefficient stability analysis. Lasso for a leaner, more interpretable deployment.

---

## Final Statement

> This project demonstrates that **rigorous data preparation and feature engineering are the primary drivers of model quality** — not algorithmic sophistication. A well-understood, interpretable linear model built on thoughtfully engineered features outperforms a poorly-prepared model regardless of complexity. The regularisation analysis served as validation of this principle.

---

[← Back to README](../README.md) | [← Prev: Model Comparison](09_model_comparison.md)
