[← Back to README](README.md)

---

# 07 — Prediction & Model Evaluation

## Objective
Evaluate the trained CRF model on the held-out validation set (2,876 tokens across 84 recipes) using classification report, confusion matrix, and per-label accuracy metrics.

---

## Validation Performance — Headline Numbers

| Metric | Value |
|--------|-------|
| **Overall Validation Accuracy** | **99.83%** |
| Misclassified Tokens | **5 / 2,876** |
| Train-Val Accuracy Gap | **0.17%** — no overfitting |

---

## 8.1 Validation Classification Report

```python
y_pred = crf.predict(X_val_features)

from sklearn_crfsuite import metrics
print(metrics.flat_classification_report(y_val_labels, y_pred))
```

| Label | Precision | Recall | F1-Score | Support |
|-------|-----------|--------|----------|---------|
| `ingredient` | **1.00** | **1.00** | **1.00** | 2,107 |
| `quantity` | 0.99 | 1.00 | 0.99 | 411 |
| `unit` | 0.99 | 0.99 | 0.99 | 358 |
| **accuracy** | | | **1.00** | **2,876** |
| macro avg | 1.00 | 1.00 | 1.00 | 2,876 |
| weighted avg | 1.00 | 1.00 | 1.00 | 2,876 |

---

## 8.2 Confusion Matrix — Validation Dataset

|  | Predicted: quantity | Predicted: unit | Predicted: ingredient |
|--|--------------------|-----------------|-----------------------|
| **True: quantity** | 409 ✓ | 2 ✗ | 0 |
| **True: unit** | 3 ✗ | 355 ✓ | 0 |
| **True: ingredient** | 0 | 0 | 2,107 ✓ |

---

## 8.3 Per-Label Accuracy

| Label | Total Tokens | Misclassified | Per-Label Accuracy |
|-------|-------------|---------------|-------------------|
| `ingredient` | 2,107 | **0** | **100.00%** |
| `quantity` | 411 | 2 | 99.51% |
| `unit` | 358 | 3 | 99.16% |
| **Overall** | **2,876** | **5** | **99.83%** |

---

## Key Evaluation Insight

> All 5 misclassifications fall on the **quantity-unit boundary**. Zero ingredient tokens were ever misclassified. The 0.17% gap between training (100%) and validation (99.83%) confirms **no overfitting occurred** — the model generalises extremely well to unseen recipes.

---

[← Back to README](../README.md) | [← Prev: Model Building](06_model_building_training.md) | [Next: Error Analysis →](08_error_analysis.md)
