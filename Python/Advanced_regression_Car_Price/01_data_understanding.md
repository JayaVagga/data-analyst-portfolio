[← Back to README](README.md)

---

# 01 — Data Understanding

## Objective
Understand the structure, shape, and content of the AutoScout24 used car dataset before any analysis or modelling begins.

---

## Dataset at a Glance

| Attribute | Detail |
|-----------|--------|
| Source | AutoScout24 — German online car marketplace (via Kaggle) |
| Records | 15,915 rows |
| Features | 23 columns |
| Missing Values | **0** — dataset is fully complete |
| Target Variable | `price` (EUR) |

---

## Feature Overview

### Numerical Features (10)
| Feature | Description |
|---------|-------------|
| `price` | Listing price in EUR (target variable) |
| `km` | Total kilometres driven |
| `age` | Age of the vehicle in years |
| `hp_kW` | Engine power in kilowatts |
| `Gears` | Number of gears |
| `Previous_Owners` | Number of previous owners |
| `Inspection_new` | Whether inspection is new (binary: 0/1) |
| `Displacement_cc` | Engine displacement in cubic centimetres |
| `Weight_kg` | Vehicle weight in kilograms |
| `cons_comb` | Combined fuel consumption (L/100km) |

### Categorical Features (13)
| Feature | Description |
|---------|-------------|
| `make_model` | Brand and model name (high cardinality) |
| `body_type` | Vehicle body style (SUV, Sedan, etc.) |
| `vat` | VAT deductibility status |
| `Type` | Listing type (Used, New, etc.) |
| `Fuel` | Fuel type (Diesel, Benzin, etc.) |
| `Comfort_Convenience` | Bundled comfort features (string) |
| `Entertainment_Media` | Bundled media features (string) |
| `Extras` | Bundled extra features (string) |
| `Safety_Security` | Bundled safety features (string) |
| `Paint_Type` | Paint finish type |
| `Upholstery_type` | Interior upholstery material |
| `Gearing_Type` | Transmission type (Manual/Automatic) |
| `Drive_chain` | Drive configuration (FWD, AWD, RWD) |

---

## Key Observations

- **No missing values** — dataset is structurally complete, eliminating the need for imputation
- **Specification columns** (`Comfort_Convenience`, `Entertainment_Media`, `Extras`, `Safety_Security`) contain bundled comma-separated strings — require special preprocessing
- **Mixed data types** — numerical, binary, categorical, and text features all present
- **High cardinality** in `make_model` — requires grouping of rare categories
- Dataset is **sufficiently large** (15,915 records) for stable regularised regression modelling

---

## Business Context

Used car pricing is influenced by a wide array of factors — from mechanical specifications to market perception. This dataset captures both **hard attributes** (engine size, mileage) and **soft attributes** (equipment level, brand) that together drive resale value.

Understanding this structure informs every downstream decision: which features to engineer, which to encode, and which regularisation strategy to apply.

---

[← Back to README](../README.md) | [Next: Preliminary Analysis →](02_preliminary_analysis.md)
