"""
STEP 1: SOURCE SYSTEM (Fintech)
Simulates a digital bank's core OLTP database - the kind of Postgres/MySQL
DB that sits behind a neobank or payments platform.

Schema covers the standard fintech entities:
- customers       : user identity + KYC status
- accounts        : checking / savings / credit accounts
- transactions    : debits, credits, transfers, payments
- loans           : personal loans with repayment status
- fraud_alerts    : flagged transactions from the fraud engine
"""
import sqlite3
import random
from datetime import datetime, timedelta
from pathlib import Path

random.seed(42)
DB_PATH = Path(__file__).parent / "fintech_source.db"

if DB_PATH.exists():
    DB_PATH.unlink()

conn = sqlite3.connect(DB_PATH)
cur = conn.cursor()

cur.executescript("""
CREATE TABLE customers (
    customer_id INTEGER PRIMARY KEY,
    email TEXT NOT NULL,
    first_name TEXT,
    last_name TEXT,
    country TEXT,
    date_of_birth TEXT,
    kyc_status TEXT,           -- pending / verified / rejected
    risk_score INTEGER,        -- 0-100, higher = riskier
    signup_date TEXT,
    _updated_at TEXT
);

CREATE TABLE accounts (
    account_id INTEGER PRIMARY KEY,
    customer_id INTEGER,
    account_type TEXT,         -- checking / savings / credit
    currency TEXT,
    balance REAL,
    status TEXT,               -- active / frozen / closed
    opened_date TEXT,
    _updated_at TEXT,
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
);

CREATE TABLE transactions (
    transaction_id INTEGER PRIMARY KEY,
    account_id INTEGER,
    txn_date TEXT,
    txn_type TEXT,             -- deposit / withdrawal / transfer / payment / fee
    channel TEXT,              -- mobile / web / atm / card / wire
    merchant_category TEXT,    -- groceries / dining / travel / etc.
    amount REAL,
    currency TEXT,
    status TEXT,               -- completed / pending / failed / reversed
    is_international INTEGER,
    _updated_at TEXT,
    FOREIGN KEY (account_id) REFERENCES accounts(account_id)
);

CREATE TABLE loans (
    loan_id INTEGER PRIMARY KEY,
    customer_id INTEGER,
    loan_type TEXT,            -- personal / auto / mortgage
    principal REAL,
    interest_rate REAL,
    term_months INTEGER,
    origination_date TEXT,
    status TEXT,               -- active / paid_off / defaulted / charged_off
    outstanding_balance REAL,
    _updated_at TEXT,
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
);

CREATE TABLE fraud_alerts (
    alert_id INTEGER PRIMARY KEY,
    transaction_id INTEGER,
    alert_type TEXT,           -- velocity / location / amount / pattern
    severity TEXT,              -- low / medium / high / critical
    flagged_at TEXT,
    resolution TEXT,            -- false_positive / confirmed_fraud / pending
    _updated_at TEXT,
    FOREIGN KEY (transaction_id) REFERENCES transactions(transaction_id)
);
""")

# --- Reference data ---
countries = ["US", "UK", "DE", "FR", "IN", "JP", "CA", "AU", "BR", "MX", "SG", "NL"]
first_names = ["Alex", "Priya", "Yuki", "Carlos", "Anna", "Liam", "Sofia", "Raj",
               "Emma", "Hiro", "Mia", "Noah", "Aisha", "Diego", "Chloe", "Wei", "Zara", "Ahmed"]
last_names = ["Smith", "Patel", "Tanaka", "Garcia", "Schmidt", "Kim", "Silva",
              "Khan", "Rossi", "Dubois", "Chen", "Nguyen", "Hassan"]

merchant_categories = ["Groceries", "Dining", "Travel", "Entertainment",
                       "Fuel", "Healthcare", "Utilities", "Shopping",
                       "Subscription", "Education", "Insurance", "Rent"]

now = datetime(2026, 5, 9)

# --- Seed customers ---
for cid in range(1, 401):
    signup = now - timedelta(days=random.randint(30, 1095))
    dob = now - timedelta(days=random.randint(18 * 365, 70 * 365))
    kyc = random.choices(["verified", "pending", "rejected"], weights=[88, 8, 4])[0]
    # Risk score: most low-risk, fat-tail of high-risk
    risk = int(random.betavariate(2, 5) * 100)
    cur.execute(
        "INSERT INTO customers VALUES (?,?,?,?,?,?,?,?,?,?)",
        (cid, f"user{cid}@bank.example",
         random.choice(first_names), random.choice(last_names),
         random.choice(countries), dob.date().isoformat(),
         kyc, risk, signup.isoformat(), signup.isoformat())
    )

# --- Seed accounts (1-3 accounts per verified customer) ---
account_id = 1
account_owner = {}  # account_id -> customer_id
account_currency = {}
for cid in range(1, 401):
    kyc = cur.execute("SELECT kyc_status FROM customers WHERE customer_id=?", (cid,)).fetchone()[0]
    if kyc == "rejected":
        continue
    n_accounts = random.choices([1, 2, 3], weights=[55, 35, 10])[0]
    types_pool = ["checking", "savings", "credit"]
    chosen_types = random.sample(types_pool, min(n_accounts, len(types_pool)))
    country = cur.execute("SELECT country FROM customers WHERE customer_id=?", (cid,)).fetchone()[0]
    currency = {"US": "USD", "UK": "GBP", "DE": "EUR", "FR": "EUR", "NL": "EUR",
                "IN": "INR", "JP": "JPY", "CA": "CAD", "AU": "AUD",
                "BR": "BRL", "MX": "MXN", "SG": "SGD"}.get(country, "USD")
    opened = now - timedelta(days=random.randint(1, 700))
    for atype in chosen_types:
        if atype == "credit":
            balance = -round(random.uniform(0, 4500), 2)
        elif atype == "savings":
            balance = round(random.uniform(500, 50000), 2)
        else:
            balance = round(random.uniform(50, 12000), 2)
        status = random.choices(["active", "frozen", "closed"], weights=[94, 3, 3])[0]
        cur.execute(
            "INSERT INTO accounts VALUES (?,?,?,?,?,?,?,?)",
            (account_id, cid, atype, currency, balance, status,
             opened.isoformat(), opened.isoformat())
        )
        account_owner[account_id] = cid
        account_currency[account_id] = currency
        account_id += 1

