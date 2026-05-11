-- models/marts/agg_fraud_metrics.sql
-- Fraud detection performance by alert type.
SELECT
    f.alert_type,
    COUNT(*)                                                AS alerts,
    SUM(f.is_confirmed_fraud)                               AS confirmed_fraud,
    SUM(f.is_false_positive)                                AS false_positives,
    ROUND(SUM(f.is_confirmed_fraud) * 1.0 / COUNT(*), 4)    AS precision_rate,
    ROUND(SUM(t.amount), 2)                                 AS total_flagged_amount,
    ROUND(SUM(CASE WHEN f.is_confirmed_fraud=1 THEN t.amount ELSE 0 END), 2) AS confirmed_fraud_amount
FROM stg_fraud_alerts f
LEFT JOIN stg_transactions t ON f.transaction_id = t.transaction_id
GROUP BY f.alert_type
ORDER BY alerts DESC
