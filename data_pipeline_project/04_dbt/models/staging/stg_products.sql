-- models/staging/stg_products.sql
WITH source AS (
    SELECT * FROM airbyte_raw_products
)
SELECT
    product_id,
    product_name,
    category,
    price                       AS unit_price,
    cost                        AS unit_cost,
    (price - cost)              AS unit_margin,
    ROUND((price - cost) / price, 4) AS margin_pct,
    _airbyte_extracted_at       AS loaded_at
FROM source
