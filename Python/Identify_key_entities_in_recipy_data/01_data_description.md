[← Back to README](README.md)

---

# 01 — Data Description

## Objective
Understand the structure, format, and content of the annotated recipe dataset before any preprocessing or modelling begins.

---

## Dataset at a Glance

| Attribute | Detail |
|-----------|--------|
| File | `ingredient_and_quantity.json` |
| Domain | Culinary recipe NER — ingredient extraction |
| Total Records | 285 annotated recipes |
| Valid Records (after cleaning) | 280 |
| Missing Values | 0 |
| Entity Classes | 3 — `ingredient`, `quantity`, `unit` |

---

## JSON Structure — Each Record

Each record in the JSON file contains exactly two fields:

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `input` | string | Raw ingredient list as space-separated tokens | `'6 Karela Bitter Gourd Salt 1 Onion 3 tablespoon Gram flour besan'` |
| `pos` | string | Space-separated NER labels — one per token in `input` | `'quantity ingredient ingredient ingredient ingredient quantity ingredient unit ingredient ingredient ingredient'` |

---

## Entity Classes

| Label | Meaning | Example Tokens |
|-------|---------|---------------|
| `ingredient` | Food item name or descriptor | `Salt`, `Onion`, `powder`, `chopped` |
| `quantity` | Numeric or textual amount | `6`, `1`, `half`, `3` |
| `unit` | Measurement unit | `tablespoon`, `cup`, `grams`, `teaspoon` |

---

## Libraries Used

| Library / Version | Purpose |
|-------------------|---------|
| `sklearn-crfsuite 0.5.0` | CRF model — training, prediction, evaluation |
| `spaCy + en_core_web_sm` | Linguistic features: POS tags, lemmas, dependency parsing, shapes |
| `pandas` | DataFrame operations, data manipulation, validation |
| `scikit-learn` | `train_test_split`, `confusion_matrix`, `flat_classification_report` |
| `matplotlib + seaborn` | Bar chart visualisations, confusion matrix heatmaps |
| `joblib` | Model serialisation — save/load `crf_model.pkl` |
| `re + fractions` | Regex quantity patterns, fractional value handling |

---

## Business Context

Online cooking platforms and meal planning apps handle millions of unstructured recipe strings. Manually tagging each ingredient, quantity, and unit is labour-intensive and unscalable.

A custom NER model trained on annotated recipe data enables:
- **Automatic ingredient tagging** → powers recipe search and dietary filtering
- **Quantity & unit extraction** → enables portion scaling and grocery list generation
- **Structured recipe data** → feeds downstream meal planning APIs and cooking assistants

---

[← Back to README](../README.md) | [Next: Data Ingestion & Preparation →](02_data_ingestion_preparation.md)
