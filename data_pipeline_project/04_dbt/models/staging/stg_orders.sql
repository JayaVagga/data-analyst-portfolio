-- models/staging/stg_orders.sql
WITH source AS (
    SELECT * FROM airbyte_raw_orders
)
SELECT
    order_id,
    customer_id,
    DATE(order_date)            AS order_date,
    order_date                  AS order_timestamp,
    status                      AS order_status,
    CASE WHEN status = 'completed' THEN 1 ELSE 0 END AS is_completed,
    _airbyte_extracted_at       AS loaded_at
FROM source
