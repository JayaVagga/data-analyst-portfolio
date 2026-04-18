[← Back to README](README.md)

---

# 05 — Feature Extraction for CRF Model

## Objective
Engineer a rich, discriminative feature set per token using spaCy linguistic properties, custom keyword sets, regex patterns, and contextual window features — giving the CRF model the signals needed to distinguish ingredients, quantities, and units.

---

## 5.1 Keyword Sets & Quantity Pattern

```python
unit_keywords = {
    'cup', 'cups', 'tablespoon', 'tbsp', 'teaspoon', 'tsp',
    'grams', 'kg', 'ml', 'liter', 'oz', 'lb', 'pinch', 'bunch',
    'clove', 'sprig', 'dash', 'medium', 'large', 'small',
    'head', 'piece', 'slice', 'inch', 'can', 'bag', 'stick'
}

quantity_keywords = {
    'half', 'quarter', 'third', 'one', 'two', 'three', 'four',
    'five', 'six', 'dozen', 'few', 'some', 'several', 'a', 'an', 'double'
}

# Matches: integers (3), fractions (1/2), decimals (1.5), mixed (2-1/2)
quantity_pattern = re.compile(r'^\d+[-/]?\d*\.?\d*$')
```

---

## 5.2 word2features — Feature Dictionary (per token)

### Core Linguistic Features (spaCy)

| Feature Key | Description |
|-------------|-------------|
| `bias` | Constant 1.0 — baseline intercept for CRF |
| `token` | Lowercase form of the token |
| `lemma` | spaCy base form — normalises plural/inflected forms |
| `pos_tag / tag / dep` | spaCy POS, fine-grained tag, dependency relation |
| `shape` | Token shape pattern (e.g. `'Xxx'` for `'Milk'`, `'dd'` for `'12'`) |
| `is_stop / is_digit / is_punct` | Boolean flags from spaCy |
| `has_digit / has_alpha` | Partial digit or alpha presence |
| `hyphenated / slash_present` | Detects mixed formats like `2-1/2` or `1/4` |
| `is_title / is_upper` | Capitalisation — ingredients are often Title case |

---

### Quantity & Unit Detection Features

| Feature Key | Description |
|-------------|-------------|
| `is_quantity` | True if token matches `quantity_pattern` OR is in `quantity_keywords` |
| `is_unit` | True if token is in `unit_keywords` |
| `is_numeric` | True if token matches `[0-9./-]+` pattern |
| `is_fraction` | True if token matches `d+/d+` format (e.g. `1/2`, `3/4`) |
| `is_decimal` | True if token matches `d+.d+` format (e.g. `1.5`, `2.25`) |
| `preceding_word / following_word` | Adjacent token text for local context |

---

### Contextual Features (Window ±1)

| Feature Key | Description |
|-------------|-------------|
| `BOS` | Beginning-of-Sequence flag (True when `i == 0`) |
| `prev_token` | Lowercase previous token |
| `prev_is_quantity` | Whether previous token is a quantity |
| `prev_is_digit` | Whether previous token is purely numeric |
| `EOS` | End-of-Sequence flag (True when last token) |
| `next_token` | Lowercase next token |
| `next_is_unit` | Whether next token is in `unit_keywords` |
| `next_is_ingredient` | True if next token is neither unit nor quantity |

---

## 5.3 sent2features & Feature Conversion

```python
def sent2features(tokens):
    return [word2features(tokens, i) for i in range(len(tokens))]

X_train_features = [sent2features(recipe) for recipe in X_train]
X_val_features   = [sent2features(recipe) for recipe in X_val]
```

| Variable | Length | Notes |
|----------|--------|-------|
| `X_train_features` | 196 | Feature dicts for all training recipes |
| `X_val_features` | 84 | Feature dicts for all validation recipes |
| `y_train_labels` | 196 | Nested label lists (training) |
| `y_val_labels` | 84 | Nested label lists (validation) |

---

## 5.4 Class Weights Applied to Feature Sets

```python
def extract_features_with_class_weights(X_features, weight_dict):
    weighted = []
    for recipe in X_features:
        weighted_recipe = []
        for token_feat in recipe:
            token_feat['class_weight'] = weight_dict.get(token_feat['token'], 1.0)
            weighted_recipe.append(token_feat)
        weighted.append(weighted_recipe)
    return weighted

X_train_weighted_features = extract_features_with_class_weights(X_train_features, weight_dict)
X_val_weighted_features   = extract_features_with_class_weights(X_val_features, weight_dict)
```

| Label | Token Count | Initial Weight | Final Weight |
|-------|------------|----------------|--------------|
| `ingredient` | 5,323 | 1.3365 | **0.6682** (penalised ×0.5) |
| `quantity` | 980 | 7.2592 | 7.2592 |
| `unit` | 811 | 8.7719 | 8.7719 |

> **Insight:** The 0.5× penalty on ingredient forces the model to focus more attention on minority classes. Without penalisation, the model would over-predict `ingredient` for ambiguous tokens due to its frequency dominance (74.8% of training tokens).

---

[← Back to README](../README.md) | [← Prev: EDA](04_exploratory_data_analysis.md) | [Next: Model Building & Training →](06_model_building_training.md)