# --- Seed transactions ---
txn_id = 1
fraud_txn_ids = []  # transactions that will get fraud alerts
active_accounts = [a for a, _ in account_owner.items()
                   if cur.execute("SELECT status FROM accounts WHERE account_id=?", (a,)).fetchone()[0] == "active"]

for _ in range(8000):
    aid = random.choice(active_accounts)
    tdate = now - timedelta(days=random.randint(0, 365),
                            hours=random.randint(0, 23),
                            minutes=random.randint(0, 59))
    ttype = random.choices(
        ["payment", "deposit", "withdrawal", "transfer", "fee"],
        weights=[55, 18, 12, 12, 3]
    )[0]
    channel = random.choices(
        ["mobile", "card", "web", "atm", "wire"],
        weights=[42, 35, 13, 7, 3]
    )[0]
    if ttype == "payment":
        amount = round(random.expovariate(1 / 75), 2)
    elif ttype == "deposit":
        amount = round(random.uniform(50, 5000), 2)
    elif ttype == "withdrawal":
        amount = round(random.uniform(20, 800), 2)
    elif ttype == "transfer":
        amount = round(random.uniform(50, 8000), 2)
    else:
        amount = round(random.uniform(0.50, 25), 2)

    mcat = random.choice(merchant_categories) if ttype == "payment" else None
    status = random.choices(
        ["completed", "pending", "failed", "reversed"],
        weights=[90, 5, 3, 2]
    )[0]
    is_intl = 1 if random.random() < 0.08 else 0
    currency = account_currency[aid]
    cur.execute(
        "INSERT INTO transactions VALUES (?,?,?,?,?,?,?,?,?,?,?)",
        (txn_id, aid, tdate.isoformat(), ttype, channel, mcat,
         amount, currency, status, is_intl, tdate.isoformat())
    )
    # Flag for fraud — small percentage, biased toward larger international amounts
    fraud_prob = 0.005 + (0.04 if is_intl else 0) + (0.02 if amount > 2000 else 0)
    if random.random() < fraud_prob:
        fraud_txn_ids.append((txn_id, tdate))
    txn_id += 1

# --- Seed fraud alerts ---
for alert_id, (tid, tdate) in enumerate(fraud_txn_ids, start=1):
    alert_type = random.choice(["velocity", "location", "amount", "pattern"])
    severity = random.choices(["low", "medium", "high", "critical"], weights=[35, 35, 22, 8])[0]
    resolution = random.choices(
        ["false_positive", "confirmed_fraud", "pending"],
        weights=[55, 20, 25]
    )[0]
    flagged = (datetime.fromisoformat(tdate.isoformat()) + timedelta(minutes=random.randint(1, 90)))
    cur.execute(
        "INSERT INTO fraud_alerts VALUES (?,?,?,?,?,?,?)",
        (alert_id, tid, alert_type, severity, flagged.isoformat(),
         resolution, flagged.isoformat())
    )

# --- Seed loans ---
loan_id = 1
verified_customers = [r[0] for r in cur.execute(
    "SELECT customer_id FROM customers WHERE kyc_status='verified'"
).fetchall()]
for cid in random.sample(verified_customers, k=180):
    loan_type = random.choices(["personal", "auto", "mortgage"], weights=[60, 30, 10])[0]
    if loan_type == "personal":
        principal = round(random.uniform(2000, 25000), 2); rate = round(random.uniform(0.07, 0.18), 4); term = random.choice([12, 24, 36, 48])
    elif loan_type == "auto":
        principal = round(random.uniform(8000, 45000), 2); rate = round(random.uniform(0.04, 0.10), 4); term = random.choice([36, 48, 60, 72])
    else:
        principal = round(random.uniform(120000, 600000), 2); rate = round(random.uniform(0.03, 0.07), 4); term = random.choice([180, 240, 360])
    orig = now - timedelta(days=random.randint(30, 1000))
    status = random.choices(["active", "paid_off", "defaulted", "charged_off"],
                            weights=[78, 14, 5, 3])[0]
    if status == "paid_off":
        outstanding = 0.0
    elif status in ("defaulted", "charged_off"):
        outstanding = round(principal * random.uniform(0.4, 0.95), 2)
    else:
        # active: roughly proportional to remaining term
        outstanding = round(principal * random.uniform(0.2, 0.95), 2)
    cur.execute(
        "INSERT INTO loans VALUES (?,?,?,?,?,?,?,?,?,?)",
        (loan_id, cid, loan_type, principal, rate, term,
         orig.isoformat(), status, outstanding, orig.isoformat())
    )
    loan_id += 1

conn.commit()

print("=" * 64)
print("SOURCE SYSTEM: fintech_source.db (simulating digital bank OLTP)")
print("=" * 64)
for table in ["customers", "accounts", "transactions", "loans", "fraud_alerts"]:
    n = cur.execute(f"SELECT COUNT(*) FROM {table}").fetchone()[0]
    print(f"  {table:18s} -> {n:>6,} rows")
conn.close()
print(f"\nSource DB created at: {DB_PATH}")
