# Part 1 — Database & Schema Setup

[← Back to README](../README.md)

---

## Overview

Eight tables built in dependency order — `wh_capacities` first because every other table foreign-keys into it. The schema separates entity data, bridge tables, and transactional data cleanly.

```
wh_capacities ──< order_lists >── freight_rates
      │                │
      ▼                ▼
  wh_costs      products_per_plant
      │
      ├──── plant_ports
      └──── vmi_customers
```

---

## Table: wh_capacities
**Core entity. Created first — all other tables FK into it.**
Each plant has exactly one daily capacity limit.

```sql
CREATE TABLE wh_capacities (
    plant_id       VARCHAR(20) PRIMARY KEY,
    daily_capacity INT NOT NULL CHECK (daily_capacity >= 0)
);
```

---

## Table: wh_costs
One cost-per-unit row per plant. FK ensures a warehouse cost can only exist for a valid plant.

```sql
CREATE TABLE wh_costs (
    wh            VARCHAR(20) PRIMARY KEY,
    cost_per_unit DECIMAL(12,6) NOT NULL CHECK (cost_per_unit >= 0),
    CONSTRAINT fk_wh_costs_capacity
        FOREIGN KEY (wh) REFERENCES wh_capacities(plant_id)
);
```

---

## Table: products_per_plant *(Bridge — Many-to-Many)*
A plant stores many products; a product can exist at many plants. Composite PK prevents duplicate plant-product pairs.

> **Real-world fix applied:** Orphan entry `CND9` found in source data with no matching `wh_capacities` record. Detected via `NOT IN` subquery and removed before FK was applied.

```sql
CREATE TABLE products_per_plant (
    plant_code VARCHAR(20) NOT NULL,
    product_id INT          NOT NULL,
    PRIMARY KEY (plant_code, product_id),
    CONSTRAINT fk_ppp_plant
        FOREIGN KEY (plant_code) REFERENCES wh_capacities(plant_id)
);
```

---

## Table: plant_ports *(Bridge — Many-to-Many)*
One plant can ship via multiple ports; a port may serve multiple plants.

```sql
CREATE TABLE plant_ports (
    plant_code VARCHAR(20) NOT NULL,
    port       VARCHAR(50) NOT NULL,
    PRIMARY KEY (plant_code, port),
    CONSTRAINT fk_plant_ports
        FOREIGN KEY (plant_code) REFERENCES wh_capacities(plant_id)
);
```

---

## Table: vmi_customers *(Bridge — Many-to-Many)*
VMI (Vendor Managed Inventory) constraints: some plants are only authorised to serve specific customers. Violations of this rule are detected in Part 9 (Q32).

```sql
CREATE TABLE vmi_customers (
    plant_code VARCHAR(20) NOT NULL,
    customers  VARCHAR(50) NOT NULL,
    PRIMARY KEY (plant_code, customers),
    CONSTRAINT fk_vmi_plant
        FOREIGN KEY (plant_code) REFERENCES wh_capacities(plant_id)
);
```

---

## Table: ports *(Derived Reference Table)*
Built by UNIONing all port columns across all tables. Enforces referential integrity for freight_rates origin and destination without requiring a pre-existing port master in the source data.

```sql
CREATE TABLE ports (
    port_code VARCHAR(20) PRIMARY KEY
);

INSERT INTO ports (port_code)
SELECT DISTINCT origin_port      FROM order_lists   UNION
SELECT DISTINCT destination_port FROM order_lists   UNION
SELECT DISTINCT orig_port_cd     FROM freight_rates UNION
SELECT DISTINCT dest_port_cd     FROM freight_rates UNION
SELECT DISTINCT port             FROM plant_ports;
```

---

## Table: freight_rates
**Design decision — surrogate PK:** Multiple transit-time options can exist per carrier + lane + weight band. A composite PK on those columns would have excluded valid pricing tiers. A surrogate `freight_id` (auto-increment) uniquely identifies each rate option instead.

```sql
CREATE TABLE freight_rates (
    carrier       VARCHAR(20),
    orig_port_cd  VARCHAR(20),
    dest_port_cd  VARCHAR(20),
    minm_wgh_qty  DECIMAL(12,2),
    max_wgh_qty   DECIMAL(12,2),
    svc_cd        VARCHAR(20),
    minimum_cost  DECIMAL(12,4) CHECK (minimum_cost >= 0),
    rate          DECIMAL(12,4) CHECK (rate >= 0),
    mode_dsc      VARCHAR(20),
    tpt_day_cnt   INT           CHECK (tpt_day_cnt >= 0),
    carrier_type  VARCHAR(30),
    freight_id    INT AUTO_INCREMENT PRIMARY KEY,
    CHECK (minm_wgh_qty < max_wgh_qty),
    CONSTRAINT fk_freight_orig
        FOREIGN KEY (orig_port_cd) REFERENCES ports(port_code),
    CONSTRAINT fk_freight_dest
        FOREIGN KEY (dest_port_cd) REFERENCES ports(port_code)
);
```

---

## Table: order_lists *(Core Transactional Table)*
Loaded last because it FKs to `wh_capacities` and `plant_ports`. The `data_issue_flag` column is added post-load — **flagging anomalies instead of deleting them** keeps the base table intact for audit purposes. All analytical queries filter `WHERE data_issue_flag IS NULL`.

```sql
CREATE TABLE order_lists (
    order_id             VARCHAR(50)  NOT NULL PRIMARY KEY,
    order_date           DATE,
    origin_port          VARCHAR(20)  NOT NULL,
    carrier              VARCHAR(20),
    tpt                  INT          CHECK (tpt >= 0),
    service_level        VARCHAR(20),
    ship_ahead_day_count INT          DEFAULT 0,
    ship_late_day_count  INT          DEFAULT 0,
    customer             VARCHAR(30)  NOT NULL,
    product_id           INT          NOT NULL,
    plant_code           VARCHAR(20)  NOT NULL,
    destination_port     VARCHAR(20)  NOT NULL,
    unit_quantity        INT          CHECK (unit_quantity > 0),
    weight               DECIMAL(12,8),
    data_issue_flag      VARCHAR(50),
    CONSTRAINT fk_order_plant
        FOREIGN KEY (plant_code) REFERENCES wh_capacities(plant_id),
    CONSTRAINT fk_order_product_plant
        FOREIGN KEY (plant_code, product_id)
        REFERENCES products_per_plant(plant_code, product_id)
);
```

---

[← Back to README](../README.md) | [Next: Data Loading & Cleaning →](02_data_loading_cleaning.md)
