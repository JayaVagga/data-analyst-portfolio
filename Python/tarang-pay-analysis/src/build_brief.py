"""Builds brief/tarang_pay_assignment.pdf: the take-home brief this project answers."""
from pathlib import Path
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.units import mm
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

ROOT = Path(__file__).resolve().parents[1]
for n, f in [("DV", "DejaVuSans.ttf"), ("DVB", "DejaVuSans-Bold.ttf"), ("DVM", "DejaVuSansMono.ttf")]:
    pdfmetrics.registerFont(TTFont(n, f"/usr/share/fonts/truetype/dejavu/{f}"))
INK, MUTED, ACC, LINE, SOFT = colors.HexColor("#1B1F24"), colors.HexColor("#5B6470"), colors.HexColor("#0F766E"), colors.HexColor("#D5D9E0"), colors.HexColor("#EEF6F5")
def S(n, **k):
    b = dict(fontName="DV", fontSize=9, leading=12.6, textColor=INK); b.update(k); return ParagraphStyle(n, **b)
kicker = S("k", fontName="DVB", fontSize=8, textColor=ACC, leading=10, spaceAfter=2)
title = S("t", fontName="DVB", fontSize=24, leading=28, spaceAfter=4)
lead = S("l", fontSize=10.5, leading=15, textColor=MUTED, spaceAfter=10)
h2 = S("h2", fontName="DVB", fontSize=12.5, leading=16, spaceBefore=10, spaceAfter=4, textColor=INK, keepWithNext=1)
h3 = S("h3", fontName="DVB", fontSize=9.6, leading=13, spaceBefore=5, spaceAfter=2, textColor=ACC)
body = S("b", spaceAfter=4)
bul = S("bu", leftIndent=11, spaceAfter=2.5)
cell, cellb = S("c", fontSize=8.2, leading=10.4), S("cb", fontName="DVB", fontSize=8.2, leading=10.4)
box = S("box", fontSize=9, leading=12.6, textColor=INK)
code = lambda t: f"<font name='DVM' size='8.3'>{t}</font>"
b = lambda t: f"<font name='DVB'>{t}</font>"

def table(rows, widths, head=True):
    t = Table([[Paragraph(str(x), cellb if (i == 0 and head) else cell) for x in r] for i, r in enumerate(rows)], colWidths=widths, hAlign="LEFT")
    t.setStyle(TableStyle([("LINEBELOW", (0, 0), (-1, 0), .8, INK), ("LINEBELOW", (0, 1), (-1, -1), .3, LINE), ("VALIGN", (0, 0), (-1, -1), "TOP"),
                           ("TOPPADDING", (0, 0), (-1, -1), 2.4), ("BOTTOMPADDING", (0, 0), (-1, -1), 2.4), ("LEFTPADDING", (0, 0), (-1, -1), 3)]))
    return t
def callout(text):
    t = Table([[Paragraph(text, box)]], colWidths=[174 * mm])
    t.setStyle(TableStyle([("BACKGROUND", (0, 0), (-1, -1), SOFT), ("LINEBEFORE", (0, 0), (0, -1), 2.5, ACC),
                           ("TOPPADDING", (0, 0), (-1, -1), 6), ("BOTTOMPADDING", (0, 0), (-1, -1), 6), ("LEFTPADDING", (0, 0), (-1, -1), 8)]))
    return t
def task(n, name, mins):
    return Paragraph(f"Task {n} · {name} <font color='#5B6470' size='9'>· {mins} min</font>", h2)
P = lambda t: Paragraph(t, body)
B = lambda items: [Paragraph(i, bul, bulletText="•") for i in items]

