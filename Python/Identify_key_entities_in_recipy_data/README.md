# 🍽️ Identifying Key Entities in Recipe Data — NER using CRF

![Python](https://img.shields.io/badge/Python-3.8+-blue?logo=python&logoColor=white)
![CRF](https://img.shields.io/badge/Model-CRF%20(sklearn--crfsuite)-orange)
![spaCy](https://img.shields.io/badge/NLP-spaCy-09A3D5?logo=spacy&logoColor=white)
![Status](https://img.shields.io/badge/Status-Completed-brightgreen)
![Accuracy](https://img.shields.io/badge/Validation%20Accuracy-99.83%25-success)

> Named Entity Recognition model to automatically extract **ingredients**, **quantities**, and **units** from unstructured culinary recipe text — using a Conditional Random Field (CRF) with rich spaCy-based feature engineering.

---

## What This Project Demonstrates

| Skill Area | What I Did |
|------------|-----------|
| **NLP & NER** | Built a sequence labelling pipeline to extract 3 entity types from recipe strings |
| **Feature Engineering** | 20+ features per token — spaCy POS/lemma/dep, regex patterns, keyword sets, contextual window ±1 |
| **Class Imbalance Handling** | Inverse-frequency weighting + 0.5× ingredient penalty on 74.8% majority class |
| **CRF Modelling** | Tuned `lbfgs` CRF with L1/L2 regularisation and all_possible_transitions |
| **Model Evaluation** | Classification report, confusion matrix, per-label accuracy, error analysis |
| **Data Quality** | Automated mismatch detection — removed 5 annotation errors before training |
| **Business Thinking** | Mapped accuracy metrics to real food-tech automation use cases |

---

## Results at a Glance

| Metric | Training | Validation |
|--------|----------|------------|
| **Overall Accuracy** | **100.00%** | **99.83%** |
| Ingredient F1 | 1.00 | **1.00** |
| Quantity F1 | 1.00 | 0.99 |
| Unit F1 | 1.00 | 0.99 |
| Misclassified Tokens | 0 / 7,114 | **5 / 2,876** |
| Train-Val Gap | — | **0.17%** — no overfitting |

**Model:** CRF — `lbfgs`, `c1=0.5`, `c2=1.0`, `max_iterations=100`, `all_possible_transitions=True`
**Dataset:** `ingredient_and_quantity.json` | 285 total → 280 valid records | 70% train / 30% validation

---

## Repository Structure

```
NER_Recipe_CRF/
│
├── README.md                                  ← You are here
├── Identifying_Key_Entities_in_Recipe_Data.ipynb  ← Full solution notebook
├── Identifying_Key_Entities_in_Recipe_Data.pdf    ← Detailed analysis report
├── crf_model.pkl                              ← Saved trained CRF model
│
├──                                   ← Section-by-section breakdown
│   ├── 01_data_description.md
│   ├── 02_data_ingestion_preparation.md
│   ├── 03_train_validation_split.md
│   ├── 04_exploratory_data_analysis.md
│   ├── 05_feature_extraction.md
│   ├── 06_model_building_training.md
│   ├── 07_prediction_evaluation.md
│   ├── 08_error_analysis.md
│   └── 09_conclusions.md
│
└── data/
    └── ingredient_and_quantity.json
```

---

## Analysis — Section by Section

*Click any section to read the full analysis, code, and insights.*

| # | Section | What's Inside |
|---|---------|---------------|
| 01 | [Data Description](01_data_description.md) | Dataset structure, JSON schema, entity classes, libraries, business context |
| 02 | [Data Ingestion & Preparation](02_data_ingestion_preparation.md) | JSON loading, tokenisation, label validation, mismatch detection, 5-row removal |
| 03 | [Train-Validation Split](03_train_validation_split.md) | 70/30 split, token counts, label consistency check across splits |
| 04 | [Exploratory Data Analysis](04_exploratory_data_analysis.md) | Class distribution (74.8% imbalance), top ingredients/units, train-val comparison |
| 05 | [Feature Extraction for CRF](05_feature_extraction.md) | 20+ features: spaCy linguistic, keyword sets, regex patterns, contextual window ±1 |
| 06 | [Model Building & Training](06_model_building_training.md) | CRF hyperparameters, 100% training accuracy, confusion matrix, model saved |
| 07 | [Prediction & Evaluation](07_prediction_evaluation.md) | 99.83% validation accuracy, classification report, confusion matrix, per-label metrics |
| 08 | [Error Analysis](08_error_analysis.md) | All 5 misclassifications investigated — root cause, pattern, business risk |
| 09 | [Conclusions & Key Takeaways](09_conclusions.md) | Final verdict, business value, limitations, recommendations |

---

## Key Findings

### What Drove 99.83% Accuracy?

```
Performance drivers (in order of impact):

Rich feature engineering  → spaCy lemma/POS/dep + custom keyword sets + regex
Class weighting           → 0.5× ingredient penalty balanced 74.8% majority class
CRF architecture          → sequence-aware; models quantity→unit→ingredient transitions
Data cleaning             → 5 annotation errors removed before training
Contextual window ±1      → prev/next token features resolve positional ambiguity
```

### Where Did It Fail? (All 5 errors)

| Token | True Label | Predicted | Why |
|-------|-----------|-----------|-----|
| `to` | unit | quantity | Preposition between two numbers mimics unit position |
| `into` | unit | quantity | Same positional pattern as `to` |
| `a` | unit | quantity | Article before `pinch` — unusual quantity-without-numeral |
| `pinch` | quantity | unit | Dual-role word — appears as both quantity and unit |
| `cloves` | quantity | unit | Dual-role word — ambiguous without numeric context |

> **Zero ingredient tokens were ever misclassified** — the most business-critical class.

---

## Tech Stack

```python
# NLP
import spacy
nlp = spacy.load('en_core_web_sm')

# CRF Model
import sklearn_crfsuite
crf = sklearn_crfsuite.CRF(algorithm='lbfgs', c1=0.5, c2=1.0,
                            max_iterations=100, all_possible_transitions=True)

# Evaluation
from sklearn_crfsuite import metrics
from sklearn.metrics import confusion_matrix

# Persistence
import joblib
joblib.dump(crf, 'crf_model.pkl')
```

| Library | Version | Purpose |
|---------|---------|---------|
| `sklearn-crfsuite` | 0.5.0 | CRF model |
| `spaCy` | — | Linguistic features |
| `en_core_web_sm` | — | POS, lemma, dependency |
| `pandas` | — | Data manipulation |
| `scikit-learn` | — | Split, evaluation |
| `joblib` | — | Model serialisation |

---

## Run Locally

```bash
# Clone the repository
git clone https://github.com/<your-username>/NER_Recipe_CRF.git
cd NER_Recipe_CRF

# Install dependencies
pip install sklearn-crfsuite spacy pandas scikit-learn matplotlib seaborn joblib
python -m spacy download en_core_web_sm

# Launch notebook
jupyter notebook Identifying_Key_Entities_in_Recipe_Data.ipynb
```

---

## Author

**Vagga Jayalakshmi**  
[LinkedIn](https://linkedin.com/in/vagga-jai-1206inn)

---

*Dataset: ingredient_and_quantity.json — annotated culinary recipe NER dataset.*
