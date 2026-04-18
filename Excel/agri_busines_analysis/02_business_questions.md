# Section 2 — Business Questions & Excel Analysis

[← Back to README](README.md)

---

All 19 business questions were answered using **Excel Pivot Tables, Pivot Charts, Calculated Fields, and Slicers**. Results are embedded in the workbook `excel_agri_project4.xlsx`.

---

## Financial & Revenue Questions

### Q1. Total Revenue Generated
**Answer:** ₹64,97,78,250 (₹649.78 Cr)

Calculated using `SUM(investment_amount)` across all 3,000 projects. Infrastructure services alone account for ~46–50% of this total due to high unit prices.

### Q3. Monthly Investment Trends (2023)
**Method:** Pivot Table grouping `Booking_Date` by month, filtered to year = 2023.

Monthly investment shows seasonal peaks corresponding to Kharif (June–October) and Rabi (November–March) crop cycles.

### Q4. Top Services by Revenue
**Top Revenue Generators:**

| Rank | Service | Category | Approx Revenue Share |
|---|---|---|---|
| 1 | Hi-Tech Smart Polyhouse 1000 sqm | Infrastructure | Highest |
| 2 | Fan & Pad System 1000 sqm | Infrastructure | 2nd |
| 3 | Polyhouse 1000 sqm | Infrastructure | 3rd |
| 4 | Net House 1000 sqm | Infrastructure | 4th |
| 5 | Agri Consultancy Package (4 months) | Consultancy | 5th |

### Q6. Revenue Comparison by Season
**Method:** Pivot Table on `Target_Season` vs `SUM(investment_amount)`.

| Season | Services Available | Revenue Contribution |
|---|---|---|
| All Season | Greenhouse, Hi-Tech, Maintenance, Consultancy | ~55–60% |
| Kharif | Net House | ~12–15% |
| Rabi | Fan & Pad System | ~18–22% |
| Summer | Polyhouse | ~8–12% |

### Q9. Category-wise Revenue Contribution
| Category | Revenue Share |
|---|---|
| Infrastructure | ~46–50% |
| Maintenance | ~25–30% |
| Consultancy | ~18–22% |
| Irrigation | ~7–10% |

---

## Operational Questions

### Q2. Average Project Completion Time
**Answer:** 71.78 days (across all services)

Infrastructure projects dominate this average — maintenance services complete in 1–3 days but infrastructure projects take 15–35 days.

### Q8. Investment Amount vs Completion Time
**Insight:** Strong positive correlation — higher-investment infrastructure projects (Polyhouse, Hi-Tech) take significantly longer. Maintenance services have near-zero investment relative to completion time.

### Q14. Average Project Investment per Service
| Service | Avg Investment |
|---|---|
| Hi-Tech Smart Polyhouse | ~₹25,00,000+ |
| Fan & Pad System | ~₹9,00,000 |
| Polyhouse | ~₹7,28,000 |
| Net House | ~₹3,00,000 |
| Fertigation System | ~₹3,00,000 |

### Q15. Services with Longest Completion Time
1. Polyhouse 1000 sqm — ~28–35 days
2. Fan & Pad System — ~18–24 days
3. Net House — ~15–20 days
4. Hi-Tech Smart Polyhouse — ~15–20 days
5. Greenhouse — ~7–10 days

### Q16. Project Demand Over Time
**Method:** Pivot Table grouping `Booking_Date` by year.

Project growth peaked in 2022–2023 and showed a surge before a mild 2025 correction — consistent with government subsidy cycle patterns.

---

## Farmer & Market Questions

### Q5. Average Farmer Investment
Average investment per farmer ≈ ₹2,16,592 (varies significantly by farmer type).

### Q7. Top 10 Districts by Number of Projects
**Method:** Pivot Table on `District` → `COUNT(Project_ID)`, sorted descending.

Bangalore, Pune, Nashik, Chennai, and Hyderabad-area districts consistently top the list.

### Q10. Farmer Type Adoption Analysis

**Top 5 Services by Season and Farmer Type (Kharif):**
Dominated by Net House installations — primarily by Medium and Small farmers.

**Top 5 Services by Season (Rabi):**
Fan & Pad System dominant — primarily Medium and Large farmers.

**Top 5 Services by Season (Summer):**
Polyhouse dominant — all farmer types but larger average size.

---

## Segmentation Questions

### Q11. Farmer Segment with Highest Subsidy Support
**Answer: Medium Farmers** receive the highest total subsidy (~48–52% of all subsidies).

Even though Small farmers get a higher subsidy *rate* (60%), Medium farmers have more eligible infrastructure projects — driving higher total subsidy value.

| Farmer Type | Subsidy Rate | Total Subsidy Share |
|---|---|---|
| Large | 40% | ~18–22% |
| Medium | 50% | **~48–52%** |
| Small | 60% | ~28–32% |

### Q12. Districts with Highest Project Demand
Bangalore district leads — Karnataka accounts for ~35–38% of all projects.

### Q13. Services Preferred by Farmer Segment
| Farmer Type | Preferred Services |
|---|---|
| Small | Greenhouse, Net House, Consultancy |
| Medium | Polyhouse, Fan & Pad, Fertigation |
| Large | Hi-Tech Smart Polyhouse, Fan & Pad |

### Q17. Subsidy Coverage per Service
Infrastructure and Irrigation services have 40–60% covered by government subsidies. Consultancy and Maintenance: 0% subsidy.

### Q18. Popular Services by State
| State | Top Service |
|---|---|
| Karnataka | Polyhouse, Hi-Tech Smart Polyhouse |
| Tamil Nadu | Net House, Fan & Pad |
| Maharashtra | Fan & Pad, Polyhouse |
| Madhya Pradesh | Net House, Consultancy |
| Telangana | Fertigation, Net House |

### Q19. Farm Size vs Technology Adoption
| Farm Size | Technology Adoption Pattern |
|---|---|
| Small (0.5–2 ac) | Greenhouse, Net House, Basic consultancy |
| Medium (2–5 ac) | Polyhouse, Fan & Pad, Fertigation |
| Large (5+ ac) | Hi-Tech Smart Polyhouse, Full systems |

---

[← Back to README](../README.md) | [Next: Key Insights →](03_key_insights.md)
