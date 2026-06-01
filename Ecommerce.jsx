import { useState, useEffect, useRef } from "react";
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis } from "recharts";

const revenueData = [
  { month: "Jan", revenue: 42000, orders: 1240, customers: 890 },
  { month: "Feb", revenue: 51000, orders: 1580, customers: 1020 },
  { month: "Mar", revenue: 47000, orders: 1390, customers: 960 },
  { month: "Apr", revenue: 63000, orders: 1820, customers: 1340 },
  { month: "May", revenue: 58000, orders: 1690, customers: 1190 },
  { month: "Jun", revenue: 72000, orders: 2100, customers: 1560 },
  { month: "Jul", revenue: 68000, orders: 1980, customers: 1410 },
  { month: "Aug", revenue: 81000, orders: 2340, customers: 1720 },
  { month: "Sep", revenue: 76000, orders: 2190, customers: 1580 },
  { month: "Oct", revenue: 94000, orders: 2680, customers: 1940 },
  { month: "Nov", revenue: 112000, orders: 3120, customers: 2290 },
  { month: "Dec", revenue: 138000, orders: 3890, customers: 2810 },
];

const segmentData = [
  { name: "Champions", value: 18, color: "#00ff88" },
  { name: "Loyal", value: 24, color: "#00d4ff" },
  { name: "At Risk", value: 15, color: "#ff6b35" },
  { name: "Potential", value: 22, color: "#a855f7" },
  { name: "New", value: 21, color: "#f59e0b" },
];

const categoryData = [
  { category: "Electronics", revenue: 284000, growth: 23 },
  { category: "Fashion", revenue: 198000, growth: 15 },
  { category: "Home & Garden", revenue: 142000, growth: 31 },
  { category: "Sports", revenue: 118000, growth: 8 },
  { category: "Beauty", revenue: 96000, growth: 42 },
  { category: "Books", revenue: 64000, growth: -3 },
];

const behaviorData = [
  { metric: "Retention", value: 78 },
  { metric: "Repeat Buy", value: 64 },
  { metric: "Referral", value: 42 },
  { metric: "Engagement", value: 71 },
  { metric: "Satisfaction", value: 85 },
  { metric: "LTV Score", value: 68 },
];

const cohortData = [
  { cohort: "Jan '25", m0: 100, m1: 68, m2: 52, m3: 44, m4: 38, m5: 34 },
  { cohort: "Feb '25", m0: 100, m1: 71, m2: 55, m3: 47, m4: 41, m5: 37 },
  { cohort: "Mar '25", m0: 100, m1: 65, m2: 49, m3: 42, m4: 36, m5: null },
  { cohort: "Apr '25", m0: 100, m1: 73, m2: 57, m3: 48, m4: null, m5: null },
  { cohort: "May '25", m0: 100, m1: 69, m2: 53, m3: null, m4: null, m5: null },
  { cohort: "Jun '25", m0: 100, m1: 74, m2: null, m3: null, m4: null, m5: null },
];

const topCustomers = [
  { id: "C-00412", name: "Meridian Corp", spend: 12840, orders: 47, segment: "Champion", trend: "+18%" },
  { id: "C-00891", name: "Voss & Partners", spend: 10290, orders: 38, segment: "Champion", trend: "+24%" },
  { id: "C-01204", name: "Harlow Retail", spend: 9150, orders: 31, segment: "Loyal", trend: "+9%" },
  { id: "C-00337", name: "Eclipse Media", spend: 8720, orders: 29, segment: "Champion", trend: "+31%" },
  { id: "C-01567", name: "Nora & Blake", spend: 7480, orders: 26, segment: "Loyal", trend: "+5%" },
];

const kpis = [
  { label: "Total Revenue", value: "$1.03M", change: "+22.4%", up: true },
  { label: "Active Customers", value: "14,820", change: "+18.1%", up: true },
  { label: "Avg Order Value", value: "$264", change: "+6.8%", up: true },
  { label: "Churn Rate", value: "4.2%", change: "-1.3pp", up: true },
];

