-- models/marts/fct_orders.sql
-- Fact table: one row per order, completed orders only
WITH items AS (SELECT * FROM int_order_items_enriched),
     o     AS (SELECT * FROM stg_orders)
SELECT
    o.order_id,
    o.customer_id,
    o.order_date,
    o.order_status,
    COUNT(items.order_item_id)              AS item_count,
    SUM(items.quantity)                     AS total_units,
    ROUND(SUM(items.line_revenue), 2)       AS order_revenue,
    ROUND(SUM(items.line_cost),    2)       AS order_cost,
    ROUND(SUM(items.line_margin),  2)       AS order_margin
FROM o
LEFT JOIN items ON o.order_id = items.order_id
GROUP BY o.order_id, o.customer_id, o.order_date, o.order_status
