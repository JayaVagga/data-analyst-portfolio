# Section 7 — Pricing Strategy

[← Back to README](README.md)

---

## 7.1 — Fare per Mile per Passenger Count

```python
valid_pricing_df = df[(df['trip_distance'] > 0) & (df['passenger_count'] > 0)].copy()
valid_pricing_df['fare_per_mile_per_passenger'] = (
    valid_pricing_df['fare_amount'] /
    (valid_pricing_df['trip_distance'] * valid_pricing_df['passenger_count'])
)

pricing_summary = valid_pricing_df.groupby('passenger_count')['fare_per_mile_per_passenger'].mean()
sns.barplot(data=pricing_summary.reset_index(), x='passenger_count', y='fare_per_mile_per_passenger')
plt.title('Average Fare per Mile per Passenger')
plt.show()
```

**Result:** Fare per mile per person decreases as passenger count increases. Solo rides most expensive per person per mile.

**Outcome:** Promote group ride packages at 10–15% discount per person for 3–4 passengers — more competitive vs ride-hailing alternatives.

---

## 7.2 — Fare per Mile by Hour and Day

```python
valid_fare_df = df[df['trip_distance'] > 0].copy()
valid_fare_df['fare_per_mile'] = valid_fare_df['fare_amount'] / valid_fare_df['trip_distance']

# By hour
fare_by_hour = valid_fare_df.groupby('hour')['fare_per_mile'].mean()
sns.lineplot(data=fare_by_hour.reset_index(), x='hour', y='fare_per_mile')
plt.title('Average Fare per Mile by Hour')
plt.show()

# By day
fare_by_day = valid_fare_df.groupby('day_of_week')['fare_per_mile'].mean()
sns.barplot(data=fare_by_day.reset_index(), x='day_of_week', y='fare_per_mile')
plt.show()
```

**Result:** Fare per mile peaks during late night (11 PM – 3 AM). Day-of-week variation is low — weekends slightly higher.

**Outcome:** Introduce 1.2x surge multiplier for 11 PM – 3 AM window. Keep weekday rates competitive with ride-hailing.

---

## 7.3 — Vendor Fare Comparison by Hour

```python
vendor_df = df[df['trip_distance'] > 0].copy()
vendor_df['fare_per_mile'] = vendor_df['fare_amount'] / vendor_df['trip_distance']

vendor_hour_comparison = vendor_df.groupby(['vendorid', 'hour'])['fare_per_mile'].mean().reset_index()

sns.lineplot(data=vendor_hour_comparison, x='hour', y='fare_per_mile', hue='vendorid')
plt.title('Average Fare per Mile by Vendor and Hour')
plt.show()
```

**Insight:** Two vendors show distinct fare-per-mile profiles. One vendor charges higher at certain hours. May reflect metering algorithm differences or fleet composition.

---

## 7.4 — Vendor Fare by Distance Tier

```python
tier_df = df[df['trip_distance'] > 0].copy()
tier_df['fare_per_mile'] = tier_df['fare_amount'] / tier_df['trip_distance']
tier_df['distance_tier'] = pd.cut(
    tier_df['trip_distance'],
    bins=[0, 2, 5, float('inf')],
    labels=['<=2 miles', '2-5 miles', '>5 miles']
)

tier_vendor_comparison = tier_df.groupby(['vendorid', 'distance_tier'])['fare_per_mile'].mean().reset_index()
sns.barplot(data=tier_vendor_comparison, x='distance_tier', y='fare_per_mile', hue='vendorid')
plt.title('Average Fare per Mile by Vendor and Distance Tier')
plt.show()
```

**Result:** Short trips (≤2 miles) have highest fare per mile. Long trips (>5 miles) lowest. Both vendors follow same tier pattern.

**Insight:** Minimum fare charges make short trips disproportionately expensive per mile.

**Outcome:** Introduce flat-rate short-trip packages in high-density Manhattan zones. Long-distance incentive rates for airport volume.

---

[← Back to README](../README.md) | [Next: Customer Experience →](08_customer_experience.md)
