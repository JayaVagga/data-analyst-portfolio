-- models/staging/stg_customers.sql
-- Staging: 1:1 with source, light renaming and casting only.
WITH source AS (
    SELECT * FROM airbyte_raw_customers
)
SELECT
    customer_id,
    LOWER(TRIM(email))                  AS email,
    first_name || ' ' || last_name      AS full_name,
    first_name,
    last_name,
    country                             AS country_code,
    DATE(date_of_birth)                 AS date_of_birth,
    CAST((julianday('now') - julianday(date_of_birth)) / 365.25 AS INTEGER) AS age,
    kyc_status,
    risk_score,
    CASE
        WHEN risk_score < 25 THEN 'low'
        WHEN risk_score < 50 THEN 'medium'
        WHEN risk_score < 75 THEN 'high'
        ELSE 'critical'
    END                                 AS risk_band,
    DATE(signup_date)                   AS signup_date,
    _airbyte_extracted_at               AS loaded_at
FROM source
