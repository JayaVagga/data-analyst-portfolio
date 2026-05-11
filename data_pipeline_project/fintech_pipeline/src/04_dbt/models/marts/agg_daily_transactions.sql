-- models/marts/agg_daily_transactions.sql
-- Daily KPIs: volume, count, completion rate, fraud rate.
SELECT
    txn_date,
    COUNT(*)                                                AS total_transactions,
    SUM(is_completed)                                       AS completed_transactions,
    ROUND(SUM(CASE WHEN is_completed=1 THEN amount ELSE 0 END), 2) AS completed_volume,
    SUM(is_flagged)                                         AS flagged_transactions,
    SUM(is_confirmed_fraud)                                 AS confirmed_fraud_count,
    ROUND(SUM(CASE WHEN is_confirmed_fraud=1 THEN amount ELSE 0 END), 2) AS fraud_loss,
    SUM(is_international)                                   AS international_transactions,
    COUNT(DISTINCT customer_id)                             AS active_customers,
    ROUND(AVG(CASE WHEN is_completed=1 THEN amount END), 2) AS avg_txn_size
FROM int_transactions_enriched
GROUP BY txn_date
ORDER BY txn_date
