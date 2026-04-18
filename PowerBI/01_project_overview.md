# Section 1 — Dataset Description

[← Back to README](README.md)

---

## Source

The dataset (`ac-sample-data.xlsx`) is the underlying data for the Awesome Chocolates Power BI Sales Analytics report. It contains three sheets that map directly to three of the six Power BI data model tables.

---

## Sheet 1 — Shipment Data (Fact Table)

**6,113 rows** of individual shipment records spanning **February 2023 – February 2024**.

| Column | Type | Description |
|---|---|---|
| `Sales Person` | Text | Name of the sales representative |
| `Geography` | Text | Country of shipment |
| `Product` | Text | Chocolate product name |
| `Date` | Date | Shipment date |
| `Sales` | Currency ($) | Revenue from the shipment |
| `Boxes` | Integer | Number of boxes shipped |

**Full date range:** 2023-02-01 → 2024-02-29 (13 months)

---

## Sheet 2 — Dimension Data

Contains three dimension tables side by side:

### Products (22 products)

| Product | Category | Cost per Box ($) |
|---|---|---|
| Baker's Choco Chips | Bars | 12.41 |
| 85% Dark Bars | Bars | 10.51 |
| After Nines | Bites | 10.23 |
| Spicy Special Slims | Bites | 8.22 |
| Caramel Stuffed Bars | Bars | 8.43 |
| Eclairs | Bites | 6.31 |
| Mint Chip Choco | Bars | 5.72 |
| 50% Dark Bites | Bites | 7.48 |
| 99% Dark & Pure | Bars | 7.73 |
| Milk Bars | Bars | 5.26 |
| Almond Choco | Bars | 5.15 |
| 70% Dark Bites | Bites | 5.04 |
| Fruit & Nut Bars | Bars | 4.74 |
| Raspberry Choco | Bars | 3.85 |
| Orange Choco | Bars | 3.68 |
| Choco Coated Almonds | Bites | 3.32 |
| Smooth Silky Salty | Bars | 2.76 |
| Peanut Butter Cubes | Bites | 2.65 |
| Drinking Coco | Other | 9.94 |
| Organic Choco Syrup | Other | 9.57 |
| Manuka Honey Choco | Other | 6.80 |
| White Choc | Other | 6.43 |

**Product Categories:**
- **Bars** (11 products): Milk Bars, Almond Choco, Raspberry Choco, Mint Chip Choco, 99% Dark & Pure, Orange Choco, Fruit & Nut Bars, 85% Dark Bars, Baker's Choco Chips, Caramel Stuffed Bars, Smooth Silky Salty
- **Bites** (7 products): 50% Dark Bites, Eclairs, Spicy Special Slims, After Nines, 70% Dark Bites, Choco Coated Almonds, Peanut Butter Cubes
- **Other** (4 products): Drinking Coco, White Choc, Organic Choco Syrup, Manuka Honey Choco

### Geographies (6 countries, 3 regions)

| Country | Region |
|---|---|
| India | APAC |
| Australia | APAC |
| New Zealand | APAC |
| USA | Americas |
| Canada | Americas |
| UK | Europe |

### Sales Team (25 people across 4 teams)

| Team | Members |
|---|---|
| **Yummies** | Barr Faughny, Dennison Crosswaite, Gunar Cockshoot, Wilone O'Kielt, Gigi Bohling, Jan Morforth |
| **Delish** | Curtice Advani, Kaine Padly, Ches Bonnell, Brien Boise, Husein Augar, Andria Kimpton, Karlen McCaffrey |
| **Jucies** | Beverie Moffet, Oby Sorrel, Dotty Strutley, Kelci Walkden, Marney O'Breen, Rafaelita Blaksland, Madelene Upcott |
| **Tempo** | Camilla Castle, Jehu Rudeforth, Mallorie Waber, Van Tuxwell, Roddy Speechley |

---

## Sheet 3 — Calendar Table

**394 dates** from 2023-02-01 to 2024-02-29. Used as the date dimension for all time intelligence DAX measures — MoM calculations, latest month snapshots, and trend charts.

---

[← Back to README](../README.md) | [Next: Report Pages →](02_report_pages.md)
