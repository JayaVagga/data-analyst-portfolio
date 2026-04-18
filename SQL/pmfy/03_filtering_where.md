# Section 3 — Filtering Data (WHERE)

[← Back to README](README.md)

---

## Q3. All records for the year 2020.

**Business Context:** Isolates the most recent full year of scheme data for snapshot analysis.

```sql
SELECT *
FROM FarmersInsuranceData
WHERE srcYear = 2020;
```

---

## Q4. Himachal Pradesh districts with rural population > 1 million.

**Business Context:** Rural-heavy districts are PMFBY's core target zones. High rural population + low farmer coverage = priority outreach gap.

> **Fix applied:** Original code used `UPPER(col) = 'Himachal Pradesh'` — a silent bug where `UPPER()` converts the column to uppercase but the comparison string stays mixed case, so it matches nothing. Fixed by applying `UPPER(TRIM())` to **both** sides.

```sql
SELECT
    srcStateName                                    AS state_name,
    srcDistrictName                                 AS district_name,
    TotalPopulationRural                            AS rural_population,
    TotalFarmersCovered                             AS farmers_covered
FROM FarmersInsuranceData
WHERE TotalPopulationRural > 1000000
  AND UPPER(TRIM(srcStateName)) = 'HIMACHAL PRADESH'
ORDER BY TotalPopulationRural DESC;
```

---

## Q5. Total FarmersPremiumAmount per district in 2018, lowest first.

**Business Context:** Districts with very low farmer premiums either have minimal coverage or receive disproportionate government subsidies — both are signals for policy review.

> All premium columns stored in **lakhs INR**.

```sql
SELECT
    srcStateName                                    AS state_name,
    srcDistrictName                                 AS district_name,
    ROUND(SUM(FarmersPremiumAmount), 4)             AS total_farmer_premium_lakhs
FROM FarmersInsuranceData
WHERE srcYear = 2018
  AND srcStateName IS NOT NULL
  AND srcDistrictName IS NOT NULL
GROUP BY srcStateName, srcDistrictName
ORDER BY total_farmer_premium_lakhs ASC;
```

---

## Q6. States in 2018 with InsuredLandArea > 5 thousand hectares — full premium breakdown.

**Business Context:** Large insured land states have mature PMFBY adoption. Splitting the gross premium into farmer, state, and central shares reveals **who is actually funding the scheme** in each state.

> `farmer_pct_of_gross_premium` is the key metric — states where farmers pay under 5% of the gross premium are entirely subsidy-dependent.

```sql
SELECT
    srcStateName                                    AS state_name,
    SUM(TotalFarmersCovered)                        AS total_farmers_covered,
    ROUND(SUM(InsuredLandArea), 2)                  AS total_insured_land_thousand_ha,
    ROUND(SUM(GrossPremiumAmountToBePaid), 2)       AS gross_premium_lakhs,
    ROUND(SUM(FarmersPremiumAmount), 2)             AS farmer_share_lakhs,
    ROUND(SUM(StatePremiumAmount), 2)               AS state_share_lakhs,
    ROUND(SUM(GOVPremiumAmount), 2)                 AS central_govt_share_lakhs,
    ROUND(
        SUM(FarmersPremiumAmount) /
        NULLIF(SUM(GrossPremiumAmountToBePaid), 0) * 100,
    2)                                              AS farmer_pct_of_gross_premium
FROM FarmersInsuranceData
WHERE InsuredLandArea > 5.0
  AND srcYear = 2018
  AND srcStateName IS NOT NULL
GROUP BY srcStateName
ORDER BY gross_premium_lakhs DESC;
```

---

[← Back to README](../README.md) | [Next: Aggregation →](04_aggregation_groupby.md)
