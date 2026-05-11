-- models/marts/fct_transactions.sql
-- Core fact: one row per transaction with all dims joined.
SELECT
    transaction_id,
    txn_date,
    txn_timestamp,
    customer_id,
    account_id,
    txn_type,
    channel,
    merchant_category,
    account_type,
    country_code,
    risk_band,
    amount,
    currency,
    txn_status,
    is_completed,
    is_international,
    is_flagged,
    is_confirmed_fraud,
    fraud_severity,
    fraud_resolution
FROM int_transactions_enriched
