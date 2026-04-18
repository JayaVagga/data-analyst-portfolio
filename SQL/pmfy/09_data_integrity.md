# Section 9 — Data Integrity (Constraints & Foreign Keys)

[← Back to README](README.md)

---

## Q22. Create normalised reference tables for states and districts.

**Design rationale:** `FarmersInsuranceData` repeats state and district names across thousands of rows. Extracting these into dedicated lookup tables:
- Eliminates text redundancy
- Enables FK-enforced referential integrity
- Allows JOINs on integer keys (significantly faster at scale)

```sql
-- States lookup table
CREATE TABLE IF NOT EXISTS states (
    StateCode    INT          PRIMARY KEY,
    StateName    VARCHAR(100) NOT NULL
);

-- Districts lookup table (FK to states added in Q23)
CREATE TABLE IF NOT EXISTS districts (
    DistrictCode  INT          PRIMARY KEY,
    DistrictName  VARCHAR(100) NOT NULL,
    StateCode     INT          NOT NULL
);
```

---

## Q23. Add Foreign Key constraint: districts.StateCode → states.StateCode

**Why this matters:** Without the FK, a district record could reference a StateCode that doesn't exist in the states table — an orphan record that would corrupt any geographic JOIN. The FK prevents this at the database level, not the application level.

**Referential actions explained:**
- `ON DELETE RESTRICT` — prevents deleting a state that still has districts. Forces correct deletion order.
- `ON UPDATE CASCADE` — if a StateCode changes in the states table, all district records update automatically. No manual sync required.

```sql
ALTER TABLE districts
ADD CONSTRAINT fk_districts_statecode
FOREIGN KEY (StateCode)
REFERENCES states(StateCode)
ON DELETE RESTRICT
ON UPDATE CASCADE;

-- Verify the constraint was applied
SHOW CREATE TABLE districts;
```

---

[← Back to README](../README.md) | [Next: Update & Delete →](10_update_delete.md)
