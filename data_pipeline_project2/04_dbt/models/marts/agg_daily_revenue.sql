-- models/marts/agg_daily_revenue.sql
-- Aggregate: daily revenue, margin, orders, AOV
SELECT
    order_date,
    COUNT(DISTINCT order_id)                AS orders,
    COUNT(DISTINCT customer_id)             AS unique_customers,
    ROUND(SUM(order_revenue), 2)            AS revenue,
    ROUND(SUM(order_margin),  2)            AS margin,
    ROUND(AVG(order_revenue), 2)            AS aov
FROM fct_orders
WHERE order_status = 'completed'
GROUP BY order_date
ORDER BY order_date
