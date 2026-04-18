# Section 6 — Operational Efficiency

[← Back to README](README.md)

---

## 6.1 — Trips per Hour (Scaled to Full Population)

Since only 8% was sampled, actual trip estimates are scaled up:

```python
trips_per_hour = df.groupby('hour').size().reset_index(name='sampled_trip_count')
sample_fraction = 0.08
trips_per_hour['estimated_trip_count'] = trips_per_hour['sampled_trip_count'] * (1 / sample_fraction)

# Busiest hour
busiest_hour = trips_per_hour.loc[trips_per_hour['estimated_trip_count'].idxmax()]
```

**Result:** Peak at hour 15 (3 PM). Minimum at hour 4 (4 AM).

**Outcome:** Deploy maximum fleet at 3 PM. Implement dynamic pricing 2–7 PM.

---

## 6.2 — Weekday vs Weekend Hourly Demand

```python
df['is_weekend'] = df['day_of_week'].isin(['Saturday', 'Sunday'])

weekday_weekend_trips = df.groupby(['hour', 'is_weekend']).size().reset_index(name='sampled_trip_count')
weekday_weekend_trips['estimated_trip_count'] = weekday_weekend_trips['sampled_trip_count'] * (1/0.08)

sns.lineplot(data=weekday_weekend_trips, x='hour', y='estimated_trip_count', hue='is_weekend')
plt.title('Hourly Trip Demand: Weekdays vs Weekends')
plt.show()
```

**Result:** Weekdays: sharp morning (7–9 AM) and evening (5–7 PM) peaks. Weekends: flatter, later-starting, broader midday peak.

**Outcome:** Separate weekday/weekend driver schedules. Late-night coverage more valuable on weekends.

---

## 6.3 — Top 10 Pickup and Dropoff Zones (Hourly Trends)

```python
top_10_pickups = pickup_merged['zone'].value_counts().head(10)

hourly_pickup_trend = pickup_merged[pickup_merged['zone'].isin(top_10_pickups.index)] \
    .groupby(['zone','hour']).size().reset_index(name='trip_count')

sns.lineplot(data=hourly_pickup_trend, x='hour', y='trip_count', hue='zone')
plt.title('Hourly Pickup Trends for Top 10 Zones')
plt.show()
```

**Insight:** Each top zone has a distinct temporal fingerprint. Airports align with flight schedules; entertainment zones peak late evening; business districts peak mid-morning.

---

## 6.4 — Night Zones (11 PM – 5 AM)

```python
night_hours = [23, 0, 1, 2, 3, 4, 5]
night_pickups = pickup_merged[pickup_merged['hour'].isin(night_hours)]
top_10_night_pickups = night_pickups['zone'].value_counts().head(10)

sns.barplot(x=top_10_night_pickups.values, y=top_10_night_pickups.index)
plt.title('Top 10 Night Pickup Zones (11 PM – 5 AM)')
plt.show()
```

**Result:** Entertainment zones, nightlife areas, and transit hubs dominate night pickups. Residential zones dominate night dropoffs.

**Outcome:** Position night fleet near entertainment hubs at 10 PM. Surge pricing 1–3 AM captures low-supply, high-demand windows.

---

## 6.5 — Night vs Day Revenue Share

```python
night_df = df[df['hour'].isin([23, 0, 1, 2, 3, 4, 5])]
day_df = df[~df['hour'].isin([23, 0, 1, 2, 3, 4, 5])]

night_share = (night_df['total_amount'].sum() / df['total_amount'].sum()) * 100
# Night: ~17% | Day: ~83%
```

**Outcome:** Night operations are revenue-positive. Maintaining reduced but active night fleet is economically justified — especially near airports.

---

[← Back to README](../README.md) | [Next: Pricing Strategy →](07_pricing_strategy.md)
