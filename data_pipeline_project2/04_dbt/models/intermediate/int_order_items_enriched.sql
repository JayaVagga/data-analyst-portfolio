-- models/intermediate/int_order_items_enriched.sql
-- Joins order items with products to compute margin per line
WITH oi AS (SELECT * FROM stg_order_items),
     p  AS (SELECT * FROM stg_products),
     o  AS (SELECT * FROM stg_orders)
SELECT
    oi.order_item_id,
    oi.order_id,
    o.customer_id,
    o.order_date,
    o.order_status,
    oi.product_id,
    p.product_name,
    p.category,
    oi.quantity,
    oi.unit_price,
    p.unit_cost,
    oi.line_revenue,
    oi.quantity * p.unit_cost           AS line_cost,
    oi.line_revenue - (oi.quantity * p.unit_cost) AS line_margin
FROM oi
LEFT JOIN p ON oi.product_id = p.product_id
LEFT JOIN o ON oi.order_id   = o.order_id
