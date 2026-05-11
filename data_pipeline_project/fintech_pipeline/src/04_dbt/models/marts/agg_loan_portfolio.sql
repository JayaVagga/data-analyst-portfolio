-- models/marts/agg_loan_portfolio.sql
-- Loan book health by loan type.
SELECT
    loan_type,
    COUNT(*)                                                AS loans,
    ROUND(SUM(principal), 2)                                AS total_originated,
    ROUND(SUM(outstanding_balance), 2)                      AS total_outstanding,
    ROUND(SUM(principal_repaid), 2)                         AS total_repaid,
    ROUND(AVG(interest_rate_pct), 2)                        AS avg_rate_pct,
    SUM(is_delinquent)                                      AS delinquent_loans,
    ROUND(SUM(is_delinquent) * 1.0 / COUNT(*), 4)           AS delinquency_rate
FROM stg_loans
GROUP BY loan_type
ORDER BY total_outstanding DESC
