# Section 4 — Dashboards

[← Back to README](README.md)

---

The Excel workbook contains **4 interactive dashboards**, each with slicers for Category, State, Farmer Type, Registration Date, and Service Name. All charts are connected to Pivot Tables and update dynamically when slicers are applied.

---

## Dashboard 1 — Financial Performance Dashboard

**Purpose:** Evaluate the business revenue structure, subsidy dependency, and investment mix across services and farmer segments.

![Financial Performance Dashboard](../financial_dashboard.png)

### Key KPIs shown:
| KPI | Value |
|---|---|
| Total Investment | ₹64,97,78,250 |
| Total Subsidy | ₹30,21,63,400 |
| Net Investment (Farmer-borne) | ₹34,76,14,850 |
| Average Project Value | ₹2,16,592.75 |

### Charts included:
- **Subsidy vs Investment by Service** — grouped bar chart comparing gross investment against subsidy amount for each service
- **Revenue Mix by Service Category** — pie chart showing Infrastructure / Maintenance / Irrigation / Consultancy proportion
- **Subsidy Amount vs Farmer Type** — bar chart showing Medium farmers receive highest total subsidy

### Slicers: Category · Farmer Type · State · Registration Date

---

## Dashboard 2 — Operational Performance Dashboard

**Purpose:** Track project execution efficiency, service-level completion times, and demand growth trends.

![Operational Performance Dashboard](../operational_dashboard.png)

### Key KPIs shown:
| KPI | Value |
|---|---|
| Average Completion Time | 71.78 days |
| Total Projects Completed | 3,000 |

### Charts included:
- **Completion Time by Service** — horizontal bar chart ranking services from fastest (maintenance) to slowest (polyhouse)
- **Average Project Size by Service** — bar chart showing unit investment per service
- **Project Growth Trend (2019–2025)** — line chart showing year-over-year project volume, with clear peak in 2022–2023

### Slicers: Registration Date · Farmer Type · State · Service Name

---

## Dashboard 3 — Market & Geographic Analysis

**Purpose:** Identify regions with highest infrastructure adoption and market penetration.

### Key Metrics:
- Total Investment by State
- Total Projects by District
- Service demand by region
- Active Districts and States

### Charts included:
- State-wise investment bar chart
- District-wise project count (Top 10)
- Regional service adoption heatmap

---

## Dashboard 4 — Customer & Demand Analysis

**Purpose:** Understand which farmer segments drive demand and technology adoption patterns.

### Key Metrics:
- Total Farmers: 480
- Average Farm Size
- Total Projects: 3,000
- Average Investment per Farmer: ₹2,16,592

### Charts included:
- Investment by Farmer Type
- Service demand by segment
- Farm size vs technology adoption

---

## How the Dashboards Work

All dashboards are built with:
- **Pivot Tables** as the data source
- **Pivot Charts** for visualisation
- **Slicers** connected to multiple charts simultaneously
- **Calculated Fields** for derived metrics (Net Investment, Average Project Value, Completion Days)
- **Conditional formatting** on KPI cards for visual emphasis

To interact with the dashboards, open `excel_agri_project4.xlsx` in Microsoft Excel and use the slicers on each dashboard sheet to filter by State, Farmer Type, Category, or Date.

---

[← Back to README](../README.md) | [Next: Recommendations →](05_recommendations.md)
