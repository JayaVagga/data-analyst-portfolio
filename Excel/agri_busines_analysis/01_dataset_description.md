# Section 1 — Dataset Description

[← Back to README](../README.md)

---

## Overview

The dataset was created from scratch using structured business logic to simulate realistic agricultural operations of an Agri-tech consulting company. It is **not copied from any public source** — all records were generated synthetically to reflect real-world agri-business patterns across five Indian states.

The dataset consists of three related tables joined on `Customer_ID` and `Service_ID`.

---

## Table 1 — Customers (`agri_customers.csv`)

Contains demographic and segmentation data for 480 farmers across 5 states.

| Field | Type | Description |
|---|---|---|
| `Customer_ID` | ID | Unique farmer identifier |
| `Farmer_Name` | Text | Full name |
| `District` | Text | District of the farm |
| `State` | Text | Karnataka, Tamil Nadu, Maharashtra, Madhya Pradesh, Telangana |
| `Farm_Size_Acres` | Decimal | Farm area in acres |
| `Farmer_Type` | Category | Small / Medium / Large |
| `Contact_Number` | Text | Phone contact |
| `Registration_Date` | Date | Date of onboarding |

**Farmer Segmentation:**

| Farmer Type | Land Holding | Count | Share |
|---|---|---|---|
| Small | 0.5 – 2 acres | 232 | 53% |
| Medium | 2 – 5 acres | 218 | 36% |
| Large | 5+ acres | 31 | 11% |

---

## Table 2 — Projects (`agri_projects.csv`)

Represents ~3,000 infrastructure and service projects executed for farmers. Each row is one project.

| Field | Type | Description |
|---|---|---|
| `Project_ID` | ID | Unique project identifier |
| `Customer_ID` | FK | Links to customer |
| `Service_ID` | FK | Links to service |
| `Farm_Size` | Decimal | Farm size for this project |
| `Max_allowed_units` | Integer | Maximum service units eligible |
| `Booking_Date` | Date | When the project was booked |
| `Start_Date` | Date | Project start date |
| `Completion_Date` | Date | Project completion date |
| `Investment_Amount` | Currency (₹) | Total project investment |
| `Subsidy_Amount` | Currency (₹) | Government subsidy applied |
| `Eligible_Category` | Text | Infrastructure eligibility bucket |
| `Helper_farmer_type` | Text | Farmer type helper field |
| `Helper_category` | Text | Service category helper field |

**Completion Time Benchmarks:**

| Service | Avg Completion |
|---|---|
| Polyhouse 1000 sqm | ~28–35 days |
| Fan & Pad System | ~18–24 days |
| Net House | ~15–20 days |
| Greenhouse | ~7–10 days |
| Maintenance Services | 1–3 days |

---

## Table 3 — Services (`agri_services.csv`)

Defines the 14 products and services offered by the company.

| Field | Type | Description |
|---|---|---|
| `Service_ID` | ID | Unique service identifier |
| `Service_Name` | Text | Full service name |
| `Category` | Text | Infrastructure / Maintenance / Irrigation / Consultancy |
| `Unit_Price` | Currency (₹) | Price per unit |
| `Target_Season` | Text | Kharif / Rabi / Summer / All Season |

**Service Categories:**

| Category | Example Services | Revenue Weight |
|---|---|---|
| Infrastructure | Polyhouse, Net House, Fan & Pad, Hi-Tech Polyhouse | ~46–50% |
| Maintenance | Annual maintenance contracts | ~25–30% |
| Consultancy | Crop planning, advisory packages | ~18–22% |
| Irrigation | Fertigation systems | ~7–10% |

---

## Government Subsidy Logic

Subsidies apply only to Infrastructure and Irrigation services.

| Farmer Type | Subsidy Rate |
|---|---|
| Small Farmers | 60% |
| Medium Farmers | 50% |
| Large Farmers | 40% |

> Consultancy and Maintenance services are **not subsidised.**

---

## Service Eligibility Rules

| Service | Eligibility |
|---|---|
| Polyhouse 1000 sqm | ≥ 1.5 acres |
| Fan & Pad System | 2 – 4 acres |
| Hi-Tech Smart Polyhouse | > 4 acres |
| Fertigation System | ≥ 2 acres |

---

[← Back to README](../README.md) | [Next: Business Questions →](02_business_questions.md)
