import React, { useState, useMemo } from 'react';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';

// ====================================================================
// DATA FROM dbt MARTS (via export_for_bi.py)
// In production: BI tool queries warehouse via SQL directly.
// ====================================================================
const DATA = {"kpis":{"total_transactions":8000,"total_volume":7397842.83,"active_customers":376,"confirmed_fraud":24,"fraud_loss":49569.16,"completion_rate_pct":89.45},"loan_kpis":{"total_loans":180,"total_originated":9878047.32,"total_outstanding":5080660.06,"delinquent_count":16,"delinquency_rate_pct":8.89},"channel_performance":[{"channel":"mobile","transactions":3399,"volume":3190312.6,"avg_txn_size":1047.38,"completion_rate":0.8961,"confirmed_fraud_count":11,"fraud_rate":0.003236},{"channel":"card","transactions":2745,"volume":2595098.82,"avg_txn_size":1056.64,"completion_rate":0.8947,"confirmed_fraud_count":6,"fraud_rate":0.002186},{"channel":"web","transactions":1053,"volume":872425.46,"avg_txn_size":929.1,"completion_rate":0.8917,"confirmed_fraud_count":6,"fraud_rate":0.005698},{"channel":"atm","transactions":538,"volume":486194.17,"avg_txn_size":1036.66,"completion_rate":0.8717,"confirmed_fraud_count":1,"fraud_rate":0.001859},{"channel":"wire","transactions":265,"volume":253811.78,"avg_txn_size":1031.76,"completion_rate":0.9283,"confirmed_fraud_count":0,"fraud_rate":0.0}],"merchant_category":[{"merchant_category":"Travel","transactions":367,"volume":29117.69,"avg_ticket":86.66,"unique_customers":226},{"merchant_category":"Insurance","transactions":394,"volume":27245.17,"avg_ticket":76.1,"unique_customers":241},{"merchant_category":"Entertainment","transactions":385,"volume":25892.24,"avg_ticket":74.4,"unique_customers":240},{"merchant_category":"Dining","transactions":358,"volume":25666.63,"avg_ticket":78.73,"unique_customers":220},{"merchant_category":"Shopping","transactions":386,"volume":25435.63,"avg_ticket":75.03,"unique_customers":227},{"merchant_category":"Utilities","transactions":358,"volume":24139.6,"avg_ticket":74.97,"unique_customers":217},{"merchant_category":"Education","transactions":370,"volume":24051.33,"avg_ticket":73.78,"unique_customers":235},{"merchant_category":"Subscription","transactions":348,"volume":23842.34,"avg_ticket":77.41,"unique_customers":226},{"merchant_category":"Fuel","transactions":359,"volume":22122.6,"avg_ticket":73.5,"unique_customers":213},{"merchant_category":"Healthcare","transactions":340,"volume":22094.31,"avg_ticket":74.14,"unique_customers":218},{"merchant_category":"Rent","transactions":349,"volume":21825.34,"avg_ticket":68.63,"unique_customers":222},{"merchant_category":"Groceries","transactions":349,"volume":20940.61,"avg_ticket":68.21,"unique_customers":209}],"fraud_metrics":[{"alert_type":"location","alerts":35,"confirmed_fraud":6,"false_positives":25,"precision_rate":0.1714,"total_flagged_amount":75921.67,"confirmed_fraud_amount":21782.34},{"alert_type":"pattern","alerts":31,"confirmed_fraud":8,"false_positives":19,"precision_rate":0.2581,"total_flagged_amount":48746.94,"confirmed_fraud_amount":7495.93},{"alert_type":"amount","alerts":31,"confirmed_fraud":6,"false_positives":15,"precision_rate":0.1935,"total_flagged_amount":65104.12,"confirmed_fraud_amount":18857.51},{"alert_type":"velocity","alerts":25,"confirmed_fraud":4,"false_positives":15,"precision_rate":0.16,"total_flagged_amount":42987.6,"confirmed_fraud_amount":1433.38}],"loan_portfolio":[{"loan_type":"mortgage","loans":17,"total_originated":6913065.97,"total_outstanding":3588976.08,"total_repaid":3324089.89,"avg_rate_pct":4.89,"delinquent_loans":1,"delinquency_rate":0.0588},{"loan_type":"personal","loans":108,"total_originated":1498017.8,"total_outstanding":796043.65,"total_repaid":701974.15,"avg_rate_pct":13.22,"delinquent_loans":9,"delinquency_rate":0.0833},{"loan_type":"auto","loans":55,"total_originated":1466963.55,"total_outstanding":695640.33,"total_repaid":771323.22,"avg_rate_pct":6.92,"delinquent_loans":6,"delinquency_rate":0.1091}],"customer_segments":[{"engagement_segment":"engaged","customers":280,"volume":4669879.39},{"engagement_segment":"power_user","customers":78,"volume":2592151.82},{"engagement_segment":"casual","customers":18,"volume":135811.62},{"engagement_segment":"inactive","customers":24,"volume":0.0}],"risk_distribution":[{"risk_band":"critical","customers":5},{"risk_band":"high","customers":38},{"risk_band":"low","customers":180},{"risk_band":"medium","customers":177}],"txn_status_breakdown":[{"txn_status":"completed","transactions":7156,"volume":7397842.83},{"txn_status":"failed","transactions":269,"volume":310957.41},{"txn_status":"pending","transactions":413,"volume":482460.98},{"txn_status":"reversed","transactions":162,"volume":129328.18}],"country_volume":[{"country_code":"AU","transactions":869,"volume":812412.68,"customers":39},{"country_code":"BR","transactions":860,"volume":755387.07,"customers":33},{"country_code":"UK","transactions":783,"volume":751723.16,"customers":33},{"country_code":"US","transactions":740,"volume":713857.77,"customers":31},{"country_code":"CA","transactions":753,"volume":671579.24,"customers":36},{"country_code":"NL","transactions":675,"volume":620024.28,"customers":32},{"country_code":"SG","transactions":680,"volume":618170.75,"customers":33},{"country_code":"MX","transactions":553,"volume":607816.56,"customers":31},{"country_code":"DE","transactions":577,"volume":514088.86,"customers":32},{"country_code":"IN","transactions":620,"volume":506430.44,"customers":28},{"country_code":"JP","transactions":563,"volume":504429.58,"customers":28},{"country_code":"FR","transactions":327,"volume":321922.44,"customers":20}],"top_customers":[{"full_name":"Liam Patel","country_code":"US","lifetime_transactions":53,"lifetime_volume":77827.59,"total_balance":32132.27,"engagement_segment":"power_user","risk_band":"low"},{"full_name":"Zara Khan","country_code":"UK","lifetime_transactions":57,"lifetime_volume":68913.93,"total_balance":36889.62,"engagement_segment":"power_user","risk_band":"low"},{"full_name":"Liam Rossi","country_code":"BR","lifetime_transactions":55,"lifetime_volume":66739.85,"total_balance":41695.98,"engagement_segment":"power_user","risk_band":"low"},{"full_name":"Mia Chen","country_code":"UK","lifetime_transactions":26,"lifetime_volume":59531.29,"total_balance":3777.34,"engagement_segment":"engaged","risk_band":"medium"},{"full_name":"Chloe Tanaka","country_code":"JP","lifetime_transactions":50,"lifetime_volume":57756.32,"total_balance":50133.23,"engagement_segment":"power_user","risk_band":"medium"},{"full_name":"Chloe Dubois","country_code":"CA","lifetime_transactions":48,"lifetime_volume":52281.18,"total_balance":26835.53,"engagement_segment":"power_user","risk_band":"medium"},{"full_name":"Emma Chen","country_code":"IN","lifetime_transactions":55,"lifetime_volume":50947.22,"total_balance":28873.69,"engagement_segment":"power_user","risk_band":"low"},{"full_name":"Wei Chen","country_code":"JP","lifetime_transactions":30,"lifetime_volume":47882.15,"total_balance":36808.58,"engagement_segment":"power_user","risk_band":"low"},{"full_name":"Anna Nguyen","country_code":"SG","lifetime_transactions":41,"lifetime_volume":46400.88,"total_balance":18577.21,"engagement_segment":"power_user","risk_band":"low"},{"full_name":"Anna Patel","country_code":"BR","lifetime_transactions":50,"lifetime_volume":45906.7,"total_balance":9045.56,"engagement_segment":"power_user","risk_band":"high"}],"recent_fraud":[{"transaction_id":4003,"txn_date":"2026-05-07","customer_id":273,"amount":26.4,"currency":"USD","channel":"mobile","merchant_category":"Entertainment","fraud_severity":"high","fraud_resolution":"confirmed_fraud"},{"transaction_id":6538,"txn_date":"2026-05-05","customer_id":382,"amount":4004.62,"currency":"USD","channel":"atm","merchant_category":null,"fraud_severity":"low","fraud_resolution":"confirmed_fraud"},{"transaction_id":1280,"txn_date":"2026-05-04","customer_id":171,"amount":357.63,"currency":"USD","channel":"mobile","merchant_category":"Entertainment","fraud_severity":"low","fraud_resolution":"false_positive"},{"transaction_id":3139,"txn_date":"2026-05-01","customer_id":223,"amount":28.43,"currency":"MXN","channel":"mobile","merchant_category":"Shopping","fraud_severity":"high","fraud_resolution":"false_positive"},{"transaction_id":2079,"txn_date":"2026-04-23","customer_id":108,"amount":4008.17,"currency":"AUD","channel":"card","merchant_category":null,"fraud_severity":"high","fraud_resolution":"pending"},{"transaction_id":4051,"txn_date":"2026-04-20","customer_id":170,"amount":81.88,"currency":"AUD","channel":"card","merchant_category":null,"fraud_severity":"high","fraud_resolution":"pending"},{"transaction_id":3626,"txn_date":"2026-04-19","customer_id":166,"amount":3505.87,"currency":"SGD","channel":"card","merchant_category":null,"fraud_severity":"critical","fraud_resolution":"false_positive"},{"transaction_id":7478,"txn_date":"2026-04-12","customer_id":368,"amount":3114.04,"currency":"EUR","channel":"mobile","merchant_category":null,"fraud_severity":"low","fraud_resolution":"false_positive"},{"transaction_id":1149,"txn_date":"2026-04-11","customer_id":313,"amount":5.51,"currency":"BRL","channel":"mobile","merchant_category":"Utilities","fraud_severity":"low","fraud_resolution":"false_positive"},{"transaction_id":5241,"txn_date":"2026-04-11","customer_id":313,"amount":2911.82,"currency":"BRL","channel":"mobile","merchant_category":null,"fraud_severity":"low","fraud_resolution":"false_positive"},{"transaction_id":7898,"txn_date":"2026-04-11","customer_id":147,"amount":425.15,"currency":"MXN","channel":"mobile","merchant_category":null,"fraud_severity":"low","fraud_resolution":"confirmed_fraud"},{"transaction_id":2831,"txn_date":"2026-03-22","customer_id":269,"amount":4031.36,"currency":"MXN","channel":"mobile","merchant_category":null,"fraud_severity":"high","fraud_resolution":"confirmed_fraud"}],"weekly_transactions":[{"week":"2025-W19","total_transactions":84,"completed_transactions":75,"completed_volume":71055.84,"flagged_transactions":0,"confirmed_fraud_count":0,"fraud_loss":0.0,"international_transactions":4},{"week":"2025-W20","total_transactions":170,"completed_transactions":149,"completed_volume":128569.24,"flagged_transactions":2,"confirmed_fraud_count":0,"fraud_loss":0.0,"international_transactions":21},{"week":"2025-W21","total_transactions":154,"completed_transactions":143,"completed_volume":142186.06,"flagged_transactions":4,"confirmed_fraud_count":1,"fraud_loss":32.04,"international_transactions":9},{"week":"2025-W22","total_transactions":141,"completed_transactions":131,"completed_volume":134624.72,"flagged_transactions":2,"confirmed_fraud_count":0,"fraud_loss":0.0,"international_transactions":9},{"week":"2025-W23","total_transactions":143,"completed_transactions":122,"completed_volume":111112.13,"flagged_transactions":1,"confirmed_fraud_count":0,"fraud_loss":0.0,"international_transactions":12},{"week":"2025-W24","total_transactions":150,"completed_transactions":137,"completed_volume":138499.1,"flagged_transactions":1,"confirmed_fraud_count":1,"fraud_loss":53.9,"international_transactions":11},{"week":"2025-W25","total_transactions":151,"completed_transactions":130,"completed_volume":107759.98,"flagged_transactions":2,"confirmed_fraud_count":0,"fraud_loss":0.0,"international_transactions":11},{"week":"2025-W26","total_transactions":138,"completed_transactions":122,"completed_volume":137874.13,"flagged_transactions":0,"confirmed_fraud_count":0,"fraud_loss":0.0,"international_transactions":9},{"week":"2025-W27","total_transactions":148,"completed_transactions":129,"completed_volume":110814.94,"flagged_transactions":3,"confirmed_fraud_count":0,"fraud_loss":0.0,"international_transactions":12},{"week":"2025-W28","total_transactions":140,"completed_transactions":124,"completed_volume":159741.6,"flagged_transactions":3,"confirmed_fraud_count":1,"fraud_loss":4789.27,"international_transactions":12},{"week":"2025-W29","total_transactions":166,"completed_transactions":153,"completed_volume":159395.77,"flagged_transactions":2,"confirmed_fraud_count":0,"fraud_loss":0.0,"international_transactions":13},{"week":"2025-W30","total_transactions":155,"completed_transactions":135,"completed_volume":125101.88,"flagged_transactions":1,"confirmed_fraud_count":1,"fraud_loss":3521.38,"international_transactions":9},{"week":"2025-W31","total_transactions":160,"completed_transactions":150,"completed_volume":141199.59,"flagged_transactions":1,"confirmed_fraud_count":0,"fraud_loss":0.0,"international_transactions":13},{"week":"2025-W32","total_transactions":132,"completed_transactions":116,"completed_volume":107204.55,"flagged_transactions":0,"confirmed_fraud_count":0,"fraud_loss":0.0,"international_transactions":19},{"week":"2025-W33","total_transactions":153,"completed_transactions":137,"completed_volume":153315.26,"flagged_transactions":4,"confirmed_fraud_count":2,"fraud_loss":2813.03,"international_transactions":7},{"week":"2025-W34","total_transactions":149,"completed_transactions":136,"completed_volume":147568.6,"flagged_transactions":5,"confirmed_fraud_count":1,"fraud_loss":3.21,"international_transactions":14},{"week":"2025-W35","total_transactions":188,"completed_transactions":174,"completed_volume":192245.84,"flagged_transactions":3,"confirmed_fraud_count":1,"fraud_loss":5730.9,"international_transactions":20},{"week":"2025-W36","total_transactions":190,"completed_transactions":172,"completed_volume":177800.22,"flagged_transactions":4,"confirmed_fraud_count":0,"fraud_loss":0.0,"international_transactions":21},{"week":"2025-W37","total_transactions":158,"completed_transactions":145,"completed_volume":147195.18,"flagged_transactions":1,"confirmed_fraud_count":1,"fraud_loss":2942.34,"international_transactions":16},{"week":"2025-W38","total_transactions":158,"completed_transactions":140,"completed_volume":175157.09,"flagged_transactions":4,"confirmed_fraud_count":0,"fraud_loss":0.0,"international_transactions":16},{"week":"2025-W39","total_transactions":157,"completed_transactions":136,"completed_volume":178884.39,"flagged_transactions":3,"confirmed_fraud_count":0,"fraud_loss":0.0,"international_transactions":16},{"week":"2025-W40","total_transactions":168,"completed_transactions":146,"completed_volume":138899.28,"flagged_transactions":5,"confirmed_fraud_count":0,"fraud_loss":0.0,"international_transactions":14},{"week":"2025-W41","total_transactions":170,"completed_transactions":150,"completed_volume":172631.99,"flagged_transactions":6,"confirmed_fraud_count":0,"fraud_loss":0.0,"international_transactions":11},{"week":"2025-W42","total_transactions":149,"completed_transactions":124,"completed_volume":131585.73,"flagged_transactions":2,"confirmed_fraud_count":1,"fraud_loss":301.12,"international_transactions":16},{"week":"2025-W43","total_transactions":158,"completed_transactions":142,"completed_volume":162708.02,"flagged_transactions":2,"confirmed_fraud_count":0,"fraud_loss":0.0,"international_transactions":17},{"week":"2025-W44","total_transactions":148,"completed_transactions":134,"completed_volume":135138.21,"flagged_transactions":4,"confirmed_fraud_count":1,"fraud_loss":6029.74,"international_transactions":8},{"week":"2025-W45","total_transactions":121,"completed_transactions":104,"completed_volume":91509.37,"flagged_transactions":0,"confirmed_fraud_count":0,"fraud_loss":0.0,"international_transactions":10},{"week":"2025-W46","total_transactions":161,"completed_transactions":138,"completed_volume":168892.16,"flagged_transactions":2,"confirmed_fraud_count":1,"fraud_loss":410.72,"international_transactions":17},{"week":"2025-W47","total_transactions":153,"completed_transactions":137,"completed_volume":129359.19,"flagged_transactions":1,"confirmed_fraud_count":0,"fraud_loss":0.0,"international_transactions":16},{"week":"2025-W48","total_transactions":159,"completed_transactions":144,"completed_volume":139966.95,"flagged_transactions":5,"confirmed_fraud_count":1,"fraud_loss":2568.92,"international_transactions":13},{"week":"2025-W49","total_transactions":178,"completed_transactions":159,"completed_volume":111875.39,"flagged_transactions":7,"confirmed_fraud_count":1,"fraud_loss":147.86,"international_transactions":15},{"week":"2025-W50","total_transactions":152,"completed_transactions":140,"completed_volume":136130.8,"flagged_transactions":0,"confirmed_fraud_count":0,"fraud_loss":0.0,"international_transactions":8},{"week":"2025-W51","total_transactions":147,"completed_transactions":129,"completed_volume":148370.58,"flagged_transactions":2,"confirmed_fraud_count":0,"fraud_loss":0.0,"international_transactions":12},{"week":"2025-W52","total_transactions":147,"completed_transactions":132,"completed_volume":112039.6,"flagged_transactions":1,"confirmed_fraud_count":0,"fraud_loss":0.0,"international_transactions":10},{"week":"2026-W01","total_transactions":156,"completed_transactions":140,"completed_volume":173751.17,"flagged_transactions":3,"confirmed_fraud_count":1,"fraud_loss":1657.15,"international_transactions":16},{"week":"2026-W02","total_transactions":141,"completed_transactions":131,"completed_volume":139737.78,"flagged_transactions":1,"confirmed_fraud_count":0,"fraud_loss":0.0,"international_transactions":12},{"week":"2026-W03","total_transactions":166,"completed_transactions":152,"completed_volume":154712.47,"flagged_transactions":1,"confirmed_fraud_count":1,"fraud_loss":38.35,"international_transactions":14},{"week":"2026-W04","total_transactions":171,"completed_transactions":151,"completed_volume":154908.12,"flagged_transactions":1,"confirmed_fraud_count":0,"fraud_loss":0.0,"international_transactions":10},{"week":"2026-W05","total_transactions":156,"completed_transactions":144,"completed_volume":177832.81,"flagged_transactions":1,"confirmed_fraud_count":0,"fraud_loss":0.0,"international_transactions":15},{"week":"2026-W06","total_transactions":152,"completed_transactions":140,"completed_volume":140906.48,"flagged_transactions":1,"confirmed_fraud_count":1,"fraud_loss":1341.81,"international_transactions":13},{"week":"2026-W07","total_transactions":145,"completed_transactions":123,"completed_volume":140595.9,"flagged_transactions":2,"confirmed_fraud_count":0,"fraud_loss":0.0,"international_transactions":10},{"week":"2026-W08","total_transactions":141,"completed_transactions":126,"completed_volume":125529.82,"flagged_transactions":4,"confirmed_fraud_count":1,"fraud_loss":2559.2,"international_transactions":12},{"week":"2026-W09","total_transactions":141,"completed_transactions":126,"completed_volume":152008.42,"flagged_transactions":2,"confirmed_fraud_count":1,"fraud_loss":6138.78,"international_transactions":11},{"week":"2026-W10","total_transactions":131,"completed_transactions":118,"completed_volume":109638.42,"flagged_transactions":6,"confirmed_fraud_count":0,"fraud_loss":0.0,"international_transactions":13},{"week":"2026-W11","total_transactions":171,"completed_transactions":156,"completed_volume":196354.27,"flagged_transactions":1,"confirmed_fraud_count":0,"fraud_loss":0.0,"international_transactions":15},{"week":"2026-W12","total_transactions":171,"completed_transactions":154,"completed_volume":168229.23,"flagged_transactions":5,"confirmed_fraud_count":2,"fraud_loss":4033.27,"international_transactions":20},{"week":"2026-W13","total_transactions":148,"completed_transactions":130,"completed_volume":91903.81,"flagged_transactions":0,"confirmed_fraud_count":0,"fraud_loss":0.0,"international_transactions":19},{"week":"2026-W14","total_transactions":139,"completed_transactions":120,"completed_volume":120716.66,"flagged_transactions":0,"confirmed_fraud_count":0,"fraud_loss":0.0,"international_transactions":7},{"week":"2026-W15","total_transactions":173,"completed_transactions":157,"completed_volume":148560.73,"flagged_transactions":4,"confirmed_fraud_count":1,"fraud_loss":425.15,"international_transactions":7},{"week":"2026-W16","total_transactions":120,"completed_transactions":107,"completed_volume":139111.56,"flagged_transactions":1,"confirmed_fraud_count":0,"fraud_loss":0.0,"international_transactions":5},{"week":"2026-W17","total_transactions":133,"completed_transactions":120,"completed_volume":102192.13,"flagged_transactions":2,"confirmed_fraud_count":0,"fraud_loss":0.0,"international_transactions":15},{"week":"2026-W18","total_transactions":136,"completed_transactions":128,"completed_volume":139043.93,"flagged_transactions":1,"confirmed_fraud_count":0,"fraud_loss":0.0,"international_transactions":7},{"week":"2026-W19","total_transactions":113,"completed_transactions":98,"completed_volume":95695.74,"flagged_transactions":3,"confirmed_fraud_count":2,"fraud_loss":4031.02,"international_transactions":12}]};

