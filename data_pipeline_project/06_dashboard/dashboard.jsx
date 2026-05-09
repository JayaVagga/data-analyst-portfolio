import React, { useState, useMemo } from 'react';
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';

// =====================================================================
// DATA FROM dbt MARTS (exported via export_for_bi.py)
// In production: BI tool would query the warehouse via SQL directly
// =====================================================================
const DATA = {"kpis":{"total_revenue":244853.44,"total_margin":150739.44,"total_orders":1197,"unique_customers":247,"avg_order_value":204.56},"daily_revenue":[{"order_date":"2025-05-08","orders":5,"revenue":780.98,"margin":524.98,"aov":156.2},{"order_date":"2025-05-09","orders":2,"revenue":1158.98,"margin":717.98,"aov":579.49},{"order_date":"2025-05-10","orders":1,"revenue":194.98,"margin":130.98,"aov":194.98},{"order_date":"2025-05-11","orders":3,"revenue":300.97,"margin":206.97,"aov":100.32},{"order_date":"2025-05-12","orders":5,"revenue":1839.98,"margin":1037.98,"aov":368.0},{"order_date":"2025-05-13","orders":3,"revenue":313.98,"margin":211.98,"aov":104.66},{"order_date":"2025-05-14","orders":1,"revenue":124.99,"margin":81.99,"aov":124.99},{"order_date":"2025-05-15","orders":5,"revenue":1349.93,"margin":844.93,"aov":269.99},{"order_date":"2025-05-16","orders":3,"revenue":992.98,"margin":626.98,"aov":330.99},{"order_date":"2025-05-17","orders":5,"revenue":1424.97,"margin":832.97,"aov":284.99},{"order_date":"2025-05-18","orders":4,"revenue":885.98,"margin":575.98,"aov":221.5},{"order_date":"2025-05-19","orders":5,"revenue":2131.96,"margin":1176.96,"aov":426.39},{"order_date":"2025-05-20","orders":3,"revenue":309.95,"margin":220.95,"aov":103.32},{"order_date":"2025-05-21","orders":4,"revenue":839.98,"margin":531.98,"aov":210.0},{"order_date":"2025-05-22","orders":4,"revenue":767.97,"margin":464.97,"aov":191.99},{"order_date":"2025-05-23","orders":3,"revenue":1311.98,"margin":688.98,"aov":437.33},{"order_date":"2025-05-24","orders":4,"revenue":1179.96,"margin":747.96,"aov":294.99},{"order_date":"2025-05-25","orders":7,"revenue":1004.95,"margin":654.95,"aov":143.56},{"order_date":"2025-05-26","orders":1,"revenue":89.99,"margin":54.99,"aov":89.99},{"order_date":"2025-05-27","orders":4,"revenue":930.97,"margin":498.97,"aov":232.74},{"order_date":"2025-05-29","orders":5,"revenue":1082.98,"margin":587.98,"aov":216.6},{"order_date":"2025-05-30","orders":3,"revenue":533.94,"margin":366.94,"aov":177.98},{"order_date":"2025-05-31","orders":3,"revenue":1452.91,"margin":856.91,"aov":484.3},{"order_date":"2025-06-01","orders":1,"revenue":32.0,"margin":23.0,"aov":32.0},{"order_date":"2025-06-02","orders":5,"revenue":444.97,"margin":303.97,"aov":88.99},{"order_date":"2025-06-03","orders":2,"revenue":190.99,"margin":139.99,"aov":95.5},{"order_date":"2025-06-04","orders":3,"revenue":612.95,"margin":397.95,"aov":204.32},{"order_date":"2025-06-05","orders":7,"revenue":916.91,"margin":629.91,"aov":130.99},{"order_date":"2025-06-06","orders":3,"revenue":318.0,"margin":212.0,"aov":106.0},{"order_date":"2025-06-07","orders":5,"revenue":585.94,"margin":402.94,"aov":117.19},{"order_date":"2025-06-08","orders":2,"revenue":615.97,"margin":362.97,"aov":307.99},{"order_date":"2025-06-09","orders":4,"revenue":1077.95,"margin":696.95,"aov":269.49},{"order_date":"2025-06-10","orders":8,"revenue":1712.94,"margin":1062.94,"aov":214.12},{"order_date":"2025-06-11","orders":1,"revenue":219.0,"margin":129.0,"aov":219.0},{"order_date":"2025-06-12","orders":7,"revenue":1598.95,"margin":978.95,"aov":228.42},{"order_date":"2025-06-13","orders":1,"revenue":144.99,"margin":98.99,"aov":144.99},{"order_date":"2025-06-14","orders":4,"revenue":696.93,"margin":454.93,"aov":174.23},{"order_date":"2025-06-15","orders":3,"revenue":567.98,"margin":308.98,"aov":189.33},{"order_date":"2025-06-16","orders":2,"revenue":239.97,"margin":155.97,"aov":119.98},{"order_date":"2025-06-17","orders":1,"revenue":152.98,"margin":113.98,"aov":152.98},{"order_date":"2025-06-18","orders":4,"revenue":645.97,"margin":437.97,"aov":161.49},{"order_date":"2025-06-19","orders":6,"revenue":531.97,"margin":372.97,"aov":88.66},{"order_date":"2025-06-20","orders":4,"revenue":1065.98,"margin":667.98,"aov":266.5},{"order_date":"2025-06-21","orders":4,"revenue":1379.96,"margin":787.96,"aov":344.99},{"order_date":"2025-06-22","orders":3,"revenue":889.97,"margin":586.97,"aov":296.66},{"order_date":"2025-06-23","orders":6,"revenue":1280.95,"margin":791.95,"aov":213.49},{"order_date":"2025-06-24","orders":4,"revenue":411.97,"margin":282.97,"aov":102.99},{"order_date":"2025-06-25","orders":1,"revenue":60.0,"margin":44.0,"aov":60.0},{"order_date":"2025-06-26","orders":6,"revenue":897.95,"margin":599.95,"aov":149.66},{"order_date":"2025-06-28","orders":4,"revenue":447.98,"margin":299.98,"aov":112.0},{"order_date":"2025-06-29","orders":3,"revenue":1060.94,"margin":676.94,"aov":353.65},{"order_date":"2025-06-30","orders":2,"revenue":395.99,"margin":244.99,"aov":198.0},{"order_date":"2025-07-01","orders":2,"revenue":553.98,"margin":302.98,"aov":276.99},{"order_date":"2025-07-02","orders":7,"revenue":1383.96,"margin":837.96,"aov":197.71},{"order_date":"2025-07-04","orders":2,"revenue":223.99,"margin":156.99,"aov":112.0},{"order_date":"2025-07-05","orders":4,"revenue":674.95,"margin":456.95,"aov":168.74},{"order_date":"2025-07-06","orders":2,"revenue":229.98,"margin":157.98,"aov":114.99},{"order_date":"2025-07-07","orders":7,"revenue":1121.95,"margin":725.95,"aov":160.28},{"order_date":"2025-07-08","orders":3,"revenue":803.94,"margin":545.94,"aov":267.98},{"order_date":"2025-07-09","orders":2,"revenue":83.99,"margin":61.99,"aov":41.99},{"order_date":"2025-07-10","orders":3,"revenue":1227.98,"margin":743.98,"aov":409.33},{"order_date":"2025-07-11","orders":5,"revenue":1082.99,"margin":692.99,"aov":216.6},{"order_date":"2025-07-12","orders":5,"revenue":931.97,"margin":560.97,"aov":186.39},{"order_date":"2025-07-13","orders":4,"revenue":282.98,"margin":185.98,"aov":70.75},{"order_date":"2025-07-14","orders":3,"revenue":446.99,"margin":295.99,"aov":149.0},{"order_date":"2025-07-15","orders":2,"revenue":632.99,"margin":354.99,"aov":316.5},{"order_date":"2025-07-16","orders":2,"revenue":164.97,"margin":120.97,"aov":82.48},{"order_date":"2025-07-17","orders":6,"revenue":1086.97,"margin":612.97,"aov":181.16},{"order_date":"2025-07-18","orders":4,"revenue":412.96,"margin":298.96,"aov":103.24},{"order_date":"2025-07-19","orders":3,"revenue":437.97,"margin":306.97,"aov":145.99},{"order_date":"2025-07-20","orders":3,"revenue":354.95,"margin":229.95,"aov":118.32},{"order_date":"2025-07-21","orders":5,"revenue":535.94,"margin":380.94,"aov":107.19},{"order_date":"2025-07-22","orders":4,"revenue":2825.94,"margin":1573.94,"aov":706.49},{"order_date":"2025-07-23","orders":2,"revenue":470.98,"margin":323.98,"aov":235.49},{"order_date":"2025-07-24","orders":2,"revenue":437.0,"margin":302.0,"aov":218.5},{"order_date":"2025-07-25","orders":4,"revenue":972.98,"margin":626.98,"aov":243.25},{"order_date":"2025-07-26","orders":2,"revenue":130.0,"margin":94.0,"aov":65.0},{"order_date":"2025-07-27","orders":3,"revenue":356.95,"margin":243.95,"aov":118.98},{"order_date":"2025-07-28","orders":2,"revenue":378.97,"margin":250.97,"aov":189.49},{"order_date":"2025-07-30","orders":4,"revenue":759.99,"margin":459.99,"aov":190.0},{"order_date":"2025-07-31","orders":4,"revenue":159.99,"margin":117.99,"aov":40.0},{"order_date":"2025-08-02","orders":1,"revenue":301.98,"margin":192.98,"aov":301.98},{"order_date":"2025-08-03","orders":3,"revenue":1785.0,"margin":964.0,"aov":595.0},{"order_date":"2025-08-04","orders":2,"revenue":440.0,"margin":280.0,"aov":220.0},{"order_date":"2025-08-05","orders":2,"revenue":129.0,"margin":93.0,"aov":64.5},{"order_date":"2025-08-06","orders":3,"revenue":742.0,"margin":474.0,"aov":247.33},{"order_date":"2025-08-07","orders":3,"revenue":613.96,"margin":427.96,"aov":204.65},{"order_date":"2025-08-08","orders":5,"revenue":365.97,"margin":256.97,"aov":73.19},{"order_date":"2025-08-09","orders":5,"revenue":962.95,"margin":626.95,"aov":192.59},{"order_date":"2025-08-10","orders":3,"revenue":655.97,"margin":436.97,"aov":218.66},{"order_date":"2025-08-11","orders":1,"revenue":179.98,"margin":109.98,"aov":179.98},{"order_date":"2025-08-12","orders":5,"revenue":1017.92,"margin":669.92,"aov":203.58},{"order_date":"2025-08-13","orders":6,"revenue":508.99,"margin":332.99,"aov":84.83},{"order_date":"2025-08-14","orders":5,"revenue":1020.97,"margin":619.97,"aov":204.19},{"order_date":"2025-08-15","orders":4,"revenue":218.99,"margin":151.99,"aov":54.75},{"order_date":"2025-08-16","orders":2,"revenue":128.99,"margin":91.99,"aov":64.5},{"order_date":"2025-08-17","orders":6,"revenue":1188.97,"margin":736.97,"aov":198.16},{"order_date":"2025-08-18","orders":2,"revenue":386.97,"margin":250.97,"aov":193.49},{"order_date":"2025-08-19","orders":1,"revenue":49.99,"margin":35.99,"aov":49.99},{"order_date":"2025-08-20","orders":2,"revenue":302.98,"margin":213.98,"aov":151.49},{"order_date":"2025-08-21","orders":2,"revenue":540.98,"margin":334.98,"aov":270.49},{"order_date":"2025-08-22","orders":2,"revenue":74.98,"margin":54.98,"aov":37.49},{"order_date":"2025-08-23","orders":5,"revenue":1615.93,"margin":975.93,"aov":323.19},{"order_date":"2025-08-24","orders":2,"revenue":602.99,"margin":389.99,"aov":301.5},{"order_date":"2025-08-25","orders":1,"revenue":91.99,"margin":66.99,"aov":91.99},{"order_date":"2025-08-26","orders":3,"revenue":395.98,"margin":282.98,"aov":131.99},{"order_date":"2025-08-27","orders":3,"revenue":135.99,"margin":93.99,"aov":45.33},{"order_date":"2025-08-28","orders":7,"revenue":1126.9,"margin":750.9,"aov":160.99},{"order_date":"2025-08-29","orders":3,"revenue":729.99,"margin":429.99,"aov":243.33},{"order_date":"2025-08-30","orders":4,"revenue":630.96,"margin":428.96,"aov":157.74},{"order_date":"2025-08-31","orders":7,"revenue":1346.95,"margin":884.95,"aov":192.42},{"order_date":"2025-09-01","orders":4,"revenue":1589.98,"margin":930.98,"aov":397.5},{"order_date":"2025-09-02","orders":2,"revenue":862.0,"margin":504.0,"aov":431.0},{"order_date":"2025-09-03","orders":6,"revenue":644.93,"margin":451.93,"aov":107.49},{"order_date":"2025-09-04","orders":7,"revenue":927.93,"margin":592.93,"aov":132.56},{"order_date":"2025-09-05","orders":7,"revenue":1380.97,"margin":869.97,"aov":197.28},{"order_date":"2025-09-06","orders":3,"revenue":873.98,"margin":537.98,"aov":291.33},{"order_date":"2025-09-07","orders":4,"revenue":1217.98,"margin":630.98,"aov":304.5},{"order_date":"2025-09-08","orders":2,"revenue":508.0,"margin":312.0,"aov":254.0},{"order_date":"2025-09-09","orders":3,"revenue":511.99,"margin":333.99,"aov":170.66},{"order_date":"2025-09-10","orders":2,"revenue":367.96,"margin":250.96,"aov":183.98},{"order_date":"2025-09-11","orders":1,"revenue":220.0,"margin":140.0,"aov":220.0},{"order_date":"2025-09-12","orders":1,"revenue":24.99,"margin":18.99,"aov":24.99},{"order_date":"2025-09-13","orders":3,"revenue":939.99,"margin":584.99,"aov":313.33},{"order_date":"2025-09-14","orders":5,"revenue":788.99,"margin":456.99,"aov":157.8},{"order_date":"2025-09-15","orders":1,"revenue":408.99,"margin":250.99,"aov":408.99},{"order_date":"2025-09-16","orders":2,"revenue":766.96,"margin":456.96,"aov":383.48},{"order_date":"2025-09-17","orders":2,"revenue":548.0,"margin":316.0,"aov":274.0},{"order_date":"2025-09-18","orders":6,"revenue":1152.96,"margin":701.96,"aov":192.16},{"order_date":"2025-09-19","orders":2,"revenue":613.0,"margin":328.0,"aov":306.5},{"order_date":"2025-09-20","orders":3,"revenue":307.0,"margin":201.0,"aov":102.33},{"order_date":"2025-09-21","orders":3,"revenue":663.0,"margin":442.0,"aov":221.0},{"order_date":"2025-09-22","orders":3,"revenue":253.99,"margin":175.99,"aov":84.66},{"order_date":"2025-09-23","orders":8,"revenue":1230.95,"margin":813.95,"aov":153.87},{"order_date":"2025-09-24","orders":3,"revenue":865.96,"margin":507.96,"aov":288.65},{"order_date":"2025-09-25","orders":4,"revenue":1270.97,"margin":825.97,"aov":317.74},{"order_date":"2025-09-26","orders":2,"revenue":209.96,"margin":141.96,"aov":104.98},{"order_date":"2025-09-28","orders":1,"revenue":134.0,"margin":100.0,"aov":134.0},{"order_date":"2025-09-30","orders":3,"revenue":290.0,"margin":191.0,"aov":96.67},{"order_date":"2025-10-01","orders":4,"revenue":1265.0,"margin":797.0,"aov":316.25},{"order_date":"2025-10-02","orders":5,"revenue":1261.94,"margin":688.94,"aov":252.39},{"order_date":"2025-10-03","orders":3,"revenue":633.98,"margin":414.98,"aov":211.33},{"order_date":"2025-10-04","orders":4,"revenue":479.95,"margin":339.95,"aov":119.99},{"order_date":"2025-10-05","orders":6,"revenue":1130.92,"margin":748.92,"aov":188.49},{"order_date":"2025-10-06","orders":2,"revenue":204.99,"margin":142.99,"aov":102.5},{"order_date":"2025-10-07","orders":4,"revenue":716.93,"margin":468.93,"aov":179.23},{"order_date":"2025-10-08","orders":4,"revenue":314.95,"margin":224.95,"aov":78.74},{"order_date":"2025-10-09","orders":4,"revenue":413.98,"margin":274.98,"aov":103.5},{"order_date":"2025-10-10","orders":1,"revenue":94.99,"margin":65.99,"aov":94.99},{"order_date":"2025-10-11","orders":10,"revenue":1917.96,"margin":1151.96,"aov":191.8},{"order_date":"2025-10-12","orders":4,"revenue":762.99,"margin":438.99,"aov":190.75},{"order_date":"2025-10-13","orders":5,"revenue":1428.97,"margin":871.97,"aov":285.79},{"order_date":"2025-10-14","orders":1,"revenue":89.99,"margin":54.99,"aov":89.99},{"order_date":"2025-10-15","orders":1,"revenue":1047.0,"margin":507.0,"aov":1047.0},{"order_date":"2025-10-17","orders":2,"revenue":762.97,"margin":423.97,"aov":381.49},{"order_date":"2025-10-18","orders":3,"revenue":463.98,"margin":308.98,"aov":154.66},{"order_date":"2025-10-19","orders":5,"revenue":1107.95,"margin":712.95,"aov":221.59},{"order_date":"2025-10-20","orders":3,"revenue":648.0,"margin":389.0,"aov":216.0},{"order_date":"2025-10-21","orders":3,"revenue":343.99,"margin":210.99,"aov":114.66},{"order_date":"2025-10-22","orders":2,"revenue":128.0,"margin":92.0,"aov":64.0},{"order_date":"2025-10-23","orders":2,"revenue":94.99,"margin":65.99,"aov":47.5},{"order_date":"2025-10-24","orders":3,"revenue":314.99,"margin":207.99,"aov":105.0},{"order_date":"2025-10-25","orders":5,"revenue":1189.97,"margin":689.97,"aov":237.99},{"order_date":"2025-10-26","orders":3,"revenue":1607.0,"margin":888.0,"aov":535.67},{"order_date":"2025-10-27","orders":3,"revenue":523.97,"margin":362.97,"aov":174.66},{"order_date":"2025-10-28","orders":3,"revenue":1833.99,"margin":973.99,"aov":611.33},{"order_date":"2025-10-29","orders":2,"revenue":477.99,"margin":253.99,"aov":239.0},{"order_date":"2025-10-31","orders":5,"revenue":873.95,"margin":538.95,"aov":174.79},{"order_date":"2025-11-01","orders":5,"revenue":861.97,"margin":504.97,"aov":172.39},{"order_date":"2025-11-02","orders":2,"revenue":405.99,"margin":266.99,"aov":203.0},{"order_date":"2025-11-03","orders":2,"revenue":522.0,"margin":321.0,"aov":261.0},{"order_date":"2025-11-04","orders":2,"revenue":277.98,"margin":184.98,"aov":138.99},{"order_date":"2025-11-05","orders":2,"revenue":93.0,"margin":68.0,"aov":46.5},{"order_date":"2025-11-06","orders":4,"revenue":1504.99,"margin":885.99,"aov":376.25},{"order_date":"2025-11-07","orders":1,"revenue":130.0,"margin":94.0,"aov":130.0},{"order_date":"2025-11-08","orders":3,"revenue":563.99,"margin":325.99,"aov":188.0},{"order_date":"2025-11-09","orders":2,"revenue":77.0,"margin":53.0,"aov":38.5},{"order_date":"2025-11-11","orders":4,"revenue":439.92,"margin":303.92,"aov":109.98},{"order_date":"2025-11-12","orders":5,"revenue":721.97,"margin":461.97,"aov":144.39},{"order_date":"2025-11-13","orders":7,"revenue":909.88,"margin":617.88,"aov":129.98},{"order_date":"2025-11-14","orders":1,"revenue":77.0,"margin":58.0,"aov":77.0},{"order_date":"2025-11-15","orders":2,"revenue":544.97,"margin":346.97,"aov":272.49},{"order_date":"2025-11-16","orders":1,"revenue":45.0,"margin":30.0,"aov":45.0},{"order_date":"2025-11-17","orders":3,"revenue":710.96,"margin":472.96,"aov":236.99},{"order_date":"2025-11-18","orders":3,"revenue":279.99,"margin":204.99,"aov":93.33},{"order_date":"2025-11-19","orders":3,"revenue":698.99,"margin":395.99,"aov":233.0},{"order_date":"2025-11-20","orders":8,"revenue":1978.92,"margin":1255.92,"aov":247.37},{"order_date":"2025-11-21","orders":3,"revenue":466.0,"margin":303.0,"aov":155.33},{"order_date":"2025-11-22","orders":5,"revenue":2012.97,"margin":1173.97,"aov":402.59},{"order_date":"2025-11-23","orders":6,"revenue":1004.98,"margin":603.98,"aov":167.5},{"order_date":"2025-11-24","orders":5,"revenue":363.97,"margin":260.97,"aov":72.79},{"order_date":"2025-11-25","orders":2,"revenue":418.99,"margin":217.99,"aov":209.5},{"order_date":"2025-11-26","orders":5,"revenue":663.96,"margin":447.96,"aov":132.79},{"order_date":"2025-11-27","orders":6,"revenue":632.0,"margin":405.0,"aov":105.33},{"order_date":"2025-11-28","orders":3,"revenue":182.98,"margin":123.98,"aov":60.99},{"order_date":"2025-11-29","orders":2,"revenue":156.98,"margin":104.98,"aov":78.49},{"order_date":"2025-11-30","orders":1,"revenue":129.0,"margin":84.0,"aov":129.0},{"order_date":"2025-12-01","orders":3,"revenue":741.95,"margin":486.95,"aov":247.32},{"order_date":"2025-12-02","orders":4,"revenue":571.98,"margin":356.98,"aov":143.0},{"order_date":"2025-12-03","orders":4,"revenue":1923.95,"margin":1014.95,"aov":480.99},{"order_date":"2025-12-04","orders":4,"revenue":1187.94,"margin":704.94,"aov":296.99},{"order_date":"2025-12-05","orders":4,"revenue":385.98,"margin":264.98,"aov":96.5},{"order_date":"2025-12-06","orders":4,"revenue":299.0,"margin":210.0,"aov":74.75},{"order_date":"2025-12-07","orders":2,"revenue":392.98,"margin":202.98,"aov":196.49},{"order_date":"2025-12-08","orders":2,"revenue":385.98,"margin":260.98,"aov":192.99},{"order_date":"2025-12-09","orders":4,"revenue":685.92,"margin":455.92,"aov":171.48},{"order_date":"2025-12-10","orders":1,"revenue":28.0,"margin":21.0,"aov":28.0},{"order_date":"2025-12-11","orders":2,"revenue":500.97,"margin":280.97,"aov":250.49},{"order_date":"2025-12-12","orders":4,"revenue":518.96,"margin":341.96,"aov":129.74},{"order_date":"2025-12-13","orders":3,"revenue":644.98,"margin":402.98,"aov":214.99},{"order_date":"2025-12-14","orders":3,"revenue":422.96,"margin":284.96,"aov":140.99},{"order_date":"2025-12-15","orders":2,"revenue":610.97,"margin":397.97,"aov":305.49},{"order_date":"2025-12-16","orders":4,"revenue":426.98,"margin":293.98,"aov":106.75},{"order_date":"2025-12-17","orders":5,"revenue":865.0,"margin":515.0,"aov":173.0},{"order_date":"2025-12-18","orders":6,"revenue":875.96,"margin":595.96,"aov":145.99},{"order_date":"2025-12-19","orders":2,"revenue":629.94,"margin":427.94,"aov":314.97},{"order_date":"2025-12-20","orders":4,"revenue":381.94,"margin":263.94,"aov":95.48},{"order_date":"2025-12-21","orders":2,"revenue":517.99,"margin":309.99,"aov":259.0},{"order_date":"2025-12-22","orders":3,"revenue":712.98,"margin":417.98,"aov":237.66},{"order_date":"2025-12-23","orders":3,"revenue":409.99,"margin":268.99,"aov":136.66},{"order_date":"2025-12-24","orders":4,"revenue":922.93,"margin":575.93,"aov":230.73},{"order_date":"2025-12-25","orders":4,"revenue":1296.94,"margin":803.94,"aov":324.24},{"order_date":"2025-12-26","orders":3,"revenue":606.0,"margin":349.0,"aov":202.0},{"order_date":"2025-12-27","orders":1,"revenue":140.97,"margin":106.97,"aov":140.97},{"order_date":"2025-12-28","orders":1,"revenue":129.0,"margin":84.0,"aov":129.0},{"order_date":"2025-12-29","orders":4,"revenue":726.95,"margin":497.95,"aov":181.74},{"order_date":"2025-12-30","orders":5,"revenue":983.95,"margin":633.95,"aov":196.79},{"order_date":"2025-12-31","orders":3,"revenue":523.96,"margin":352.96,"aov":174.65},{"order_date":"2026-01-01","orders":4,"revenue":877.96,"margin":580.96,"aov":219.49},{"order_date":"2026-01-02","orders":5,"revenue":871.96,"margin":538.96,"aov":174.39},{"order_date":"2026-01-04","orders":3,"revenue":549.94,"margin":370.94,"aov":183.31},{"order_date":"2026-01-05","orders":3,"revenue":447.97,"margin":291.97,"aov":149.32},{"order_date":"2026-01-06","orders":2,"revenue":401.0,"margin":263.0,"aov":200.5},{"order_date":"2026-01-07","orders":1,"revenue":119.0,"margin":89.0,"aov":119.0},{"order_date":"2026-01-08","orders":4,"revenue":1265.0,"margin":688.0,"aov":316.25},{"order_date":"2026-01-09","orders":2,"revenue":459.0,"margin":239.0,"aov":229.5},{"order_date":"2026-01-10","orders":6,"revenue":433.96,"margin":303.96,"aov":72.33},{"order_date":"2026-01-11","orders":2,"revenue":174.0,"margin":114.0,"aov":87.0},{"order_date":"2026-01-12","orders":2,"revenue":959.0,"margin":554.0,"aov":479.5},{"order_date":"2026-01-13","orders":4,"revenue":737.98,"margin":499.98,"aov":184.5},{"order_date":"2026-01-14","orders":6,"revenue":1110.92,"margin":703.92,"aov":185.15},{"order_date":"2026-01-15","orders":4,"revenue":365.96,"margin":257.96,"aov":91.49},{"order_date":"2026-01-16","orders":1,"revenue":18.99,"margin":14.99,"aov":18.99},{"order_date":"2026-01-17","orders":5,"revenue":461.91,"margin":321.91,"aov":92.38},{"order_date":"2026-01-18","orders":4,"revenue":405.97,"margin":278.97,"aov":101.49},{"order_date":"2026-01-19","orders":7,"revenue":1304.92,"margin":865.92,"aov":186.42},{"order_date":"2026-01-20","orders":2,"revenue":287.97,"margin":198.97,"aov":143.99},{"order_date":"2026-01-22","orders":4,"revenue":855.96,"margin":455.96,"aov":213.99},{"order_date":"2026-01-23","orders":4,"revenue":616.97,"margin":413.97,"aov":154.24},{"order_date":"2026-01-24","orders":1,"revenue":64.0,"margin":46.0,"aov":64.0},{"order_date":"2026-01-25","orders":4,"revenue":749.98,"margin":502.98,"aov":187.5},{"order_date":"2026-01-26","orders":3,"revenue":138.98,"margin":104.98,"aov":46.33},{"order_date":"2026-01-27","orders":1,"revenue":65.0,"margin":47.0,"aov":65.0},{"order_date":"2026-01-28","orders":2,"revenue":147.98,"margin":99.98,"aov":73.99},{"order_date":"2026-01-29","orders":2,"revenue":261.97,"margin":173.97,"aov":130.99},{"order_date":"2026-01-30","orders":6,"revenue":2048.96,"margin":1122.96,"aov":341.49},{"order_date":"2026-01-31","orders":4,"revenue":474.0,"margin":312.0,"aov":118.5},{"order_date":"2026-02-02","orders":6,"revenue":526.97,"margin":347.97,"aov":87.83},{"order_date":"2026-02-04","orders":1,"revenue":79.99,"margin":51.99,"aov":79.99},{"order_date":"2026-02-05","orders":3,"revenue":1031.97,"margin":603.97,"aov":343.99},{"order_date":"2026-02-06","orders":5,"revenue":2434.95,"margin":1289.95,"aov":486.99},{"order_date":"2026-02-07","orders":4,"revenue":699.97,"margin":418.97,"aov":174.99},{"order_date":"2026-02-08","orders":2,"revenue":269.97,"margin":175.97,"aov":134.99},{"order_date":"2026-02-09","orders":2,"revenue":251.99,"margin":172.99,"aov":126.0},{"order_date":"2026-02-10","orders":2,"revenue":308.99,"margin":198.99,"aov":154.5},{"order_date":"2026-02-11","orders":3,"revenue":325.99,"margin":217.99,"aov":108.66},{"order_date":"2026-02-12","orders":4,"revenue":655.98,"margin":444.98,"aov":164.0},{"order_date":"2026-02-13","orders":3,"revenue":993.98,"margin":535.98,"aov":331.33},{"order_date":"2026-02-14","orders":3,"revenue":289.99,"margin":202.99,"aov":96.66},{"order_date":"2026-02-15","orders":6,"revenue":1322.96,"margin":750.96,"aov":220.49},{"order_date":"2026-02-16","orders":3,"revenue":206.98,"margin":141.98,"aov":68.99},{"order_date":"2026-02-17","orders":3,"revenue":571.97,"margin":355.97,"aov":190.66},{"order_date":"2026-02-18","orders":6,"revenue":744.92,"margin":502.92,"aov":124.15},{"order_date":"2026-02-19","orders":3,"revenue":368.98,"margin":250.98,"aov":122.99},{"order_date":"2026-02-20","orders":2,"revenue":77.98,"margin":58.98,"aov":38.99},{"order_date":"2026-02-21","orders":3,"revenue":298.97,"margin":191.97,"aov":99.66},{"order_date":"2026-02-22","orders":4,"revenue":469.96,"margin":321.96,"aov":117.49},{"order_date":"2026-02-23","orders":6,"revenue":1823.93,"margin":1145.93,"aov":303.99},{"order_date":"2026-02-24","orders":3,"revenue":450.98,"margin":303.98,"aov":150.33},{"order_date":"2026-02-25","orders":1,"revenue":110.0,"margin":70.0,"aov":110.0},{"order_date":"2026-02-26","orders":1,"revenue":45.0,"margin":30.0,"aov":45.0},{"order_date":"2026-02-27","orders":3,"revenue":987.0,"margin":584.0,"aov":329.0},{"order_date":"2026-02-28","orders":3,"revenue":391.98,"margin":256.98,"aov":130.66},{"order_date":"2026-03-01","orders":5,"revenue":753.94,"margin":504.94,"aov":150.79},{"order_date":"2026-03-02","orders":3,"revenue":401.98,"margin":270.98,"aov":133.99},{"order_date":"2026-03-03","orders":5,"revenue":715.93,"margin":476.93,"aov":143.19},{"order_date":"2026-03-04","orders":3,"revenue":556.98,"margin":368.98,"aov":185.66},{"order_date":"2026-03-05","orders":6,"revenue":1113.96,"margin":661.96,"aov":185.66},{"order_date":"2026-03-06","orders":7,"revenue":1158.92,"margin":733.92,"aov":165.56},{"order_date":"2026-03-07","orders":3,"revenue":597.97,"margin":377.97,"aov":199.32},{"order_date":"2026-03-08","orders":5,"revenue":837.96,"margin":541.96,"aov":167.59},{"order_date":"2026-03-09","orders":4,"revenue":1204.92,"margin":729.92,"aov":301.23},{"order_date":"2026-03-10","orders":3,"revenue":608.99,"margin":380.99,"aov":203.0},{"order_date":"2026-03-11","orders":6,"revenue":1640.98,"margin":900.98,"aov":273.5},{"order_date":"2026-03-12","orders":1,"revenue":70.0,"margin":54.0,"aov":70.0},{"order_date":"2026-03-13","orders":6,"revenue":1322.99,"margin":695.99,"aov":220.5},{"order_date":"2026-03-14","orders":3,"revenue":240.0,"margin":177.0,"aov":80.0},{"order_date":"2026-03-15","orders":3,"revenue":284.98,"margin":190.98,"aov":94.99},{"order_date":"2026-03-16","orders":1,"revenue":99.98,"margin":71.98,"aov":99.98},{"order_date":"2026-03-17","orders":6,"revenue":3031.95,"margin":1808.95,"aov":505.32},{"order_date":"2026-03-18","orders":3,"revenue":274.98,"margin":202.98,"aov":91.66},{"order_date":"2026-03-19","orders":8,"revenue":1608.99,"margin":941.99,"aov":201.12},{"order_date":"2026-03-20","orders":4,"revenue":1200.94,"margin":730.94,"aov":300.24},{"order_date":"2026-03-21","orders":2,"revenue":159.97,"margin":117.97,"aov":79.98},{"order_date":"2026-03-22","orders":3,"revenue":589.97,"margin":391.97,"aov":196.66},{"order_date":"2026-03-23","orders":3,"revenue":1382.95,"margin":828.95,"aov":460.98},{"order_date":"2026-03-24","orders":3,"revenue":1144.97,"margin":700.97,"aov":381.66},{"order_date":"2026-03-25","orders":2,"revenue":139.99,"margin":95.99,"aov":70.0},{"order_date":"2026-03-26","orders":6,"revenue":1888.95,"margin":1184.95,"aov":314.82},{"order_date":"2026-03-27","orders":1,"revenue":255.0,"margin":167.0,"aov":255.0},{"order_date":"2026-03-28","orders":2,"revenue":633.98,"margin":356.98,"aov":316.99},{"order_date":"2026-03-29","orders":3,"revenue":750.0,"margin":455.0,"aov":250.0},{"order_date":"2026-03-30","orders":7,"revenue":864.94,"margin":535.94,"aov":123.56},{"order_date":"2026-03-31","orders":3,"revenue":648.99,"margin":377.99,"aov":216.33},{"order_date":"2026-04-01","orders":4,"revenue":1131.94,"margin":670.94,"aov":282.99},{"order_date":"2026-04-02","orders":1,"revenue":45.0,"margin":30.0,"aov":45.0},{"order_date":"2026-04-03","orders":1,"revenue":142.99,"margin":99.99,"aov":142.99},{"order_date":"2026-04-04","orders":7,"revenue":1933.91,"margin":1107.91,"aov":276.27},{"order_date":"2026-04-05","orders":2,"revenue":477.0,"margin":318.0,"aov":238.5},{"order_date":"2026-04-06","orders":3,"revenue":877.99,"margin":463.99,"aov":292.66},{"order_date":"2026-04-07","orders":4,"revenue":715.92,"margin":438.92,"aov":178.98},{"order_date":"2026-04-08","orders":2,"revenue":454.98,"margin":306.98,"aov":227.49},{"order_date":"2026-04-09","orders":1,"revenue":196.99,"margin":132.99,"aov":196.99},{"order_date":"2026-04-10","orders":5,"revenue":2868.97,"margin":1573.97,"aov":573.79},{"order_date":"2026-04-11","orders":4,"revenue":2121.96,"margin":1105.96,"aov":530.49},{"order_date":"2026-04-12","orders":4,"revenue":718.94,"margin":414.94,"aov":179.73},{"order_date":"2026-04-13","orders":1,"revenue":24.99,"margin":18.99,"aov":24.99},{"order_date":"2026-04-14","orders":5,"revenue":1134.98,"margin":627.98,"aov":227.0},{"order_date":"2026-04-15","orders":7,"revenue":2197.91,"margin":1370.91,"aov":313.99},{"order_date":"2026-04-16","orders":7,"revenue":1840.98,"margin":1169.98,"aov":263.0},{"order_date":"2026-04-17","orders":1,"revenue":262.98,"margin":162.98,"aov":262.98},{"order_date":"2026-04-18","orders":4,"revenue":1203.99,"margin":659.99,"aov":301.0},{"order_date":"2026-04-19","orders":1,"revenue":253.99,"margin":165.99,"aov":253.99},{"order_date":"2026-04-20","orders":2,"revenue":372.99,"margin":231.99,"aov":186.5},{"order_date":"2026-04-21","orders":2,"revenue":1006.0,"margin":556.0,"aov":503.0},{"order_date":"2026-04-22","orders":5,"revenue":1739.98,"margin":963.98,"aov":348.0},{"order_date":"2026-04-24","orders":6,"revenue":1843.95,"margin":1052.95,"aov":307.32},{"order_date":"2026-04-25","orders":2,"revenue":837.99,"margin":433.99,"aov":419.0},{"order_date":"2026-04-26","orders":1,"revenue":349.0,"margin":169.0,"aov":349.0},{"order_date":"2026-04-27","orders":2,"revenue":390.0,"margin":244.0,"aov":195.0},{"order_date":"2026-04-29","orders":2,"revenue":336.98,"margin":242.98,"aov":168.49},{"order_date":"2026-04-30","orders":4,"revenue":357.95,"margin":235.95,"aov":89.49},{"order_date":"2026-05-01","orders":2,"revenue":746.99,"margin":441.99,"aov":373.5},{"order_date":"2026-05-02","orders":1,"revenue":239.97,"margin":155.97,"aov":239.97},{"order_date":"2026-05-03","orders":4,"revenue":799.96,"margin":492.96,"aov":199.99},{"order_date":"2026-05-04","orders":1,"revenue":610.0,"margin":329.0,"aov":610.0},{"order_date":"2026-05-05","orders":4,"revenue":568.99,"margin":369.99,"aov":142.25},{"order_date":"2026-05-06","orders":3,"revenue":864.99,"margin":499.99,"aov":288.33},{"order_date":"2026-05-07","orders":3,"revenue":527.94,"margin":365.94,"aov":175.98},{"order_date":"2026-05-08","orders":3,"revenue":334.95,"margin":235.95,"aov":111.65}],"product_performance":[{"product_name":"4K Monitor 27\"","category":"Electronics","units_sold":178,"revenue":62122.0,"margin":30082.0,"margin_pct":0.4842},{"product_name":"Smartwatch","category":"Electronics","units_sold":188,"revenue":41172.0,"margin":24252.0,"margin_pct":0.589},{"product_name":"Mechanical Keyboard","category":"Electronics","units_sold":186,"revenue":23994.0,"margin":15624.0,"margin_pct":0.6512},{"product_name":"Running Shoes","category":"Sports","units_sold":180,"revenue":19800.0,"margin":12600.0,"margin_pct":0.6364},{"product_name":"Coffee Maker","category":"Home & Kitchen","units_sold":203,"revenue":16237.97,"margin":10553.97,"margin_pct":0.65},{"product_name":"Wireless Headphones","category":"Electronics","units_sold":174,"revenue":15658.26,"margin":9568.26,"margin_pct":0.6111},{"product_name":"Denim Jeans","category":"Apparel","units_sold":197,"revenue":12805.0,"margin":9259.0,"margin_pct":0.7231},{"product_name":"Hoodie","category":"Apparel","units_sold":187,"revenue":9348.13,"margin":6730.13,"margin_pct":0.7199},{"product_name":"Cast Iron Skillet","category":"Home & Kitchen","units_sold":191,"revenue":8595.0,"margin":5730.0,"margin_pct":0.6667},{"product_name":"Face Serum","category":"Beauty","units_sold":204,"revenue":8568.0,"margin":6324.0,"margin_pct":0.7381},{"product_name":"Cookbook - Modern Indian","category":"Books","units_sold":217,"revenue":6944.0,"margin":4991.0,"margin_pct":0.7188},{"product_name":"Yoga Mat","category":"Sports","units_sold":179,"revenue":6265.0,"margin":4833.0,"margin_pct":0.7714},{"product_name":"Cotton T-Shirt","category":"Apparel","units_sold":218,"revenue":5447.82,"margin":4139.82,"margin_pct":0.7599},{"product_name":"Lipstick Set","category":"Beauty","units_sold":164,"revenue":4592.0,"margin":3444.0,"margin_pct":0.75},{"product_name":"Novel - The Migration","category":"Books","units_sold":174,"revenue":3304.26,"margin":2608.26,"margin_pct":0.7894}],"country_revenue":[{"country_code":"FR","customers":33,"orders":166,"revenue":36275.6,"margin":21765.6},{"country_code":"IN","customers":32,"orders":165,"revenue":35076.57,"margin":21733.57},{"country_code":"MX","customers":31,"orders":164,"revenue":32367.96,"margin":19979.96},{"country_code":"CA","customers":28,"orders":124,"revenue":24929.05,"margin":15738.05},{"country_code":"BR","customers":22,"orders":113,"revenue":23767.95,"margin":14610.95},{"country_code":"UK","customers":27,"orders":131,"revenue":23105.08,"margin":14530.08},{"country_code":"AU","customers":21,"orders":86,"revenue":20274.35,"margin":11802.35},{"country_code":"DE","customers":20,"orders":96,"revenue":18596.09,"margin":11822.09},{"country_code":"US","customers":20,"orders":79,"revenue":17159.38,"margin":10386.38},{"country_code":"JP","customers":16,"orders":73,"revenue":13301.41,"margin":8370.41}],"customer_segments":[{"customer_segment":"loyal","customers":126,"revenue":171945.4},{"customer_segment":"repeat","customers":108,"revenue":69928.14},{"customer_segment":"one_time","customers":13,"revenue":2979.9},{"customer_segment":"never_purchased","customers":3,"revenue":0.0}],"order_status_breakdown":[{"order_status":"cancelled","orders":128,"revenue":23574.06},{"order_status":"completed","orders":1197,"revenue":244853.44},{"order_status":"pending","orders":103,"revenue":19990.37},{"order_status":"refunded","orders":72,"revenue":14370.41}],"top_customers":[{"full_name":"Chloe Schmidt","country_code":"FR","lifetime_orders":12,"lifetime_revenue":3637.82,"customer_segment":"loyal"},{"full_name":"Anna Smith","country_code":"UK","lifetime_orders":10,"lifetime_revenue":3113.96,"customer_segment":"loyal"},{"full_name":"Alex Patel","country_code":"US","lifetime_orders":5,"lifetime_revenue":2875.95,"customer_segment":"loyal"},{"full_name":"Priya Garcia","country_code":"MX","lifetime_orders":6,"lifetime_revenue":2715.97,"customer_segment":"loyal"},{"full_name":"Alex Rossi","country_code":"FR","lifetime_orders":11,"lifetime_revenue":2602.89,"customer_segment":"loyal"},{"full_name":"Sofia Khan","country_code":"MX","lifetime_orders":6,"lifetime_revenue":2511.96,"customer_segment":"loyal"},{"full_name":"Yuki Rossi","country_code":"IN","lifetime_orders":12,"lifetime_revenue":2508.94,"customer_segment":"loyal"},{"full_name":"Alex Smith","country_code":"BR","lifetime_orders":6,"lifetime_revenue":2489.9,"customer_segment":"loyal"},{"full_name":"Sofia Khan","country_code":"CA","lifetime_orders":8,"lifetime_revenue":2464.9,"customer_segment":"loyal"},{"full_name":"Sofia Silva","country_code":"MX","lifetime_orders":11,"lifetime_revenue":2395.95,"customer_segment":"loyal"}]};

