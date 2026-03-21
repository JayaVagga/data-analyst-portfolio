# Section 10 — UPDATE and DELETE

[← Back to README](../README.md)

---

## Q24. Update FarmersPremiumAmount to 500.0 for rowID = 1.

**Best practice applied:** Always SELECT the target row before updating to confirm you have the right record. Always SELECT after to confirm the change was applied. This pattern prevents silent errors — especially when working with shared or production databases.

```sql
-- Before: verify target row
SELECT rowID, srcStateName, srcDistrictName,
       FarmersPremiumAmount AS premium_before_update
FROM FarmersInsuranceData
WHERE rowID = 1;

-- Execute update
UPDATE FarmersInsuranceData
SET FarmersPremiumAmount = 500.0
WHERE rowID = 1;

-- After: confirm change
SELECT rowID, srcStateName, srcDistrictName,
       FarmersPremiumAmount AS premium_after_update
FROM FarmersInsuranceData
WHERE rowID = 1;
```

---

## Q25. Set srcYear = 2021 for all Himachal Pradesh records.

**Fix applied:** Original code compared `UPPER(col)` against `'Himachal pradesh'` — mixed case that would never match the uppercased column. Fixed with `UPPER(TRIM(col)) = 'HIMACHAL PRADESH'`.

**Safe updates:** `SQL_SAFE_UPDATES` is disabled only for the duration of the bulk update, then immediately re-enabled. This is the correct pattern — not leaving safe mode off permanently.

```sql
-- Before: count records to be updated
SELECT COUNT(*) AS rows_to_update
FROM FarmersInsuranceData
WHERE UPPER(TRIM(srcStateName)) = 'HIMACHAL PRADESH';

SET SQL_SAFE_UPDATES = 0;

UPDATE FarmersInsuranceData
SET srcYear = 2021
WHERE UPPER(TRIM(srcStateName)) = 'HIMACHAL PRADESH';

SET SQL_SAFE_UPDATES = 1;

-- After: confirm all records updated
SELECT srcStateName, COUNT(*) AS updated_records, MIN(srcYear) AS new_year
FROM FarmersInsuranceData
WHERE UPPER(TRIM(srcStateName)) = 'HIMACHAL PRADESH'
GROUP BY srcStateName;
```

---

## Q26. Delete records where TotalFarmersCovered < 10,000 and srcYear = 2020.

**Business rationale:** Near-zero coverage records in 2020 represent non-participating districts — retaining them pulls down district-level coverage averages and distorts trend analysis. Removing them keeps the 2020 dataset representative of actual scheme activity.

**Safety pattern:** COUNT before DELETE so you know exactly how many rows will be removed. COUNT after DELETE to confirm the operation completed as expected.

```sql
-- Before: how many rows will be deleted?
SELECT COUNT(*) AS rows_to_delete
FROM FarmersInsuranceData
WHERE TotalFarmersCovered < 10000
  AND srcYear = 2020;

SET SQL_SAFE_UPDATES = 0;

DELETE FROM FarmersInsuranceData
WHERE TotalFarmersCovered < 10000
  AND srcYear = 2020;

SET SQL_SAFE_UPDATES = 1;

-- After: confirm remaining 2020 records
SELECT COUNT(*) AS remaining_2020_records
FROM FarmersInsuranceData
WHERE srcYear = 2020;
```

---

[← Back to README](../README.md)
