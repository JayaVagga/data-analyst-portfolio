-- models/marts/agg_merchant_category.sql
-- Customer spending by merchant category (payment txns only).
SELECT
    merchant_category,
    COUNT(*)                                                AS transactions,
    ROUND(SUM(CASE WHEN is_completed=1 THEN amount ELSE 0 END), 2) AS volume,
    ROUND(AVG(CASE WHEN is_completed=1 THEN amount END), 2) AS avg_ticket,
    COUNT(DISTINCT customer_id)                             AS unique_customers
FROM int_transactions_enriched
WHERE txn_type = 'payment' AND merchant_category IS NOT NULL
GROUP BY merchant_category
ORDER BY volume DESC
