[← Back to README](README.md)

---

# 02 — Data Ingestion & Preparation

## Objective
Load the JSON dataset into a structured DataFrame, tokenise input and label sequences, validate annotation alignment, and remove corrupted records before modelling.

---

## 2.1 load_json_to_dataframe — Data Loading

```python
def load_json_to_dataframe(file_path):
    with open(file_path, 'r') as f:
        data = json.load(f)
    df = pd.DataFrame(data)
    return df

df = load_json_to_dataframe('ingredient_and_quantity.json')
```

### DataFrame Summary

| Property | Value |
|----------|-------|
| Shape | (285, 2) |
| Columns | `input` (object), `pos` (object) |
| Total entries | 285 non-null in both columns — no missing values |
| Memory usage | 4.6+ KB |
| Index | RangeIndex: 285 entries, 0 to 284 |

---

## 2.2 Recipe Data Manipulation

### 2.2.1 Tokenisation — input_tokens & pos_tokens

```python
df['input_tokens'] = df['input'].str.split()
df['pos_tokens']   = df['pos'].str.split()
df['input_length'] = df['input_tokens'].apply(len)
df['pos_length']   = df['pos_tokens'].apply(len)
```

`input` and `pos` columns were split by whitespace to create list columns. Length columns `input_length` and `pos_length` were added to enable row-level validation.

---

### 2.2.2 Unique Labels Validation

```python
def unique_labels(df):
    all_labels = [label for pos in df['pos_tokens'] for label in pos]
    return set(all_labels)

unique_labels(df)
# Output: {'ingredient', 'quantity', 'unit'}
```

Exactly 3 valid NER classes — no unexpected values found.

---

### 2.2.3 Mismatch Detection & Cleaning

Rows where `input_length != pos_length` contain annotation errors and must be removed before training.

```python
mismatched = df[df['input_length'] != df['pos_length']]
print(f"Mismatched rows: {len(mismatched)}")
# Indexes with errors: 17, 27, 79, 164, 207

df_clean = df[df['input_length'] == df['pos_length']].reset_index(drop=True)
```

### Cleaning Results

| Finding | Before Cleaning | After Cleaning |
|---------|-----------------|----------------|
| Total records | 285 | **280** |
| Mismatched rows | 5 (indexes: 17, 27, 79, 164, 207) | **0** |
| Data validity | Annotation errors present | **100% clean** |

### Token Length Statistics After Cleaning

| Column | Count | Mean | Std | Min | Max |
|--------|-------|------|-----|-----|-----|
| `input_length` | 280 | 35.68 | 13.88 | 7 | 93 |
| `pos_length` | 280 | 35.68 | 13.88 | 7 | 93 |

> **Insight:** The 5 dropped rows had unequal input and POS token counts — caused by missing or duplicated annotation labels during dataset creation. After removal, both token columns have **identical lengths for all 280 records**, confirming complete data integrity before model training.

---

[← Back to README](../README.md) | [← Prev: Data Description](01_data_description.md) | [Next: Train-Validation Split →](03_train_validation_split.md)
