"""
STEP 5: Export analytics marts -> JSON for the BI layer.

In production: BI tools (Looker, Tableau, Metabase, Superset) connect directly
to the warehouse via JDBC/ODBC. Here we export to JSON so the dashboard
artifact can render without a live connection.
"""
import sqlite3
import json
from pathlib import Path

ROOT = Path(__file__).parent.parent.parent
WAREHOUSE = ROOT / "src" / "03_warehouse" / "warehouse.db"
OUT = Path(__file__).parent / "analytics_export.json"

conn = sqlite3.connect(WAREHOUSE)
conn.row_factory = sqlite3.Row

def query(sql):
    return [dict(r) for r in conn.execute(sql).fetchall()]

export = {
    "kpis": query("""
        SELECT
            COUNT(*)                                                    AS total_transactions,
            ROUND(SUM(CASE WHEN is_completed=1 THEN amount ELSE 0 END), 2) AS total_volume,
            COUNT(DISTINCT customer_id)                                 AS active_customers,
            SUM(is_confirmed_fraud)                                     AS confirmed_fraud,
            ROUND(SUM(CASE WHEN is_confirmed_fraud=1 THEN amount ELSE 0 END), 2) AS fraud_loss,
            ROUND(SUM(is_completed) * 100.0 / COUNT(*), 2)              AS completion_rate_pct
        FROM fct_transactions
    """)[0],
    "loan_kpis": query("""
        SELECT
            COUNT(*)                                AS total_loans,
            ROUND(SUM(principal), 2)                AS total_originated,
            ROUND(SUM(outstanding_balance), 2)      AS total_outstanding,
            SUM(is_delinquent)                      AS delinquent_count,
            ROUND(SUM(is_delinquent) * 100.0 / COUNT(*), 2) AS delinquency_rate_pct
        FROM stg_loans
    """)[0],
    "daily_transactions": query("SELECT * FROM agg_daily_transactions ORDER BY txn_date"),
    "channel_performance": query("SELECT * FROM agg_channel_performance"),
    "merchant_category": query("SELECT * FROM agg_merchant_category"),
    "fraud_metrics": query("SELECT * FROM agg_fraud_metrics"),
    "loan_portfolio": query("SELECT * FROM agg_loan_portfolio"),
    "customer_segments": query("""
        SELECT engagement_segment, COUNT(*) AS customers,
               ROUND(SUM(lifetime_volume), 2) AS volume
        FROM dim_customers
        GROUP BY engagement_segment
        ORDER BY volume DESC
    """),
    "risk_distribution": query("""
        SELECT risk_band, COUNT(*) AS customers
        FROM dim_customers
        GROUP BY risk_band
    """),
    "txn_status_breakdown": query("""
        SELECT txn_status, COUNT(*) AS transactions,
               ROUND(SUM(amount), 2) AS volume
        FROM fct_transactions
        GROUP BY txn_status
    """),
    "country_volume": query("""
        SELECT country_code, COUNT(*) AS transactions,
               ROUND(SUM(CASE WHEN is_completed=1 THEN amount ELSE 0 END), 2) AS volume,
               COUNT(DISTINCT customer_id) AS customers
        FROM fct_transactions
        WHERE country_code IS NOT NULL
        GROUP BY country_code
        ORDER BY volume DESC
    """),
    "top_customers": query("""
        SELECT full_name, country_code, lifetime_transactions,
               lifetime_volume, total_balance, engagement_segment, risk_band
        FROM dim_customers
        WHERE lifetime_transactions > 0
        ORDER BY lifetime_volume DESC
        LIMIT 10
    """),
    "recent_fraud": query("""
        SELECT t.transaction_id, t.txn_date, t.customer_id,
               t.amount, t.currency, t.channel, t.merchant_category,
               t.fraud_severity, t.fraud_resolution
        FROM fct_transactions t
        WHERE t.is_flagged = 1
        ORDER BY t.txn_date DESC
        LIMIT 12
    """),
}

OUT.write_text(json.dumps(export, indent=2, default=str))
print(f"Exported analytics to: {OUT}")
print(f"Total volume: ${export['kpis']['total_volume']:,.2f}")
print(f"Total transactions: {export['kpis']['total_transactions']:,}")
print(f"Confirmed fraud: {export['kpis']['confirmed_fraud']} (${export['kpis']['fraud_loss']:,.2f} loss)")
print(f"Loan book: ${export['loan_kpis']['total_outstanding']:,.2f} outstanding")
conn.close()
