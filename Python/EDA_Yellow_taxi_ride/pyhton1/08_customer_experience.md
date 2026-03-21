# Section 8 — Customer Experience & Behaviour

[← Back to README](../README.md)

---

## 8.1 — Tip Percentage Analysis

### By Distance Tier
```python
tip_df = df[df['total_amount'] > 0].copy()
tip_df['tip_pct'] = tip_df['tip_amount'] / tip_df['total_amount'] * 100

tip_df['distance_tier'] = pd.cut(
    tip_df['trip_distance'],
    bins=[0, 2, 5, float('inf')],
    labels=['<=2 miles', '2-5 miles', '>5 miles']
)
tip_by_distance = tip_df.groupby('distance_tier')['tip_pct'].mean().reset_index()
sns.barplot(data=tip_by_distance, x='distance_tier', y='tip_pct')
plt.title('Average Tip % by Distance Tier')
plt.show()
```

**Result:** Tip % increases with trip distance. Longer trips generate higher average tip percentages.

### By Passenger Count
```python
tip_by_passenger = tip_df.groupby('passenger_count')['tip_pct'].mean().reset_index()
sns.barplot(data=tip_by_passenger, x='passenger_count', y='tip_pct')
plt.title('Average Tip % by Passenger Count')
plt.show()
```

**Result:** 2–3 passenger trips show higher average tips than solo or large-group rides.

### By Hour
```python
tip_by_hour = tip_df.groupby('hour')['tip_pct'].mean().reset_index()
sns.lineplot(data=tip_by_hour, x='hour', y='tip_pct')
plt.title('Average Tip % by Hour of Day')
plt.show()
```

**Result:** Tip % slightly elevated during late-night hours (11 PM – 3 AM).

**Insight:** Longer trips give passengers more time to form a positive experience. Group rides may tip collectively. Late-night social trips = more generous mood.

**Outcome:** Service quality training for longer trips. In-app tip prompts after airport and outer-borough runs.

---

## 8.2 — Low vs High Tip Trip Comparison (KDE)

```python
low_tip_df  = tip_df[tip_df['tip_pct'] < 10]
high_tip_df = tip_df[tip_df['tip_pct'] > 25]

# Hour distribution
sns.kdeplot(low_tip_df['hour'],          label='Low Tip (<10%)')
sns.kdeplot(high_tip_df['hour'],         label='High Tip (>25%)')
plt.title('Tip Comparison by Hour (KDE)')
plt.show()

# Distance distribution
sns.kdeplot(low_tip_df['trip_distance'], label='Low Tip (<10%)')
sns.kdeplot(high_tip_df['trip_distance'],label='High Tip (>25%)')
plt.title('Tip Comparison by Trip Distance (KDE)')
plt.show()
```

**Result:** High-tip trips concentrate at lower distances but longer times. Low-tip trips are spread across hours and shorter distances.

**Insight:** Service quality and driver interaction — not trip length alone — drives above-average tipping.

**Outcome:** Communication and service training protocols for short-to-medium trips could significantly lift average tip rates fleet-wide.

---

## 8.3 — Passenger Count by Hour and Day

```python
passenger_by_hour = df.groupby('hour')['passenger_count'].mean().reset_index()
sns.lineplot(data=passenger_by_hour, x='hour', y='passenger_count')
plt.title('Average Passenger Count by Hour')
plt.show()

passenger_by_day = df.groupby('day_of_week')['passenger_count'].mean().reset_index()
sns.barplot(data=passenger_by_day, x='day_of_week', y='passenger_count')
plt.title('Average Passenger Count by Day')
plt.show()
```

**Result:** Higher average counts in late evening. Weekend days show marginally higher averages.

**Outcome:** Market group ride packages for weekend evenings. Deploy larger-capacity vehicles for late-night demand.

---

## 8.4 — Surcharge Frequency by Hour

```python
df['any_surcharge'] = (
    (df['extra'] > 0) |
    (df['mta_tax'] > 0) |
    (df['improvement_surcharge'] > 0) |
    (df['congestion_surcharge'] > 0) |
    (df['airport_fee'] > 0)
)

surcharge_by_hour = df.groupby('hour')['any_surcharge'].mean().reset_index()
sns.lineplot(data=surcharge_by_hour, x='hour', y='any_surcharge')
plt.title('Surcharge Frequency by Hour')
plt.show()
```

**Result:** Surcharge prevalence is near 100% across all hours — virtually every trip incurs at least one charge.

**Insight:** Standard MTA and improvement surcharges are universal. Congestion surcharge applies to all Manhattan trips below 96th Street.

**Outcome:** Communicate surcharge transparency clearly in apps and receipts. Passengers who understand mandatory vs discretionary charges have higher satisfaction and fewer disputes.

---

[← Back to README](../README.md) | [Next: Conclusions →](09_conclusions.md)