// Pipeline DAG status — what an orchestrator (Airflow/Dagster) shows
const PIPELINE = [
  { stage: "01 SOURCE",   name: "ecommerce_postgres",    rows: 4371, ms: 12,  status: "ok" },
  { stage: "02 EXTRACT",  name: "airbyte.full_refresh",   rows: 4371, ms: 89,  status: "ok" },
  { stage: "03 LOAD",     name: "warehouse.raw_layer",   rows: 4371, ms: 41,  status: "ok" },
  { stage: "04 TRANSFORM",name: "dbt.run + dbt.test",    rows: 6243, ms: 167, status: "ok" },
  { stage: "05 SERVE",    name: "analytics.marts",       rows: 1822, ms: 18,  status: "ok" },
];

// ----- helpers -----
const fmtUSD = (n) => "$" + n.toLocaleString("en-US", { maximumFractionDigits: 0 });
const fmtUSDdec = (n) => "$" + n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const fmtNum = (n) => n.toLocaleString("en-US");

const COUNTRY_NAMES = {
  US: "United States", UK: "United Kingdom", DE: "Germany", FR: "France",
  IN: "India", JP: "Japan", CA: "Canada", AU: "Australia", BR: "Brazil", MX: "Mexico",
};

const SEGMENT_COLORS = { loyal: "#22d97a", repeat: "#7ad9ff", one_time: "#ffb84d", never_purchased: "#555" };

