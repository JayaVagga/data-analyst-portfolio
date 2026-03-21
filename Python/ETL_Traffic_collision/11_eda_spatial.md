# EDA 3.8 — Spatial Distribution of Collisions

[← Back to README](../README.md) | [← EDA Overview](03_eda_overview.md)

---

## Analysis Type: Spatial Analysis

**Question:** How are collisions distributed geographically across California counties and coordinates?

---

## 3.8.1 — County-Level Choropleth Map

```python
import geopandas as gpd

# Aggregate collisions by county
county_counts = (
    df_dict["collisions"]
    .groupBy("county_location")
    .count()
    .toPandas()
)
county_counts.columns = ["county", "collision_count"]

# Load California county boundaries
url = "https://raw.githubusercontent.com/codeforamerica/click_that_hood/master/public/data/california-counties.geojson"
ca_map = gpd.read_file(url)

# Normalise names for join
county_counts["county"] = (
    county_counts["county"]
    .str.lower()
    .str.replace(r"\s+county", "", regex=True)
    .str.strip()
)
ca_map["name"] = ca_map["name"].str.lower().str.strip()

# Merge and plot
ca_merged = ca_map.merge(county_counts, left_on="name", right_on="county", how="left")
ca_merged["collision_count"] = ca_merged["collision_count"].fillna(0)

fig, ax = plt.subplots(1, 1, figsize=(10, 12))
ca_merged.plot(
    column="collision_count",
    cmap="OrRd",
    linewidth=0.5,
    edgecolor="black",
    legend=True,
    ax=ax
)
plt.title("Collision Density by County (California)")
plt.tight_layout()
plt.show()
```

---

## 3.8.2 — Geographic Scatter Plot (Latitude/Longitude)

```python
geo_df = df_dict["collisions"].select("latitude", "longitude")
geo_pd = geo_df.toPandas().dropna()

geo_pd["latitude"]  = pd.to_numeric(geo_pd["latitude"],  errors="coerce")
geo_pd["longitude"] = pd.to_numeric(geo_pd["longitude"], errors="coerce")
geo_pd = geo_pd.dropna()

plt.figure(figsize=(8, 10))
plt.scatter(geo_pd["longitude"], geo_pd["latitude"], s=1, alpha=0.3, color="steelblue")
plt.xlabel("Longitude")
plt.ylabel("Latitude")
plt.title("Geographic Distribution of Traffic Collisions (California)")
plt.tight_layout()
plt.show()
```

---

## Result

**County-level:** A small number of urban counties account for a disproportionate share of total collisions. Los Angeles County alone accounts for a significant portion of statewide collision volume.

**Scatter plot:** Collisions cluster densely along the I-5, US-101, and I-405 corridors — California's major urban freeways. Rural counties in the north and east show sparse, near-zero density.

---

## Insight

Risk is **geographically concentrated**. The 80/20 principle applies strongly: roughly 20% of California counties account for 80%+ of total collisions. Urban density, road complexity, intersection frequency, and traffic volume all compound in metropolitan areas to create collision hotspots that are structurally different from rural incidents.

## Outcome

> **Hotspot-based infrastructure investment** is more cost-effective than uniform statewide spending. GIS-based collision density mapping should directly inform:
> - Where to deploy speed cameras
> - Where to prioritise intersection redesign
> - Which corridors need enhanced signal timing
> - Where to concentrate pedestrian safety upgrades

---

[← Back to README](../README.md) | [Next: Time Trends →](12_eda_time_trends.md)
