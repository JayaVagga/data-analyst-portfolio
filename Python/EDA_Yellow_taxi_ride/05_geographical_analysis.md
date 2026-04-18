# Section 5 — Geographical Analysis

[← Back to README](README.md)

---

## 5.1 — Loading the NYC Taxi Zone Shapefile

```python
import geopandas as gpd

taxi_zones = gpd.read_file("taxi_zones.shp")
taxi_zones.plot()
plt.title("NYC Taxi Zones")
plt.show()
```

The shapefile contains 263 taxi zones across 5 boroughs with columns: `OBJECTID`, `Shape_Leng`, `Shape_Area`, `zone`, `LocationID`, `borough`, `geometry`.

---

## 5.2 — Merge Trip Data with Zone Geometry

```python
# Merge on PULocationID → LocationID
pickup_merged = df.merge(
    taxi_zones[['LocationID', 'zone', 'borough']],
    left_on='pulocationid',
    right_on='LocationID',
    how='left'
)
```

---

## 5.3 — Trips per Zone

```python
trips_per_location = pickup_merged.groupby('pulocationid').size().reset_index(name='trip_count')
trips_per_location = trips_per_location.sort_values(by='trip_count', ascending=False)
```

---

## 5.4 — Choropleth Map: Zone-Wise Trip Density

```python
zones_trip_merged = taxi_zones.merge(
    trips_per_location,
    left_on='LocationID',
    right_on='pulocationid',
    how='left'
)
zones_trip_merged['trip_count'] = zones_trip_merged['trip_count'].fillna(0)

fig, ax = plt.subplots(1, 1, figsize=(12, 10))
zones_trip_merged.plot(
    column='trip_count',
    cmap='YlOrRd',
    linewidth=0.5,
    edgecolor='black',
    legend=True,
    ax=ax
)
plt.title('NYC Taxi Pickup Density by Zone')
plt.show()
```

**Result:** Midtown Manhattan zones are overwhelmingly dominant. Outer boroughs show near-zero density.

**Insight:** Trip concentration in Manhattan reflects pedestrian density, business activity, and tourist presence. Outer boroughs have subway/bus alternatives.

**Outcome:** Concentrate fleet in Midtown during business hours. Outer-borough incentives could capture underserved demand and reduce empty return trips.

---

[← Back to README](../README.md) | [Next: Operational Efficiency →](06_operational_efficiency.md)
