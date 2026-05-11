-- models/marts/agg_channel_performance.sql
-- Performance per channel: mobile / card / web / atm / wire.
SELECT
    channel,
    COUNT(*)                                                AS transactions,
    ROUND(SUM(CASE WHEN is_completed=1 THEN amount ELSE 0 END), 2) AS volume,
    ROUND(AVG(CASE WHEN is_completed=1 THEN amount END), 2) AS avg_txn_size,
    ROUND(SUM(is_completed) * 1.0 / COUNT(*), 4)            AS completion_rate,
    SUM(is_confirmed_fraud)                                 AS confirmed_fraud_count,
    ROUND(SUM(is_confirmed_fraud) * 1.0 / COUNT(*), 6)      AS fraud_rate
FROM int_transactions_enriched
GROUP BY channel
ORDER BY volume DESC
