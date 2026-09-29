"""Builds reports/bolo_august_budget_plan.pdf from reports/results.json and the charts.
Run the notebook first, then: python src/build_report.py (from the project root)."""
import json
from pathlib import Path
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.units import mm
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, Image, PageBreak, KeepTogether
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

ROOT = Path(__file__).resolve().parents[1]
R = json.loads((ROOT / "reports/results.json").read_text())
pdfmetrics.registerFont(TTFont("DV", "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"))
pdfmetrics.registerFont(TTFont("DVB", "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"))
INK, MUTED, BLUE, LINE = colors.HexColor("#1F2328"), colors.HexColor("#5B6470"), colors.HexColor("#2F6FDE"), colors.HexColor("#D5D9E0")
def S(name, **kw):
    base = dict(fontName="DV", fontSize=9.2, leading=12.6, textColor=INK); base.update(kw)
    return ParagraphStyle(name, **base)
h1 = S("h1", fontName="DVB", fontSize=17, leading=21, spaceAfter=2)
sub = S("sub", textColor=MUTED, fontSize=8.8, spaceAfter=8)
h2 = S("h2", fontName="DVB", fontSize=11, leading=14, spaceBefore=8, spaceAfter=4, textColor=BLUE)
body = S("body", spaceAfter=3, fontSize=8.8, leading=11.8)
bullet = S("bullet", leftIndent=11, bulletIndent=0, spaceAfter=2.5, fontSize=8.8, leading=11.8)
small = S("small", fontSize=7.8, leading=10, textColor=MUTED)
cell = S("cell", fontSize=7.9, leading=9.8)
cellb = S("cellb", fontName="DVB", fontSize=7.9, leading=9.8)

L = lambda v: f"₹{v/1e5:,.1f}L"
N = lambda v: f"{v:,.0f}"
tot = {r["index"]: r for r in R["totals"]}
down = {r["index"]: r for r in R["downside_totals"]}
paid_now, paid_new = tot["expected paying users"]["today's split"], tot["expected paying users"]["proposed"]
cac_now, cac_new = tot["cost per paying user"]["today's split"], tot["cost per paying user"]["proposed"]
sens = R["sensitivity"]; lo, hi = sens[0]["gain %"], sens[2]["gain %"]
kpi = {r["campaign"]: r for r in R["kpi"]}
order = list(kpi)
prop = {r["campaign"]: r for r in R["proposed"]}; cur = {r["campaign"]: r for r in R["current"]}; dn = {r["campaign"]: r for r in R["downside"]}
net_per_user = tot["expected 1st-month net revenue"]["proposed"] / paid_new
inmobi_now = sum(cur[c]["share %"] for c in order if cur[c]["channel"] == "inmobi")
inmobi_new = sum(prop[c]["share %"] for c in order if prop[c]["channel"] == "inmobi")

def table(rows, widths, bold_last=False):
    data = [[Paragraph(str(x), cellb if i == 0 or (bold_last and i == len(rows) - 1) else cell) for x in r] for i, r in enumerate(rows)]
    t = Table(data, colWidths=widths, hAlign="LEFT")
    t.setStyle(TableStyle([("LINEBELOW", (0, 0), (-1, 0), .8, INK), ("LINEBELOW", (0, 1), (-1, -1), .3, LINE),
                           ("VALIGN", (0, 0), (-1, -1), "MIDDLE"), ("TOPPADDING", (0, 0), (-1, -1), 2.2), ("BOTTOMPADDING", (0, 0), (-1, -1), 2.2),
                           ("LEFTPADDING", (0, 0), (-1, -1), 3), ("RIGHTPADDING", (0, 0), (-1, -1), 3)]))
    return t

story = [Paragraph("Bolo · August paid-media plan", h1),
         Paragraph("Budget recommendation for ₹1 crore across 6 campaigns · based on 90 days of data, 1 May – 29 July 2026 · all amounts ex-GST", sub),
         Paragraph("Recommendation", h2)]
