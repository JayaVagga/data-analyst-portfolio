# 🏦 Fintech Data Pipeline — Source → Airbyte → Warehouse → dbt → BI

> **End-to-end modern data stack demo for a digital bank.** Postgres OLTP → Airbyte EL → warehouse → dbt transforms + tests → analytics marts → interactive BI dashboard.

[![Pipeline](https://img.shields.io/badge/pipeline-passing-22d97a?style=flat-square)]()
[![dbt tests](https://img.shields.io/badge/dbt%20tests-20%2F20%20passing-22d97a?style=flat-square)]()
[![Python](https://img.shields.io/badge/python-3.9%2B-blue?style=flat-square)]()
[![License](https://img.shields.io/badge/license-MIT-lightgrey?style=flat-square)](LICENSE)

---

## Overview

This project demonstrates a complete fintech analytics platform mirroring how real digital banks (Revolut, Nubank, Chime, Mercury, etc.) move data from their core banking system to executive dashboards. Every layer in the stack is implemented with realistic logic and conventions.

### Architecture

```
┌──────────┐    ┌─────────┐    ┌───────────┐    ┌──────┐    ┌──────────┐    ┌────┐
│ Postgres │ -> │ Airbyte │ -> │ Warehouse │ -> │ dbt  │ -> │   Marts  │ -> │ BI │
│   OLTP   │    │   EL    │    │ (Raw +    │    │      │    │ (fact +  │    │    │
│          │    │         │    │  Staging) │    │      │    │   dim)   │    │    │
└──────────┘    └─────────┘    └───────────┘    └──────┘    └──────────┘    └────┘
   source       extract+load    landing zone   transform    analytics      dashboard
```

### What's modeled

A digital bank's core entities:

- **customers** — identity, KYC status, risk score
- **accounts** — checking / savings / credit accounts in 12 currencies
- **transactions** — payments, deposits, withdrawals, transfers, fees across 5 channels
- **loans** — personal, auto, and mortgage portfolio with delinquency tracking
- **fraud_alerts** — flagged transactions from the fraud engine

### What it produces

- **$7.4M** total transaction volume across 8,000 transactions
- **376** active customers across 12 countries
- **24** confirmed fraud cases ($49.5K loss) detected via 4 alert rule types
- **$5.08M** outstanding loan book with **8.89%** delinquency rate
- **20/20** dbt data tests passing on every run

---

## Repo structure

```
fintech-data-pipeline/
├── run_pipeline.py                 # Orchestrator — runs the full pipeline end-to-end
├── src/
│   ├── 01_source/                  # Source OLTP simulation (replace with real Postgres)
│   │   └── setup_source_db.py
│   ├── 02_airbyte_extract/         # Airbyte connector simulation
│   │   └── airbyte_sync.py
│   ├── 03_warehouse/               # Warehouse layer (Snowflake/BigQuery in prod)
│   │   └── warehouse.db            # Generated at runtime
│   ├── 04_dbt/                     # dbt project
│   │   ├── dbt_project.yml
│   │   ├── run_dbt.py              # dbt runner (compile + run + test)
│   │   └── models/
│   │       ├── staging/            # 1:1 with source, light renaming
│   │       ├── intermediate/       # Joins and enrichments
│   │       ├── marts/              # Fact + dim + aggregate tables
│   │       └── schema.yml          # Documentation + data tests
│   ├── 05_analytics/               # Export marts -> JSON for BI
│   │   └── export_for_bi.py
│   └── 06_dashboard/               # React BI dashboard
│       └── Dashboard.jsx
├── logs/                           # Pipeline run logs
├── docs/                           # Additional documentation
├── .github/workflows/ci.yml        # GitHub Actions CI
├── requirements.txt
├── .gitignore
├── LICENSE
└── README.md
```

---

## Quickstart

### Prerequisites

- Python 3.9+
- (Optional) Node.js 18+ if you want to render the React dashboard locally

### Run the full pipeline

```bash
git clone https://github.com/<your-username>/fintech-data-pipeline.git
cd fintech-data-pipeline
pip install -r requirements.txt
python run_pipeline.py
```

You'll see each stage execute in order:

```
########################################################################
# FINTECH DATA PIPELINE
# Source -> Airbyte -> Warehouse -> dbt -> Analytics -> BI
########################################################################

>>> Stage: 1. Source seed
>>> Stage: 2. Airbyte extract
>>> Stage: 3. dbt transform+test
>>> Stage: 4. Export to BI

# PIPELINE COMPLETED in 1.07s
```

### Run individual stages

```bash
python src/01_source/setup_source_db.py            # Seed source DB
python src/02_airbyte_extract/airbyte_sync.py      # Run Airbyte sync
python src/04_dbt/run_dbt.py                       # Run dbt models + tests
python src/05_analytics/export_for_bi.py           # Export for BI
```

### View the dashboard

The dashboard is a single React component at `src/06_dashboard/Dashboard.jsx`. To view it:

1. Drop into any React app (Vite, Next.js, CRA)
2. Install peer deps: `npm install recharts`
3. Import and render `<Dashboard />`

Or paste it into Claude.ai / claude.com / any React playground that supports recharts.

---

## Stack details

### 1. Source system — `src/01_source/setup_source_db.py`

Generates a SQLite database that simulates a digital bank's Postgres OLTP. In production, this is your live application database — replace this script with a real Postgres connection string.

| Table         | Rows  | Description                               |
|---------------|-------|-------------------------------------------|
| customers     | 400   | User identity + KYC + risk score          |
| accounts      | 610   | Checking/savings/credit accounts          |
| transactions  | 8,000 | One year of payment activity              |
| loans         | 180   | Personal/auto/mortgage portfolio          |
| fraud_alerts  | 122   | Flagged transactions                      |

### 2. Airbyte extraction — `src/02_airbyte_extract/airbyte_sync.py`

Mimics Airbyte's source connector + warehouse destination behavior:

- Reads each stream from source (full refresh in this demo; real Airbyte supports CDC / incremental)
- Wraps each record in the standard Airbyte raw schema:
  - `_airbyte_raw_id` (UUID)
  - `_airbyte_extracted_at` (timestamp)
  - `_airbyte_meta` (JSON metadata)
  - `_airbyte_data` (raw JSON payload)
- Runs the normalization step that expands `_airbyte_data` into typed columns (`airbyte_raw_<stream>`)

### 3. Warehouse — `src/03_warehouse/warehouse.db`

A single SQLite file standing in for Snowflake/BigQuery/Redshift/Databricks. Holds:

- `_airbyte_raw_*` — raw landing tables (JSON blobs)
- `airbyte_raw_*` — normalized typed tables (Airbyte's output)
- All dbt-built models from staging through marts

### 4. dbt transformations — `src/04_dbt/`

A real dbt project structure with `dbt_project.yml`, `models/schema.yml`, and 13 SQL models organized in three layers:

**Staging** (1:1 with source, light cleanup):
- `stg_customers`, `stg_accounts`, `stg_transactions`, `stg_loans`, `stg_fraud_alerts`

**Intermediate** (joins and enrichments):
- `int_transactions_enriched` — transactions joined to accounts, customers, fraud alerts

**Marts** (analytics-ready):
- `fct_transactions` — transaction fact table
- `dim_customers` — customer dimension with behavioral metrics
- `agg_daily_transactions` — daily KPIs
- `agg_channel_performance` — per-channel volume and fraud rates
- `agg_merchant_category` — spend by category
- `agg_fraud_metrics` — fraud detection precision by alert type
- `agg_loan_portfolio` — loan book health by type

**Data tests (20 in total):**
- `not_null` and `unique` on all primary keys
- `relationships` enforcing foreign key integrity
- `accepted_values` on enum columns (kyc_status, risk_band, txn_type, txn_status, loan_status)

### 5. Analytics export — `src/05_analytics/export_for_bi.py`

In production, BI tools query the warehouse directly via JDBC/ODBC. For this demo, marts are exported to JSON so the React dashboard can render without a live connection.

### 6. BI dashboard — `src/06_dashboard/Dashboard.jsx`

Self-contained React component with seven tabs:

- **Overview** — top-line KPIs, weekly volume chart, status breakdown, customer segments
- **Pipeline** — DAG visualization, stage durations, dbt test results
- **Channels** — volume + fraud rate per channel; merchant category spend
- **Fraud & Risk** — risk distribution, alert precision, recent fraud feed
- **Loan Book** — portfolio health by loan type, delinquency rates
- **Customers** — top customers by lifetime volume
- **Geography** — volume by country

Built with `recharts` for charts; styling is hand-rolled CSS (terminal/editorial aesthetic, no UI framework).

---

## Mapping to a real production stack

Each demo component maps cleanly to a real tool:

| Demo component                         | Production replacement                                   |
|----------------------------------------|----------------------------------------------------------|
| `src/01_source/setup_source_db.py`     | Real Postgres / MySQL / MongoDB (your app's database)    |
| `src/02_airbyte_extract/airbyte_sync.py` | [Airbyte Cloud](https://airbyte.com/) or self-hosted Airbyte OSS |
| `src/03_warehouse/warehouse.db`        | Snowflake / BigQuery / Redshift / Databricks             |
| `src/04_dbt/run_dbt.py`                | Real `dbt-core` + `dbt-cloud` (or self-hosted)           |
| `run_pipeline.py`                      | Apache Airflow / Dagster / Prefect DAG                   |
| `src/06_dashboard/Dashboard.jsx`       | Looker / Tableau / Metabase / Superset / PowerBI         |

To productionize:

1. Replace the SQLite source with a real Postgres connection in your Airbyte source connector config
2. Point Airbyte at a real warehouse (Snowflake, BigQuery, etc.)
3. Initialize the dbt project with `dbt init`, copy these models into `models/`, configure your `profiles.yml`
4. Wire up the orchestrator (Airflow, Dagster, or Prefect) to schedule `dbt run` + `dbt test`
5. Connect a BI tool to the marts schema

---

## Sample queries

Some questions you can answer from this pipeline:

```sql
-- Daily volume trend
SELECT * FROM agg_daily_transactions
WHERE txn_date >= date('now', '-30 days')
ORDER BY txn_date;

-- Fraud rate by channel
SELECT channel, fraud_rate * 100 AS fraud_pct
FROM agg_channel_performance
ORDER BY fraud_rate DESC;

-- High-risk customers with active loans
SELECT c.full_name, c.risk_band, c.total_outstanding_loans
FROM dim_customers c
WHERE c.risk_band IN ('high', 'critical')
  AND c.total_outstanding_loans > 0;

-- Most-flagged customer behavior
SELECT customer_id, full_name, flagged_count, confirmed_fraud_count
FROM dim_customers
WHERE flagged_count > 0
ORDER BY flagged_count DESC;
```

---

## Roadmap

Possible extensions:

- [ ] Switch from full-refresh to CDC-based incremental sync
- [ ] Add slowly changing dimension (SCD Type 2) for `dim_customers`
- [ ] Add a real Airflow / Dagster orchestrator definition
- [ ] Add Great Expectations or `dbt-expectations` for richer data quality tests
- [ ] Add a fraud detection ML model (XGBoost on `fct_transactions`)
- [ ] Add a customer churn prediction model
- [ ] Replace SQLite with DuckDB for closer parity with Snowflake/BigQuery SQL
- [ ] Containerize the whole pipeline with Docker Compose

---

## License

MIT — see [LICENSE](LICENSE).

## Disclaimer

All data in this project is synthetically generated by `src/01_source/setup_source_db.py` using a fixed random seed. No real customer data, no real banking data, no PII. Names, emails, and identifiers are entirely fictional.
