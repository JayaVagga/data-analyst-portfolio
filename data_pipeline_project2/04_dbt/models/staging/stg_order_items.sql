-- models/staging/stg_order_items.sql
WITH source AS (
    SELECT * FROM airbyte_raw_order_items
)
SELECT
    order_item_id,
    order_id,
    product_id,
    quantity,
    unit_price,
    quantity * unit_price       AS line_revenue,
    _airbyte_extracted_at       AS loaded_at
FROM source
