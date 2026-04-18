# 🚗 Used Car Price Prediction — Regularised Regression Analysis

![Python](https://img.shields.io/badge/Python-3.8+-blue?logo=python&logoColor=white)
![scikit-learn](https://img.shields.io/badge/scikit--learn-Regression-orange?logo=scikit-learn&logoColor=white)
![Status](https://img.shields.io/badge/Status-Completed-brightgreen)
![R²](https://img.shields.io/badge/Test%20R²-0.9217-success)

> Predicting used car resale prices from 15,915 AutoScout24 listings using Linear, Ridge, and Lasso Regression — with end-to-end EDA, feature engineering, and regularisation analysis.

---

##  What This Project Demonstrates

| Skill Area | What I Did |
|------------|-----------|
| **Data Analysis** | EDA on 15,915 records across 23 features; distribution analysis, correlation mapping, outlier investigation |
| **Feature Engineering** | Derived 7 new features including `km_per_year`, `power_to_weight`, `engine_efficiency`; converted bundled string columns into count features |
| **Statistical Modelling** | Built OLS Linear Regression, Ridge (L2), and Lasso (L1) with cross-validated hyperparameter tuning |
| **Model Evaluation** | R², MAE, RMSE comparison; residual diagnostics; VIF multicollinearity analysis |
| **Regularisation** | Systematic alpha tuning via GridSearchCV; coefficient comparison and feature elimination analysis |
| **Business Thinking** | Translated model outputs into actionable pricing strategy insights |

---

##  Results at a Glance

| Model | Test R² | Test MAE | Test RMSE | Features Used |
|-------|---------|----------|-----------|---------------|
| Linear Regression | 0.9217 | 0.007806 | 0.010465 | All |
| Ridge Regression | 0.9217 | 0.007806 | 0.010463 | All (shrunk) |
| **Lasso Regression** | **0.9215** | **0.007804** | **0.010477** | **All − 5** |

**All three models explain ~92% of used car price variance on unseen data with no overfitting.**

---

## Repository Structure

```
RR_Car_Price_Prediction/
│
├── README.md                             ← You are here
├── RR_Car_Price_Prediction.ipynb         ← Full solution notebook
├── RR_Car_Price_Prediction_Report.pdf    ← Detailed analysis report
│
├──                              ← Section-by-section breakdown
│   ├── 01_data_understanding.md
│   ├── 02_preliminary_analysis.md
│   ├── 03_correlation_analysis.md
│   ├── 04_outlier_handling.md
│   ├── 05_feature_engineering.md
│   ├── 06_baseline_linear_regression.md
│   ├── 07_ridge_regression.md
│   ├── 08_lasso_regression.md
│   ├── 09_model_comparison.md
│   └── 10_conclusions.md
│
└── data/
    └── Car_Price_data.csv
```

---

## Analysis — Section by Section

*Click any section to read the full analysis, code, and insights.*

| # | Section | What's Inside |
|---|---------|---------------|
| 01 | [Data Understanding](01_data_understanding.md) | Dataset structure, feature inventory, business context |
| 02 | [Preliminary Analysis & Distributions](02_preliminary_analysis.md) | Missing value checks, numerical & categorical distributions, class imbalance fixes |
| 03 | [Correlation Analysis](03_correlation_analysis.md) | Pearson correlation heatmap, categorical mean-price analysis, multicollinearity signals |
| 04 | [Outlier Handling](04_outlier_handling.md) | IQR-based detection, strategy rationale, why outliers were preserved |
| 05 | [Feature Engineering](05_feature_engineering.md) | 7 derived features, encoding strategy, train-test split, scaling pipeline |
| 06 | [Baseline Linear Regression](06_baseline_linear_regression.md) | OLS model, R²=0.92 result, residual diagnostics, assumption validation |
| 07 | [Ridge Regression](07_ridge_regression.md) | L2 regularisation, alpha tuning via GridSearchCV, R² vs alpha curve |
| 08 | [Lasso Regression](08_lasso_regression.md) | L1 regularisation, feature elimination, 5 coefficients zeroed out |
| 09 | [Model Comparison](09_model_comparison.md) | Side-by-side metrics, coefficient comparison, when to use which model |
| 10 | [Conclusions & Key Takeaways](10_conclusions.md) | Business insights, pricing drivers, modelling principles validated |

---

## Key Findings

### What Drives Used Car Prices?

```
Strongest Price Drivers (all models agree):

🔻 Age              → #1 depreciation driver — older car = significantly lower price
🔺 power_to_weight  → Performance efficiency matters more than raw engine size
🔺 Brand / Model    → Premium brands resist depreciation; brand identity is structural
🔻 km_per_year      → Usage intensity (not just total km) reflects true wear
🔺 Comfort_count    → Equipment richness adds measurable resale value
🔺 4WD / Automatic  → Drive configuration and transmission type command premiums
```

### What Did Regularisation Reveal?

- **Ridge** → All features retained; correlated engine variables (`hp_kW`, `Displacement_cc`) slightly stabilised. Multicollinearity is moderate, not harmful.
- **Lasso** → 5 weak/redundant features eliminated (`Displacement_cc`, `total_features`, `age_group_Old`, `owner_category_Medium`, `owner_category_High`). Confirms feature engineering was well-executed.
- **Key insight:** Feature engineering contributed more to the R²=0.92 result than algorithm choice. The baseline OLS model was already optimal.

---

## 🛠️ Tech Stack

```python
# Core
import pandas as pd
import numpy as np

# Visualisation
import matplotlib.pyplot as plt
import seaborn as sns

# Modelling
from sklearn.linear_model import LinearRegression, Ridge, Lasso
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import r2_score, mean_absolute_error, mean_squared_error

# Diagnostics
from statsmodels.stats.outliers_influence import variance_inflation_factor
```

---

## Run Locally

```bash
# Clone the repo
git clone https://github.com/<your-username>/RR_Car_Price_Prediction.git
cd RR_Car_Price_Prediction

# Install dependencies
pip install pandas numpy matplotlib seaborn scikit-learn statsmodels jupyter

# Launch notebook
jupyter notebook RR_Car_Price_Prediction.ipynb
```

---

## Author

**Vagga Jayalakshmi**  
[GitHub](https://github.com/<your-username>) · [LinkedIn](https://linkedin.com/in/<your-profile>)

---

*Dataset: AutoScout24 German used car listings — sourced from Kaggle (public domain).*
