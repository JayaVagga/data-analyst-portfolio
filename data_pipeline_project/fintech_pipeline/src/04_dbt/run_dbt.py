"""
STEP 4: DBT TRANSFORMATIONS
Simulates `dbt run` + `dbt test` against the warehouse.

In production:
- `dbt run` parses ref()/source() into a DAG and materializes models
- `dbt test` runs schema tests (unique, not_null, relationships, accepted_values)

Here we replicate the layered build (staging -> intermediate -> marts),
materialize each as a TABLE, then run the schema tests.
"""
import sqlite3
import re
from pathlib import Path
from datetime import datetime

ROOT = Path(__file__).parent.parent.parent
WAREHOUSE = ROOT / "src" / "03_warehouse" / "warehouse.db"
MODELS_DIR = Path(__file__).parent / "models"
LOG_FILE = ROOT / "logs" / "dbt_run.log"

LAYER_ORDER = ["staging", "intermediate", "marts"]

# Within each layer, build in this order so refs resolve.
# (dbt does this automatically by parsing ref() — we hardcode it here.)
MODEL_ORDER = {
    "staging": [
        "stg_customers", "stg_accounts", "stg_transactions",
        "stg_loans", "stg_fraud_alerts",
    ],
    "intermediate": ["int_transactions_enriched"],
    "marts": [
        "fct_transactions", "dim_customers",
        "agg_daily_transactions", "agg_channel_performance",
        "agg_merchant_category", "agg_fraud_metrics", "agg_loan_portfolio",
    ],
}

# Schema tests (mirror what schema.yml declares)
TESTS = [
    ("not_null",        "stg_customers",        "customer_id"),
    ("unique",          "stg_customers",        "customer_id"),
    ("accepted_values", "stg_customers",        "kyc_status:verified,pending,rejected"),
    ("accepted_values", "stg_customers",        "risk_band:low,medium,high,critical"),
    ("not_null",        "stg_accounts",         "account_id"),
    ("unique",          "stg_accounts",         "account_id"),
    ("relationships",   "stg_accounts",         "customer_id->stg_customers.customer_id"),
    ("not_null",        "stg_transactions",     "transaction_id"),
    ("unique",          "stg_transactions",     "transaction_id"),
    ("accepted_values", "stg_transactions",     "txn_type:payment,deposit,withdrawal,transfer,fee"),
    ("accepted_values", "stg_transactions",     "txn_status:completed,pending,failed,reversed"),
    ("not_null",        "stg_loans",            "loan_id"),
    ("unique",          "stg_loans",            "loan_id"),
    ("accepted_values", "stg_loans",            "loan_status:active,paid_off,defaulted,charged_off"),
    ("not_null",        "stg_fraud_alerts",     "alert_id"),
    ("unique",          "stg_fraud_alerts",     "alert_id"),
    ("not_null",        "fct_transactions",     "transaction_id"),
    ("unique",          "fct_transactions",     "transaction_id"),
    ("not_null",        "dim_customers",        "customer_id"),
    ("unique",          "dim_customers",        "customer_id"),
]

logs = []
def log(msg):
    line = f"[{datetime.now().isoformat(timespec='seconds')}] {msg}"
    logs.append(line); print(line)

conn = sqlite3.connect(WAREHOUSE)

log("Running dbt project: fintech_analytics")
log("Profile: warehouse | Target: prod")
log("=" * 64)

# 1. RUN MODELS
total_models = 0
for layer in LAYER_ORDER:
    layer_dir = MODELS_DIR / layer
    if not layer_dir.exists():
        continue
    log(f"\n[Layer: {layer}]")
    for model_name in MODEL_ORDER[layer]:
        sql_file = layer_dir / f"{model_name}.sql"
        sql = sql_file.read_text().strip()
        sql = re.sub(r";\s*$", "", sql, flags=re.MULTILINE).strip()
        try:
            conn.execute(f"DROP TABLE IF EXISTS {model_name}")
            conn.execute(f"CREATE TABLE {model_name} AS {sql}")
            n = conn.execute(f"SELECT COUNT(*) FROM {model_name}").fetchone()[0]
            log(f"  OK created {layer}.{model_name:35s} [{n:>6,} rows]")
            total_models += 1
        except Exception as e:
            log(f"  FAIL {model_name}: {e}")
            raise

conn.commit()
log("=" * 64)
log(f"Built {total_models} models")

# 2. RUN TESTS
log("\nRunning data tests...")
log("-" * 64)
passed, failed = 0, 0
for test_type, model, arg in TESTS:
    try:
        if test_type == "not_null":
            n_null = conn.execute(f"SELECT COUNT(*) FROM {model} WHERE {arg} IS NULL").fetchone()[0]
            ok = n_null == 0
            detail = f"{n_null} nulls" if not ok else ""
        elif test_type == "unique":
            n_dupes = conn.execute(
                f"SELECT COUNT(*) FROM (SELECT {arg} FROM {model} GROUP BY {arg} HAVING COUNT(*) > 1)"
            ).fetchone()[0]
            ok = n_dupes == 0
            detail = f"{n_dupes} dupes" if not ok else ""
        elif test_type == "relationships":
            child_col, parent = arg.split("->")
            parent_table, parent_col = parent.split(".")
            n_orphans = conn.execute(f"""
                SELECT COUNT(*) FROM {model} c
                LEFT JOIN {parent_table} p ON c.{child_col} = p.{parent_col}
                WHERE p.{parent_col} IS NULL AND c.{child_col} IS NOT NULL
            """).fetchone()[0]
            ok = n_orphans == 0
            detail = f"{n_orphans} orphans" if not ok else ""
        elif test_type == "accepted_values":
            col, vals = arg.split(":")
            allowed = vals.split(",")
            placeholders = ",".join(f"'{v}'" for v in allowed)
            n_bad = conn.execute(
                f"SELECT COUNT(*) FROM {model} WHERE {col} NOT IN ({placeholders})"
            ).fetchone()[0]
            ok = n_bad == 0
            detail = f"{n_bad} unexpected values" if not ok else ""
        status = "PASS" if ok else "FAIL"
        log(f"  [{status}] {test_type:16s} {model}.{arg} {detail}")
        if ok: passed += 1
        else:  failed += 1
    except Exception as e:
        log(f"  [ERROR] {test_type} {model}.{arg}: {e}")
        failed += 1

log("-" * 64)
log(f"Tests: {passed} passed, {failed} failed")
conn.close()

LOG_FILE.write_text("\n".join(logs))
print(f"\nLog written to: {LOG_FILE}")