// Aggregate daily into monthly for the headline chart (350 days is too noisy)
function toMonthly(daily) {
  const m = {};
  daily.forEach(d => {
    const k = d.order_date.slice(0, 7);
    m[k] = m[k] || { month: k, revenue: 0, margin: 0, orders: 0 };
    m[k].revenue += d.revenue;
    m[k].margin  += d.margin;
    m[k].orders  += d.orders;
  });
  return Object.values(m).map(r => ({
    ...r,
    revenue: +r.revenue.toFixed(0),
    margin: +r.margin.toFixed(0),
  }));
}

// Custom dark tooltip — recharts default is too generic
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
  const monthly = useMemo(() => toMonthly(DATA.daily_revenue), []);
  const completedRate = ((DATA.kpis.total_orders / DATA.order_status_breakdown.reduce((s, r) => s + r.orders, 0)) * 100).toFixed(1);
  const marginPct = ((DATA.kpis.total_margin / DATA.kpis.total_revenue) * 100).toFixed(1);

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
          cursor: pointer; text-transform: uppercase; border-bottom: 1px solid transparent;
          transition: all 0.15s;
        }
        .tab-btn:hover { color: #fff; }
        .tab-btn.active { color: #fff; border-bottom-color: #22d97a; }
        .panel {
          background: #0c0c0c; border: 1px solid #1f1f1f;
          padding: 24px;
        }
        .panel-title {
          font-size: 10px; letter-spacing: 0.2em; color: #888;
          text-transform: uppercase; margin-bottom: 4px;
        }
        .panel-sub {
          font-family: 'Fraunces', serif; font-size: 22px; color: #fff;
          font-weight: 400; margin-bottom: 22px; letter-spacing: -0.01em;
        }
        .kpi-card {
          background: #0c0c0c; border: 1px solid #1f1f1f; padding: 20px 22px;
          position: relative; overflow: hidden;
        }
        .kpi-card::before {
          content: ""; position: absolute; left: 0; top: 0; bottom: 0;
          width: 2px; background: #22d97a;
        }
        .kpi-label { font-size: 10px; letter-spacing: 0.18em; color: #888; text-transform: uppercase; }
        .kpi-value {
          font-family: 'Fraunces', serif; font-weight: 300;
          font-size: 32px; color: #fff; margin-top: 8px; letter-spacing: -0.02em;
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
          color: #888; font-size: 10px; letter-spacing: 0.15em; text-transform: uppercase;
          border-bottom: 1px solid #2a2a2a;
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
      <header style={{ borderBottom: "1px solid #1a1a1a", padding: "20px 32px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div style={{ fontFamily: "'Fraunces', serif", fontSize: 22, fontWeight: 400, letterSpacing: "-0.01em" }}>
            <span style={{ color: "#22d97a" }}>◢</span> stack<span style={{ color: "#666" }}>/</span>analytics
          </div>
          <div style={{ height: 18, width: 1, background: "#2a2a2a" }} />
          <div style={{ fontSize: 11, color: "#666", letterSpacing: "0.1em" }}>
            ECOMMERCE · PROD · v0.4.2
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 11, color: "#888" }}>
          <span className="pulse-dot" />
          <span>PIPELINE HEALTHY · LAST RUN 2026-05-09 04:54 UTC</span>
        </div>
      </header>

      {/* TABS */}
      <nav style={{ borderBottom: "1px solid #1a1a1a", padding: "0 24px", display: "flex" }}>
        {[
          ["overview", "Overview"],
          ["pipeline", "Pipeline"],
          ["products", "Products"],
          ["customers", "Customers"],
          ["geo",      "Geography"],
        ].map(([k, label]) => (
          <button key={k} className={`tab-btn ${tab === k ? "active" : ""}`} onClick={() => setTab(k)}>
            {label}
          </button>
        ))}
      </nav>

      <main style={{ padding: "32px" }} className="grid-bg">

        {/* OVERVIEW TAB */}
        {tab === "overview" && (
          <>
            {/* KPI ROW */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 16, marginBottom: 24 }}>
              <div className="kpi-card">
                <div className="kpi-label">Revenue</div>
                <div className="kpi-value num">{fmtUSD(DATA.kpis.total_revenue)}</div>
                <div className="kpi-meta">Completed orders · 12mo</div>
              </div>
              <div className="kpi-card">
                <div className="kpi-label">Gross Margin</div>
                <div className="kpi-value num">{fmtUSD(DATA.kpis.total_margin)}</div>
                <div className="kpi-meta">{marginPct}% margin rate</div>
              </div>
              <div className="kpi-card">
                <div className="kpi-label">Orders</div>
                <div className="kpi-value num">{fmtNum(DATA.kpis.total_orders)}</div>
                <div className="kpi-meta">{completedRate}% completion</div>
              </div>
              <div className="kpi-card">
                <div className="kpi-label">Customers</div>
                <div className="kpi-value num">{fmtNum(DATA.kpis.unique_customers)}</div>
                <div className="kpi-meta">Active in window</div>
              </div>
              <div className="kpi-card">
                <div className="kpi-label">Avg Order Value</div>
                <div className="kpi-value num">{fmtUSDdec(DATA.kpis.avg_order_value)}</div>
                <div className="kpi-meta">Per completed order</div>
              </div>
            </div>

            {/* MAIN CHART */}
            <div className="panel" style={{ marginBottom: 24 }}>
              <div className="panel-title">fct_orders × dim_date</div>
              <div className="panel-sub">Revenue and margin, monthly</div>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={monthly} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%"   stopColor="#22d97a" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="#22d97a" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gMar" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%"   stopColor="#7ad9ff" stopOpacity={0.25} />
                      <stop offset="100%" stopColor="#7ad9ff" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="#1a1a1a" vertical={false} />
                  <XAxis dataKey="month" stroke="#555" tick={{ fontSize: 10, fill: "#888" }} />
                  <YAxis stroke="#555" tick={{ fontSize: 10, fill: "#888" }} tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
                  <Tooltip content={<DarkTooltip valuePrefix="$" />} />
                  <Area type="monotone" dataKey="revenue" name="revenue" stroke="#22d97a" strokeWidth={1.5} fill="url(#gRev)" />
                  <Area type="monotone" dataKey="margin"  name="margin"  stroke="#7ad9ff" strokeWidth={1.5} fill="url(#gMar)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* SPLIT ROW: status + segments */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
              <div className="panel">
                <div className="panel-title">fct_orders.order_status</div>
                <div className="panel-sub">Order status distribution</div>
                {DATA.order_status_breakdown.map(r => {
                  const total = DATA.order_status_breakdown.reduce((s, x) => s + x.orders, 0);
                  const pct = (r.orders / total) * 100;
                  const color = r.order_status === "completed" ? "#22d97a"
                              : r.order_status === "pending"   ? "#ffb84d"
                              : r.order_status === "cancelled" ? "#ff6b6b"
                              : "#888";
                  return (
                    <div key={r.order_status} style={{ marginBottom: 14 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 11 }}>
                        <span style={{ color: "#ccc", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                          {r.order_status}
                        </span>
                        <span className="num" style={{ color: "#888" }}>
                          {r.orders} · {fmtUSDdec(r.revenue)}
                        </span>
                      </div>
                      <div style={{ height: 4, background: "#1a1a1a", position: "relative" }}>
                        <div style={{ width: `${pct}%`, height: "100%", background: color }} />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="panel">
                <div className="panel-title">dim_customers.customer_segment</div>
                <div className="panel-sub">Customer segments by revenue</div>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie
                      data={DATA.customer_segments.filter(s => s.revenue > 0)}
                      dataKey="revenue" nameKey="customer_segment"
                      innerRadius={55} outerRadius={90} paddingAngle={2}
                      stroke="#070707"
                    >
                      {DATA.customer_segments.map((s, i) => (
                        <Cell key={i} fill={SEGMENT_COLORS[s.customer_segment]} />
                      ))}
                    </Pie>
                    <Tooltip content={<DarkTooltip valuePrefix="$" />} />
                  </PieChart>
                </ResponsiveContainer>
                <div style={{ marginTop: 10, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, fontSize: 11 }}>
                  {DATA.customer_segments.map(s => (
                    <div key={s.customer_segment} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ width: 8, height: 8, background: SEGMENT_COLORS[s.customer_segment] }} />
                      <span style={{ color: "#ccc", textTransform: "uppercase", letterSpacing: "0.05em", fontSize: 10 }}>
                        {s.customer_segment.replace("_", " ")}
                      </span>
                      <span className="num" style={{ color: "#888", marginLeft: "auto" }}>{s.customers}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {/* PIPELINE TAB */}
        {tab === "pipeline" && (
          <>
            <div className="panel" style={{ marginBottom: 24 }}>
              <div className="panel-title">orchestrator.dag_run · 2026-05-09T04:54</div>
              <div className="panel-sub">End-to-end pipeline execution</div>

              {/* Visual DAG */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", margin: "20px 0 32px", flexWrap: "wrap", gap: 8 }}>
                {[
                  { name: "Postgres", sub: "OLTP source" },
                  { name: "Airbyte",  sub: "EL connector" },
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
                      <div style={{ fontSize: 12, color: "#fff", letterSpacing: "0.02em" }}>{n.name}</div>
                      <div style={{ fontSize: 9, color: "#666", marginTop: 4, letterSpacing: "0.1em", textTransform: "uppercase" }}>{n.sub}</div>
                    </div>
                    {i < arr.length - 1 && (
                      <div style={{ flex: "1 1 auto", height: 1, background: "linear-gradient(to right, #22d97a, #2a2a2a)", margin: "0 4px", minWidth: 16 }} />
                    )}
                  </React.Fragment>
                ))}
              </div>

              <div style={{ borderTop: "1px solid #1a1a1a", paddingTop: 12 }}>
                <div className="pipeline-row" style={{ color: "#666", fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", borderBottom: "1px solid #2a2a2a" }}>
                  <span>STAGE</span><span>TASK</span><span style={{ textAlign: "right" }}>ROWS</span><span style={{ textAlign: "right" }}>DURATION</span><span style={{ textAlign: "right" }}>STATUS</span>
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

              <div style={{ marginTop: 24, padding: 16, background: "#0a0a0a", border: "1px solid #1a1a1a", fontSize: 11, color: "#888" }}>
                <div style={{ color: "#22d97a", marginBottom: 8 }}>// dbt test results</div>
                <div>12 / 12 tests passed · 0 failures · 0 warnings</div>
                <div style={{ marginTop: 4 }}>not_null, unique, relationships, accepted_values · 10 models built across staging → intermediate → marts</div>
              </div>
            </div>
          </>
        )}

        {/* PRODUCTS TAB */}
        {tab === "products" && (
          <>
            <div className="panel" style={{ marginBottom: 24 }}>
              <div className="panel-title">agg_product_performance</div>
              <div className="panel-sub">Revenue by product</div>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={DATA.product_performance} layout="vertical" margin={{ top: 5, right: 20, left: 140, bottom: 0 }}>
                  <CartesianGrid stroke="#1a1a1a" horizontal={false} />
                  <XAxis type="number" stroke="#555" tick={{ fontSize: 10, fill: "#888" }} tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
                  <YAxis type="category" dataKey="product_name" stroke="#555" tick={{ fontSize: 10, fill: "#aaa" }} width={140} />
                  <Tooltip content={<DarkTooltip valuePrefix="$" />} />
                  <Bar dataKey="revenue" name="revenue" fill="#22d97a" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="margin"  name="margin"  fill="#7ad9ff" radius={[0, 0, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="panel">
              <div className="panel-title">SELECT * FROM agg_product_performance</div>
              <div className="panel-sub">Product detail</div>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Product</th><th>Category</th>
                    <th style={{ textAlign: "right" }}>Units</th>
                    <th style={{ textAlign: "right" }}>Revenue</th>
                    <th style={{ textAlign: "right" }}>Margin</th>
                    <th style={{ textAlign: "right" }}>Margin %</th>
                  </tr>
                </thead>
                <tbody>
                  {DATA.product_performance.map((p, i) => (
                    <tr key={i}>
                      <td style={{ color: "#fff" }}>{p.product_name}</td>
                      <td style={{ color: "#888" }}>{p.category}</td>
                      <td className="num" style={{ textAlign: "right" }}>{fmtNum(p.units_sold)}</td>
                      <td className="num" style={{ textAlign: "right" }}>{fmtUSDdec(p.revenue)}</td>
                      <td className="num" style={{ textAlign: "right", color: "#22d97a" }}>{fmtUSDdec(p.margin)}</td>
                      <td className="num" style={{ textAlign: "right", color: "#7ad9ff" }}>{(p.margin_pct * 100).toFixed(1)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* CUSTOMERS TAB */}
        {tab === "customers" && (
          <div className="panel">
            <div className="panel-title">dim_customers ORDER BY lifetime_revenue DESC LIMIT 10</div>
            <div className="panel-sub">Top customers by lifetime revenue</div>
            <table className="data-table">
              <thead>
                <tr>
                  <th>#</th><th>Name</th><th>Country</th>
                  <th style={{ textAlign: "right" }}>Orders</th>
                  <th style={{ textAlign: "right" }}>LTV</th>
                  <th>Segment</th>
                </tr>
              </thead>
              <tbody>
                {DATA.top_customers.map((c, i) => (
                  <tr key={i}>
                    <td style={{ color: "#666" }} className="num">{String(i + 1).padStart(2, "0")}</td>
                    <td style={{ color: "#fff" }}>{c.full_name}</td>
                    <td style={{ color: "#888" }}>{COUNTRY_NAMES[c.country_code] || c.country_code}</td>
                    <td className="num" style={{ textAlign: "right" }}>{c.lifetime_orders}</td>
                    <td className="num" style={{ textAlign: "right", color: "#22d97a" }}>{fmtUSDdec(c.lifetime_revenue)}</td>
                    <td>
                      <span className="pill" style={{ color: SEGMENT_COLORS[c.customer_segment] }}>
                        {c.customer_segment}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* GEO TAB */}
        {tab === "geo" && (
          <>
            <div className="panel" style={{ marginBottom: 24 }}>
              <div className="panel-title">agg_country_revenue</div>
              <div className="panel-sub">Revenue by country</div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={DATA.country_revenue}>
                  <CartesianGrid stroke="#1a1a1a" vertical={false} />
                  <XAxis dataKey="country_code" stroke="#555" tick={{ fontSize: 10, fill: "#aaa" }} />
                  <YAxis stroke="#555" tick={{ fontSize: 10, fill: "#888" }} tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
                  <Tooltip content={<DarkTooltip valuePrefix="$" />} />
                  <Bar dataKey="revenue" name="revenue" fill="#22d97a" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="panel">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Country</th>
                    <th style={{ textAlign: "right" }}>Customers</th>
                    <th style={{ textAlign: "right" }}>Orders</th>
                    <th style={{ textAlign: "right" }}>Revenue</th>
                    <th style={{ textAlign: "right" }}>Margin</th>
                  </tr>
                </thead>
                <tbody>
                  {DATA.country_revenue.map((r, i) => (
                    <tr key={i}>
                      <td style={{ color: "#fff" }}>{COUNTRY_NAMES[r.country_code] || r.country_code} <span style={{ color: "#666", fontSize: 10 }}>· {r.country_code}</span></td>
                      <td className="num" style={{ textAlign: "right" }}>{r.customers}</td>
                      <td className="num" style={{ textAlign: "right" }}>{r.orders}</td>
                      <td className="num" style={{ textAlign: "right", color: "#22d97a" }}>{fmtUSDdec(r.revenue)}</td>
                      <td className="num" style={{ textAlign: "right", color: "#7ad9ff" }}>{fmtUSDdec(r.margin)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </main>

      <footer style={{ borderTop: "1px solid #1a1a1a", padding: "16px 32px", color: "#555", fontSize: 10, letterSpacing: "0.1em", display: "flex", justifyContent: "space-between" }}>
        <span>POSTGRES → AIRBYTE → WAREHOUSE → DBT → MARTS → BI</span>
        <span>END-TO-END PIPELINE · DEMO BUILD</span>
      </footer>
    </div>
  );
}
