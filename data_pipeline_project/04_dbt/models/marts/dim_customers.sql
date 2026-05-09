-- models/marts/dim_customers.sql
-- Dimension: customers enriched with order behavior
WITH c AS (SELECT * FROM stg_customers),
     o AS (SELECT * FROM fct_orders WHERE order_status = 'completed')
SELECT
    c.customer_id,
    c.email,
    c.full_name,
    c.country_code,
    c.signup_date,
    COUNT(o.order_id)                            AS lifetime_orders,
    COALESCE(ROUND(SUM(o.order_revenue), 2), 0)  AS lifetime_revenue,
    COALESCE(ROUND(SUM(o.order_margin),  2), 0)  AS lifetime_margin,
    MIN(o.order_date)                            AS first_order_date,
    MAX(o.order_date)                            AS last_order_date,
    CASE
        WHEN COUNT(o.order_id) = 0 THEN 'never_purchased'
        WHEN COUNT(o.order_id) = 1 THEN 'one_time'
        WHEN COUNT(o.order_id) BETWEEN 2 AND 4 THEN 'repeat'
        ELSE 'loyal'
    END                                          AS customer_segment
FROM c
LEFT JOIN o ON c.customer_id = o.customer_id
GROUP BY c.customer_id, c.email, c.full_name, c.country_code, c.signup_date