s = []
s += [Paragraph("TARANG PAY · PAYMENTS OPERATIONS ANALYTICS", kicker),
      Paragraph("Data analyst take-home", title),
      Paragraph("About 4.5 hours of work, 72 hours to send it back. Python only. We're reading your judgement, not your formatting.", lead),
      table([["Role", "Company", "Time", "Tools"], ["Data analyst", "Tarang Pay (fictional)", "~4.5 h · 72 h to submit", "Python"]], [40*mm, 48*mm, 46*mm, 40*mm]),
      Paragraph("Before you start", h2),
      P("Tarang Pay is a payment gateway for Indian online businesses. Merchants use us to accept UPI, card, netbanking and wallet payments. "
        "We collect the money, keep a fee, and pay the rest out to the merchant."),
      P(f"Tarang Pay is invented for this assignment. There's nothing to look up. {b('Treat every rule below as true.')}"),
      P("We're preparing our investor update. Payment volume grew fast this year, but three teams don't agree on what the numbers mean:"),
      *B([f"{b('Finance')} says fee revenue in the books is lower than our volume should produce.",
          f"{b('Operations')} says merchants complain that some payments reach them late, or never.",
          f"{b('The CFO')} saw refunds spike in one week of August and wants to know if something broke."]),
      P(f"Your job isn't to build a dashboard. It's to tell us {b('which numbers we can trust, where money is going missing, and what to fix first.')}"),
      callout(f"{b('If something is unclear, write the question down.')} Send a short list of the questions you would ask us, with the assumption you made for each. "
              "Asking a good question counts for you. Guessing silently counts against you."),
      Spacer(1, 5),
      callout(f"{b('Using AI tools is expected, not just tolerated.')} Task 7 asks you to show how you used them."),
      Paragraph("Rules of the business (treat as true)", h2),
      Paragraph("Orders and attempts", h3),
      *B(["A customer places an <b>order</b> with a merchant. Each try to pay for it is an <b>attempt</b>, with its own " + code("txn_id") + ".",
          "If an attempt fails, the customer may retry. That creates a new attempt with the same " + code("order_id") + " and the next " + code("attempt_no") + ".",
          "An order is successful if <b>any</b> of its attempts succeeded."]),
      Paragraph("Payment status", h3),
      *B(["An attempt ends as " + code("success") + " or " + code("failed") + ". Until then it is " + code("pending") + ", which must resolve within 48 hours.",
          code("status_updated_at") + " records when the final status reached Tarang Pay."]),
      Paragraph("Settlement", h3),
      *B(["A successful payment is paid out to the merchant on the <b>next working day</b> (T+1). Working days exclude Sundays, the second and fourth Saturdays, "
          "and the bank holidays in " + code("calendar.csv") + ".",
          "Day T is the day the payment's <b>final success status</b> reached us. A status that arrives at or after <b>23:00 IST</b> counts toward the next day.",
          "Merchants whose KYC is " + code("on_hold") + " are not paid out until it clears. That is correct behaviour, not an error."]),
      Paragraph("Fees and GST", h3),
      *B(["Fee = payment amount × the rate in " + code("pricing.csv") + " for that merchant and method, <b>on the payment date</b>.",
          "UPI carries a <b>0% fee</b> for every merchant.",
          "GST at 18% is charged on the fee, not on the payment amount.",
          "The fee and GST are deducted at settlement. Finance books fee revenue (ex-GST) in " + code("revenue_ledger.csv.gz") + ", one entry per settlement batch, on the settlement date."]),
      Paragraph("Refunds", h3),
      *B(["A merchant can refund a successful payment, fully or partly, up to 90 days after it.",
          "Tarang Pay keeps its fee when a payment is refunded."]),
      P("All money is in rupees. All times are IST. The data runs from 1 January to 31 August 2026."),
      Paragraph("The files", h2),
      table([["File", "One row per", "Rows"],
             [code("merchants.csv"), "merchant", "2,010"],
             [code("pricing.csv"), "merchant × method × period a rate applies", "11,840"],
             [code("transactions.csv.gz"), "payment attempt", "506,062"],
             [code("settlements.csv.gz"), "payment paid out to a merchant", "445,917"],
             [code("revenue_ledger.csv.gz"), "fee entry in finance's books (one per settlement batch)", "72,876"],
             [code("refunds.csv"), "refund", "13,013"],
             [code("calendar.csv"), "day, with a working-day flag and holiday name", "243"],
             [code("monthly_report.csv"), "month, as currently reported to leadership", "8"]], [52*mm, 100*mm, 22*mm]),
      Paragraph("Columns", h3),
      table([["Column", "Meaning"],
             [code("order_id") + ", " + code("txn_id") + ", " + code("attempt_no"), "Order, attempt, and which try it was (1 = first)"],
             [code("created_at"), "When the attempt started"],
             [code("status") + ", " + code("status_updated_at"), "Final status, and when it reached us (blank if still pending)"],
             [code("failure_reason"), "For failed attempts: customer_dropped, insufficient_funds, bank_declined, bank_timeout, technical_error"],
             [code("method") + ", " + code("bank"), "Payment method, and the customer's bank"],
             [code("settlement_id"), "Settlement batch: one per merchant per settlement date"],
             [code("payment_amount") + ", " + code("fee_charged") + ", " + code("gst_charged") + ", " + code("settled_amount"), "The payment, what we kept, and what the merchant received"],
             [code("fee_booked") + ", " + code("booked_date"), "Fee revenue as finance recorded it (ex-GST)"],
             [code("fee_rate_pct") + ", " + code("valid_from") + ", " + code("valid_to") + ", " + code("plan"), "Agreed fee rate and when it applies (blank valid_to = still in force)"],
             [code("category") + ", " + code("size_tier") + ", " + code("joined_date"), "Merchant details"],
             [code("kyc_status") + ", " + code("kyc_hold_since"), "KYC state, and the date a hold started"]], [66*mm, 108*mm]),
      task(1, "Trust the files", 60),
      P("Before analysing anything, check that the data means what it says."),
      *B(["Profile each file: completeness, ranges, duplicates, impossible values.",
          "Then check <b>across</b> files. Does every settled payment have a successful attempt? Does every settlement batch have a ledger entry? "
          "Does every fee match the pricing table? Does every refund belong to a successful payment, and is any refund larger than its payment or later than 90 days?",
          "<b>At least three things in these files are genuinely wrong, and at least one thing looks wrong but isn't.</b>"]),
      P("For each finding, add one row to an <b>investigation log</b>:"),
      table([["What you noticed", "Rows and ₹ affected", "What you think happened", "How you handled it", "Why that handling"]], [35*mm]*5),
      Spacer(1, 3),
      P("\"How you handled it\" means one of: <b>corrected, excluded, flagged but kept, or left alone.</b> We care more about this choice than the name you give the problem. "
        "Changing financial data without proof is as bad as ignoring a real error. End with up to five questions you would ask an engineer or finance before trusting these numbers."),
      task(2, "How the business is really doing", 55),
      *B(["One row per month: attempts, orders, success rate, TPV (value of successful payments), average payment value, take rate (fee revenue ÷ TPV), refund rate, active merchants.",
          "<b>You decide how to define success rate.</b> Say which definition you used, and what the other one would have shown.",
          "<b>Where do payments fail?</b> By method, bank, hour of day and merchant category. Which failures could Tarang Pay fix, and which are the customer's choice?",
          "<b>Compare your numbers with " + code("monthly_report.csv") + ".</b> Which reported numbers are wrong, by how much, and why?",
          "Take rate fell this year. Is that bad news? Two sentences."]),
      callout(f"{b('The one trap we will warn you about.')} Money doesn't move on the day a payment happens. A settlement or a ledger entry on a given day belongs "
              "to payments from an earlier working day, and a refund belongs to a payment from days or weeks earlier. Comparing same-day totals across these files "
              "creates gaps that aren't real and hides some that are. Tell us which way your numbers would be wrong if you ignored this."),
      task(3, "Where the money goes missing", 60),
      P("Follow successful payments through the chain: <b>successful payment → paid out to the merchant → fee booked by finance</b>. "
        "Report the <b>settlement completion rate</b> (successful payments that were paid out) and the <b>on-time settlement rate</b> "
        "(paid out on the next working day after the payment), by month. Then:"),
      *B(["<b>The settlement gap.</b> Some successful payments were paid out late or not at all. Split the gap into its causes. For each: rows, ₹, whether it is "
          "<b>expected behaviour, a process problem or a data problem</b>, and who should fix it.",
          "<b>Fees.</b> Compare the fee we should have charged (from the pricing table) with the fee we did charge. Where they differ: ₹, merchants, and when it started.",
          "<b>Finance's books.</b> Compare fees charged at settlement with fees booked. Is there a gap? Is it the same problem as the one above, or a different one?"]),
      P("Say <b>\"potential leakage\"</b> until the evidence proves money was lost, and tell us what evidence would prove it."),
      task(4, "Merchants", 30),
      *B(["<b>Concentration.</b> What share of TPV and of fee revenue comes from the top 10% of merchants?",
          "<b>Retention.</b> For merchants who joined each month from January to June, what share were still taking payments in each later month?",
          "<b>The link.</b> Do merchants whose payments often fail in their first month leave sooner? Show the evidence, and say what else could explain it.",
          "Finish with <b>the ten merchants the account team should call this week</b>, and one line on why for each."]),
      task(5, "One sprint", 30),
      P("Engineering can give payments operations <b>one sprint in October</b>. The candidates:"),
      *B(["<b>A.</b> Fix the integration with the bank that sends late status updates.",
          "<b>B.</b> Fix the pricing configuration, and recover the fees we didn't charge.",
          "<b>C.</b> Build a daily automated reconciliation that alerts when payments, settlements and the ledger don't match."]),
      P("For each option, estimate the <b>₹ impact per month</b> (or the risk it removes), with your assumptions and how confident you are. <b>Pick one.</b> Then give us:"),
      *B(["The evidence that would prove your choice wrong.",
          "<b>One headline number</b> for leadership. Say which number, and why that one.",
          "<b>One metric</b> for the monthly investor deck, defended in three sentences. We disagree internally between success rate, TPV and net take rate, "
          "so argue for yours rather than guessing what we want to hear."]),
      task(6, "One chart", 15),
      P("One chart, not a dashboard, that the Head of Payments could look at for ten seconds and know what to do. Underneath it, <b>one sentence</b> saying what it "
        "is telling them to do. If you can't write that sentence, it's the wrong chart."),
      task(7, "How you used AI", 15),
      *B(["Which tools you used, and for what: cleaning, joins, charts, writing.",
          "Your single best prompt, pasted exactly as you sent it.",
          "<b>One thing the model got wrong,</b> and how you caught it: a join that silently duplicated rows, a rate at the wrong grain, a confident claim the data "
          "doesn't support. \"It was right about everything\" reads as either no AI or no checking."]),
      Paragraph("What to send back", h2),
      *B(["<b>Your working:</b> a Python notebook that reruns top to bottom from the files as we sent them.",
          "<b>A one-page memo:</b> recommendation first, evidence second, caveats last. One extra page is allowed for the investigation log.",
          "<b>The chart,</b> in the memo or as an image.",
          "<b>Your questions list,</b> with the assumption you made for each."]),
      callout(f"{b('No machine learning.')} Nothing in these files needs a model, and reaching for one counts against you."),
      Paragraph("How we'll read it", h2),
      table([["We look for", "Strong", "Weak"],
             ["Data judgement", "The right handling for each problem, with the ₹ attached", "Deletes rows silently, or corrects financial data without proof"],
             ["Grain", "Orders vs attempts, and payment date vs settlement date, used correctly", "Joins that duplicate rows; same-day comparisons across files"],
             ["Root cause", "Splits the settlement gap into separate causes with owners", "\"There is a 3% gap\""],
             ["Money", "Every finding has a rupee amount", "Percentages only"],
             ["Decision", "Picks one sprint and says what would change their mind", "Recommends everything"],
             ["Communication", "A leader understands the memo without opening the notebook", "The notebook is the answer"]], [34*mm, 70*mm, 70*mm])]

def page(c, d):
    c.setFont("DV", 7); c.setFillColor(MUTED)
    c.drawString(18*mm, 10*mm, "Tarang Pay · data analyst take-home · fictional company and data, written for a portfolio project")
    c.drawRightString(192*mm, 10*mm, f"{d.page}")
    c.setFillColor(ACC); c.rect(0, 297*mm - 3*mm, 210*mm, 3*mm, fill=1, stroke=0)
doc = SimpleDocTemplate(str(ROOT / "brief/tarang_pay_assignment.pdf"), pagesize=A4, leftMargin=18*mm, rightMargin=18*mm, topMargin=15*mm, bottomMargin=16*mm,
                        title="Tarang Pay · data analyst take-home")
doc.build(s, onFirstPage=page, onLaterPages=page)
print("wrote brief/tarang_pay_assignment.pdf")
