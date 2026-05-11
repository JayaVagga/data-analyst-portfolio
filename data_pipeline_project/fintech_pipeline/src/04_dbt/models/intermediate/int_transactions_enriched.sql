-- models/intermediate/int_transactions_enriched.sql
-- Joins transactions with their account, customer, and any fraud alert.
WITH t AS (SELECT * FROM stg_transactions),
     a AS (SELECT * FROM stg_accounts),
     c AS (SELECT * FROM stg_customers),
     f AS (SELECT * FROM stg_fraud_alerts)
SELECT
    t.transaction_id,
    t.txn_date,
    t.txn_timestamp,
    t.txn_type,
    t.channel,
    t.merchant_category,
    t.amount,
    t.currency,
    t.txn_status,
    t.is_completed,
    t.is_international,
    a.account_id,
    a.account_type,
    c.customer_id,
    c.full_name                         AS customer_name,
    c.country_code,
    c.kyc_status,
    c.risk_band,
    c.risk_score,
    f.alert_id,
    f.severity                          AS fraud_severity,
    f.resolution                        AS fraud_resolution,
    CASE WHEN f.alert_id IS NOT NULL THEN 1 ELSE 0 END AS is_flagged,
    COALESCE(f.is_confirmed_fraud, 0)   AS is_confirmed_fraud
FROM t
LEFT JOIN a ON t.account_id = a.account_id
LEFT JOIN c ON a.customer_id = c.customer_id
LEFT JOIN f ON t.transaction_id = f.transaction_id
