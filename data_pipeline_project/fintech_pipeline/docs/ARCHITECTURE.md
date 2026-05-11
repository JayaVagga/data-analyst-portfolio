# Architecture

## High-level data flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          DIGITAL BANK OLTP                                  │
│                       (Postgres - simulated)                                │
│                                                                             │
│  customers     accounts     transactions     loans     fraud_alerts         │
└────────────────────────────────┬────────────────────────────────────────────┘
                                 │  Airbyte source connector
                                 │  (full_refresh / incremental CDC)
                                 ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                     AIRBYTE EXTRACTION + LOAD                               │
│                                                                             │
│  Wraps each record in AirbyteRecordMessage:                                 │
│    _airbyte_raw_id, _airbyte_extracted_at, _airbyte_meta, _airbyte_data     │
└────────────────────────────────┬────────────────────────────────────────────┘
                                 │  Destination connector + normalization
                                 ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                       WAREHOUSE (Snowflake / BigQuery)                      │
│                                                                             │
│   ┌───────────────────┐   ┌────────────────────┐                            │
│   │ _airbyte_raw_*    │   │ airbyte_raw_*      │                            │
│   │ (raw JSON blobs)  │ → │ (typed columns)    │                            │
│   └───────────────────┘   └─────────┬──────────┘                            │
└─────────────────────────────────────┼───────────────────────────────────────┘
                                      │  dbt run
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                              DBT MODELS                                     │
│                                                                             │
│  STAGING                  INTERMEDIATE              MARTS                   │
│  (1:1 + clean)            (joins/enrich)            (fact + dim + agg)      │
│                                                                             │
│  stg_customers            int_transactions_         fct_transactions        │
│  stg_accounts                 enriched              dim_customers           │
│  stg_transactions                                   agg_daily_transactions  │
│  stg_loans                                          agg_channel_performance │
│  stg_fraud_alerts                                   agg_merchant_category   │
│                                                     agg_fraud_metrics       │
│                                                     agg_loan_portfolio      │
│                                                                             │
│  + 20 schema tests (not_null, unique, relationships, accepted_values)       │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         BI DASHBOARD (Looker / Tableau)                     │
│                                                                             │
│  Overview · Pipeline · Channels · Fraud & Risk · Loans · Customers · Geo    │
└─────────────────────────────────────────────────────────────────────────────┘
```

## dbt DAG

```
   stg_customers ─┐
   stg_accounts ──┼──┐
   stg_transactions ─┼─→ int_transactions_enriched ─┬──→ fct_transactions
   stg_fraud_alerts ─┘                              │
   stg_loans ──────────────────────────────┐        │
                                           │        │
                                           │        └──→ dim_customers
                                           │
                                           ├──→ agg_daily_transactions
                                           ├──→ agg_channel_performance
                                           ├──→ agg_merchant_category
                                           ├──→ agg_fraud_metrics
                                           └──→ agg_loan_portfolio
```

## Data tests

dbt validates every layer on every run. The 20 tests cover:

| Test type        | Count | What it catches                                    |
|------------------|-------|----------------------------------------------------|
| `not_null`       | 7     | Missing primary keys                               |
| `unique`         | 7     | Duplicate primary keys                             |
| `relationships`  | 1     | Orphaned foreign keys (account → customer)         |
| `accepted_values`| 5     | Unexpected enum values (kyc, status, types)        |

A single failure blocks the build via the GitHub Actions CI workflow.