function AnimatedNumber({ target, prefix = "", suffix = "" }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let start = 0;
    const end = parseFloat(target.replace(/[^0-9.]/g, ""));
    if (isNaN(end)) { setDisplay(target); return; }
    const duration = 1200;
    const step = (end / duration) * 16;
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setDisplay(target); clearInterval(timer); }
      else setDisplay(prefix + start.toFixed(end % 1 !== 0 ? 1 : 0) + suffix);
    }, 16);
    return () => clearInterval(timer);
  }, []);
  return <span>{display}</span>;
}

const segmentColors = { Champion: "#00ff88", Loyal: "#00d4ff", "At Risk": "#ff6b35", Potential: "#a855f7", New: "#f59e0b" };

export default function EcommerceAnalytics() {
  const [activeTab, setActiveTab] = useState("overview");
  const [hoveredRow, setHoveredRow] = useState(null);

  const tabs = ["overview", "segments", "cohorts", "products"];

  return (
    <div style={{
      minHeight: "100vh",
      background: "#070b14",
      fontFamily: "'DM Mono', 'Courier New', monospace",
      color: "#e8eaf0",
      padding: "0",
      overflowX: "hidden",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=Syne:wght@700;800&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; background: #0d1320; }
        ::-webkit-scrollbar-thumb { background: #1e2d45; border-radius: 2px; }
        .tab-btn { 
          background: none; border: none; cursor: pointer; 
          font-family: 'DM Mono', monospace; font-size: 11px; 
          letter-spacing: 2px; text-transform: uppercase;
          padding: 8px 20px; transition: all 0.2s;
          border-bottom: 2px solid transparent;
          color: #4a5568;
        }
        .tab-btn:hover { color: #a0aec0; }
        .tab-btn.active { color: #00ff88; border-bottom-color: #00ff88; }
        .kpi-card {
          background: linear-gradient(135deg, #0d1320 0%, #111827 100%);
          border: 1px solid #1e2d45;
          border-radius: 4px;
          padding: 24px;
          position: relative;
          overflow: hidden;
          transition: border-color 0.2s;
        }
        .kpi-card:hover { border-color: #2d4a6e; }
        .kpi-card::before {
          content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px;
          background: linear-gradient(90deg, transparent, #00ff8840, transparent);
        }
        .chart-card {
          background: #0d1320;
          border: 1px solid #1e2d45;
          border-radius: 4px;
          padding: 24px;
        }
        .data-row {
          display: grid; grid-template-columns: 80px 1fr 100px 80px 90px 70px;
          gap: 12px; padding: 14px 16px; border-bottom: 1px solid #0f1a2e;
          transition: background 0.15s; align-items: center;
        }
        .data-row:hover { background: #0f1a2e; }
        .cohort-cell {
          width: 52px; height: 36px; border-radius: 3px;
          display: flex; align-items: center; justify-content: center;
          font-size: 11px; font-weight: 500; transition: transform 0.15s;
        }
        .cohort-cell:hover { transform: scale(1.1); z-index: 1; position: relative; }
        .scan-line {
          position: fixed; top: 0; left: 0; right: 0; bottom: 0;
          background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,136,0.01) 2px, rgba(0,255,136,0.01) 4px);
          pointer-events: none; z-index: 1000;
        }
      `}</style>

      <div className="scan-line" />

      {/* Header */}
      <div style={{ borderBottom: "1px solid #1e2d45", padding: "0 40px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#00ff88", boxShadow: "0 0 8px #00ff88" }} />
            <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 15, fontWeight: 800, letterSpacing: 3, textTransform: "uppercase", color: "#e8eaf0" }}>
              Customer Analytics
            </span>
            <span style={{ fontSize: 10, color: "#2d4a6e", letterSpacing: 2 }}>// E-COMMERCE PLATFORM</span>
          </div>
          <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
            <span style={{ fontSize: 10, color: "#4a5568", letterSpacing: 1 }}>YTD 2025</span>
            <div style={{ width: 1, height: 16, background: "#1e2d45" }} />
            <span style={{ fontSize: 10, color: "#00ff88", letterSpacing: 1 }}>● LIVE</span>
          </div>
        </div>
        <div style={{ display: "flex", gap: 0 }}>
          {tabs.map(t => (
            <button key={t} className={`tab-btn ${activeTab === t ? "active" : ""}`} onClick={() => setActiveTab(t)}>
              {t}
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding: "32px 40px", maxWidth: 1400, margin: "0 auto" }}>

        {/* KPI Row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 32 }}>
          {kpis.map((k, i) => (
            <div key={i} className="kpi-card">
              <div style={{ fontSize: 10, color: "#4a5568", letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>{k.label}</div>
              <div style={{ fontSize: 28, fontFamily: "'Syne', sans-serif", fontWeight: 800, color: "#e8eaf0", marginBottom: 8 }}>
                {k.value}
              </div>
              <div style={{ fontSize: 12, color: k.up ? "#00ff88" : "#ff6b35", letterSpacing: 1 }}>
                {k.change} <span style={{ color: "#4a5568" }}>vs last year</span>
              </div>
            </div>
          ))}
        </div>

        {activeTab === "overview" && (
          <>
            {/* Revenue Chart */}
            <div className="chart-card" style={{ marginBottom: 24 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                <div>
                  <div style={{ fontSize: 10, color: "#4a5568", letterSpacing: 2, textTransform: "uppercase" }}>Revenue & Orders</div>
                  <div style={{ fontSize: 14, color: "#a0aec0", marginTop: 4 }}>Monthly performance across all channels</div>
                </div>
                <div style={{ display: "flex", gap: 20, fontSize: 11, color: "#4a5568" }}>
                  <span style={{ color: "#00ff88" }}>── Revenue</span>
                  <span style={{ color: "#00d4ff" }}>── Orders</span>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00ff88" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#00ff88" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="ordGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00d4ff" stopOpacity={0.1} />
                      <stop offset="95%" stopColor="#00d4ff" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e2d45" vertical={false} />
                  <XAxis dataKey="month" stroke="#2d4a6e" tick={{ fill: "#4a5568", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis yAxisId="rev" stroke="#2d4a6e" tick={{ fill: "#4a5568", fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v/1000).toFixed(0)}k`} />
                  <YAxis yAxisId="ord" orientation="right" stroke="#2d4a6e" tick={{ fill: "#4a5568", fontSize: 10 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: "#0d1320", border: "1px solid #1e2d45", borderRadius: 4, fontSize: 12 }} labelStyle={{ color: "#a0aec0" }} />
                  <Area yAxisId="rev" type="monotone" dataKey="revenue" stroke="#00ff88" strokeWidth={2} fill="url(#revGrad)" dot={false} />
                  <Area yAxisId="ord" type="monotone" dataKey="orders" stroke="#00d4ff" strokeWidth={2} fill="url(#ordGrad)" dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Bottom Row */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
              {/* Customer Segments Pie */}
              <div className="chart-card">
                <div style={{ fontSize: 10, color: "#4a5568", letterSpacing: 2, textTransform: "uppercase", marginBottom: 4 }}>Customer Segments</div>
                <div style={{ fontSize: 14, color: "#a0aec0", marginBottom: 20 }}>RFM-based classification</div>
                <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
                  <ResponsiveContainer width={160} height={160}>
                    <PieChart>
                      <Pie data={segmentData} cx="50%" cy="50%" innerRadius={45} outerRadius={75} paddingAngle={3} dataKey="value">
                        {segmentData.map((entry, i) => (
                          <Cell key={i} fill={entry.color} opacity={0.85} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div style={{ flex: 1 }}>
                    {segmentData.map((s, i) => (
                      <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", borderBottom: "1px solid #0f1a2e" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <div style={{ width: 6, height: 6, borderRadius: "50%", background: s.color }} />
                          <span style={{ fontSize: 11, color: "#a0aec0" }}>{s.name}</span>
                        </div>
                        <span style={{ fontSize: 11, color: s.color, fontWeight: 500 }}>{s.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Behavior Radar */}
              <div className="chart-card">
                <div style={{ fontSize: 10, color: "#4a5568", letterSpacing: 2, textTransform: "uppercase", marginBottom: 4 }}>Behavior Metrics</div>
                <div style={{ fontSize: 14, color: "#a0aec0", marginBottom: 20 }}>Customer health index</div>
                <ResponsiveContainer width="100%" height={180}>
                  <RadarChart data={behaviorData}>
                    <PolarGrid stroke="#1e2d45" />
                    <PolarAngleAxis dataKey="metric" tick={{ fill: "#4a5568", fontSize: 10 }} />
                    <Radar dataKey="value" stroke="#a855f7" fill="#a855f7" fillOpacity={0.15} strokeWidth={2} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        )}

        {activeTab === "segments" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 24 }}>
            {/* Top Customers Table */}
            <div className="chart-card">
              <div style={{ fontSize: 10, color: "#4a5568", letterSpacing: 2, textTransform: "uppercase", marginBottom: 4 }}>Top Customers</div>
              <div style={{ fontSize: 14, color: "#a0aec0", marginBottom: 24 }}>Ranked by lifetime spend · YTD 2025</div>
              <div style={{ display: "grid", gridTemplateColumns: "80px 1fr 100px 80px 90px 70px", gap: 12, padding: "8px 16px", marginBottom: 4 }}>
                {["ID", "Customer", "Revenue", "Orders", "Segment", "Trend"].map(h => (
                  <span key={h} style={{ fontSize: 9, color: "#2d4a6e", letterSpacing: 2, textTransform: "uppercase" }}>{h}</span>
                ))}
              </div>
              {topCustomers.map((c, i) => (
                <div key={i} className="data-row" onMouseEnter={() => setHoveredRow(i)} onMouseLeave={() => setHoveredRow(null)}>
                  <span style={{ fontSize: 10, color: "#2d4a6e" }}>{c.id}</span>
                  <span style={{ fontSize: 12, color: "#e8eaf0" }}>{c.name}</span>
                  <span style={{ fontSize: 12, color: "#00ff88" }}>${c.spend.toLocaleString()}</span>
                  <span style={{ fontSize: 12, color: "#a0aec0" }}>{c.orders}</span>
                  <span style={{ fontSize: 10, padding: "3px 8px", borderRadius: 2, background: segmentColors[c.segment] + "22", color: segmentColors[c.segment], letterSpacing: 1 }}>{c.segment}</span>
                  <span style={{ fontSize: 11, color: "#00ff88" }}>{c.trend}</span>
                </div>
              ))}
            </div>

            {/* Segment Bar Chart */}
            <div className="chart-card">
              <div style={{ fontSize: 10, color: "#4a5568", letterSpacing: 2, textTransform: "uppercase", marginBottom: 4 }}>Revenue by Segment</div>
              <div style={{ fontSize: 14, color: "#a0aec0", marginBottom: 20 }}>Contribution to total GMV</div>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={[
                  { name: "Champions", revenue: 312000 },
                  { name: "Loyal", revenue: 248000 },
                  { name: "Potential", revenue: 184000 },
                  { name: "New", revenue: 156000 },
                  { name: "At Risk", revenue: 134000 },
                ]} barSize={32}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e2d45" horizontal={true} vertical={false} />
                  <XAxis dataKey="name" stroke="#2d4a6e" tick={{ fill: "#4a5568", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis stroke="#2d4a6e" tick={{ fill: "#4a5568", fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v/1000).toFixed(0)}k`} />
                  <Tooltip contentStyle={{ background: "#0d1320", border: "1px solid #1e2d45", borderRadius: 4, fontSize: 12 }} />
                  <Bar dataKey="revenue" radius={[3, 3, 0, 0]}>
                    {segmentData.map((s, i) => <Cell key={i} fill={s.color} opacity={0.8} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {activeTab === "cohorts" && (
          <div className="chart-card">
            <div style={{ fontSize: 10, color: "#4a5568", letterSpacing: 2, textTransform: "uppercase", marginBottom: 4 }}>Cohort Retention Analysis</div>
            <div style={{ fontSize: 14, color: "#a0aec0", marginBottom: 32 }}>% of customers returning by month since acquisition</div>

            <div style={{ overflowX: "auto" }}>
              <div style={{ minWidth: 600 }}>
                {/* Header */}
                <div style={{ display: "flex", gap: 8, marginBottom: 8, paddingLeft: 100 }}>
                  {["M+0", "M+1", "M+2", "M+3", "M+4", "M+5"].map(m => (
                    <div key={m} style={{ width: 52, textAlign: "center", fontSize: 10, color: "#4a5568", letterSpacing: 1 }}>{m}</div>
                  ))}
                </div>
                {cohortData.map((row, ri) => (
                  <div key={ri} style={{ display: "flex", gap: 8, marginBottom: 6, alignItems: "center" }}>
                    <div style={{ width: 92, fontSize: 11, color: "#4a5568", textAlign: "right", paddingRight: 8 }}>{row.cohort}</div>
                    {[row.m0, row.m1, row.m2, row.m3, row.m4, row.m5].map((val, ci) => {
                      if (val === null) return <div key={ci} style={{ width: 52, height: 36 }} />;
                      const intensity = val / 100;
                      const bg = ci === 0
                        ? "#1a3a2a"
                        : `rgba(0, 255, 136, ${intensity * 0.6})`;
                      return (
                        <div key={ci} className="cohort-cell" style={{ background: bg, color: val > 50 ? "#e8eaf0" : "#6b9e7e" }}>
                          {val}%
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>

            <div style={{ marginTop: 32, display: "flex", gap: 8, alignItems: "center" }}>
              <span style={{ fontSize: 10, color: "#4a5568" }}>Low retention</span>
              {[0.1, 0.2, 0.35, 0.5, 0.65, 0.8, 1].map((v, i) => (
                <div key={i} style={{ width: 24, height: 14, borderRadius: 2, background: `rgba(0,255,136,${v * 0.6})` }} />
              ))}
              <span style={{ fontSize: 10, color: "#4a5568" }}>High retention</span>
            </div>
          </div>
        )}

        {activeTab === "products" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
            <div className="chart-card">
              <div style={{ fontSize: 10, color: "#4a5568", letterSpacing: 2, textTransform: "uppercase", marginBottom: 4 }}>Revenue by Category</div>
              <div style={{ fontSize: 14, color: "#a0aec0", marginBottom: 20 }}>YTD contribution</div>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={categoryData} layout="vertical" barSize={18}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e2d45" vertical={true} horizontal={false} />
                  <XAxis type="number" stroke="#2d4a6e" tick={{ fill: "#4a5568", fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v/1000).toFixed(0)}k`} />
                  <YAxis type="category" dataKey="category" stroke="#2d4a6e" tick={{ fill: "#a0aec0", fontSize: 11 }} axisLine={false} tickLine={false} width={90} />
                  <Tooltip contentStyle={{ background: "#0d1320", border: "1px solid #1e2d45", borderRadius: 4, fontSize: 12 }} />
                  <Bar dataKey="revenue" fill="#00d4ff" opacity={0.75} radius={[0, 3, 3, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="chart-card">
              <div style={{ fontSize: 10, color: "#4a5568", letterSpacing: 2, textTransform: "uppercase", marginBottom: 4 }}>Category Growth Rate</div>
              <div style={{ fontSize: 14, color: "#a0aec0", marginBottom: 24 }}>YoY % change by category</div>
              {categoryData.map((c, i) => (
                <div key={i} style={{ marginBottom: 16 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <span style={{ fontSize: 11, color: "#a0aec0" }}>{c.category}</span>
                    <span style={{ fontSize: 11, color: c.growth >= 0 ? "#00ff88" : "#ff6b35", fontWeight: 500 }}>
                      {c.growth >= 0 ? "+" : ""}{c.growth}%
                    </span>
                  </div>
                  <div style={{ height: 4, background: "#0f1a2e", borderRadius: 2, overflow: "hidden" }}>
                    <div style={{
                      height: "100%",
                      width: `${Math.abs(c.growth) * 2.2}%`,
                      background: c.growth >= 0 ? "linear-gradient(90deg, #00ff88, #00d4ff)" : "#ff6b35",
                      borderRadius: 2,
                      transition: "width 0.8s ease",
                    }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div style={{ marginTop: 48, paddingTop: 24, borderTop: "1px solid #0f1a2e", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 9, color: "#2d4a6e", letterSpacing: 2 }}>ANALYTICS ENGINE v3.1.4 // DATA REFRESHED 2 MIN AGO</span>
          <span style={{ fontSize: 9, color: "#2d4a6e", letterSpacing: 2 }}>14,820 ACTIVE RECORDS IN SCOPE</span>
        </div>
      </div>
    </div>
  );
}
