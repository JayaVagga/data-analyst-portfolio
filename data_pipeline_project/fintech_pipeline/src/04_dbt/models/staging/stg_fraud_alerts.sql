-- models/staging/stg_fraud_alerts.sql
WITH source AS (
    SELECT * FROM airbyte_raw_fraud_alerts
)
SELECT
    alert_id,
    transaction_id,
    alert_type,
    severity,
    DATE(flagged_at)                    AS flagged_date,
    flagged_at                          AS flagged_timestamp,
    resolution,
    CASE WHEN resolution = 'confirmed_fraud' THEN 1 ELSE 0 END AS is_confirmed_fraud,
    CASE WHEN resolution = 'false_positive' THEN 1 ELSE 0 END AS is_false_positive,
    _airbyte_extracted_at               AS loaded_at
FROM source
