# Supply Chain Logistics Optimization — SQL Project

[![MySQL](https://img.shields.io/badge/MySQL-8.x-4479A1?style=flat&logo=mysql&logoColor=white)](https://www.mysql.com/)
[![SQL](https://img.shields.io/badge/Language-SQL-orange?style=flat)](https://en.wikipedia.org/wiki/SQL)
[![Dataset](https://img.shields.io/badge/Dataset-Kaggle-20BEFF?style=flat&logo=kaggle)](https://www.kaggle.com/datasets/anisseezzebdi/supply-chain-logistics-problem)
[![Queries](https://img.shields.io/badge/Queries-50-brightgreen?style=flat)]()
[![Status](https://img.shields.io/badge/Status-Complete-success?style=flat)]()

---

## The Business Question

> **Are we using the lowest-cost freight routes available — and if not, exactly how much are we leaving on the table?**

This project analyses 15,398 logistics orders across 6 plants, 2 carriers, and 1 destination port using pure SQL — from schema design through data cleaning, validation, cost modelling, and a route optimization simulation.

**The answer: $58,062.17 in avoidable freight spend. And 95.3% of it traces back to a single plant with 34 orders.**

---

## Key Results

| Metric | Result |
|---|---|
| Total orders analysed | **15,398** |
| Total historical network cost | **$25,968,428.98** |
| Total potential savings | **$58,062.17 (0.22%)** |
| Orders currently overpaying | **6,368 (41.36%)** |
| Plant driving 95% of all savings | **PLANT16 — $55,312.61 (69.24% of its own spend)** |
| Most expensive plant vs network avg | **PLANT09 — $8,674/order vs $2,174 avg (4× higher)** |
| Best carrier for heavy orders | **V444_1 at $0.098/kg** |
| Savings switching all heavy orders to V444_1 | **$55,595.47 (83.17% reduction)** |
| Speed premium for ≤3-day delivery | **$1,492.96 (0.01%) — essentially free** |
| Destination port concentration | **PORT09 handles 100% of all shipments — single point of failure** |

---

## 🔗 Analysis — Click Any Section to See the Queries

| Part | Section | What It Covers |
|---|---|---|
| 1 | [Schema Setup](01_schema_setup.md) | 8 tables, PKs, FKs, constraints, design decisions |
| 2 | [Data Loading & Cleaning](02_data_loading_cleaning.md) | Staging pattern, date conversion, numeric cleaning, flagging |
| 3 | [Exploratory Data Analysis](03_exploratory_analysis.md) | Q1–Q5: totals, date range, carriers, service levels |
| 4 | [Data Validation](04_data_validation.md) | Q6–Q10: invalid weights, unmapped products, unroutable orders |
| 5 | [Aggregations](05_aggregations.md) | Q11–Q15: orders by plant, customer, carrier, service level |
| 6 | [Joins & Route Matching](06_joins_route_matching.md) | Q16–Q20: 5-condition freight JOIN, unroutable orders, lane match rates |
| 7 | [Window Functions & Rankings](07_window_functions.md) | Q21–Q25: RANK, running totals, cost spread analysis |
| 8 | [Cost Calculations](08_cost_calculations.md) | Q26–Q30: GREATEST() cost formula, plant rankings, freight vs warehouse split |
| 9 | [Constraint & Compliance Checks](09_constraint_checks.md) | Q31–Q35: capacity violations, VMI violations, weight band checks |
| 10 | [Optimization Simulation](10_optimization_simulation.md) | Q36–Q40: relaxed-carrier JOIN, cheapest route selection, $58K savings |
| 11 | [Time Series & Trend Analytics](11_time_series.md) | Q41–Q45: monthly trends, 3-month moving avg, seasonality, weight bands |
| 12 | [Strategic Business Insights](12_strategic_insights.md) | Q46–Q50: plant cost ranking, carrier efficiency, port risk, speed premium |

> Each section page shows the question, the full SQL, and the reasoning behind every design choice.

---

## How the Optimization Works

The entire savings simulation rests on one idea — **relaxing the carrier constraint in the JOIN**:

```sql
-- Historical JOIN (matches only the carrier the order used)
ON o.carrier = f.carrier AND o.origin_port = f.orig_port_cd ...

-- Optimization JOIN (matches ALL carriers on that route)
ON o.origin_port = f.orig_port_cd AND o.destination_port = f.dest_port_cd ...
```

The second JOIN returns every available option. `RANK() OVER (PARTITION BY order_id ORDER BY total_cost ASC) = 1` picks the cheapest. Comparing that to the historical cost gives the savings — per order, per plant, and network-wide.

---

## SQL Techniques Used

| Technique | Applied In |
|---|---|
| Multi-condition JOIN (5 conditions) | Q10, Q16–Q20, Q26–Q50 |
| Staging table pattern for unreliable imports | Part 2 |
| `STR_TO_DATE` + `ALTER MODIFY` for date conversion | Part 2 |
| `REGEXP_REPLACE` for numeric field cleaning | Part 2 |
| `GREATEST()` for minimum-charge freight logic | Q21–Q50 |
| `RANK() OVER (PARTITION BY … ORDER BY …)` | Q21, Q22, Q23, Q27, Q28, Q37, Q40 |
| `SUM() OVER (ROWS BETWEEN UNBOUNDED PRECEDING …)` | Q24, Q41 |
| `AVG() OVER (ROWS BETWEEN 2 PRECEDING AND CURRENT ROW)` | Q43 |
| CTE chaining (3–4 levels deep) | Q37, Q38, Q39, Q40, Q47 |
| `NOT EXISTS` for compliance checks | Q32 |
| `CASE WHEN` inside `COUNT()` / `SUM()` | Q20, Q39 |
| `ROW_NUMBER()` for percentile calculation | Q47 |
| `NULLIF()` for safe division | Q47 |
| `CROSS JOIN` for scalar broadcast | Q46 |
| `data_issue_flag` pattern (flag vs delete) | Part 2, all analytical queries |
| Composite PKs on bridge tables | Schema |
| Surrogate PK reasoning (freight_rates) | Schema |

---

## Project Structure

```
supply-chain-sql-project/
│
├── README.md                              <- This page
├── supply_chain_analysis.sql              <- Full SQL file (50 queries)
│
├──                            <- One page per section
│   ├── 01_schema_setup.md
│   ├── 02_data_loading_cleaning.md
│   ├── 03_exploratory_analysis.md
│   ├── 04_data_validation.md
│   ├── 05_aggregations.md
│   ├── 06_joins_route_matching.md
│   ├── 07_window_functions.md
│   ├── 08_cost_calculations.md
│   ├── 09_constraint_checks.md
│   ├── 10_optimization_simulation.md
│   ├── 11_time_series.md
│   └── 12_strategic_insights.md
│
└── data/
    ├── order_lists.csv
    ├── freight_rates.csv
    ├── wh_costs.csv
    ├── wh_capacities.csv
    ├── products_per_plant.csv
    ├── plant_ports.csv
    └── vmi_customers.csv
```

---

## How to Run

```sql
CREATE DATABASE supply_chain;
USE supply_chain;
SET GLOBAL local_infile = 1;
SOURCE supply_chain_analysis.sql;
```

Update the `LOAD DATA LOCAL INFILE` paths in Part 2 to match your local directory.

---

## Conclusion

The most important thing this project demonstrates is not the total savings figure — it is the **precision**. SQL analysis identified that 95.3% of a $58,062 network-wide inefficiency is caused by 34 orders at one plant. The fix is a carrier assignment correction, not a contract renegotiation.

---

*Dataset: [Kaggle — Supply Chain Logistics Problem](https://www.kaggle.com/datasets/anisseezzebdi/supply-chain-logistics-problem)*
