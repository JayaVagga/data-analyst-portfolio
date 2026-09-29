"""Builds reports/tarang_pay_memo.pdf (memo + investigation log) from reports/results.json and charts/."""
import json
from pathlib import Path
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.units import mm
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, Image, PageBreak
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from PIL import Image as PILImage

ROOT = Path(__file__).resolve().parents[1]
R = json.loads((ROOT / "reports/results.json").read_text())
LINK = {r["first-month technical errors"]: r["active_month_3_pct"] for r in R["link"]}
for n, f in [("DV", "DejaVuSans.ttf"), ("DVB", "DejaVuSans-Bold.ttf")]:
    pdfmetrics.registerFont(TTFont(n, f"/usr/share/fonts/truetype/dejavu/{f}"))
INK, MUTED, ACC, LINE = colors.HexColor("#1B1F24"), colors.HexColor("#5B6470"), colors.HexColor("#0F766E"), colors.HexColor("#D5D9E0")
def S(n, **k):
    b = dict(fontName="DV", fontSize=8.6, leading=11.4, textColor=INK); b.update(k); return ParagraphStyle(n, **b)
h1, sub = S("h1", fontName="DVB", fontSize=16, leading=20), S("sub", textColor=MUTED, spaceAfter=4, fontSize=8.4)
h2 = S("h2", fontName="DVB", fontSize=10.5, leading=13, spaceBefore=6, spaceAfter=3, textColor=ACC)
body, bul = S("b", spaceAfter=2.5), S("bu", leftIndent=10, spaceAfter=2)
small = S("sm", fontSize=7.8, leading=10, textColor=MUTED)
cell, cellb = S("c", fontSize=7.4, leading=9.2), S("cb", fontName="DVB", fontSize=7.4, leading=9.2)
b = lambda t: f"<font name='DVB'>{t}</font>"
lakh = lambda v: f"₹{v / 1e5:.2f} lakh"
def img(name, w):
    W, H = PILImage.open(ROOT / "charts" / name).size; return Image(str(ROOT / "charts" / name), width=w * mm, height=w * mm * H / W)
def table(rows, widths):
    t = Table([[Paragraph(str(x), cellb if i == 0 else cell) for x in r] for i, r in enumerate(rows)], colWidths=widths, hAlign="LEFT", repeatRows=1)
    t.setStyle(TableStyle([("LINEBELOW", (0, 0), (-1, 0), .8, INK), ("LINEBELOW", (0, 1), (-1, -1), .3, LINE), ("VALIGN", (0, 0), (-1, -1), "TOP"),
                           ("TOPPADDING", (0, 0), (-1, -1), 2), ("BOTTOMPADDING", (0, 0), (-1, -1), 2), ("LEFTPADDING", (0, 0), (-1, -1), 3)]))
    return t

s = [Paragraph("Tarang Pay · where should October’s one sprint go?", h1),
     Paragraph(f"Memo to the Head of Payments Operations · data 1 Jan – 31 Aug 2026 · ₹{R['tpv_cr_total']:.0f} crore of TPV · fictional company and data", sub),
     Paragraph(f"{b('Business problem:')} payment volume nearly doubled this year (₹8.9 crore to ₹17 crore a month), but fee revenue grew only by a third. "
               "Numbers that didn't match between systems, a refund spike and late payouts left leadership unsure which figures to trust before the investor update. "
               f"{b('Main question:')} which one fix should get October's engineering sprint?", body),
     Paragraph("Recommendation", h2)]
recs = [
    f"{b('Spend the October sprint on option B: fix the Growth-plan card pricing and recover the missed fees.')} Since 1 May, {R['leak_merchants']} merchants have paid ₹0 on "
    f"card payments. That's {lakh(R['leak_total'])} so far and about ₹{R['leak_month'] / 1e3:.0f},000 a month ({R['leak_share']:.1f}% of fee revenue). Ask sales first whether any were promised 0%.",
    f"{b('Escalate Nilgiri Bank now, and make option A the next sprint.')} Since May, about {R['nil_late_after_may']:.0f}% of its payments reach merchants a working day late, "
    f"against about {R['other_banks_late_after_may']:.0f}% at other banks: about ₹{R['nil_month'] / 1e5:.0f} lakh of payouts a month, across {R['nil_merchants']} merchants, many of them our largest.",
    f"{b('Fix the monthly report before the investor update.')} Report success by order ({R['order_success']:.1f}%, not {R['attempt_success']:.1f}%); add the {R['fbs_n']} "
    f"payments paid out while marked failed to July TPV ({lakh(R['fbs_value'])}); restore June's missing ledger entries (₹{R['ledger_gap']:,.0f}); show refunds by the month of the original payment.",
    f"{b('Ask engineering about 1–24 July:')} {R['fbs_n']} payments timed out on our side but were captured by the bank. Check whether those customers paid twice.",
    f"{b('Watch new merchants’ checkouts.')} Merchants with technical errors on more than 4% of first-month payments were still active three months later "
    f"{LINK['above 4%']:.0f}% of the time, against {LINK['4% or less']:.0f}% for the rest.",
]
s += [Paragraph(x, bul, bulletText="•") for x in recs]
s += [Spacer(1, 3), img("00_recommendation.png", 150),
      Paragraph(f"{b('What the chart says:')} fix the Growth-plan card pricing now: every month it waits costs about ₹{R['leak_month'] / 1e3:.0f},000.", body),
      Paragraph(f"Headline number: {b(lakh(R['leak_total']) + ' of card fees not charged since 1 May')}. It's in rupees, exact, has one cause and one owner, and grows every month. "
                f"For the investor deck I'd use {b('net take rate, shown next to UPI share')}: TPV rewards volume that earns nothing, and success rate doesn't connect to money.", small),
      Paragraph("Evidence", h2)]
