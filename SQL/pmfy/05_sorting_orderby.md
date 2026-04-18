# Section 5 — Sorting Data (ORDER BY)

[← Back to README](README.md)

---

## Q10. Top 5 most populous districts in 2020 with coverage rate.

**Business Context:** Population rank alone is misleading. A district with 9 million people and 50,000 insured farmers has a 0.5% coverage rate — a massive gap. `coverage_rate_pct` surfaces this immediately.

```sql
SELECT
    srcStateName                                    AS state_name,
    srcDistrictName                                 AS district_name,
    TotalPopulation                                 AS total_population,
    TotalFarmersCovered                             AS farmers_covered,
    ROUND(
        TotalFarmersCovered /
        NULLIF(TotalPopulation, 0) * 100,
    4)                                              AS coverage_rate_pct
FROM FarmersInsuranceData
WHERE srcYear = 2020
  AND srcDistrictName IS NOT NULL
ORDER BY TotalPopulation DESC
LIMIT 5;
```

> `NULLIF(TotalPopulation, 0)` prevents a divide-by-zero error on records where population data is missing.

---

## Q11. 10 districts with lowest non-zero FarmersPremiumAmount.

**Business Context:** Districts with minimal farmer premiums but meaningful sum insured represent maximum government subsidy leverage. `insured_to_premium_ratio` quantifies this — a ratio of 200 means the farmer receives ₹200 of coverage for every ₹1 they pay.

```sql
SELECT
    srcStateName                                    AS state_name,
    srcDistrictName                                 AS district_name,
    ROUND(SumInsured, 2)                            AS sum_insured_lakhs,
    ROUND(FarmersPremiumAmount, 4)                  AS farmer_premium_lakhs,
    ROUND(SumInsured / NULLIF(FarmersPremiumAmount, 0), 2) AS insured_to_premium_ratio
FROM FarmersInsuranceData
WHERE FarmersPremiumAmount > 0
  AND srcStateName IS NOT NULL
  AND srcDistrictName IS NOT NULL
ORDER BY SumInsured ASC, FarmersPremiumAmount ASC
LIMIT 10;
```

---

## Q12. Top 3 state-year combinations by insured farmer to population ratio.

**Business Context:** This is the most important PMFBY penetration metric. It answers: in what state and year did the scheme reach the highest share of the total population? High ratios signal successful outreach; low ratios reveal coverage gaps.

```sql
SELECT
    srcStateName                                    AS state_name,
    srcYear                                         AS year,
    SUM(TotalFarmersCovered)                        AS total_farmers_covered,
    SUM(TotalPopulation)                            AS total_population,
    ROUND(
        SUM(TotalFarmersCovered) /
        NULLIF(SUM(TotalPopulation), 0) * 100,
    4)                                              AS coverage_pct
FROM FarmersInsuranceData
WHERE TotalPopulation > 0
  AND srcStateName IS NOT NULL
  AND srcYear IS NOT NULL
GROUP BY srcStateName, srcYear
ORDER BY coverage_pct DESC
LIMIT 3;
```

---

[← Back to README](../README.md) | [Next: String Functions →](06_string_functions.md)
