# Section 8 — Subqueries

[← Back to README](../README.md)

---

## Q19. Districts where TotalFarmersCovered exceeds the national average.

**Business Context:** Above-average coverage districts are PMFBY success cases. The national average is displayed alongside each result row — so the magnitude of over-performance is immediately visible without running a second query.

```sql
SELECT DISTINCT
    srcStateName                                    AS state_name,
    srcDistrictName                                 AS district_name,
    TotalFarmersCovered,
    ROUND((
        SELECT AVG(TotalFarmersCovered)
        FROM FarmersInsuranceData
        WHERE TotalFarmersCovered > 0
    ), 0)                                           AS national_avg_coverage
FROM FarmersInsuranceData
WHERE TotalFarmersCovered > (
    SELECT AVG(TotalFarmersCovered)
    FROM FarmersInsuranceData
    WHERE TotalFarmersCovered > 0
)
  AND srcDistrictName IS NOT NULL
ORDER BY TotalFarmersCovered DESC;
```

---

## Q20. States where SumInsured exceeds the SumInsured of the highest-premium district.

**Business Context:** Identifies states providing more financial protection than the district that pays the most in premiums. These states receive high coverage despite lower farmer contributions — a signal of strong government subsidy investment. The reference benchmark is shown as a column for direct comparison.

```sql
SELECT DISTINCT
    srcStateName                                    AS state_name,
    ROUND(SumInsured, 2)                            AS sum_insured_lakhs,
    ROUND((
        SELECT SumInsured
        FROM FarmersInsuranceData
        ORDER BY FarmersPremiumAmount DESC
        LIMIT 1
    ), 2)                                           AS reference_top_premium_district_sum_insured
FROM FarmersInsuranceData
WHERE SumInsured > (
    SELECT SumInsured
    FROM FarmersInsuranceData
    ORDER BY FarmersPremiumAmount DESC
    LIMIT 1
)
  AND srcStateName IS NOT NULL
ORDER BY SumInsured DESC;
```

---

## Q21. Districts exceeding the average premium of the state with the highest population (3-level nested subquery).

**Business Context:** Uses the most-populous state as a national benchmark. Districts that out-perform this benchmark punch above their weight in scheme premium contribution.

**Query logic — reading from innermost to outermost:**

| Level | Resolves |
|---|---|
| Level 1 (innermost) | Maximum `TotalPopulation` value in the dataset |
| Level 2 | Which `srcStateName` that maximum population belongs to |
| Level 3 | Average `FarmersPremiumAmount` for that state |
| Outer query | All districts nationwide exceeding that average |

The benchmark value is shown as a column in every result row for immediate context.

```sql
SELECT DISTINCT
    srcStateName                                    AS state_name,
    srcDistrictName                                 AS district_name,
    ROUND(FarmersPremiumAmount, 2)                  AS farmer_premium_lakhs,
    ROUND((
        -- Level 3: avg premium of the most-populous state
        SELECT AVG(FarmersPremiumAmount)
        FROM FarmersInsuranceData
        WHERE srcStateName = (
            -- Level 2: which state has the max population
            SELECT srcStateName
            FROM FarmersInsuranceData
            WHERE TotalPopulation = (
                -- Level 1: find the max population value
                SELECT MAX(TotalPopulation)
                FROM FarmersInsuranceData
            )
            LIMIT 1
        )
    ), 4)                                           AS benchmark_avg_lakhs
FROM FarmersInsuranceData
WHERE FarmersPremiumAmount > (
    SELECT AVG(FarmersPremiumAmount)
    FROM FarmersInsuranceData
    WHERE srcStateName = (
        SELECT srcStateName
        FROM FarmersInsuranceData
        WHERE TotalPopulation = (
            SELECT MAX(TotalPopulation)
            FROM FarmersInsuranceData
        )
        LIMIT 1
    )
)
  AND srcDistrictName IS NOT NULL
ORDER BY farmer_premium_lakhs DESC;
```

---

[← Back to README](../README.md) | [Next: Data Integrity →](09_data_integrity.md)