const PIPELINE = [
  { stage: "01 SOURCE",    name: "bank_oltp_postgres",     rows: 9312, ms: 14,  status: "ok" },
  { stage: "02 EXTRACT",   name: "airbyte.full_refresh",   rows: 9312, ms: 142, status: "ok" },
  { stage: "03 LOAD",      name: "warehouse.raw_layer",    rows: 9312, ms: 56,  status: "ok" },
  { stage: "04 TRANSFORM", name: "dbt.run + dbt.test",     rows: 17312, ms: 218, status: "ok" },
  { stage: "05 SERVE",     name: "analytics.marts",        rows: 8970, ms: 24,  status: "ok" },
];

// ----- helpers -----
const fmtUSD = (n) => "$" + n.toLocaleString("en-US", { maximumFractionDigits: 0 });
const fmtUSDdec = (n) => "$" + n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const fmtNum = (n) => n.toLocaleString("en-US");
const fmtPct = (n) => (n * 100).toFixed(2) + "%";

const COUNTRY_NAMES = {
  US: "United States", UK: "United Kingdom", DE: "Germany", FR: "France",
  IN: "India", JP: "Japan", CA: "Canada", AU: "Australia",
  BR: "Brazil", MX: "Mexico", SG: "Singapore", NL: "Netherlands",
};

