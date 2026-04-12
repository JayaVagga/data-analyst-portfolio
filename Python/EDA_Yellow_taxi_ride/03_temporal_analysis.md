# Section 3 — Temporal Analysis

[← Back to README](../README.md)

---

## 3.1 — Hourly Pickup Trends

**Question:** At which hours of the day is taxi demand highest?

```python
hourly_pickups = df['hour'].value_counts().sort_index()

plt.figure(figsize=(10,5))
plt.plot(hourly_pickups.index, hourly_pickups.values)
plt.title('Hourly Taxi Pickup Trends')
plt.xlabel('Hour of Day')
plt.ylabel('Number of Pickups')
plt.show()
```

**Result:** Demand minimum at 3–5 AM. Rises sharply from 6 AM. Two peaks: morning commute (7–9 AM) and stronger evening commute (3–7 PM).

**Insight:** Evening peak exceeds morning — leisure travel combines with commuters in the afternoon.

**Outcome:** Schedule maximum fleet 6–9 AM and 3–7 PM. Reduce idle cabs during 2–5 AM.

---

## 3.2 — Daily Pickup Trends (Day of Week)

```python
df['day_of_week'] = pd.to_datetime(df['tpep_pickup_datetime']).dt.day_name()

weekday_order = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday']
daily_pickups = df['day_of_week'].value_counts().reindex(weekday_order)

plt.figure(figsize=(10,5))
plt.plot(daily_pickups.index, daily_pickups.values, marker='o')
plt.title('Daily Taxi Pickup Trends')
plt.show()
```

**Result:** Thursday–Friday highest. Sunday–Monday lowest.

**Insight:** End-of-week volume driven by restaurant, nightlife, and leisure trips combining with regular commute demand.

**Outcome:** Full fleet on Thursday–Friday. Reduce base staffing Sunday mornings.

---

## 3.3 — Monthly Pickup Trends

```python
df['month'] = pd.to_datetime(df['tpep_pickup_datetime']).dt.month
monthly_pickups = df['month'].value_counts().sort_index()

plt.figure(figsize=(10,5))
plt.plot(monthly_pickups.index, monthly_pickups.values, marker='o')
plt.title('Monthly Taxi Pickup Trends')
plt.show()
```

**Result:** Peaks in May–October. January–February lowest.

**Insight:** Summer tourism and outdoor activity drive warm-month demand. Winter weather suppresses early-year trips.

**Outcome:** Scale fleet May–October. Use January–February for vehicle maintenance cycles and driver training programmes.

---

[← Back to README](../README.md) | [Next: Financial Analysis →](04_financial_analysis.md)