recs = [
    f"<b>Fill josh and glance to the highest spend each has been tested at, and cut inmobi from {inmobi_now:.0f}% of the budget to {inmobi_new:.1f}%.</b> "
    f"Expected result: <b>{N(paid_new)} paying users in August instead of {N(paid_now)}</b> (+{tot['expected paying users']['change %']:.0f}%, range +{lo:.0f}% to +{hi:.0f}%) for the same ₹1 crore, "
    f"at ₹{cac_new:,.0f} per paying user instead of ₹{cac_now:,.0f}.",
    f"<b>Cut <font name='DVB'>im_cpa_trial</font> from ₹19.4L to ₹11.7L now, and switch it off as soon as there's somewhere better for the money.</b> "
    "It has the second-cheapest trials but the most expensive paying users (₹1,177). It survives at ₹1 crore only because josh and glance are already at their tested ceilings.",
    "<b>Test whether josh can take more.</b> For two weeks, run <font name='DVB'>jo_lookalike_5pct</font> and <font name='DVB'>jo_interest_learners</font> 20% above their highest tested spend, funded from "
    "<font name='DVB'>im_cpa_trial</font>. If their cost per paying user stays under ₹1,075, move the rest of <font name='DVB'>im_cpa_trial</font>'s budget too.",
    f"<b>If the budget is cut to ₹60 lakh</b>, switch <font name='DVB'>im_cpa_trial</font> off and take <font name='DVB'>im_cpi_optimised</font> to its minimum. That keeps "
    f"{down['expected paying users']['₹60L as % of ₹1cr']:.0f}% of the paying users on 60% of the money.",
    "<b>Steer every week on cost per paying user</b>, with each day's trials matched to the next day's renewals. Cost per trial rewards campaigns for trials that never pay.",
]
story += [Paragraph(r, bullet, bulletText="•") for r in recs]
story += [Spacer(1, 4), Image(str(ROOT / "charts/00_recommendation.png"), width=172*mm, height=172*mm*572/1170),
          Paragraph("<b>What it's telling you:</b> move money from the two inmobi campaigns to josh and glance until josh and glance reach the highest spend they've been tested at.", body),
          Paragraph("August plan at ₹1 crore", h2)]
rows = [["campaign", "channel", "today's split", "proposed", "expected trials", "expected paying users", "1st-month net revenue", "cost per paying user"]]
for c in order:
    p = prop[c]
    rows.append([c, p["channel"], L(cur[c]["monthly spend"]), L(p["monthly spend"]), N(p["expected trials"]), N(p["expected paying users"]),
                 L(p["expected 1st-month net revenue"]), f"₹{p['cost per paying user']:,.0f}"])
t = tot
rows.append(["total", "", L(1e7), L(1e7), N(t["expected trials"]["proposed"]), N(paid_new), L(t["expected 1st-month net revenue"]["proposed"]), f"₹{cac_new:,.0f}"])
story.append(table(rows, [34*mm, 15*mm, 19*mm, 17*mm, 18*mm, 20*mm, 23*mm, 20*mm], bold_last=True))
story.append(Paragraph(f"Headline number: <b>expected paying users ({N(paid_new)})</b>. It's what the budget exists to buy, and it's the unit of the weekly steering metric. "
                       f"Trials fall 3% under this plan while paying users rise {tot['expected paying users']['change %']:.0f}%, which is exactly the shift the plan is meant to make.", small))
story.append(PageBreak())

story += [Paragraph("Evidence", h2),
          Paragraph("<b>1. Campaign performance, trial-day cohorts.</b> Each day's trials are matched to the renewals charged the next day. Flagged data is excluded from these ratios.", body)]
rows = [["campaign", "cost per install", "cost per trial", "trial → paid", "cost per paying user", "annual plan share", "net 1st-month ROAS"]]
for c in order:
    k = kpi[c]
    rows.append([c, f"₹{k['cost per install']:.1f}", f"₹{k['cost per trial']:.0f}", f"{k['trial→paid %']:.1f}%", f"₹{k['cost per paying user']:,.0f}", f"{k['annual plan %']:.0f}%", f"{k['net 1st-month ROAS']:.2f}"])
