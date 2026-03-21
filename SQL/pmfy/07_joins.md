# Section 7 — Joins

[← Back to README](../README.md)

---

## Q16. Premium totals for districts with InsuranceUnits > 10 per year (INNER JOIN).

**Business Context:** Districts with > 10 insurance units in a year represent meaningful scheme activity. Joining on this filter reveals how much of the scheme's total premium is concentrated in high-activity districts versus low-activity ones.

**Approach:** Aggregate `InsuranceUnits` per district-year in a subquery first, then INNER JOIN on the result. This is the correct pattern for per-group threshold filtering — filtering after the join on aggregate values requires HAVING in the subquery, not WHERE in the outer query.

> This query was **blank in the original starter file**.

```sql
SELECT
    f.srcStateName                                  AS state_name,
    f.srcDistrictName                               AS district_name,
    f.srcYear                                       AS year,
    active.total_insurance_units,
    ROUND(SUM(f.FarmersPremiumAmount), 2)           AS farmer_premium_lakhs,
    ROUND(SUM(f.GrossPremiumAmountToBePaid), 2)     AS gross_premium_lakhs,
    SUM(f.TotalFarmersCovered)                      AS farmers_covered
FROM FarmersInsuranceData f
INNER JOIN (
    -- Districts actively participating: total InsuranceUnits > 10 in that year
    SELECT
        srcDistrictName,
        srcYear,
        SUM(InsuranceUnits) AS total_insurance_units
    FROM FarmersInsuranceData
    WHERE srcDistrictName IS NOT NULL
    GROUP BY srcDistrictName, srcYear
    HAVING SUM(InsuranceUnits) > 10
) active
  ON f.srcDistrictName = active.srcDistrictName
 AND f.srcYear         = active.srcYear
WHERE f.srcStateName IS NOT NULL
GROUP BY f.srcStateName, f.srcDistrictName, f.srcYear, active.total_insurance_units
ORDER BY farmer_premium_lakhs DESC;
```

---

## Q17. Districts where peak FarmersPremiumAmount ever exceeded 20 crores.

**Business Context:** Peak-premium districts are the scheme's highest farmer-contribution zones. Joining back to the base table retrieves the actual year that peak occurred — and `premium_to_insured_pct` reveals whether the high premium is proportionate to the coverage received.

> **20 crores = 2,000 lakhs** (stored unit in this dataset).

```sql
SELECT
    f.srcStateName                                  AS state_name,
    f.srcDistrictName                               AS district_name,
    f.srcYear                                       AS peak_year,
    f.TotalPopulation                               AS population_in_peak_year,
    ROUND(f.FarmersPremiumAmount, 2)                AS peak_farmer_premium_lakhs,
    ROUND(f.SumInsured, 2)                          AS sum_insured_in_peak_year_lakhs,
    ROUND(
        f.FarmersPremiumAmount /
        NULLIF(f.SumInsured, 0) * 100,
    4)                                              AS premium_to_insured_pct
FROM FarmersInsuranceData f
INNER JOIN (
    SELECT
        srcStateName,
        srcDistrictName,
        MAX(FarmersPremiumAmount) AS peak_premium
    FROM FarmersInsuranceData
    WHERE srcStateName IS NOT NULL
      AND srcDistrictName IS NOT NULL
    GROUP BY srcStateName, srcDistrictName
    HAVING MAX(FarmersPremiumAmount) > 2000         -- 2,000 lakhs = 20 crores
) peak
  ON f.srcStateName         = peak.srcStateName
 AND f.srcDistrictName      = peak.srcDistrictName
 AND f.FarmersPremiumAmount = peak.peak_premium
ORDER BY peak_farmer_premium_lakhs DESC;
```

---

## Q18. LEFT JOIN: Population + insurance totals per district where cumulative premium > 100 crores.

**Business Context:** Long-term high-premium districts are the scheme's most financially committed zones. LEFT JOIN preserves all population records — the NULL filter at the end converts it to an effective INNER JOIN only for districts meeting the premium threshold. `avg_premium_per_farmer_inr` converts from lakhs to actual rupees, giving a concrete per-person cost figure.

> **100 crores = 10,000 lakhs.**
> This query was **blank in the original starter file**.

```sql
SELECT
    pop.srcStateName                                AS state_name,
    pop.srcDistrictName                             AS district_name,
    ROUND(AVG(pop.TotalPopulation), 0)              AS avg_population,
    ROUND(AVG(pop.TotalPopulationRural), 0)         AS avg_rural_population,
    ins.total_farmers_covered,
    ROUND(ins.total_sum_insured_lakhs, 2)           AS total_sum_insured_lakhs,
    ROUND(ins.total_farmer_premium_lakhs, 2)        AS total_farmer_premium_lakhs,
    -- Premium per farmer in actual INR (lakhs × 100,000 ÷ farmers)
    ROUND(
        ins.total_farmer_premium_lakhs * 100000 /
        NULLIF(ins.total_farmers_covered, 0),
    2)                                              AS avg_premium_per_farmer_inr
FROM FarmersInsuranceData pop
LEFT JOIN (
    SELECT
        srcStateName,
        srcDistrictName,
        SUM(TotalFarmersCovered)            AS total_farmers_covered,
        SUM(SumInsured)                     AS total_sum_insured_lakhs,
        SUM(FarmersPremiumAmount)           AS total_farmer_premium_lakhs
    FROM FarmersInsuranceData
    WHERE srcStateName IS NOT NULL
      AND srcDistrictName IS NOT NULL
    GROUP BY srcStateName, srcDistrictName
    HAVING SUM(FarmersPremiumAmount) > 10000        -- 10,000 lakhs = 100 crores
) ins
  ON pop.srcStateName    = ins.srcStateName
 AND pop.srcDistrictName = ins.srcDistrictName
WHERE pop.srcStateName IS NOT NULL
  AND pop.srcDistrictName IS NOT NULL
  AND ins.total_farmer_premium_lakhs IS NOT NULL
GROUP BY
    pop.srcStateName,
    pop.srcDistrictName,
    ins.total_farmers_covered,
    ins.total_sum_insured_lakhs,
    ins.total_farmer_premium_lakhs
ORDER BY total_farmer_premium_lakhs DESC;
```

---

[← Back to README](../README.md) | [Next: Subqueries →](08_subqueries.md)
