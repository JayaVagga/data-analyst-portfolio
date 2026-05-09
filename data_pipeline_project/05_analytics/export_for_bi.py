"""
STEP 5: Export analytics marts -> JSON for the BI layer
In production: BI tools (Looker, Tableau, Metabase, Superset) connect directly
to the warehouse via JDBC/ODBC. Here we export to JSON so the dashboard
artifact can render without a live connection.
"""
import sqlite3
import json
from pathlib import Path

WAREHOUSE = Path(__file__).parent.parent / "03_warehouse" / "warehouse.db"
OUT = Path(__file__).parent / "analytics_export.json"

conn = sqlite3.connect(WAREHOUSE)
conn.row_factory = sqlite3.Row

def query(sql):
    return [dict(r) for r in conn.execute(sql).fetchall()]

export = {
    "kpis": query("""
        SELECT
            ROUND(SUM(order_revenue), 2)        AS total_revenue,
            ROUND(SUM(order_margin),  2)        AS total_margin,
            COUNT(*)                            AS total_orders,
            COUNT(DISTINCT customer_id)         AS unique_customers,
            ROUND(AVG(order_revenue), 2)        AS avg_order_value
        FROM fct_orders
        WHERE order_status = 'completed'
    """)[0],
    "daily_revenue": query("SELECT * FROM agg_daily_revenue ORDER BY order_date"),
    "product_performance": query("SELECT * FROM agg_product_performance"),
    "country_revenue": query("SELECT * FROM agg_country_revenue"),
    "customer_segments": query("""
        SELECT customer_segment, COUNT(*) AS customers,
               ROUND(SUM(lifetime_revenue), 2) AS revenue
        FROM dim_customers
        GROUP BY customer_segment
        ORDER BY revenue DESC
    """),
    "order_status_breakdown": query("""
        SELECT order_status, COUNT(*) AS orders,
               ROUND(SUM(order_revenue), 2) AS revenue
        FROM fct_orders
        GROUP BY order_status
    """),
    "top_customers": query("""
        SELECT full_name, country_code, lifetime_orders,
               lifetime_revenue, customer_segment
        FROM dim_customers
        WHERE lifetime_orders > 0
        ORDER BY lifetime_revenue DESC
        LIMIT 10
    """),
}

OUT.write_text(json.dumps(export, indent=2, default=str))
print(f"Exported analytics to: {OUT}")
print(f"Total revenue (completed): ${export['kpis']['total_revenue']:,.2f}")
print(f"Total orders (completed):  {export['kpis']['total_orders']:,}")
print(f"Unique customers:          {export['kpis']['unique_customers']:,}")
conn.close()
