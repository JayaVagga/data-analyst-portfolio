[← Back to README](../README.md)

---

# 08 — Error Analysis

## Objective
Investigate all 5 misclassified tokens in detail to understand root causes, identify error patterns, and assess business risk by entity class.

---

## 9.1 Misclassified Token Detail

```python
y_val_flat   = flatten_list(y_val_labels)
y_pred_flat  = flatten_list(y_pred)
X_val_flat   = flatten_list(X_val)

error_data = [
    {'token': tok, 'true': true, 'predicted': pred,
     'prev': X_val_flat[i-1] if i > 0 else 'BOS',
     'next': X_val_flat[i+1] if i < len(X_val_flat)-1 else 'EOS'}
    for i, (tok, true, pred) in enumerate(zip(X_val_flat, y_val_flat, y_pred_flat))
    if true != pred
]
```

| # | Token | Prev Token | Next Token | True → Predicted | Context |
|---|-------|-----------|-----------|------------------|---------|
| 1 | `to` | `10` | `12` | unit → quantity | `10 --> [to] --> 12` |
| 2 | `into` | `cut` | `1` | unit → quantity | `cut --> [into] --> 1` |
| 3 | `a` | `Haldi` | `pinch` | unit → quantity | `Haldi --> [a] --> pinch` |
| 4 | `pinch` | `Dal` | `Asafoetida` | quantity → unit | `Dal --> [pinch] --> Asafoetida` |
| 5 | `cloves` | `Tomatoes` | `Garlic` | quantity → unit | `Tomatoes --> [cloves] --> Garlic` |

---

## 9.2 Error Pattern Analysis

| Error Pattern | Tokens | Root Cause |
|---------------|--------|------------|
| Preposition labelled as unit | `to`, `into` | Appear between numeric tokens, mimicking a unit's positional context |
| Article labelled as unit | `a` | Follows Indian ingredient name `Haldi` — unusual quantity-without-numeral pattern |
| Dual-role quantity/unit words | `pinch`, `cloves` | These words appear in **both** quantity and unit roles across different recipes — inherently ambiguous |

---

## 9.3 Business Risk Assessment by Class

| Business Function | Model Suitability | Accuracy | Risk |
|-------------------|-------------------|----------|------|
| Ingredient auto-tagging | ✅ Excellent | 100% F1 | 🟢 Zero — zero ingredient errors |
| Quantity extraction | ✅ Very good | 99.51% | 🟢 Low — 2 errors in 411 tokens |
| Unit detection | ✅ Very good | 99.16% | 🟢 Low — 3 errors in 358 tokens |
| Recipe search & filtering | ✅ Production-ready | — | 🟢 Near-zero error rate on searchable fields |
| Portion scaling | ✅ Production-ready | — | 🟢 Quantity+unit accuracy sufficient for scaling |
| Manual tagging replacement | ✅ ~99.83% automation | — | 🟢 Only 0.17% of tokens need human review |

---

## 9.4 Key Insight

> The model achieved **100% accuracy on ingredient tokens** — the most business-critical class for recipe search and dietary filtering. All errors are confined to 5 semantically ambiguous tokens on the quantity-unit boundary — a boundary that is genuinely difficult even for human annotators given the dual role of words like `pinch` and `cloves`.

---

## 9.5 Suggested Fixes for Future Iterations

| Error Type | Recommended Fix |
|------------|-----------------|
| `to` / `into` between numbers | Post-processing rule: if token is a preposition between two numeric tokens, label as `ingredient` |
| `a` as unit | Expand quantity_keywords to include standalone articles before units |
| `pinch` / `cloves` ambiguity | Add a disambiguation rule: if followed by a named ingredient, label as `quantity` |

---

[← Back to README](../README.md) | [← Prev: Prediction & Evaluation](07_prediction_evaluation.md) | [Next: Conclusions →](09_conclusions.md)