const SEGMENT_COLORS = {
  power_user: "#22d97a", engaged: "#7ad9ff",
  casual: "#ffb84d", inactive: "#555",
};
const RISK_COLORS = {
  low: "#22d97a", medium: "#ffb84d", high: "#ff8c42", critical: "#ff5252",
};
const SEVERITY_COLORS = {
  low: "#7ad9ff", medium: "#ffb84d", high: "#ff8c42", critical: "#ff5252",
};

function DarkTooltip({ active, payload, label, valuePrefix = "" }) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div style={{
      background: "#0a0a0a", border: "1px solid #2a2a2a",
      padding: "10px 14px", fontFamily: "'JetBrains Mono', monospace",
      fontSize: "11px", color: "#ddd", minWidth: 160,
    }}>
      <div style={{ color: "#888", marginBottom: 6, letterSpacing: "0.05em" }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ display: "flex", justifyContent: "space-between", gap: 16 }}>
          <span style={{ color: p.color }}>{p.name}</span>
          <span style={{ color: "#fff" }}>
            {valuePrefix}{typeof p.value === "number" ? p.value.toLocaleString() : p.value}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function Dashboard() {
  const [tab, setTab] = useState("overview");

  // Compress weekly labels for chart
  const weekly = useMemo(() => DATA.weekly_transactions.map(w => ({
    ...w,
    label: w.week.replace("2025-", "'25 ").replace("2026-", "'26 "),
  })), []);

  return (
    <div style={{
      background: "#070707", color: "#e8e8e8", minHeight: "100vh",
      fontFamily: "'JetBrains Mono', 'SF Mono', Consolas, monospace",
      fontSize: 13,
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600&family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,600&display=swap');
        * { box-sizing: border-box; }
        .grid-bg {
          background-image:
            linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
          background-size: 48px 48px;
        }
        .pulse-dot {
          width: 6px; height: 6px; border-radius: 50%; background: #22d97a;
          box-shadow: 0 0 12px #22d97a; animation: pulse 2s infinite;
        }
        @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.4; } }
        .tab-btn {
          background: transparent; border: none; color: #777; padding: 8px 18px;
          font-family: inherit; font-size: 11px; letter-spacing: 0.18em;
          cursor: pointer; text-transform: uppercase;
          border-bottom: 1px solid transparent; transition: all 0.15s;
        }
        .tab-btn:hover { color: #fff; }
        .tab-btn.active { color: #fff; border-bottom-color: #22d97a; }
        .panel { background: #0c0c0c; border: 1px solid #1f1f1f; padding: 24px; }
        .panel-title {
          font-size: 10px; letter-spacing: 0.2em; color: #888;
          text-transform: uppercase; margin-bottom: 4px;
        }
        .panel-sub {
          font-family: 'Fraunces', serif; font-size: 22px; color: #fff;
          font-weight: 400; margin-bottom: 22px; letter-spacing: -0.01em;
        }
        .kpi-card {
          background: #0c0c0c; border: 1px solid #1f1f1f;
          padding: 20px 22px; position: relative; overflow: hidden;
        }
        .kpi-card::before {
          content: ""; position: absolute; left: 0; top: 0; bottom: 0;
          width: 2px; background: #22d97a;
        }
        .kpi-card.warn::before { background: #ff8c42; }
        .kpi-card.danger::before { background: #ff5252; }
        .kpi-label { font-size: 10px; letter-spacing: 0.18em; color: #888; text-transform: uppercase; }
        .kpi-value {
          font-family: 'Fraunces', serif; font-weight: 300;
          font-size: 30px; color: #fff; margin-top: 8px; letter-spacing: -0.02em;
        }
        .kpi-meta { font-size: 11px; color: #666; margin-top: 6px; }
        .pipeline-row {
          display: grid; grid-template-columns: 110px 1fr 100px 80px 60px;
          gap: 20px; align-items: center; padding: 12px 0;
          border-bottom: 1px solid #161616;
        }
        .pipeline-row:last-child { border-bottom: none; }
        table.data-table { width: 100%; border-collapse: collapse; font-size: 12px; }
        table.data-table th {
          text-align: left; padding: 10px 12px; font-weight: 500;
          color: #888; font-size: 10px; letter-spacing: 0.15em;
          text-transform: uppercase; border-bottom: 1px solid #2a2a2a;
        }
        table.data-table td {
          padding: 10px 12px; border-bottom: 1px solid #161616; color: #ccc;
        }
        table.data-table tr:hover td { background: #111; }
        .num { font-variant-numeric: tabular-nums; }
        .pill {
          display: inline-block; padding: 2px 8px; font-size: 10px;
          letter-spacing: 0.1em; text-transform: uppercase;
          border: 1px solid currentColor; border-radius: 2px;
        }
      `}</style>

      {/* HEADER */}
      <header style={{ borderBottom: "1px solid #1a1a1a", padding: "20px 32px",
                       display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div style={{ fontFamily: "'Fraunces', serif", fontSize: 22, fontWeight: 400, letterSpacing: "-0.01em" }}>
            <span style={{ color: "#22d97a" }}>◢</span> ledger<span style={{ color: "#666" }}>/</span>analytics
          </div>
          <div style={{ height: 18, width: 1, background: "#2a2a2a" }} />
          <div style={{ fontSize: 11, color: "#666", letterSpacing: "0.1em" }}>
            DIGITAL BANK · PROD · v1.0.0
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 11, color: "#888" }}>
          <span className="pulse-dot" />
          <span>PIPELINE HEALTHY · LAST RUN 2026-05-09 07:24 UTC</span>
        </div>
      </header>

      {/* TABS */}
      <nav style={{ borderBottom: "1px solid #1a1a1a", padding: "0 24px", display: "flex", flexWrap: "wrap" }}>
        {[
          ["overview",  "Overview"],
          ["pipeline",  "Pipeline"],
          ["channels",  "Channels"],
          ["fraud",     "Fraud & Risk"],
          ["loans",     "Loan Book"],
          ["customers", "Customers"],
          ["geo",       "Geography"],
        ].map(([k, label]) => (
          <button key={k} className={`tab-btn ${tab === k ? "active" : ""}`} onClick={() => setTab(k)}>
            {label}
          </button>
        ))}
      </nav>

      <main style={{ padding: "32px" }} className="grid-bg">

        {/* OVERVIEW */}
        {tab === "overview" && (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 16, marginBottom: 24 }}>
              <div className="kpi-card">
                <div className="kpi-label">Total Volume</div>
                <div className="kpi-value num">{fmtUSD(DATA.kpis.total_volume)}</div>
                <div className="kpi-meta">Settled · 12mo</div>
              </div>
              <div className="kpi-card">
                <div className="kpi-label">Transactions</div>
                <div className="kpi-value num">{fmtNum(DATA.kpis.total_transactions)}</div>
                <div className="kpi-meta">{DATA.kpis.completion_rate_pct}% completion</div>
              </div>
              <div className="kpi-card">
                <div className="kpi-label">Active Customers</div>
                <div className="kpi-value num">{fmtNum(DATA.kpis.active_customers)}</div>
                <div className="kpi-meta">Transacted in window</div>
              </div>
              <div className="kpi-card warn">
                <div className="kpi-label">Confirmed Fraud</div>
                <div className="kpi-value num">{DATA.kpis.confirmed_fraud}</div>
                <div className="kpi-meta">{fmtUSDdec(DATA.kpis.fraud_loss)} loss</div>
              </div>
              <div className="kpi-card">
                <div className="kpi-label">Loan Book</div>
                <div className="kpi-value num">{fmtUSD(DATA.loan_kpis.total_outstanding)}</div>
                <div className="kpi-meta">Outstanding principal</div>
              </div>
              <div className="kpi-card danger">
                <div className="kpi-label">Delinquency</div>
                <div className="kpi-value num">{DATA.loan_kpis.delinquency_rate_pct}%</div>
                <div className="kpi-meta">{DATA.loan_kpis.delinquent_count} of {DATA.loan_kpis.total_loans} loans</div>
              </div>
            </div>

            {/* MAIN CHART */}
            <div className="panel" style={{ marginBottom: 24 }}>
              <div className="panel-title">agg_daily_transactions × dim_date</div>
              <div className="panel-sub">Weekly transaction volume and fraud loss</div>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={weekly} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gVol" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%"   stopColor="#22d97a" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="#22d97a" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="#1a1a1a" vertical={false} />
                  <XAxis dataKey="label" stroke="#555" tick={{ fontSize: 9, fill: "#888" }} interval={3} />
                  <YAxis stroke="#555" tick={{ fontSize: 10, fill: "#888" }}
                         tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
                  <Tooltip content={<DarkTooltip valuePrefix="$" />} />
                  <Area type="monotone" dataKey="completed_volume" name="volume"
                        stroke="#22d97a" strokeWidth={1.5} fill="url(#gVol)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
              <div className="panel">
                <div className="panel-title">fct_transactions.txn_status</div>
                <div className="panel-sub">Transaction status breakdown</div>
                {DATA.txn_status_breakdown.map(r => {
                  const total = DATA.txn_status_breakdown.reduce((s, x) => s + x.transactions, 0);
                  const pct = (r.transactions / total) * 100;
                  const color = r.txn_status === "completed" ? "#22d97a"
                              : r.txn_status === "pending"   ? "#ffb84d"
                              : r.txn_status === "failed"    ? "#ff5252"
                              : "#888";
                  return (
                    <div key={r.txn_status} style={{ marginBottom: 14 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 11 }}>
                        <span style={{ color: "#ccc", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                          {r.txn_status}
                        </span>
                        <span className="num" style={{ color: "#888" }}>
                          {fmtNum(r.transactions)} · {fmtUSDdec(r.volume)}
                        </span>
                      </div>
                      <div style={{ height: 4, background: "#1a1a1a" }}>
                        <div style={{ width: `${pct}%`, height: "100%", background: color }} />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="panel">
                <div className="panel-title">dim_customers.engagement_segment</div>
                <div className="panel-sub">Customer segments by volume</div>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={DATA.customer_segments.filter(s => s.volume > 0)}
                         dataKey="volume" nameKey="engagement_segment"
                         innerRadius={55} outerRadius={90} paddingAngle={2}
                         stroke="#070707">
                      {DATA.customer_segments.map((s, i) => (
                        <Cell key={i} fill={SEGMENT_COLORS[s.engagement_segment]} />
                      ))}
                    </Pie>
                    <Tooltip content={<DarkTooltip valuePrefix="$" />} />
                  </PieChart>
                </ResponsiveContainer>
                <div style={{ marginTop: 10, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, fontSize: 11 }}>
                  {DATA.customer_segments.map(s => (
                    <div key={s.engagement_segment} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ width: 8, height: 8, background: SEGMENT_COLORS[s.engagement_segment] }} />
                      <span style={{ color: "#ccc", textTransform: "uppercase", letterSpacing: "0.05em", fontSize: 10 }}>
                        {s.engagement_segment.replace("_", " ")}
                      </span>
                      <span className="num" style={{ color: "#888", marginLeft: "auto" }}>{s.customers}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {/* PIPELINE */}
        {tab === "pipeline" && (
          <div className="panel">
            <div className="panel-title">orchestrator.dag_run · 2026-05-09T07:24</div>
            <div className="panel-sub">End-to-end pipeline execution</div>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between",
                          margin: "20px 0 32px", flexWrap: "wrap", gap: 8 }}>
              {[
                { name: "Postgres",  sub: "OLTP source" },
                { name: "Airbyte",   sub: "EL connector" },
                { name: "Warehouse", sub: "raw schema" },
                { name: "dbt",       sub: "transform" },
                { name: "Marts",     sub: "analytics" },
                { name: "BI",        sub: "this dash" },
              ].map((n, i, arr) => (
                <React.Fragment key={i}>
                  <div style={{
                    flex: "0 0 auto", padding: "14px 18px",
                    border: "1px solid #2a2a2a", background: "#0c0c0c",
                    textAlign: "center", minWidth: 110,
                  }}>
                    <div style={{ fontSize: 12, color: "#fff" }}>{n.name}</div>
                    <div style={{ fontSize: 9, color: "#666", marginTop: 4, letterSpacing: "0.1em", textTransform: "uppercase" }}>{n.sub}</div>
                  </div>
                  {i < arr.length - 1 && (
                    <div style={{ flex: "1 1 auto", height: 1,
                                  background: "linear-gradient(to right, #22d97a, #2a2a2a)",
                                  margin: "0 4px", minWidth: 16 }} />
                  )}
                </React.Fragment>
              ))}
            </div>

            <div style={{ borderTop: "1px solid #1a1a1a", paddingTop: 12 }}>
              <div className="pipeline-row" style={{ color: "#666", fontSize: 10,
                   letterSpacing: "0.15em", textTransform: "uppercase",
                   borderBottom: "1px solid #2a2a2a" }}>
                <span>STAGE</span><span>TASK</span>
                <span style={{ textAlign: "right" }}>ROWS</span>
                <span style={{ textAlign: "right" }}>DURATION</span>
                <span style={{ textAlign: "right" }}>STATUS</span>
              </div>
              {PIPELINE.map(p => (
                <div className="pipeline-row" key={p.stage}>
                  <span style={{ color: "#22d97a", letterSpacing: "0.1em" }}>{p.stage}</span>
                  <span style={{ color: "#ccc" }}>{p.name}</span>
                  <span className="num" style={{ textAlign: "right", color: "#aaa" }}>{fmtNum(p.rows)}</span>
                  <span className="num" style={{ textAlign: "right", color: "#aaa" }}>{p.ms}ms</span>
                  <span style={{ textAlign: "right" }}>
                    <span className="pill" style={{ color: "#22d97a" }}>{p.status}</span>
                  </span>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 24, padding: 16, background: "#0a0a0a",
                          border: "1px solid #1a1a1a", fontSize: 11, color: "#888" }}>
              <div style={{ color: "#22d97a", marginBottom: 8 }}>// dbt test results</div>
              <div>20 / 20 tests passed · 0 failures · 0 warnings</div>
              <div style={{ marginTop: 4 }}>not_null, unique, relationships, accepted_values · 13 models built across staging → intermediate → marts</div>
            </div>
          </div>
        )}

        {/* CHANNELS */}
        {tab === "channels" && (
          <>
            <div className="panel" style={{ marginBottom: 24 }}>
              <div className="panel-title">agg_channel_performance</div>
              <div className="panel-sub">Volume and fraud rate by channel</div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={DATA.channel_performance}>
                  <CartesianGrid stroke="#1a1a1a" vertical={false} />
                  <XAxis dataKey="channel" stroke="#555" tick={{ fontSize: 11, fill: "#aaa" }} />
                  <YAxis stroke="#555" tick={{ fontSize: 10, fill: "#888" }}
                         tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
                  <Tooltip content={<DarkTooltip valuePrefix="$" />} />
                  <Bar dataKey="volume" name="volume" fill="#22d97a" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="panel" style={{ marginBottom: 24 }}>
              <div className="panel-title">SELECT * FROM agg_channel_performance</div>
              <div className="panel-sub">Channel detail</div>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Channel</th>
                    <th style={{ textAlign: "right" }}>Transactions</th>
                    <th style={{ textAlign: "right" }}>Volume</th>
                    <th style={{ textAlign: "right" }}>Avg Size</th>
                    <th style={{ textAlign: "right" }}>Completion</th>
                    <th style={{ textAlign: "right" }}>Confirmed Fraud</th>
                    <th style={{ textAlign: "right" }}>Fraud Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {DATA.channel_performance.map((c, i) => (
                    <tr key={i}>
                      <td style={{ color: "#fff", textTransform: "uppercase", letterSpacing: "0.05em" }}>{c.channel}</td>
                      <td className="num" style={{ textAlign: "right" }}>{fmtNum(c.transactions)}</td>
                      <td className="num" style={{ textAlign: "right", color: "#22d97a" }}>{fmtUSDdec(c.volume)}</td>
                      <td className="num" style={{ textAlign: "right" }}>{fmtUSDdec(c.avg_txn_size)}</td>
                      <td className="num" style={{ textAlign: "right", color: "#7ad9ff" }}>{fmtPct(c.completion_rate)}</td>
                      <td className="num" style={{ textAlign: "right", color: c.confirmed_fraud_count > 0 ? "#ff8c42" : "#666" }}>{c.confirmed_fraud_count}</td>
                      <td className="num" style={{ textAlign: "right", color: "#ff8c42" }}>{fmtPct(c.fraud_rate)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="panel">
              <div className="panel-title">agg_merchant_category</div>
              <div className="panel-sub">Spending by merchant category (payments only)</div>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={DATA.merchant_category} layout="vertical" margin={{ left: 100 }}>
                  <CartesianGrid stroke="#1a1a1a" horizontal={false} />
                  <XAxis type="number" stroke="#555" tick={{ fontSize: 10, fill: "#888" }}
                         tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
                  <YAxis type="category" dataKey="merchant_category" stroke="#555"
                         tick={{ fontSize: 10, fill: "#aaa" }} width={100} />
                  <Tooltip content={<DarkTooltip valuePrefix="$" />} />
                  <Bar dataKey="volume" name="volume" fill="#7ad9ff" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </>
        )}

        {/* FRAUD & RISK */}
        {tab === "fraud" && (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}>
              {DATA.risk_distribution.sort((a, b) => {
                const order = { low: 0, medium: 1, high: 2, critical: 3 };
                return order[a.risk_band] - order[b.risk_band];
              }).map(r => (
                <div key={r.risk_band} className="kpi-card" style={{ borderLeftColor: RISK_COLORS[r.risk_band] }}>
                  <div className="kpi-label" style={{ color: RISK_COLORS[r.risk_band] }}>{r.risk_band} risk</div>
                  <div className="kpi-value num">{r.customers}</div>
                  <div className="kpi-meta">customers</div>
                </div>
              ))}
            </div>

            <div className="panel" style={{ marginBottom: 24 }}>
              <div className="panel-title">agg_fraud_metrics</div>
              <div className="panel-sub">Detection precision by alert type</div>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Alert Type</th>
                    <th style={{ textAlign: "right" }}>Total Alerts</th>
                    <th style={{ textAlign: "right" }}>Confirmed Fraud</th>
                    <th style={{ textAlign: "right" }}>False Positives</th>
                    <th style={{ textAlign: "right" }}>Precision</th>
                    <th style={{ textAlign: "right" }}>Confirmed Loss</th>
                  </tr>
                </thead>
                <tbody>
                  {DATA.fraud_metrics.map((f, i) => (
                    <tr key={i}>
                      <td style={{ color: "#fff", textTransform: "uppercase", letterSpacing: "0.05em" }}>{f.alert_type}</td>
                      <td className="num" style={{ textAlign: "right" }}>{f.alerts}</td>
                      <td className="num" style={{ textAlign: "right", color: "#ff8c42" }}>{f.confirmed_fraud}</td>
                      <td className="num" style={{ textAlign: "right", color: "#888" }}>{f.false_positives}</td>
                      <td className="num" style={{ textAlign: "right", color: "#7ad9ff" }}>{fmtPct(f.precision_rate)}</td>
                      <td className="num" style={{ textAlign: "right", color: "#ff5252" }}>{fmtUSDdec(f.confirmed_fraud_amount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="panel">
              <div className="panel-title">fct_transactions WHERE is_flagged = 1 ORDER BY txn_date DESC LIMIT 12</div>
              <div className="panel-sub">Recent fraud alerts</div>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Txn ID</th>
                    <th>Customer</th>
                    <th style={{ textAlign: "right" }}>Amount</th>
                    <th>Channel</th>
                    <th>Severity</th>
                    <th>Resolution</th>
                  </tr>
                </thead>
                <tbody>
                  {DATA.recent_fraud.map((t, i) => (
                    <tr key={i}>
                      <td className="num" style={{ color: "#888" }}>{t.txn_date}</td>
                      <td className="num" style={{ color: "#888" }}>#{t.transaction_id}</td>
                      <td className="num">CUST-{t.customer_id}</td>
                      <td className="num" style={{ textAlign: "right", color: "#fff" }}>{fmtUSDdec(t.amount)} <span style={{ color: "#666", fontSize: 10 }}>{t.currency}</span></td>
                      <td style={{ textTransform: "uppercase", color: "#aaa", letterSpacing: "0.05em" }}>{t.channel}</td>
                      <td>
                        <span className="pill" style={{ color: SEVERITY_COLORS[t.fraud_severity] }}>
                          {t.fraud_severity}
                        </span>
                      </td>
                      <td>
                        <span className="pill" style={{
                          color: t.fraud_resolution === "confirmed_fraud" ? "#ff5252"
                               : t.fraud_resolution === "false_positive" ? "#7ad9ff"
                               : "#ffb84d"
                        }}>
                          {t.fraud_resolution.replace("_", " ")}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* LOANS */}
        {tab === "loans" && (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}>
              <div className="kpi-card">
                <div className="kpi-label">Originated</div>
                <div className="kpi-value num">{fmtUSD(DATA.loan_kpis.total_originated)}</div>
                <div className="kpi-meta">{DATA.loan_kpis.total_loans} loans</div>
              </div>
              <div className="kpi-card">
                <div className="kpi-label">Outstanding</div>
                <div className="kpi-value num">{fmtUSD(DATA.loan_kpis.total_outstanding)}</div>
                <div className="kpi-meta">Principal balance</div>
              </div>
              <div className="kpi-card warn">
                <div className="kpi-label">Delinquent</div>
                <div className="kpi-value num">{DATA.loan_kpis.delinquent_count}</div>
                <div className="kpi-meta">{DATA.loan_kpis.delinquency_rate_pct}% rate</div>
              </div>
              <div className="kpi-card">
                <div className="kpi-label">Repaid</div>
                <div className="kpi-value num">
                  {fmtUSD(DATA.loan_kpis.total_originated - DATA.loan_kpis.total_outstanding)}
                </div>
                <div className="kpi-meta">Principal</div>
              </div>
            </div>

            <div className="panel">
              <div className="panel-title">agg_loan_portfolio</div>
              <div className="panel-sub">Portfolio detail by loan type</div>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Type</th>
                    <th style={{ textAlign: "right" }}>Loans</th>
                    <th style={{ textAlign: "right" }}>Originated</th>
                    <th style={{ textAlign: "right" }}>Outstanding</th>
                    <th style={{ textAlign: "right" }}>Repaid</th>
                    <th style={{ textAlign: "right" }}>Avg Rate</th>
                    <th style={{ textAlign: "right" }}>Delinquent</th>
                    <th style={{ textAlign: "right" }}>Delinquency</th>
                  </tr>
                </thead>
                <tbody>
                  {DATA.loan_portfolio.map((l, i) => (
                    <tr key={i}>
                      <td style={{ color: "#fff", textTransform: "uppercase", letterSpacing: "0.05em" }}>{l.loan_type}</td>
                      <td className="num" style={{ textAlign: "right" }}>{l.loans}</td>
                      <td className="num" style={{ textAlign: "right" }}>{fmtUSDdec(l.total_originated)}</td>
                      <td className="num" style={{ textAlign: "right", color: "#22d97a" }}>{fmtUSDdec(l.total_outstanding)}</td>
                      <td className="num" style={{ textAlign: "right", color: "#7ad9ff" }}>{fmtUSDdec(l.total_repaid)}</td>
                      <td className="num" style={{ textAlign: "right" }}>{l.avg_rate_pct}%</td>
                      <td className="num" style={{ textAlign: "right", color: l.delinquent_loans > 0 ? "#ff8c42" : "#666" }}>{l.delinquent_loans}</td>
                      <td className="num" style={{ textAlign: "right", color: "#ff5252" }}>{fmtPct(l.delinquency_rate)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* CUSTOMERS */}
        {tab === "customers" && (
          <div className="panel">
            <div className="panel-title">dim_customers ORDER BY lifetime_volume DESC LIMIT 10</div>
            <div className="panel-sub">Top customers by transaction volume</div>
            <table className="data-table">
              <thead>
                <tr>
                  <th>#</th><th>Name</th><th>Country</th>
                  <th style={{ textAlign: "right" }}>Transactions</th>
                  <th style={{ textAlign: "right" }}>Volume</th>
                  <th style={{ textAlign: "right" }}>Balance</th>
                  <th>Engagement</th><th>Risk</th>
                </tr>
              </thead>
              <tbody>
                {DATA.top_customers.map((c, i) => (
                  <tr key={i}>
                    <td style={{ color: "#666" }} className="num">{String(i + 1).padStart(2, "0")}</td>
                    <td style={{ color: "#fff" }}>{c.full_name}</td>
                    <td style={{ color: "#888" }}>{COUNTRY_NAMES[c.country_code] || c.country_code}</td>
                    <td className="num" style={{ textAlign: "right" }}>{c.lifetime_transactions}</td>
                    <td className="num" style={{ textAlign: "right", color: "#22d97a" }}>{fmtUSDdec(c.lifetime_volume)}</td>
                    <td className="num" style={{ textAlign: "right", color: "#7ad9ff" }}>{fmtUSDdec(c.total_balance)}</td>
                    <td>
                      <span className="pill" style={{ color: SEGMENT_COLORS[c.engagement_segment] }}>
                        {c.engagement_segment.replace("_", " ")}
                      </span>
                    </td>
                    <td>
                      <span className="pill" style={{ color: RISK_COLORS[c.risk_band] }}>
                        {c.risk_band}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* GEO */}
        {tab === "geo" && (
          <>
            <div className="panel" style={{ marginBottom: 24 }}>
              <div className="panel-title">SELECT country_code, SUM(amount) FROM fct_transactions GROUP BY country_code</div>
              <div className="panel-sub">Volume by country</div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={DATA.country_volume}>
                  <CartesianGrid stroke="#1a1a1a" vertical={false} />
                  <XAxis dataKey="country_code" stroke="#555" tick={{ fontSize: 10, fill: "#aaa" }} />
                  <YAxis stroke="#555" tick={{ fontSize: 10, fill: "#888" }}
                         tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
                  <Tooltip content={<DarkTooltip valuePrefix="$" />} />
                  <Bar dataKey="volume" name="volume" fill="#22d97a" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="panel">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Country</th>
                    <th style={{ textAlign: "right" }}>Customers</th>
                    <th style={{ textAlign: "right" }}>Transactions</th>
                    <th style={{ textAlign: "right" }}>Volume</th>
                  </tr>
                </thead>
                <tbody>
                  {DATA.country_volume.map((r, i) => (
                    <tr key={i}>
                      <td style={{ color: "#fff" }}>
                        {COUNTRY_NAMES[r.country_code] || r.country_code}{" "}
                        <span style={{ color: "#666", fontSize: 10 }}>· {r.country_code}</span>
                      </td>
                      <td className="num" style={{ textAlign: "right" }}>{r.customers}</td>
                      <td className="num" style={{ textAlign: "right" }}>{fmtNum(r.transactions)}</td>
                      <td className="num" style={{ textAlign: "right", color: "#22d97a" }}>{fmtUSDdec(r.volume)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </main>

      <footer style={{ borderTop: "1px solid #1a1a1a", padding: "16px 32px",
                       color: "#555", fontSize: 10, letterSpacing: "0.1em",
                       display: "flex", justifyContent: "space-between" }}>
        <span>POSTGRES → AIRBYTE → WAREHOUSE → DBT → MARTS → BI</span>
        <span>FINTECH ANALYTICS · DEMO BUILD</span>
      </footer>
    </div>
  );
}
