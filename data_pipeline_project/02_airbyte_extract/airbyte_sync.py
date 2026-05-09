"""
STEP 2: AIRBYTE EXTRACTION (EL of ELT)
Simulates Airbyte's Postgres source connector + warehouse destination connector.

Real Airbyte:
- Source connector reads from the OLTP DB (full refresh or incremental CDC)
- Each record is wrapped in an AirbyteRecordMessage with metadata
- Destination connector writes to the warehouse with these standard columns:
    _airbyte_raw_id, _airbyte_extracted_at, _airbyte_meta, _airbyte_data
  Then a normalization step expands _airbyte_data into typed columns.

Here we replicate that contract end-to-end.
"""
import sqlite3
import json
import uuid
from datetime import datetime
from pathlib import Path

SOURCE_DB = Path(__file__).parent.parent / "01_source" / "ecommerce_source.db"
WAREHOUSE_DB = Path(__file__).parent.parent / "03_warehouse" / "warehouse.db"
LOG_FILE = Path(__file__).parent.parent / "logs" / "airbyte_sync.log"

WAREHOUSE_DB.parent.mkdir(exist_ok=True)
LOG_FILE.parent.mkdir(exist_ok=True)

# Tables to sync — in Airbyte these are configured per stream
STREAMS = ["customers", "products", "orders", "order_items"]

src = sqlite3.connect(SOURCE_DB)
src.row_factory = sqlite3.Row
wh = sqlite3.connect(WAREHOUSE_DB)

log_lines = []
def log(msg):
    line = f"[{datetime.now().isoformat(timespec='seconds')}] {msg}"
    log_lines.append(line)
    print(line)

log("Airbyte sync started: ecommerce_postgres -> warehouse")
log("Connection: ecommerce_postgres -> snowflake_warehouse (simulated)")
log("Sync mode: full_refresh | overwrite")
log("-" * 60)

extracted_at = datetime.now().isoformat()
total_records = 0

for stream in STREAMS:
    log(f"Stream '{stream}': starting extraction...")

    # 1. Drop and recreate raw landing table (Airbyte raw schema)
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

    # 2. Read from source and emit Airbyte record messages
    rows = src.execute(f"SELECT * FROM {stream}").fetchall()
    records = []
    for row in rows:
        record_data = {k: row[k] for k in row.keys()}
        records.append((
            str(uuid.uuid4()),
            extracted_at,
            json.dumps({"sync_id": 1001, "stream": stream}),
            json.dumps(record_data),
        ))

    wh.executemany(
        f"INSERT INTO {raw_table} VALUES (?,?,?,?)", records
    )
    log(f"Stream '{stream}': extracted {len(records):,} records into {raw_table}")
    total_records += len(records)

wh.commit()
log("-" * 60)
log(f"Raw extraction complete: {total_records:,} total records")

# 3. Airbyte normalization step: parse _airbyte_data JSON into typed columns
log("Starting Airbyte normalization (raw JSON -> typed columns)...")

schemas = {
    "customers": [
        ("customer_id", "INTEGER"), ("email", "TEXT"), ("first_name", "TEXT"),
        ("last_name", "TEXT"), ("country", "TEXT"),
        ("signup_date", "TEXT"), ("_updated_at", "TEXT"),
    ],
    "products": [
        ("product_id", "INTEGER"), ("product_name", "TEXT"), ("category", "TEXT"),
        ("price", "REAL"), ("cost", "REAL"), ("_updated_at", "TEXT"),
    ],
    "orders": [
        ("order_id", "INTEGER"), ("customer_id", "INTEGER"), ("order_date", "TEXT"),
        ("status", "TEXT"), ("_updated_at", "TEXT"),
    ],
    "order_items": [
        ("order_item_id", "INTEGER"), ("order_id", "INTEGER"),
        ("product_id", "INTEGER"), ("quantity", "INTEGER"),
        ("unit_price", "REAL"), ("_updated_at", "TEXT"),
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
    log(f"Normalized stream '{stream}': {len(typed_rows):,} rows -> {norm_table}")

wh.commit()
src.close()
wh.close()

log("-" * 60)
log("Airbyte sync completed successfully")
log(f"Warehouse DB: {WAREHOUSE_DB}")

LOG_FILE.write_text("\n".join(log_lines))
print(f"\nLog written to: {LOG_FILE}")
