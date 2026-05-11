"""
STEP 2: AIRBYTE EXTRACTION (EL of ELT)
Simulates Airbyte's source connector + warehouse destination connector.

In Airbyte:
- Source connector reads from the bank's OLTP DB (full refresh or CDC)
- Each record becomes an AirbyteRecordMessage with metadata
- Destination writes to warehouse with standard columns:
    _airbyte_raw_id, _airbyte_extracted_at, _airbyte_meta, _airbyte_data
  Then normalization expands _airbyte_data into typed columns.
"""
import sqlite3
import json
import uuid
from datetime import datetime
from pathlib import Path

ROOT = Path(__file__).parent.parent.parent
SOURCE_DB = ROOT / "src" / "01_source" / "fintech_source.db"
WAREHOUSE_DB = ROOT / "src" / "03_warehouse" / "warehouse.db"
LOG_FILE = ROOT / "logs" / "airbyte_sync.log"

WAREHOUSE_DB.parent.mkdir(exist_ok=True)
LOG_FILE.parent.mkdir(exist_ok=True)

STREAMS = ["customers", "accounts", "transactions", "loans", "fraud_alerts"]

src = sqlite3.connect(SOURCE_DB)
src.row_factory = sqlite3.Row
wh = sqlite3.connect(WAREHOUSE_DB)

log_lines = []
def log(msg):
    line = f"[{datetime.now().isoformat(timespec='seconds')}] {msg}"
    log_lines.append(line); print(line)

log("Airbyte sync started: bank_oltp_postgres -> warehouse")
log("Connection: bank_oltp_postgres -> snowflake_warehouse (simulated)")
log("Sync mode: full_refresh | overwrite")
log("-" * 64)

extracted_at = datetime.now().isoformat()
total_records = 0

for stream in STREAMS:
    log(f"Stream '{stream}': starting extraction...")
    raw_table = f"_airbyte_raw_{stream}"
    wh.execute(f"DROP TABLE IF EXISTS {raw_table}")
    wh.execute(f"""
        CREATE TABLE {raw_table} (
            _airbyte_raw_id TEXT PRIMARY KEY,
            _airbyte_extracted_at TEXT,
            _airbyte_meta TEXT,
            _airbyte_data TEXT
        )
    """)

    rows = src.execute(f"SELECT * FROM {stream}").fetchall()
    records = []
    for row in rows:
        record_data = {k: row[k] for k in row.keys()}
        records.append((
            str(uuid.uuid4()),
            extracted_at,
            json.dumps({"sync_id": 2042, "stream": stream}),
            json.dumps(record_data),
        ))
    wh.executemany(f"INSERT INTO {raw_table} VALUES (?,?,?,?)", records)
    log(f"Stream '{stream}': extracted {len(records):>6,} records into {raw_table}")
    total_records += len(records)

wh.commit()
log("-" * 64)
log(f"Raw extraction complete: {total_records:,} total records")

# --- Normalization step ---
log("Starting Airbyte normalization (raw JSON -> typed columns)...")

schemas = {
    "customers": [
        ("customer_id", "INTEGER"), ("email", "TEXT"), ("first_name", "TEXT"),
        ("last_name", "TEXT"), ("country", "TEXT"), ("date_of_birth", "TEXT"),
        ("kyc_status", "TEXT"), ("risk_score", "INTEGER"),
        ("signup_date", "TEXT"), ("_updated_at", "TEXT"),
    ],
    "accounts": [
        ("account_id", "INTEGER"), ("customer_id", "INTEGER"),
        ("account_type", "TEXT"), ("currency", "TEXT"), ("balance", "REAL"),
        ("status", "TEXT"), ("opened_date", "TEXT"), ("_updated_at", "TEXT"),
    ],
    "transactions": [
        ("transaction_id", "INTEGER"), ("account_id", "INTEGER"),
        ("txn_date", "TEXT"), ("txn_type", "TEXT"), ("channel", "TEXT"),
        ("merchant_category", "TEXT"), ("amount", "REAL"),
        ("currency", "TEXT"), ("status", "TEXT"),
        ("is_international", "INTEGER"), ("_updated_at", "TEXT"),
    ],
    "loans": [
        ("loan_id", "INTEGER"), ("customer_id", "INTEGER"),
        ("loan_type", "TEXT"), ("principal", "REAL"),
        ("interest_rate", "REAL"), ("term_months", "INTEGER"),
        ("origination_date", "TEXT"), ("status", "TEXT"),
        ("outstanding_balance", "REAL"), ("_updated_at", "TEXT"),
    ],
    "fraud_alerts": [
        ("alert_id", "INTEGER"), ("transaction_id", "INTEGER"),
        ("alert_type", "TEXT"), ("severity", "TEXT"),
        ("flagged_at", "TEXT"), ("resolution", "TEXT"),
        ("_updated_at", "TEXT"),
    ],
}

for stream, cols in schemas.items():
    norm_table = f"airbyte_raw_{stream}"
    cols_def = ", ".join([f"{c[0]} {c[1]}" for c in cols])
    cols_def += ", _airbyte_extracted_at TEXT, _airbyte_raw_id TEXT"
    wh.execute(f"DROP TABLE IF EXISTS {norm_table}")
    wh.execute(f"CREATE TABLE {norm_table} ({cols_def})")

    raw_rows = wh.execute(
        f"SELECT _airbyte_raw_id, _airbyte_extracted_at, _airbyte_data FROM _airbyte_raw_{stream}"
    ).fetchall()

    typed_rows = []
    for raw_id, ext_at, data_json in raw_rows:
        d = json.loads(data_json)
        row_vals = [d.get(c[0]) for c in cols] + [ext_at, raw_id]
        typed_rows.append(row_vals)

    placeholders = ",".join(["?"] * (len(cols) + 2))
    col_names = ",".join([c[0] for c in cols] + ["_airbyte_extracted_at", "_airbyte_raw_id"])
    wh.executemany(
        f"INSERT INTO {norm_table} ({col_names}) VALUES ({placeholders})", typed_rows
    )
    log(f"Normalized stream '{stream}': {len(typed_rows):>6,} rows -> {norm_table}")

wh.commit()
src.close()
wh.close()

log("-" * 64)
log("Airbyte sync completed successfully")
log(f"Warehouse DB: {WAREHOUSE_DB}")

LOG_FILE.write_text("\n".join(log_lines))
print(f"\nLog written to: {LOG_FILE}")
