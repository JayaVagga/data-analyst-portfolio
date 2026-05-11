-- models/staging/stg_customers.sql
-- Staging: 1:1 with source, light renaming and casting only
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
    DATE(signup_date)                   AS signup_date,
    _airbyte_extracted_at               AS loaded_at
FROM source
