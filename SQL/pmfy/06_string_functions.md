# Section 6 — String Functions

[← Back to README](../README.md)

---

## Q13. Generate 3-character state abbreviation (StateShortName).

**Business Context:** Compact labels for dashboards and summary reports where full state names exceed display width. `UPPER()` ensures consistent capitalisation regardless of how the source data is cased.

```sql
SELECT
    srcStateName                                    AS state_name,
    UPPER(SUBSTRING(TRIM(srcStateName), 1, 3))      AS state_short_name
FROM FarmersInsuranceData
WHERE srcStateName IS NOT NULL
GROUP BY srcStateName
ORDER BY srcStateName;
```

---

## Q14. Districts whose name begins with 'B'.

**Business Context:** Name-based filtering for regional reports when administrative district codes are unavailable or inconsistent across data sources.

```sql
SELECT DISTINCT
    srcStateName                                    AS state_name,
    srcDistrictName                                 AS district_name
FROM FarmersInsuranceData
WHERE srcDistrictName LIKE 'B%'
  AND srcDistrictName IS NOT NULL
ORDER BY srcStateName, srcDistrictName;
```

---

## Q15. Districts whose name ends with 'pur'.

**Business Context:** The 'pur' suffix identifies a geographic cluster of North Indian districts (Gorakhpur, Shahjahanpur, Mirzapur…). Useful for region-specific policy analysis and clustering.

> `LOWER()` applied before `LIKE` to handle case inconsistencies in the source data — some entries may be 'Gorakhpur', others 'GORAKHPUR'.

```sql
SELECT DISTINCT
    srcStateName                                    AS state_name,
    srcDistrictName                                 AS district_name
FROM FarmersInsuranceData
WHERE LOWER(srcDistrictName) LIKE '%pur'
  AND srcDistrictName IS NOT NULL
ORDER BY srcStateName, srcDistrictName;
```

---

[← Back to README](../README.md) | [Next: Joins →](07_joins.md)
