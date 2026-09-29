# Task 7 · How I used AI

## Tools and what they did
I used **Claude** (Anthropic) throughout this project, for more than a normal take-home would allow:

| Stage | What the AI did | What I did |
|---|---|---|
| Designing the brief | Drafted the business situation, rules, tasks and rubric | Set the goal (a fintech project that shows reconciliation and root-cause skills), chose the scope, and checked the draft against my list of business questions |
| Creating the data | Wrote the generator for the synthetic dataset and the planted problems | Decided which problems to plant and which stories the data should tell |
| Analysis | Wrote and debugged the pandas code, the charts and the first draft of the text | Reviewed every result, questioned the findings, and asked for changes |
| Writing | Drafted the memo and README | Edited for plain language and checked every number |

Because the AI also created the data, I knew what was planted. The analysis still had to find each problem from the files alone, and the notebook shows how.

## My best prompt, exactly as I sent it
This prompt made the model check its own plan against my requirements, and it found four real gaps (refund checks, a monthly-report file to compare against, missing settlement KPIs, and failures placed in the wrong task).

```
Before that answer these questions. 
You displayed few business question on Tarang
Business questions

1. Can we trust the data? Checks on each table, and checks across tables.
2. How is the business doing? Volume, success rate, average payment size, trends.
3. Where do payments fail? By method, bank, merchant type and time. Is it the customer's fault, or a bank or technical problem?
4. Do the systems match? Payments vs settlements vs refunds vs revenue.
5. Why are some successful payments settled late or never? (Root cause.)
6. Are we charging the right fees? Where is potential revenue leakage?
7. Which merchants matter most, and which need attention?
8. Do merchants stay with us? And do merchants with poor success rates leave sooner?
9. What should leadership do, and which numbers in the monthly report need fixing?

all these are answer in the above draft? If not are all these are needed? if yes you can draft. If not you can cut those questions.

Did you include all the KPI's?
Planted problems?
Other stories hidden in the data

* Payment failures cluster: one bank and one method fail much more at peak hours.
* A few merchants carry the business: a small share of merchants brings most of the TPV.
* Poor success rates drive merchants away: merchants whose payments often fail in their first month are more likely to stop using Tarang Pay.
* UPI is huge in volume but earns nothing, so revenue depends on cards and netbanking. This explains why take rate can fall even as volume grows.

9. Methods (all Python, no machine learning)

* pandas merges to join the six tables (showing you understand data grain)
* Validation checks written as small functions, with results in one table
* groupby and pivot tables for KPIs and segments
* Date and time work: settlement delays in working days, hour-of-day failures
* Cohort table for merchant retention
* matplotlib charts
```

## What the model got wrong, and how it was caught

**1. It fell into the exact trap the brief warns about.**
The first version of the on-time settlement rate counted payments that weren't due yet (the last days of August) as "late". That made August look worse, and made every bank look late about 3.7% of the time after May, when the real figure was about 2.9%. It was caught because the "other banks" line rose in May, even though nothing about those banks had changed. The fix: only judge payments whose payout date had arrived by 31 August.

**2. The written findings didn't match the numbers.**
The first draft of the text said Konkan Bank's evening failure rate was 41% (it's 40%), that Nilgiri's delays affect "800+ merchants" and "₹48 lakh a month" (it's 773 and ₹45 lakh), that the fee leak is 6.1% of revenue (it's 5.9%), and that "about half" of the May take-rate drop was the billing bug (it's about three-quarters). These were caught by checking every number in the text against the notebook output, and corrected.

**3. The first dataset was 3× too big, and the payment mix was unrealistic.**
The generator produced 1.6 million orders instead of about 500,000, and wallets were 13% of payments, far too high for India today. Both were caught by comparing the output with the plan, and both were fixed before any analysis.

**4. A chart showed noise as a finding.**
The Konkan Bank chart showed a 50% failure spike at 2 am. There are only a handful of netbanking payments at that hour, so the spike was noise. Hours with fewer than 40 attempts are now left out.

**What I learned:** the model is fast at writing correct-looking code and confident text. The checking has to be mine: does the row count match the plan, does the number in the sentence match the output, and does a pattern make business sense.
