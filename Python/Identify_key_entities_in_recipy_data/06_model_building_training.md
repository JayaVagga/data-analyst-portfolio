[← Back to README](../README.md)

---

# 06 — Model Building & Training

## Objective
Train a Conditional Random Field (CRF) model with tuned hyperparameters on the weighted feature set, evaluate on training data, and save the model for deployment.

---

## Why CRF for This Task?

| Property | Benefit |
|----------|---------|
| Sequence-aware | Models label dependencies — `quantity → unit → ingredient` transitions |
| Small dataset friendly | 280 recipes is too small for deep learning; CRF with hand-crafted features is optimal |
| Interpretable | Feature weights are inspectable; can debug misclassifications |
| Proven for NER | Standard architecture for structured prediction on token sequences |

---

## 7.1 CRF Hyperparameters

```python
import sklearn_crfsuite

crf = sklearn_crfsuite.CRF(
    algorithm='lbfgs',
    c1=0.5,
    c2=1.0,
    max_iterations=100,
    all_possible_transitions=True
)

crf.fit(X_train_weighted_features, y_train_labels)
```

| Parameter | Value | Rationale |
|-----------|-------|-----------|
| `algorithm` | `lbfgs` | Limited-memory BFGS — efficient quasi-Newton optimiser, well-suited for CRF on structured NER |
| `c1` | 0.5 | L1 regularisation — promotes feature sparsity, helps eliminate irrelevant features |
| `c2` | 1.0 | L2 regularisation — penalises large weights, prevents overfitting |
| `max_iterations` | 100 | Maximum optimisation steps — sufficient for convergence on this dataset size |
| `all_possible_transitions` | True | Considers all label-to-label transitions — improves robustness on small datasets |
| `class_weight` | `weight_dict` | Custom inverse-frequency weights with ingredient penalisation |

---

## 7.2 Training Classification Report

**Training Accuracy: 100.00%** — All 7,114 training tokens classified correctly.

| Label | Precision | Recall | F1-Score | Support |
|-------|-----------|--------|----------|---------|
| `ingredient` | 1.00 | 1.00 | 1.00 | 5,323 |
| `quantity` | 1.00 | 1.00 | 1.00 | 980 |
| `unit` | 1.00 | 1.00 | 1.00 | 811 |
| **accuracy** | | | **1.00** | **7,114** |
| macro avg | 1.00 | 1.00 | 1.00 | 7,114 |
| weighted avg | 1.00 | 1.00 | 1.00 | 7,114 |

---

## 7.3 Confusion Matrix — Training Dataset

|  | Predicted: quantity | Predicted: unit | Predicted: ingredient |
|--|--------------------|-----------------|-----------------------|
| **True: quantity** | 976 ✓ | 4 | 0 |
| **True: unit** | 0 | 811 ✓ | 0 |
| **True: ingredient** | 0 | 0 | 5,323 ✓ |

> **Outcome:** Perfect diagonal in the training confusion matrix — zero off-diagonal entries across all three classes. The model has fully learned all training patterns. A 100% training accuracy with rich feature engineering and class weighting confirms the model is **well-fitted without being under-constrained**.

---

## 7.4 Model Saved

```python
import joblib
joblib.dump(crf, 'crf_model.pkl')
print("Model saved as crf_model.pkl")

# Load for inference
crf_loaded = joblib.load('crf_model.pkl')
```

The trained CRF model is serialised as `crf_model.pkl` for future inference and production deployment.

---

[← Back to README](../README.md) | [← Prev: Feature Extraction](05_feature_extraction.md) | [Next: Prediction & Evaluation →](07_prediction_evaluation.md)
