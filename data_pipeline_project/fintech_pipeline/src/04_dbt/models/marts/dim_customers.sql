-- models/marts/dim_customers.sql
-- Dimension: customers enriched with banking behavior metrics.
WITH c AS (SELECT * FROM stg_customers),
     a AS (
        SELECT customer_id,
               COUNT(*) AS account_count,
               SUM(CASE WHEN account_status = 'active' THEN 1 ELSE 0 END) AS active_accounts,
               ROUND(SUM(balance), 2) AS total_balance
        FROM stg_accounts
        GROUP BY customer_id
     ),
     t AS (
        SELECT customer_id,
               COUNT(*) AS lifetime_transactions,
               ROUND(SUM(CASE WHEN is_completed=1 THEN amount ELSE 0 END), 2) AS lifetime_volume,
               SUM(is_flagged) AS flagged_count,
               SUM(is_confirmed_fraud) AS confirmed_fraud_count
        FROM int_transactions_enriched
        GROUP BY customer_id
     ),
     l AS (
        SELECT customer_id,
               COUNT(*) AS loan_count,
               ROUND(SUM(outstanding_balance), 2) AS total_outstanding_loans,
               SUM(is_delinquent) AS delinquent_loans
        FROM stg_loans
        GROUP BY customer_id
     )
SELECT
    c.customer_id,
    c.email,
    c.full_name,
    c.country_code,
    c.age,
    c.kyc_status,
    c.risk_band,
    c.risk_score,
    c.signup_date,
    COALESCE(a.account_count, 0)            AS account_count,
    COALESCE(a.active_accounts, 0)          AS active_accounts,
    COALESCE(a.total_balance, 0)            AS total_balance,
    COALESCE(t.lifetime_transactions, 0)    AS lifetime_transactions,
    COALESCE(t.lifetime_volume, 0)          AS lifetime_volume,
    COALESCE(t.flagged_count, 0)            AS flagged_count,
    COALESCE(t.confirmed_fraud_count, 0)    AS confirmed_fraud_count,
    COALESCE(l.loan_count, 0)               AS loan_count,
    COALESCE(l.total_outstanding_loans, 0)  AS total_outstanding_loans,
    COALESCE(l.delinquent_loans, 0)         AS delinquent_loans,
    CASE
        WHEN COALESCE(t.lifetime_transactions, 0) = 0 THEN 'inactive'
        WHEN t.lifetime_transactions < 10 THEN 'casual'
        WHEN t.lifetime_transactions < 30 THEN 'engaged'
        ELSE 'power_user'
    END                                     AS engagement_segment
FROM c
LEFT JOIN a ON c.customer_id = a.customer_id
LEFT JOIN t ON c.customer_id = t.customer_id
LEFT JOIN l ON c.customer_id = l.customer_id
