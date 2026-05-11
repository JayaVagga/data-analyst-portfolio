# Warehouse layer

The warehouse database (`warehouse.db`) is generated at runtime by `src/02_airbyte_extract/airbyte_sync.py` and populated through `src/04_dbt/run_dbt.py`. It is gitignored.

In production, this is your real cloud warehouse: Snowflake, BigQuery, Redshift, or Databricks. Both Airbyte and dbt point to it via connection credentials.
