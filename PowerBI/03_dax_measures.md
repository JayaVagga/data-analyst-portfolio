# Section 3 — DAX Measures

[← Back to README](README.md)

---

## Overview

All **30 DAX measures** live in a dedicated `_measures` table — a professional Power BI pattern that keeps all business logic centralised and the field list clean. The `_` prefix sorts it to the top of the field list alphabetically.

---

## Category 1 — Core KPI Measures (8 measures)

These are the five headline metrics shown in the main KPI card, plus three operational/efficiency measures.

```dax
-- Revenue from all shipments: $34,042,511.25
Total sales = SUM(shipments[Sales])

-- Physical volume: 2,077,844 boxes
Total boxes = SUM(shipments[Boxes])

-- Number of delivery events: 6,113
Total shipments = COUNTROWS(shipments)

-- Cost = Boxes × Cost per Box per product: $13,518,440.91
Total costs =
    SUMX(
        shipments,
        shipments[Boxes] * RELATED(products[Cost per box])
    )

-- Net profit: $20,524,070.34
Total profit = [Total sales] - [Total costs]

-- Profit margin: 60.3%
Profit % = DIVIDE([Total profit], [Total sales])

-- Count of shipments with <50 boxes: 624
LBS count =
    CALCULATE(
        COUNTROWS(shipments),
        shipments[Boxes] < 50
    )

-- LBS rate: 10.2%
LBS % = DIVIDE([LBS count], [Total shipments])
```

---

## Category 2 — Month-over-Month (MoM) Comparison (10 measures)

Time intelligence measures comparing current month to the previous calendar month. These power the MoM tables on Pages 2, 5, and 6. All require the `calendar` table to be properly marked as a Date table with contiguous dates.

```dax
-- Prior month sales (DATEADD shifts filter context back 1 month)
Total sales (prev month) =
    CALCULATE([Total sales], DATEADD(calendar[Date], -1, MONTH))

-- MoM % change in sales
MoM Sales Change % =
    DIVIDE(
        [Total sales] - [Total sales (prev month)],
        [Total sales (prev month)]
    )

-- Same pattern applied across all 5 core metrics:
Total Boxes (prev month)      = CALCULATE([Total boxes],     DATEADD(calendar[Date], -1, MONTH))
MoM boxes change %            = DIVIDE([Total boxes]     - [Total Boxes (prev month)],     [Total Boxes (prev month)])

Total Shipments (prev month)  = CALCULATE([Total shipments], DATEADD(calendar[Date], -1, MONTH))
MoM Shipments Change %        = DIVIDE([Total shipments] - [Total Shipments (prev month)], [Total Shipments (prev month)])

Total costs (prev month)      = CALCULATE([Total costs],     DATEADD(calendar[Date], -1, MONTH))
MoM Costs Change %            = DIVIDE([Total costs]     - [Total costs (prev month)],     [Total costs (prev month)])

Total profit (prev month)     = CALCULATE([Total profit],    DATEADD(calendar[Date], -1, MONTH))
MoM profit Change %           = DIVIDE([Total profit]    - [Total profit (prev month)],    [Total profit (prev month)])
```

---

## Category 3 — Latest Month Snapshot (10 measures)

These measures always return the value for the **most recent month in the dataset** regardless of any slicer or filter applied. The "Latest" columns in MoM tables use these — so the most current performance is always visible without scrolling.

```dax
-- Most recent date in the dataset: 2024-02-29
Latest date = MAX(calendar[Date])

-- Sales for most recent complete month (Feb 2024: $2,528,118.00)
Total Sales Latest Month =
    CALCULATE(
        [Total sales],
        DATESMTD(LASTDATE(calendar[Date]))
    )

-- Latest MoM % change in sales
Latest MoM Sales Change % =
    CALCULATE(
        [MoM Sales Change %],
        LASTDATE(calendar[Date])
    )

-- Same pattern applied for Boxes, Shipments, Costs, Profit:
Total boxes Latest Month          / Latest MoM Boxes Change %
Total Shipments Latest Month      / Latest MoM shipments Change %
Total Costs Latest Month          / Latest MoM Costs Change %
Total profits Latest Month        / Latest MoM Profits Change %
```

---

## Category 4 — Performance Indicators (2 measures)

```dax
-- Visual target flag in salesperson and product tables
-- Shows ✅ when profit % meets or exceeds target, ❌ when below
Profit Target Indicator =
    IF([Profit %] >= [Profit Target], "✅", "❌")
```

The `Profit %` gauge on the main dashboard uses the same measure — 60.3% overall profit margin across all products and geographies.

---

## Dynamic Measure Selector

The `Measure Selector` table is a **disconnected table** — no relationship to any other table. It powers the slicer on the main dashboard that lets users switch between metrics without navigating to a different page.

```dax
-- SWITCH reads the slicer selection and returns the corresponding measure
Selected Measure =
    SWITCH(
        SELECTEDVALUE('Measure Selector'[Measure Selector]),
        "Total Sales",      [Total sales],
        "Total Boxes",      [Total boxes],
        "Total Shipments",  [Total shipments],
        "Total Costs",      [Total costs],
        "Total Profit",     [Total profit],
        "Profit %",         [Profit %],
        "LBS %",            [LBS %],
        [Total sales]  -- default
    )
```

---

## Why DIVIDE Instead of Division Operator?

All percentage measures use `DIVIDE()` not `/`:

```dax
-- This causes a hard error if Total sales = 0
Profit % = [Total profit] / [Total sales]   ❌

-- This returns BLANK() gracefully — renders as empty in visuals
Profit % = DIVIDE([Total profit], [Total sales])   ✅
```

Power BI renders `BLANK()` cleanly in all visual types — no error messages, no broken formatting.

---

[← Back to README](../README.md) | [Next: Key Insights →](04_key_insights.md)
