# Section 4 — Financial Analysis

[← Back to README](README.md)

---

## 4.1 — Monthly Revenue Trend

```python
monthly_revenue = df.groupby('month')['total_amount'].sum().reset_index()

plt.figure(figsize=(10,5))
plt.plot(monthly_revenue['month'], monthly_revenue['total_amount'], marker='o')
plt.title('Monthly Revenue Trend')
plt.xlabel('Month')
plt.ylabel('Total Revenue (USD)')
plt.show()
```

**Result:** Revenue peaks at Month 5 (May) and Month 10 (October). Lowest in January–February.

**Outcome:** Budget for ~15–20% seasonal revenue swing. Use slow months for capital reinvestment.

---

## 4.2 — Quarterly Revenue Distribution

```python
df['quarter'] = pd.to_datetime(df['tpep_pickup_datetime']).dt.quarter
quarter_revenue = df.groupby('quarter')['total_amount'].sum().reset_index()

plt.figure(figsize=(6,6))
plt.pie(quarter_revenue['total_amount'],
        labels=['Q1','Q2','Q3','Q4'], autopct='%1.1f%%')
plt.title('Revenue Proportion by Quarter')
plt.show()
```

**Result:** Q2 = 26.9%, Q4 = 26.7%, Q3 = 25.6%, Q1 ≈ 20.8%.

**Insight:** Balanced quarterly distribution with slight Q2/Q4 advantage — spring events and fall tourism/holiday season.

**Outcome:** Invest in marketing campaigns ahead of Q2 (April) and Q4 (September) to maximise peak capture.

---

## 4.3 — Trip Distance vs Fare Amount

```python
plt.figure(figsize=(8,5))
plt.scatter(df_filtered['trip_distance'], df_filtered['fare_amount'], alpha=0.3)
plt.title('Trip Distance vs Fare Amount')
plt.show()

correlation = df_filtered[['trip_distance', 'fare_amount']].corr().iloc[0,1]
# Result: r = 0.87
```

**Result:** Strong positive correlation r = 0.87. Linear relationship across most of the distance range.

**Outcome:** Promote airport and outer-borough trips to drivers as highest-revenue opportunities.

---

## 4.4 — Fare vs Duration and Passenger Count

```python
# Trip duration
df_filtered['trip_duration'] = (
    pd.to_datetime(df_filtered['tpep_dropoff_datetime']) -
    pd.to_datetime(df_filtered['tpep_pickup_datetime'])
).dt.total_seconds() / 60

# Fare vs Duration: r = 0.26
# Fare vs Passengers: r = 0.045
```

**Insight:** Duration has weak positive impact on fare — congestion extends trips without proportional fare increase. Passenger count has negligible impact (flat-rate structure).

**Outcome:** Consider time-based fare components during peak congestion hours.

---

## 4.5 — Tip Amount vs Trip Distance

```python
correlation = df_tip_dist[['trip_distance', 'tip_amount']].corr().iloc[0,1]
# Result: r = 0.61
```

**Result:** Moderate-to-strong positive correlation (r=0.61).

**Insight:** Longer trips generate higher tips — passengers have more time to form positive impressions.

**Outcome:** Train drivers to be attentive on longer trips. In-app tip prompts after long rides.

---

## 4.6 — Payment Type Distribution

```python
payment_labels = {1: "Credit Card", 2: "Cash", 3: "No Charge", 4: "Dispute", 5: "Unknown", 6: "Voided Trip"}
df['payment_label'] = df['payment_type'].map(payment_labels)

sns.countplot(x='payment_label', data=df)
plt.title('Distribution of Payment Types')
plt.show()
```

**Result:** Credit card is dominant. Cash second. Disputes and voids are minimal.

**Insight:** Digital payment shift means tips are captured automatically for majority of trips (card payments include automatic tip prompt).

**Outcome:** Investigate dispute patterns even at low volumes — they signal service quality issues.

---

[← Back to README](../README.md) | [Next: Geographical Analysis →](05_geographical_analysis.md)
