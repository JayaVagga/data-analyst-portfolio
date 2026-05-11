-- models/staging/stg_accounts.sql
WITH source AS (
    SELECT * FROM airbyte_raw_accounts
)
SELECT
    account_id,
    customer_id,
    account_type,
    currency,
    balance,
    status                              AS account_status,
    CASE WHEN status = 'active' THEN 1 ELSE 0 END AS is_active,
    DATE(opened_date)                   AS opened_date,
    _airbyte_extracted_at               AS loaded_at
FROM source
