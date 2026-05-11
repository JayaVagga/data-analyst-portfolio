-- models/staging/stg_transactions.sql
WITH source AS (
    SELECT * FROM airbyte_raw_transactions
)
SELECT
    transaction_id,
    account_id,
    DATE(txn_date)                      AS txn_date,
    txn_date                            AS txn_timestamp,
    txn_type,
    channel,
    merchant_category,
    amount,
    currency,
    status                              AS txn_status,
    CASE WHEN status = 'completed' THEN 1 ELSE 0 END AS is_completed,
    is_international,
    _airbyte_extracted_at               AS loaded_at
FROM source
