# PMFBY Farmers Insurance Coverage Analysis — SQL Project

[![MySQL](https://img.shields.io/badge/MySQL-8.x-4479A1?style=flat&logo=mysql&logoColor=white)](https://www.mysql.com/)
[![SQL](https://img.shields.io/badge/Language-SQL-orange?style=flat)](https://en.wikipedia.org/wiki/SQL)
[![Dataset](https://img.shields.io/badge/Source-NDAP%20India-blue?style=flat)](https://ndap.niti.gov.in)
[![Queries](https://img.shields.io/badge/Queries-26-brightgreen?style=flat)]()
[![Status](https://img.shields.io/badge/Status-Complete-success?style=flat)]()

---

## The Policy Question

> **Is India's flagship crop insurance scheme (PMFBY) reaching the farmers who need it most — and who is actually paying for it?**

This project analyses district-level PMFBY data across Indian states to measure insurance penetration, map the farmer vs government premium split, and identify where the scheme is succeeding and where coverage gaps remain.

---

## About PMFBY

**Pradhan Mantri Fasal Bima Yojana (PMFBY)** is the Government of India's national crop insurance programme, providing financial protection to farmers against crop losses due to natural calamities, pests, and diseases. The scheme is jointly funded by three parties:

| Who Pays | What They Contribute |
|---|---|
| Farmer | Fixed premium (2% Kharif / 1.5% Rabi / 5% commercial) |
| State Government | Subsidises remaining premium |
| Central Government | Co-funds with the state |

This cost-sharing structure makes the data analytically rich — it holds a story about subsidy dependence, outreach effectiveness, and regional equity that SQL can surface precisely.

---

## Dataset

**Source:** [National Data and Analytics Platform (NDAP)](https://ndap.niti.gov.in)  
**Coverage:** District-level data across Indian states, multiple years  
**Volume:** ~1,800+ district-year records

### Key Columns and Units

| Column | Stored Unit | Real-World Equivalent |
|---|---|---|
| `FarmersPremiumAmount` | Lakhs INR | ÷ 100 = crores |
| `StatePremiumAmount` | Lakhs INR | ÷ 100 = crores |
| `GOVPremiumAmount` | Lakhs INR | ÷ 100 = crores |
| `GrossPremiumAmountToBePaid` | Lakhs INR | ÷ 100 = crores |
| `SumInsured` | Lakhs INR | ÷ 100 = crores |
| `InsuredLandArea` | Thousand Hectares | × 1,000 = hectares |
| `TotalFarmersCovered` | Count | — |
| `PercentageMaleFarmersCovered` | % | — |
| `PercentageMarginalFarmers` | % | Farmers with < 1 ha land |

> All monetary values are stored in **lakhs** (₹1,00,000). Every query in this project labels units explicitly and documents thresholds in crore equivalents.

---

## 🔗 Analysis — Click Any Section to See the Questions & Queries

| # | Section | What It Covers |
|---|---|---|
| 2 | [SELECT Queries](02_select_queries.md) | Geographic scope, state-level coverage totals |
| 3 | [Filtering Data — WHERE](03_filtering_where.md) | Year filters, rural population targets, subsidy structure |
| 4 | [Aggregation — GROUP BY](04_aggregation_groupby.md) | Land area trends, active districts, premium breakdown by state |
| 5 | [Sorting — ORDER BY](05_sorting_orderby.md) | Population rankings, coverage rates, penetration metrics |
| 6 | [String Functions](06_string_functions.md) | State abbreviations, district name pattern matching |
| 7 | [Joins](07_joins.md) | Active district filtering (INNER JOIN), peak premium context, population + insurance combined (LEFT JOIN) |
| 8 | [Subqueries](08_subqueries.md) | National average comparison, benchmark filtering, 3-level nested subquery |
| 9 | [Data Integrity — Constraints & FKs](09_data_integrity.md) | Normalised reference tables, FK with referential actions |
| 10 | [UPDATE and DELETE](10_update_delete.md) | DML with before/after verification pattern |

> Each section page shows the question, the full SQL query, and the business reasoning behind every design decision.

---

## Key Fixes From Original Starter File

Two queries were completely blank in the original. Several others had silent bugs or missed the analytical insight the question was asking for.

| Query | Issue | Fix |
|---|---|---|
| Q4 | `UPPER(col) = 'Himachal Pradesh'` — case mismatch, returns 0 rows | `UPPER(TRIM(col)) = 'HIMACHAL PRADESH'` |
| Q6 | Only returned farmer count and gross premium | Added full 3-way premium split + `farmer_pct_of_gross` |
| Q9 | No scale check before applying threshold | Added Step 1 diagnostic; threshold documented as ₹5,000 crore |
| Q10 | Raw population ranking only | Added `coverage_rate_pct` |
| Q11 | No value metric | Added `insured_to_premium_ratio` |
| **Q16** | **Blank — no answer written** | Full INNER JOIN on aggregated subquery with HAVING |
| Q17 | Group MAX only, no peak year context | Joined back to base table for actual peak record + ratio |
| **Q18** | **Blank — no answer written** | Full LEFT JOIN with `avg_premium_per_farmer_inr` |
| Q22–Q23 | FK with no referential action clauses | Added `ON DELETE RESTRICT ON UPDATE CASCADE` |
| Q24–Q26 | No before/after verification | SELECT before → execute → SELECT after throughout |

---

## SQL Techniques Used

| Technique | Where Applied |
|---|---|
| `UPPER(TRIM())` for case-safe matching | Q4, Q25 |
| `NULLIF()` for safe division | Q6, Q10, Q11, Q12, Q18 |
| `ROUND()` with explicit precision on all monetary output | All sections |
| `HAVING` for post-aggregation filtering | Q8, Q16, Q17, Q18 |
| INNER JOIN on aggregated subquery | Q16, Q17 |
| LEFT JOIN with subquery and NULL filter | Q18 |
| 3-level nested correlated subquery | Q21 |
| Scalar subquery as display column | Q19, Q20 |
| `ON DELETE RESTRICT / ON UPDATE CASCADE` on FK | Q23 |
| Before/after verification pattern for all DML | Q24, Q25, Q26 |
| Derived metrics (coverage rate, insured-to-premium ratio, premium per farmer) | Q6, Q10, Q11, Q12, Q18 |

---

## Project Structure

```
pmfby-sql-project/
│
├── README.md                        <- This page
├── pmfby_analysis.sql               <- Full raw SQL file (all 26 queries)
│
├──                         <- One page per section (click links above)
│   ├── 02_select_queries.md
│   ├── 03_filtering_where.md
│   ├── 04_aggregation_groupby.md
│   ├── 05_sorting_orderby.md
│   ├── 06_string_functions.md
│   ├── 07_joins.md
│   ├── 08_subqueries.md
│   ├── 09_data_integrity.md
│   └── 10_update_delete.md
│
└── data/
    ├── data.csv                     <- District-level PMFBY dataset
    └── column_description.csv       <- Variable definitions, units, scaling factors
```

---

## How to Run

```sql
-- 1. Create schema
CREATE SCHEMA IF NOT EXISTS ndap;
USE ndap;

-- 2. Enable local file import
SET GLOBAL local_infile = 1;

-- 3. Run the full script
SOURCE pmfby_analysis.sql;
```

Update the `LOAD DATA LOCAL INFILE` path in Section 1 to match your local directory.

---

## Conclusion

The two blank queries (Q16, Q18) were the hardest problems in the assignment — both required joining against aggregated subqueries rather than simple table-to-table joins. These are also the patterns most commonly tested in SQL data analyst interviews. The most important discipline demonstrated throughout is **unit awareness**: every monetary column is stored in lakhs, and every threshold is documented with its real-world crore equivalent so the analysis stays interpretable to a non-technical policy audience.

---

## Author

**Vagga Jayalakshmi**  
[LinkedIn](https://linkedin.com/in/vagga-jai-1206inn)

---

*Dataset: [National Data and Analytics Platform (NDAP)](https://ndap.niti.gov.in)*  
*Scheme: [Pradhan Mantri Fasal Bima Yojana (PMFBY)](https://pmfby.gov.in)*
