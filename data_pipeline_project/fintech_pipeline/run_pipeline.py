"""
ORCHESTRATOR (the Airflow / Dagster / Prefect role)
Runs the full fintech pipeline end-to-end:
  Source -> Airbyte -> Warehouse -> dbt -> Export
"""
import subprocess
import sys
import time
from pathlib import Path

ROOT = Path(__file__).parent / "src"

STAGES = [
    ("1. Source seed",        ROOT / "01_source"          / "setup_source_db.py"),
    ("2. Airbyte extract",    ROOT / "02_airbyte_extract" / "airbyte_sync.py"),
    ("3. dbt transform+test", ROOT / "04_dbt"             / "run_dbt.py"),
    ("4. Export to BI",       ROOT / "05_analytics"       / "export_for_bi.py"),
]

print("\n" + "#" * 72)
print("# FINTECH DATA PIPELINE")
print("# Source -> Airbyte -> Warehouse -> dbt -> Analytics -> BI")
print("#" * 72)

t0 = time.time()
for name, script in STAGES:
    print(f"\n>>> Stage: {name}")
    print(f"    Script: {script}")
    print("-" * 72)
    rc = subprocess.run([sys.executable, str(script)]).returncode
    if rc != 0:
        print(f"\n!!! Stage failed: {name}")
        sys.exit(1)
    print(f">>> {name}: OK")

elapsed = time.time() - t0
print("\n" + "#" * 72)
print(f"# PIPELINE COMPLETED in {elapsed:.2f}s")
print("#" * 72)
