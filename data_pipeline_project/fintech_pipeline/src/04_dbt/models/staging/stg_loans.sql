-- models/staging/stg_loans.sql
WITH source AS (
    SELECT * FROM airbyte_raw_loans
)
SELECT
    loan_id,
    customer_id,
    loan_type,
    principal,
    interest_rate,
    ROUND(interest_rate * 100, 2)       AS interest_rate_pct,
    term_months,
    DATE(origination_date)              AS origination_date,
    status                              AS loan_status,
    outstanding_balance,
    principal - outstanding_balance     AS principal_repaid,
    CASE
        WHEN status IN ('defaulted', 'charged_off') THEN 1 ELSE 0
    END                                 AS is_delinquent,
    _airbyte_extracted_at               AS loaded_at
FROM source
