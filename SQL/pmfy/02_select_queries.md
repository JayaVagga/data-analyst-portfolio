# Section 2 — SELECT Queries

[← Back to README](../README.md)

---

## Q1. Retrieve all distinct state names covered by the PMFBY scheme.

**Business Context:** Establishes the geographic scope of the dataset — how many states are actively participating in PMFBY.

```sql
SELECT DISTINCT srcStateName AS state_name
FROM FarmersInsuranceData
WHERE srcStateName IS NOT NULL
ORDER BY srcStateName;
```

---

## Q2. Total farmers covered and total sum insured per state, ordered by coverage.

**Business Context:** Ranks states by insurance reach and total financial exposure. States with high farmer coverage but low sum insured may be under-protecting their enrolled farmers.

> `SumInsured` is stored in **lakhs INR** (1 lakh = ₹1,00,000).

```sql
SELECT
    srcStateName                                    AS state_name,
    SUM(TotalFarmersCovered)                        AS total_farmers_covered,
    ROUND(SUM(SumInsured), 2)                       AS total_sum_insured_lakhs
FROM FarmersInsuranceData
WHERE srcStateName IS NOT NULL
GROUP BY srcStateName
ORDER BY total_farmers_covered DESC;
```

---

[← Back to README](../README.md) | [Next: Filtering Data →](03_filtering_where.md)