story.append(table(rows, [36*mm, 22*mm, 21*mm, 21*mm, 26*mm, 24*mm, 24*mm]))
story += [Spacer(1, 5),
          Paragraph("<b>2. The cheap-trial trap.</b> <font name='DVB'>jo_retarget_signup</font> and <font name='DVB'>im_cpa_trial</font> have almost the same cost per trial (₹115 and ₹117). "
                    "But <font name='DVB'>jo_retarget_signup</font> has the cheapest paying users (₹270) and <font name='DVB'>im_cpa_trial</font> has the most expensive (₹1,177), "
                    "because only 10% of <font name='DVB'>im_cpa_trial</font>'s trials pay. Ranking by net ROAS gives the same order.", body),
          Image(str(ROOT / "charts/02_cost_per_trial_vs_paying_user.png"), width=84*mm, height=84*mm*546/1040),
          Paragraph("<b>3. Diminishing returns are real, so the plan can't just pour money into the best campaign.</b> In 5 of 6 campaigns, high-spend days cost more per paying user than low-spend days. "
                    f"A shared log-log fit across all six campaigns gives an elasticity of {R['b_shared']:.2f} (standard error {R['b_se']:.2f}): doubling spend brings about 67% more paying users, not 100%. "
                    "The plan spends until the next paying user costs the same in every funded campaign, and never goes above or below the daily spend each campaign has actually run at. "
                    f"At ₹1 crore, the last paying user bought costs ₹{R['marginal']:,.0f}, nearly twice the plan average.", body),
          Paragraph("<b>4. Weekends.</b> josh prospecting gets paying users 5–8% cheaper on weekends; inmobi and josh retargeting are 17–25% more expensive; glance is flat. "
                    "Worth a four-week scheduling test; not included in the numbers above.", body),
          Paragraph("<b>5. Data fixes applied before any of this.</b>", body)]
fixes = [["issue", "rows", "how it was found", "handling"],
         ["Trial tracking outage, jo_interest_learners and jo_lookalike_5pct, 6–12 June", "14", "13 June renewals exceeded the previous day's trials; trials fell ~95% while installs stayed normal", "Kept spend; excluded trial cohorts 5–12 June from ratios; no interpolation"],
         ["glance revenue reported including 18% GST, 15–21 July", "7", "Revenue was exactly 1.18× what prices × plans give", "Recomputed from trials and renewals (−₹21,677)"],
         ["im_cpi_optimised spend posted twice, 22 May", "1", "CPM ₹84 vs a usual ₹42; impressions and installs normal", "Halved (−₹74,157); confirm with invoice"]]
story.append(table(fixes, [52*mm, 10*mm, 58*mm, 54*mm]))
story += [Paragraph("Caveats", h2)]
cav = [
    f"<b>Only the first charge is visible.</b> A paying user brings about ₹{net_per_user:,.0f} of net revenue in month one, and the marginal user in this plan costs ₹{R['marginal']:,.0f}. "
    "Whether the last ₹35 lakh is worth spending depends on month-two-onward retention, which this data doesn't contain. That's the first thing to get from the product team.",
    "<b>Predictions stay inside tested spend levels.</b> The josh ceiling test exists because the data can't say what josh does above its highest tested spend.",
    "<b>The elasticity is a single shared estimate.</b> Campaign-level fits were too noisy (standard errors 0.13–0.22). The allocation is the same at 0.55 and 0.90; only the size of the gain changes.",
    "<b>Attribution is taken as given.</b> If inmobi counts installs more generously than josh, part of the gap is measurement, not performance.",
    "<b>Refunds are booked on the day they happen</b>, so they're applied as each campaign's 90-day refund rate (2.5–2.7% of subscription revenue), not matched to cohorts.",
]
story += [Paragraph(c_, bullet, bulletText="•") for c_ in cav]

def footer(canvas, doc):
    canvas.setFont("DV", 7); canvas.setFillColor(MUTED)
    canvas.drawString(18*mm, 10*mm, "Synthetic dataset · full analysis in notebooks/bolo_growth_analysis.ipynb")
    canvas.drawRightString(192*mm, 10*mm, f"page {doc.page}")
doc = SimpleDocTemplate(str(ROOT / "reports/bolo_august_budget_plan.pdf"), pagesize=A4, leftMargin=18*mm, rightMargin=18*mm, topMargin=12*mm, bottomMargin=16*mm,
                        title="Bolo · August paid-media plan")
doc.build(story, onFirstPage=footer, onLaterPages=footer)
print("wrote reports/bolo_august_budget_plan.pdf")
