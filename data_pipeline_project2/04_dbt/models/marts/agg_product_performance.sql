-- models/marts/agg_product_performance.sql
SELECT
    items.product_id,
    items.product_name,
    items.category,
    SUM(items.quantity)              AS units_sold,
    ROUND(SUM(items.line_revenue),2) AS revenue,
    ROUND(SUM(items.line_margin), 2) AS margin,
    ROUND(SUM(items.line_margin) * 1.0 / SUM(items.line_revenue), 4) AS margin_pct
FROM int_order_items_enriched items
WHERE items.order_status = 'completed'
GROUP BY items.product_id, items.product_name, items.category
ORDER BY revenue DESC
