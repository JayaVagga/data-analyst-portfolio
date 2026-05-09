"""
STEP 1: SOURCE SYSTEM
Simulates a Postgres OLTP database for an e-commerce application.
In production: this would be your live application database (Postgres, MySQL, MongoDB, etc.)
"""
import sqlite3
import random
from datetime import datetime, timedelta
from pathlib import Path

random.seed(42)
DB_PATH = Path(__file__).parent / "ecommerce_source.db"

if DB_PATH.exists():
    DB_PATH.unlink()

conn = sqlite3.connect(DB_PATH)
cur = conn.cursor()

# Schema mimics a typical e-commerce Postgres DB
cur.executescript("""
CREATE TABLE customers (
    customer_id INTEGER PRIMARY KEY,
    email TEXT NOT NULL,
    first_name TEXT,
    last_name TEXT,
    country TEXT,
    signup_date TEXT,
    _updated_at TEXT
);

CREATE TABLE products (
    product_id INTEGER PRIMARY KEY,
    product_name TEXT,
    category TEXT,
    price REAL,
    cost REAL,
    _updated_at TEXT
);

CREATE TABLE orders (
    order_id INTEGER PRIMARY KEY,
    customer_id INTEGER,
    order_date TEXT,
    status TEXT,
    _updated_at TEXT,
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
);

CREATE TABLE order_items (
    order_item_id INTEGER PRIMARY KEY,
    order_id INTEGER,
    product_id INTEGER,
    quantity INTEGER,
    unit_price REAL,
    _updated_at TEXT,
    FOREIGN KEY (order_id) REFERENCES orders(order_id),
    FOREIGN KEY (product_id) REFERENCES products(product_id)
);
""")

# Seed data
countries = ["US", "UK", "DE", "FR", "IN", "JP", "CA", "AU", "BR", "MX"]
first_names = ["Alex", "Priya", "Yuki", "Carlos", "Anna", "Liam", "Sofia", "Raj", "Emma", "Hiro", "Mia", "Noah", "Aisha", "Diego", "Chloe"]
last_names = ["Smith", "Patel", "Tanaka", "Garcia", "Schmidt", "Kim", "Silva", "Khan", "Rossi", "Dubois"]
categories = ["Electronics", "Apparel", "Home & Kitchen", "Books", "Sports", "Beauty"]
products_seed = [
    ("Wireless Headphones", "Electronics", 89.99, 35.0),
    ("4K Monitor 27\"", "Electronics", 349.00, 180.0),
    ("Mechanical Keyboard", "Electronics", 129.00, 45.0),
    ("Running Shoes", "Sports", 110.00, 40.0),
    ("Yoga Mat", "Sports", 35.00, 8.0),
    ("Cotton T-Shirt", "Apparel", 24.99, 6.0),
    ("Denim Jeans", "Apparel", 65.00, 18.0),
    ("Coffee Maker", "Home & Kitchen", 79.99, 28.0),
    ("Cast Iron Skillet", "Home & Kitchen", 45.00, 15.0),
    ("Novel - The Migration", "Books", 18.99, 4.0),
    ("Cookbook - Modern Indian", "Books", 32.00, 9.0),
    ("Face Serum", "Beauty", 42.00, 11.0),
    ("Lipstick Set", "Beauty", 28.00, 7.0),
    ("Smartwatch", "Electronics", 219.00, 90.0),
    ("Hoodie", "Apparel", 49.99, 14.0),
]

now = datetime(2026, 5, 9)

# Insert customers
for cid in range(1, 251):
    signup = now - timedelta(days=random.randint(1, 720))
    cur.execute(
        "INSERT INTO customers VALUES (?,?,?,?,?,?,?)",
        (cid, f"user{cid}@example.com", random.choice(first_names),
         random.choice(last_names), random.choice(countries),
         signup.isoformat(), signup.isoformat())
    )

# Insert products
for pid, (name, cat, price, cost) in enumerate(products_seed, start=1):
    cur.execute("INSERT INTO products VALUES (?,?,?,?,?,?)",
                (pid, name, cat, price, cost, (now - timedelta(days=300)).isoformat()))

# Insert orders + items
order_id = 1
order_item_id = 1
for _ in range(1500):
    cid = random.randint(1, 250)
    odate = now - timedelta(days=random.randint(0, 365), hours=random.randint(0, 23))
    status = random.choices(["completed", "pending", "cancelled", "refunded"],
                            weights=[80, 8, 7, 5])[0]
    cur.execute("INSERT INTO orders VALUES (?,?,?,?,?)",
                (order_id, cid, odate.isoformat(), status, odate.isoformat()))
    n_items = random.choices([1, 2, 3, 4], weights=[50, 30, 15, 5])[0]
    chosen = random.sample(range(1, len(products_seed) + 1), n_items)
    for pid in chosen:
        qty = random.choices([1, 2, 3], weights=[70, 25, 5])[0]
        price = products_seed[pid - 1][2]
        cur.execute("INSERT INTO order_items VALUES (?,?,?,?,?,?)",
                    (order_item_id, order_id, pid, qty, price, odate.isoformat()))
        order_item_id += 1
    order_id += 1

conn.commit()

# Verify
print("=" * 60)
print("SOURCE SYSTEM: ecommerce_source.db (simulating Postgres OLTP)")
print("=" * 60)
for table in ["customers", "products", "orders", "order_items"]:
    n = cur.execute(f"SELECT COUNT(*) FROM {table}").fetchone()[0]
    print(f"  {table:15s} -> {n:,} rows")
conn.close()
print(f"\nSource DB created at: {DB_PATH}")
