[← Back to README](../README.md)

---

# 04 — Exploratory Data Analysis

## Objective
Analyse token distributions, class imbalance, and top entity frequencies in both training and validation sets to inform feature engineering and class weighting decisions.

---

## 4.1 Data Flattening & Token Extraction

```python
def flatten_list(nested):
    return [item for sublist in nested for item in sublist]

flat_tokens = flatten_list(X_train)
flat_labels = flatten_list(y_train)

print(f"Total input tokens: {len(flat_tokens)}")   # 7,114
print(f"Total POS tags:     {len(flat_labels)}")   # 7,114 — lengths match ✓
print(f"First 10 tokens: {flat_tokens[:10]}")
print(f"First 10 labels: {flat_labels[:10]}")
```

| Metric | Result |
|--------|--------|
| Total input tokens (flat) | 7,114 |
| Total POS tags (flat) | 7,114 — lengths match ✓ |
| First 10 tokens | `'250', 'grams', 'Okra', 'Oil', '1', 'Onion', 'finely', 'chopped', 'Tomato', 'Grated'` |
| First 10 POS tags | `quantity, unit, ingredient, ingredient, quantity, ingredient, ingredient, ingredient, ingredient, ingredient` |

---

## 4.2 Class Distribution & Imbalance

```python
from collections import Counter
label_counts = Counter(flat_labels)
```

| Label | Token Count | % of Total | Initial Weight | Final Weight |
|-------|------------|------------|----------------|--------------|
| `ingredient` | 5,323 | **74.8%** | 1.3365 | **0.6682** (×0.5 penalty) |
| `quantity` | 980 | 13.8% | 7.2592 | 7.2592 |
| `unit` | 811 | 11.4% | 8.7719 | 8.7719 |
| **Total** | **7,114** | **100%** | — | — |

> **Insight:** Ingredients dominate at 74.8% — a severe class imbalance. Inverse-frequency weighting was applied, with an **additional 0.5× penalty on ingredient** to prevent the model from defaulting to the majority class for ambiguous tokens.

---

## 4.3 Top 10 Most Frequent Ingredients — Training

```python
ingredient_tokens = [t for t, l in zip(flat_tokens, flat_labels) if l == 'ingredient']
ingredient_freq = Counter(ingredient_tokens).most_common(10)
```

| # | Ingredient | Freq | # | Ingredient | Freq |
|---|-----------|------|---|-----------|------|
| 1 | powder | 129 | 6 | Oil | 83 |
| 2 | Salt | 102 | 7 | Red | 81 |
| 3 | seeds | 89 | 8 | Chilli | 77 |
| 4 | Green | 85 | 9 | Coriander | 71 |
| 5 | chopped | 84 | 10 | Sunflower | 65 |

> **Insight:** The dataset reflects a strong **South Asian / Indian cuisine bias**. Many top "ingredients" are actually modifiers or descriptors (`chopped`, `Red`, `Green`) rather than standalone ingredient names — creating positional ambiguity for the NER model.

---

## 4.4 Top 10 Most Frequent Units — Training

```python
unit_tokens = [t for t, l in zip(flat_tokens, flat_labels) if l == 'unit']
unit_freq = Counter(unit_tokens).most_common(10)
```

| # | Unit | Freq | # | Unit | Freq |
|---|------|------|---|------|------|
| 1 | teaspoon | 162 | 6 | inch | 52 |
| 2 | cup | 136 | 7 | cups | 50 |
| 3 | tablespoon | 99 | 8 | sprig | 41 |
| 4 | grams | 63 | 9 | cloves | 39 |
| 5 | tablespoons | 61 | 10 | teaspoons | 39 |

> **Insight:** Volume-based units (teaspoon, cup, tablespoon) vastly outnumber weight units — consistent with Indian cooking conventions. `teaspoon` and `teaspoons` are counted separately, indicating singular/plural fragmentation. Lemmatisation could resolve this in a future iteration.

---

## 4.5 Training vs Validation Comparison

| Metric | Training | Validation | Consistent? |
|--------|----------|------------|-------------|
| Total tokens | 7,114 | 2,876 | Yes — ≈70/30 split |
| Top ingredient | powder (129) | powder (54) | Yes — same rank |
| 2nd ingredient | Salt (102) | Salt (47) | Yes — same rank |
| 3rd ingredient | seeds (89) | Oil (39) | Slight variance |
| Top unit | teaspoon (162) | teaspoon (59) | Yes — same rank |
| 2nd unit | cup (136) | cup (~50) | Yes — same rank |

> **Insight:** The validation set closely mirrors the training distribution — top entities appear in the same rank order across both splits. This confirms `train_test_split` produced a **well-representative validation set with no distributional shift**, supporting reliable generalisation of the trained CRF model.

---

[← Back to README](../README.md) | [← Prev: Train-Val Split](03_train_validation_split.md) | [Next: Feature Extraction →](05_feature_extraction.md)