take_txt = f"{R['take_jan']:.2f}% to {R['take_aug']:.2f}%"
ontime_txt = f"{R['on_time_before']:.1f}% to {R['on_time_after']:.1f}% in May."
ev = [
    f"{b('Take rate fell from ')}{b(take_txt)}{b(', mostly for a good reason:')} "
    f"UPI, which earns 0%, grew from {R['upi_jan']:.0f}% to {R['upi_aug']:.0f}% of TPV. The rate on card, netbanking and wallet payments also dropped in May, and about three-quarters of that drop is the ₹0 card fees.",
    f"{b('On-time payouts fell from ')}{b(ontime_txt)} "
    f"Nilgiri Bank started sending success statuses 3–30 hours late, so many miss the 23:00 cut-off. The other late payouts ({R['late_cutoff']:,} across eight months) are the cut-off working as designed.",
    f"{b('Every successful payment that was never paid out is explained:')} most weren't due yet when the data ends, and {R['kyc_payments']} ({lakh(R['kyc_value'])}) belong to "
    f"{R['kyc_merchants']} merchants on KYC hold, which the rules allow.",
    f"{b('Failures:')} {R['customer_fail_share']:.0f}% are the customer's choice. Konkan Bank netbanking fails {R['konkan_peak']:.0f}% of the time from 7 to 11 pm, against "
    f"{R['other_peak']:.0f}% at other banks.",
    f"{b('The August refund spike is not an error:')} {R['spike_n']:,} refunds ({lakh(R['spike_value'])}) in one week are returns from the 7–10 August sale.",
]
s += [Paragraph(x, bul, bulletText="•") for x in ev]
s += [Paragraph("Caveats", h2),
      Paragraph("The company and data are fictional. \"Potential leakage\" stays potential until sales confirms what the 85 merchants were promised. The retention link rests on "
                "109 merchants, and a failing checkout may signal a weaker business rather than cause merchants to leave. August refunds are incomplete: refunds can arrive up to 90 days later.", body),
      PageBreak(),
      Paragraph("Appendix · Investigation log", h2)]
rows = [["What I noticed", "Rows and ₹", "What I think happened", "Handling", "Why"]] + [[r["what I noticed"], r["rows and ₹"], r["what I think happened"], r["handling"], r["why"]] for r in R["log"]]
rows.append(["Payouts a working day late (Nilgiri Bank)", f"{R['late_nil']:,} payments since May", "Nilgiri sends success statuses 3–30 h late, missing the 23:00 cut-off",
             "Left alone; escalated", "The rule worked; the bank feed is the problem"])
rows.append(["Payouts a working day late (other)", f"{R['late_cutoff']:,} payments", "Payment or status after 23:00", "Left alone", "Expected under the cut-off rule"])
rows.append(["Monthly report: success rate", "every month", "Counts attempts, so retries look like lost payments", "Recalculated by order", "Orders are what merchants get paid for"])
s.append(table(rows, [34*mm, 30*mm, 44*mm, 32*mm, 34*mm]))
s += [Paragraph("Questions I would ask, and what I assumed meanwhile", h2),
      table([["Question", "Assumption I made"],
             ["Did payment timeout handling change on 1 July and roll back on 24 July? Were any customers charged twice?", "The bank captured these payments, so they count as successful"],
             ["Were any Growth-plan merchants promised 0% on cards?", "No: the pricing table is the agreement, so the gap is potential leakage"],
             ["Did the ledger booking job fail on 16–18 June?", "Yes: I used settlement fees for revenue and reported the ledger gap separately"],
             ["Does Nilgiri Bank know about a status delay since May?", "It's on the bank's side: it affects one bank and starts on one date"],
             ["Can refunds fail or be reversed?", "No: the refunds file shows completed refunds only"],
             ["What counts as an active merchant?", "At least one successful payment in the month (or 30-day window)"]], [95*mm, 79*mm]),
      Spacer(1, 4),
      Paragraph("Working: notebooks/tarang_pay_analysis.ipynb reruns from the data files. How AI was used: AI_USAGE.md.", small)]

def page(c, d):
    c.setFont("DV", 7); c.setFillColor(MUTED)
    c.drawString(18*mm, 10*mm, "Tarang Pay · fictional company and data · portfolio project"); c.drawRightString(192*mm, 10*mm, f"page {d.page}")
    c.setFillColor(ACC); c.rect(0, 297*mm - 3*mm, 210*mm, 3*mm, fill=1, stroke=0)
doc = SimpleDocTemplate(str(ROOT / "reports/tarang_pay_memo.pdf"), pagesize=A4, leftMargin=18*mm, rightMargin=18*mm, topMargin=13*mm, bottomMargin=16*mm,
                        title="Tarang Pay · where should October’s one sprint go?")
doc.build(s, onFirstPage=page, onLaterPages=page)
print("wrote reports/tarang_pay_memo.pdf")
