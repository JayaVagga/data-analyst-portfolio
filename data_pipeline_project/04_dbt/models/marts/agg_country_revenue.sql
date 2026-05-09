-- models/marts/agg_country_revenue.sql
SELECT
    c.country_code,
    COUNT(DISTINCT c.customer_id)        AS customers,
    COUNT(DISTINCT o.order_id)           AS orders,
    ROUND(SUM(o.order_revenue), 2)       AS revenue,
    ROUND(SUM(o.order_margin), 2)        AS margin
FROM stg_customers c
LEFT JOIN fct_orders o
    ON c.customer_id = o.customer_id
   AND o.order_status = 'completed'
GROUP BY c.country_code
HAVING revenue IS NOT NULL
ORDER BY revenue DESC
