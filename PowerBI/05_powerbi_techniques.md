# Section 5 — Power BI Techniques Used

[← Back to README](README.md)

---

## Data Modelling

### Star Schema
The model uses a classic **star schema** — one fact table (`shipments`) surrounded by four dimension tables. This is the correct Power BI model structure for performance and filter propagation.

```
         calendar (394 dates)
              │
              │ 1:*
              ▼
locations ──────── shipments ──────────── products
(6 countries)  (6,113 rows — FACT)   (22 products)
    1:*              │                     1:*
                     │ 1:*
                     ▼
                  people
               (25 salespeople)

Measure Selector  ←── disconnected helper (no relationships)
_measures         ←── empty table housing all 30 DAX measures
```

### Dedicated Measure Table (`_measures`)
All 30 measures are in an **empty table** used purely as a container. The `_` prefix sorts it to the top of the field list alphabetically. This is industry-standard Power BI development practice for any report with more than ~10 measures.

**Why it matters:**
- Clean field list — no hunting through fact and dimension tables for measures
- Single place to update, rename, or reorganise measures
- Easier code review and handover to other developers

### Disconnected Table for Dynamic Slicer
`Measure Selector` has **no relationships** to any table. A user's slicer selection is read by a SWITCH measure and determines what a visual displays — reducing page count and visual clutter while increasing user control.

---

## DAX Techniques

### DATEADD for Time Intelligence
```dax
Total sales (prev month) =
    CALCULATE([Total sales], DATEADD(calendar[Date], -1, MONTH))
```
Shifts the filter context backward by exactly one month. Requires a properly marked Date Table with contiguous dates — the `Calendar Table` sheet (394 days: 2023-02-01 to 2024-02-29) serves this role.

### LASTDATE + DATESMTD for Latest Month Snapshot
```dax
Total Sales Latest Month =
    CALCULATE([Total sales], DATESMTD(LASTDATE(calendar[Date])))
```
Always returns the value for the most recent month in the dataset, regardless of which date filter the user has applied. This prevents the common problem where the "current" row in a MoM table is always blank.

### SUMX for Row-Context Calculations
```dax
Total costs =
    SUMX(
        shipments,
        shipments[Boxes] * RELATED(products[Cost per box])
    )
```
`SUMX` iterates row-by-row over the shipments table, multiplying each row's box count by the related product's cost per box — then summing the result. `RELATED()` traverses the relationship from shipments to products to retrieve the correct cost.

### DIVIDE for Safe Division
```dax
Profit %  = DIVIDE([Total profit],    [Total sales])     -- 60.3%
LBS %     = DIVIDE([LBS count],       [Total shipments]) -- 10.2%
MoM Sales Change % = DIVIDE([Total sales] - [Total sales (prev month)], [Total sales (prev month)])
```
Returns `BLANK()` instead of an error when the denominator is zero — essential for MoM measures where prior month data doesn't exist for the first period.

### CALCULATE + FILTER for LBS Count
```dax
LBS count = CALCULATE(COUNTROWS(shipments), shipments[Boxes] < 50)
```
`CALCULATE` modifies the filter context — here adding a filter to count only shipments where box count is below the LBS threshold (50 boxes). Result: 624 shipments = 10.2% LBS rate.

### SWITCH for Dynamic Measure Selection
```dax
Selected Measure =
    SWITCH(
        SELECTEDVALUE('Measure Selector'[Measure Selector]),
        "Total Sales",  [Total sales],
        "Total Profit", [Total profit],
        "LBS %",        [LBS %],
        [Total sales]   -- default
    )
```
A single visual on the dashboard can display any of the key metrics based on what the user selects from the Measure Selector slicer.

### IF for Conditional Target Indicators
```dax
Profit Target Indicator = IF([Profit %] >= [Profit Target], "✅", "❌")
```
Returns a visual symbol that renders in table cells — instantly communicates pass/fail status without relying on colour coding alone (colour blindness accessibility consideration).

---

## Visualisation Techniques

| Technique | Visual Used | Purpose |
|---|---|---|
| **Gauge** | Profit % and LBS % | Target-based KPI with needle and arc — more intuitive than a number alone |
| **Bookmarks** | Product/People toggle | Single-page density — switch between two tables without navigating pages |
| **Disconnected slicer** | Measure Selector | One dynamic visual replaces multiple static charts |
| **Bins** | Boxes (bins) column chart | Groups continuous box counts into ranges for distribution analysis |
| **Profile photos in table** | Salesperson leaderboard | Renders photos in table cells — faster recognition for managers |
| **Multi-Row Card** | 8 KPIs on Page 1 | Space-efficient compact KPI grid |
| **Line Chart** | Monthly boxes trend | Shows volume trajectory across 13 months |

---

## Report Design Decisions

| Decision | Reasoning |
|---|---|
| Star schema over flat table | Faster query performance, correct slicer propagation, simpler DAX |
| `_measures` dedicated table | Professional maintainability standard |
| 7 pages rather than 1 | MoM analysis needs its own table space; main dashboard stays clean |
| Bookmarks for panel toggle | Keeps main dashboard to 1 page without sacrificing information depth |
| LBS % as second gauge alongside Profit % | Surfaces operational efficiency next to financial performance — both matter for sustainable growth |
| All 6 countries with roughly equal shipments | Data confirms deliberate geographic balancing strategy |

---

[← Back to README](../README.md)
