# Section 4 — Key Insights & Business Analysis

[← Back to README](README.md)

---

## Insight 1 — Strong Profit Margins Across the Business

| KPI | Value |
|---|---|
| Total Sales | $34,042,511.25 |
| Total Costs | $13,518,440.91 |
| Total Profit | $20,524,070.34 |
| **Profit %** | **60.3%** |

A 60.3% gross profit margin is healthy for a confectionery business — driven by the premium pricing of the chocolate product range against relatively low per-box manufacturing costs ($2.65–$12.41 per box depending on product).

**Highest cost products** (hardest margin to defend):
- Baker's Choco Chips: $12.41/box
- 85% Dark Bars: $10.51/box
- After Nines (Bites): $10.23/box

**Lowest cost products** (strongest margin):
- Peanut Butter Cubes: $2.65/box
- Smooth Silky Salty: $2.76/box
- Choco Coated Almonds: $3.32/box

---

## Insight 2 — Revenue is Evenly Distributed Across Geographies

| Country | Total Sales | Boxes | Shipments | Region |
|---|---|---|---|---|
| New Zealand | $5,875,218.00 | 344,645 | 1,022 | APAC |
| Canada | $5,725,894.50 | 364,419 | 1,039 | Americas |
| Australia | $5,703,536.25 | 326,004 | 1,005 | APAC |
| India | $5,648,465.25 | 340,403 | 1,017 | APAC |
| USA | $5,617,462.50 | 338,068 | 1,007 | Americas |
| UK | $5,471,934.75 | 364,305 | 1,023 | Europe |

**Key observation:** Revenue spread across 6 countries is remarkably balanced — the gap between highest (New Zealand $5.88M) and lowest (UK $5.47M) is only $400K (~7%). This indicates a well-diversified geographic sales strategy with no single-market dependency risk.

---

## Insight 3 — "Other" Category Products Lead Revenue Despite Fewer SKUs

Despite having only 4 products, the **Other** category includes the top revenue product (Organic Choco Syrup at $2.1M) and the 4th highest (Manuka Honey Choco at $1.84M).

**Top 5 products by revenue:**

| Product | Category | Revenue |
|---|---|---|
| Organic Choco Syrup | Other | $2,107,156.50 |
| Peanut Butter Cubes | Bites | $2,028,631.50 |
| 99% Dark & Pure | Bars | $1,975,833.00 |
| Manuka Honey Choco | Other | $1,839,156.75 |
| Fruit & Nut Bars | Bars | $1,826,694.00 |

**Bottom 3 products by revenue:**

| Product | Category | Revenue |
|---|---|---|
| 70% Dark Bites | Bites | $1,223,093.25 |
| Eclairs | Bites | $1,043,856.00 |
| Mint Chip Choco | Bars | $880,897.50 |

Mint Chip Choco at $880K is less than half of Organic Choco Syrup — a significant performance gap worth investigating for potential product rationalisation.

---

## Insight 4 — LBS % is 10.2% — An Operational Efficiency Signal

**LBS (Low Box Shipments)** — shipments with fewer than 50 boxes — represent **624 out of 6,113 shipments (10.2%)**.

These under-loaded shipments increase per-box logistics cost significantly:
- A full shipment of 200 boxes spreads fixed delivery cost across 200 units
- A 30-box shipment bears the same fixed cost with far fewer units to absorb it

**Why this matters:** If average delivery cost is $150 per shipment, the effective cost per box is:
- 200-box shipment: $0.75/box
- 30-box shipment: $5.00/box — 6.7× more expensive

Reducing LBS % from 10.2% to 5% would meaningfully lower total logistics costs.

---

## Insight 5 — Monthly Seasonality: Two Peaks, Two Troughs

| Period | Total Sales | Pattern |
|---|---|---|
| **Dec 2023** | **$2,938,828.50** | ← Highest month (holiday gifting) |
| **May 2023** | **$2,797,044.75** | ← Second highest (spring) |
| Oct 2023 | $2,845,233.00 | Strong autumn |
| **Nov 2023** | **$2,279,049.75** | ← Lowest month |
| **Feb 2023** | **$2,271,726.00** | ← Second lowest (Feb is shortest month) |

**Seasonal pattern:** December peaks confirm holiday gifting demand. May peak may reflect Mother's Day and spring promotions. November dip (before December) may reflect purchasing pause ahead of December holidays.

---

## Insight 6 — Sales Team Performance is Tightly Clustered

The **25 salespeople** show a remarkably narrow performance range:
- **Top:** Kelci Walkden — $1,517,602.50
- **Bottom:** Ches Bonnell — $1,219,331.25
- **Gap:** ~$298K (19.6% difference)

This suggests a well-trained, equally-supported team rather than a "star performer" model where 1–2 reps carry the rest. The `Profit Target Indicator` in the report surfaces which reps are above/below margin target — a more nuanced performance signal than revenue alone.

**Team breakdown:**

| Team | Members | Avg Sales/Person |
|---|---|---|
| Jucies | 7 | ~$1.40M |
| Delish | 7 | ~$1.36M |
| Yummies | 6 | ~$1.35M |
| Tempo | 5 | ~$1.37M |

---

## Insight 7 — The Report is Designed for Self-Service Analytics

The combination of **Category + Geography + Measure Selector slicers** on the main dashboard means any business question can be answered without a new report page:

- *"What is the LBS % for Bites in Canada?"* → Select Bites + Canada → read LBS % gauge
- *"Which products are underperforming in the UK?"* → Select UK → sort product table by Profit Target Indicator
- *"How did Q4 2023 compare to Q3 for Australia?"* → Select Australia → filter by date range → compare MoM tables
- *"Which salesperson has the best margin in APAC?"* → Select India/Australia/NZ → sort leaderboard by Profit %

---

[← Back to README](../README.md) | [Next: Power BI Techniques →](05_powerbi_techniques.md)
