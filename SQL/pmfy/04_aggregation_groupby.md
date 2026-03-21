# Section 4 — Aggregation (GROUP BY)

[← Back to README](../README.md)

---

## Q7. Average and total insured land area per year.

**Business Context:** Tracks whether land coverage under PMFBY is expanding year-over-year — a more reliable measure of scheme growth than farmer headcounts, which fluctuate with voluntary enrolment.

> `InsuredLandArea` stored in **thousand hectares**.

```sql
SELECT
    srcYear                                         AS year,
    COUNT(*)                                        AS district_records,
    ROUND(AVG(InsuredLandArea), 4)                  AS avg_insured_land_thousand_ha,
    ROUND(SUM(InsuredLandArea), 2)                  AS total_insured_land_thousand_ha
FROM FarmersInsuranceData
WHERE srcYear IS NOT NULL
GROUP BY srcYear
ORDER BY srcYear;
```

---

## Q8. Total farmers covered per district where InsuranceUnits > 0.

**Business Context:** `InsuranceUnits > 0` confirms the district is actively participating in PMFBY — filtering out districts where the scheme exists on paper but has zero operational activity.

```sql
SELECT
    srcDistrictName                                 AS district_name,
    SUM(InsuranceUnits)                             AS total_insurance_units,
    SUM(TotalFarmersCovered)                        AS total_farmers_covered
FROM FarmersInsuranceData
WHERE InsuranceUnits > 0
  AND srcDistrictName IS NOT NULL
GROUP BY srcDistrictName
ORDER BY total_farmers_covered DESC;
```

---

## Q9. Premium breakdown per state where SumInsured > 500,000 lakhs.

**Business Context:** High sum-insured states represent the scheme's biggest financial risk exposure. Comparing farmer, state, and central premium shares reveals the subsidy architecture. `farmer_premium_pct` is the core metric — how self-funded is each state's coverage?

> **500,000 lakhs = ₹5,000 crore.**
> Step 1 runs first to verify the column scale before applying the threshold.

**Step 1 — Understand the SumInsured distribution:**
```sql
SELECT
    ROUND(MIN(SumInsured), 2)  AS min_lakhs,
    ROUND(MAX(SumInsured), 2)  AS max_lakhs,
    ROUND(AVG(SumInsured), 2)  AS avg_lakhs
FROM FarmersInsuranceData;
```

**Step 2 — Main analysis:**
```sql
SELECT
    srcStateName                                    AS state_name,
    SUM(TotalFarmersCovered)                        AS total_farmers_covered,
    ROUND(SUM(FarmersPremiumAmount), 2)             AS farmer_premium_lakhs,
    ROUND(SUM(StatePremiumAmount), 2)               AS state_premium_lakhs,
    ROUND(SUM(GOVPremiumAmount), 2)                 AS central_govt_premium_lakhs,
    ROUND(SUM(GrossPremiumAmountToBePaid), 2)       AS gross_premium_lakhs,
    ROUND(SUM(SumInsured), 2)                       AS total_sum_insured_lakhs,
    ROUND(
        SUM(FarmersPremiumAmount) /
        NULLIF(SUM(GrossPremiumAmountToBePaid), 0) * 100,
    2)                                              AS farmer_premium_pct
FROM FarmersInsuranceData
WHERE SumInsured > 500000
  AND srcStateName IS NOT NULL
GROUP BY srcStateName
ORDER BY total_sum_insured_lakhs DESC;
```

---

[← Back to README](../README.md) | [Next: Sorting →](05_sorting_orderby.md)
