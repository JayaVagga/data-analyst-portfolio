[← Back to README](../README.md)

---

# 03 — Train-Validation Split

## Objective
Split the cleaned 280-recipe dataset into training and validation sets with a reproducible 70/30 ratio, and verify label consistency across both splits.

---

## Split Strategy

```python
from sklearn.model_selection import train_test_split

X = df_clean['input_tokens'].tolist()
y = df_clean['pos_tokens'].tolist()

X_train, X_val, y_train, y_val = train_test_split(
    X, y,
    test_size=0.30,
    random_state=42       # fixed seed for reproducibility
)
```

---

## Split Results

| Split | Recipes | Total Tokens | Proportion |
|-------|---------|-------------|------------|
| **Training Set** | 196 | 7,114 | 70% |
| **Validation Set** | 84 | 2,876 | 30% |
| **Total** | 280 | 9,990 | 100% |

---

## Variable Contents

| Variable | Contents | Length |
|----------|----------|--------|
| `X_train` | 196 lists of input tokens — training recipes | 196 |
| `X_val` | 84 lists of input tokens — validation recipes | 84 |
| `y_train` | 196 lists of NER labels (ingredient / quantity / unit) | 196 |
| `y_val` | 84 lists of NER labels | 84 |

---

## Label Consistency Check

```python
unique_train = set(label for seq in y_train for label in seq)
unique_val   = set(label for seq in y_val   for label in seq)

print(f"Train labels: {unique_train}")
print(f"Val labels:   {unique_val}")
# Both: {'ingredient', 'quantity', 'unit'}
```

3 unique labels confirmed in both `y_train` and `y_val` — consistent with full dataset.
No label leakage or unseen classes in either split.

---

## Why 70/30?

- 196 training recipes provides sufficient annotated sequences for CRF to learn robust label-to-label transitions
- 84 validation recipes (2,876 tokens) gives a statistically meaningful held-out evaluation set
- `random_state=42` ensures full reproducibility across runs

---

[← Back to README](../README.md) | [← Prev: Data Ingestion](02_data_ingestion_preparation.md) | [Next: Exploratory Data Analysis →](04_exploratory_data_analysis.md)
