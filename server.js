import express from "express";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { readFileSync, writeFileSync, existsSync } from "fs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = join(__dirname, "analytics.json");
const DASHBOARD_KEY = process.env.DASHBOARD_KEY || "holyweek2026";

// ============================================================
// ANALYTICS DATA
// ============================================================
function loadData() {
  if (!existsSync(DATA_FILE)) return { visits: [], daily: {} };
  try { return JSON.parse(readFileSync(DATA_FILE, "utf-8")); }
  catch { return { visits: [], daily: {} }; }
}

function saveData(data) {
  try { writeFileSync(DATA_FILE, JSON.stringify(data, null, 2)); } catch (e) { console.error("Save error:", e); }
}

function todayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
}

// ============================================================
// IP GEOLOCATION (free, no API key needed)
// ============================================================
async function lookupGeo(ip) {
  // Clean IP (handle x-forwarded-for with multiple IPs)
  const cleanIp = (ip || "").split(",")[0].trim().replace("::ffff:", "");
  if (!cleanIp || cleanIp === "127.0.0.1" || cleanIp === "::1") {
    return { country: "Local", countryCode: "LO", city: "localhost", region: "" };
  }
  try {
    const resp = await fetch(`http://ip-api.com/json/${cleanIp}?fields=status,country,countryCode,regionName,city&lang=zh-CN`, { signal: AbortSignal.timeout(3000) });
    const geo = await resp.json();
    if (geo.status === "success") {
      return { country: geo.country || "Unknown", countryCode: geo.countryCode || "??", city: geo.city || "", region: geo.regionName || "" };
    }
  } catch {}
  return { country: "Unknown", countryCode: "??", city: "", region: "" };
}

// Country code to flag emoji
function flag(code) {
  if (!code || code.length !== 2 || code === "??" || code === "LO") return "🌐";
  return String.fromCodePoint(...[...code.toUpperCase()].map(c => 0x1F1E6 - 65 + c.charCodeAt(0)));
}

// ============================================================
// MIDDLEWARE
// ============================================================
app.use(express.json());
app.use(express.static(join(__dirname, "dist")));

// ============================================================
// TRACKING API
// ============================================================
app.post("/api/track", async (req, res) => {
  res.json({ ok: true }); // respond immediately

  const data = loadData();
  const today = todayKey();
  const now = new Date().toISOString();
  const ua = req.headers["user-agent"] || "unknown";
  const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress || "unknown";

  // Lookup geo (non-blocking, already responded)
  const geo = await lookupGeo(ip);

  data.visits.push({
    time: now, date: today,
    ua: ua.substring(0, 200),
    ip: ip.split(",")[0].trim(),
    country: geo.country,
    countryCode: geo.countryCode,
    city: geo.city,
    region: geo.region,
  });

  if (!data.daily[today]) data.daily[today] = 0;
  data.daily[today]++;

  saveData(data);
});

// ============================================================
// DASHBOARD
// ============================================================
app.get("/admin/:key", (req, res) => {
  if (req.params.key !== DASHBOARD_KEY) return res.status(403).send("Access denied");

  // Query params for filtering
  const filterCountry = req.query.country || "";
  const filterDate = req.query.date || "";

  const data = loadData();
  const today = todayKey();

  // Apply filters
  let filtered = data.visits;
  if (filterCountry) filtered = filtered.filter(v => v.countryCode === filterCountry || v.country === filterCountry);
  if (filterDate) filtered = filtered.filter(v => v.date === filterDate);

  const todayVisits = data.visits.filter(v => v.date === today);
  const todayCount = filterCountry ? filtered.filter(v => v.date === today).length : (data.daily[today] || 0);
  const totalCount = filtered.length;

  // Last 30 days chart
  const days = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date(); d.setDate(d.getDate() - i);
    const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
    const count = filterCountry
      ? filtered.filter(v => v.date === key).length
      : (data.daily[key] || 0);
    days.push({ date: key, count });
  }
  const maxCount = Math.max(...days.map(d => d.count), 1);

  // Country breakdown (all time)
  const countryCounts = {};
  data.visits.forEach(v => {
    const key = v.countryCode || "??";
    const name = v.country || "Unknown";
    if (!countryCounts[key]) countryCounts[key] = { code: key, name, total: 0, today: 0 };
    countryCounts[key].total++;
    if (v.date === today) countryCounts[key].today++;
  });
  const countryList = Object.values(countryCounts).sort((a, b) => b.total - a.total);

  // Today's country breakdown
  const todayByCountry = {};
  todayVisits.forEach(v => {
    const key = v.countryCode || "??";
    const name = v.country || "Unknown";
    if (!todayByCountry[key]) todayByCountry[key] = { code: key, name, count: 0 };
    todayByCountry[key].count++;
  });
  const todayCountryList = Object.values(todayByCountry).sort((a, b) => b.count - a.count);

  // Recent visits
  const recentSource = filterDate
    ? filtered.slice(-30).reverse()
    : (filterCountry ? filtered.filter(v => v.date === today).slice(-30).reverse() : todayVisits.slice(-30).reverse());

  // Active filter label
  const filterLabel = filterCountry
    ? `篩選：${flag(filterCountry)} ${countryList.find(c => c.code === filterCountry)?.name || filterCountry}`
    : (filterDate ? `篩選：${filterDate}` : "");

  res.send(`<!DOCTYPE html>
<html lang="zh-TW">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>聖週體驗 - 使用統計</title>
  <style>
    *{margin:0;padding:0;box-sizing:border-box}
    body{background:#0e0e18;color:#fff;font-family:-apple-system,sans-serif;min-height:100vh}
    .container{max-width:860px;margin:0 auto;padding:32px 20px}
    h1{font-size:24px;font-weight:300;margin-bottom:8px;color:#E8C86A}
    .subtitle{font-size:13px;color:rgba(255,255,255,0.4);margin-bottom:32px}
    .filter-bar{display:flex;gap:8px;margin-bottom:20px;flex-wrap:wrap;align-items:center}
    .filter-tag{display:inline-flex;align-items:center;gap:4px;padding:6px 14px;background:rgba(232,200,106,0.12);border:1px solid rgba(232,200,106,0.3);border-radius:20px;font-size:13px;color:#E8C86A}
    .filter-clear{color:rgba(255,255,255,0.4);text-decoration:none;font-size:12px;padding:4px 10px;border:1px solid rgba(255,255,255,0.1);border-radius:12px}
    .filter-clear:hover{background:rgba(255,255,255,0.06)}
    .cards{display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;margin-bottom:32px}
    .card{background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:12px;padding:20px;text-align:center}
    .card-num{font-size:36px;font-weight:600;color:#E8C86A}
    .card-label{font-size:12px;color:rgba(255,255,255,0.5);margin-top:4px;letter-spacing:1px}
    .section-title{font-size:14px;color:rgba(255,255,255,0.5);letter-spacing:2px;margin-bottom:16px;text-transform:uppercase;margin-top:8px}
    .chart{display:flex;align-items:flex-end;gap:3px;height:150px;margin-bottom:32px;padding:0 4px}
    .bar-wrap{flex:1;display:flex;flex-direction:column;align-items:center;gap:4px;height:100%;justify-content:flex-end;cursor:pointer}
    .bar-wrap:hover .bar{opacity:1!important;filter:brightness(1.3)}
    .bar{width:100%;min-height:2px;border-radius:3px 3px 0 0;background:#E8C86A;transition:all 0.3s}
    .bar-label{font-size:9px;color:rgba(255,255,255,0.3);writing-mode:vertical-lr;text-orientation:mixed;height:40px;overflow:hidden}
    .bar-count{font-size:9px;color:rgba(255,255,255,0.5)}
    .today-bar .bar{background:#7BC98E}
    .region-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:32px}
    .region-card{background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:12px;padding:16px;overflow:hidden}
    .region-card h3{font-size:13px;color:rgba(255,255,255,0.5);margin-bottom:12px;letter-spacing:1px}
    .region-row{display:flex;justify-content:space-between;align-items:center;padding:6px 0;border-bottom:1px solid rgba(255,255,255,0.04);font-size:13px;cursor:pointer;transition:background 0.2s;margin:0 -8px;padding:6px 8px;border-radius:4px}
    .region-row:hover{background:rgba(255,255,255,0.04)}
    .region-row:last-child{border-bottom:none}
    .region-name{color:rgba(255,255,255,0.8);display:flex;align-items:center;gap:6px}
    .region-count{color:#E8C86A;font-weight:600;font-size:14px}
    .region-pct{color:rgba(255,255,255,0.3);font-size:11px;margin-left:4px}
    .region-bar-bg{height:3px;background:rgba(255,255,255,0.06);border-radius:2px;margin-top:4px}
    .region-bar-fill{height:3px;border-radius:2px;background:#E8C86A;transition:width 0.5s}
    .visits{margin-bottom:32px}
    .visit-row{display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.05);font-size:13px;gap:8px}
    .visit-time{color:rgba(255,255,255,0.7);white-space:nowrap}
    .visit-geo{color:rgba(255,255,255,0.6);font-size:12px;flex-shrink:0}
    .visit-detail{color:rgba(255,255,255,0.3);font-size:11px;text-align:right;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;min-width:0;flex:1}
    .refresh{display:inline-block;padding:8px 16px;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);border-radius:8px;color:rgba(255,255,255,0.6);text-decoration:none;font-size:13px;margin-top:16px}
    .refresh:hover{background:rgba(255,255,255,0.1)}
    .empty{text-align:center;padding:32px;color:rgba(255,255,255,0.25);font-size:14px}
    @media(max-width:600px){.cards{grid-template-columns:1fr}.region-grid{grid-template-columns:1fr}}
  </style>
</head>
<body>
  <div class="container">
    <h1>📊 聖週體驗 · 使用統計</h1>
    <div class="subtitle">Dashboard · ${today} · 重新整理頁面以更新數據</div>

    ${filterLabel ? `<div class="filter-bar">
      <span class="filter-tag">${filterLabel}</span>
      <a class="filter-clear" href="/admin/${DASHBOARD_KEY}">✕ 清除篩選</a>
    </div>` : ""}

    <div class="cards">
      <div class="card">
        <div class="card-num">${todayCount}</div>
        <div class="card-label">今日人次</div>
      </div>
      <div class="card">
        <div class="card-num">${days.slice(-7).reduce((s,d) => s + d.count, 0)}</div>
        <div class="card-label">近 7 天</div>
      </div>
      <div class="card">
        <div class="card-num">${totalCount}</div>
        <div class="card-label">${filterCountry ? "該地區累計" : "總累計"}</div>
      </div>
    </div>

    <div class="section-title">近 30 天趨勢${filterLabel ? `（${filterLabel}）` : ""}</div>
    <div class="chart">
      ${days.map(d => {
        const h = Math.max((d.count / maxCount) * 120, d.count > 0 ? 4 : 2);
        const isToday = d.date === today;
        return `<div class="bar-wrap ${isToday ? 'today-bar' : ''}" onclick="location.href='/admin/${DASHBOARD_KEY}?date=${d.date}${filterCountry ? '&country='+filterCountry : ''}'">
          <div class="bar-count">${d.count || ''}</div>
          <div class="bar" style="height:${h}px;${d.count === 0 ? 'opacity:0.15' : ''}"></div>
          <div class="bar-label">${d.date.slice(5)}</div>
        </div>`;
      }).join("")}
    </div>

    <div class="region-grid">
      <div class="region-card">
        <h3>🌍 全部地區（累計）</h3>
        ${countryList.length === 0 ? '<div class="empty">尚無數據</div>' :
          countryList.slice(0, 15).map(c => {
            const pct = Math.round(c.total / data.visits.length * 100);
            const isActive = filterCountry === c.code;
            return `<a href="/admin/${DASHBOARD_KEY}?country=${c.code}" style="text-decoration:none">
              <div class="region-row" style="${isActive ? 'background:rgba(232,200,106,0.08)' : ''}">
                <span class="region-name">${flag(c.code)} ${c.name}</span>
                <span><span class="region-count">${c.total}</span><span class="region-pct">${pct}%</span></span>
              </div>
              <div class="region-bar-bg"><div class="region-bar-fill" style="width:${pct}%"></div></div>
            </a>`;
          }).join("")
        }
      </div>
      <div class="region-card">
        <h3>📅 今日地區分佈</h3>
        ${todayCountryList.length === 0 ? '<div class="empty">今天尚無訪問</div>' :
          todayCountryList.map(c => {
            const pct = Math.round(c.count / todayVisits.length * 100);
            return `<a href="/admin/${DASHBOARD_KEY}?country=${c.code}" style="text-decoration:none">
              <div class="region-row">
                <span class="region-name">${flag(c.code)} ${c.name}</span>
                <span><span class="region-count">${c.count}</span><span class="region-pct">${pct}%</span></span>
              </div>
              <div class="region-bar-bg"><div class="region-bar-fill" style="width:${pct}%;background:#7BC98E"></div></div>
            </a>`;
          }).join("")
        }
      </div>
    </div>

    <div class="section-title">${filterDate ? `${filterDate} 訪問記錄` : "今日訪問記錄"}（最近 30 筆）</div>
    <div class="visits">
      ${recentSource.length === 0 ? '<div class="empty">尚無訪問記錄</div>' :
        recentSource.map(v => {
          const t = new Date(v.time);
          const timeStr = String(t.getHours()).padStart(2,"0") + ":" + String(t.getMinutes()).padStart(2,"0") + ":" + String(t.getSeconds()).padStart(2,"0");
          const device = (v.ua||"").includes("iPhone") ? "📱" :
                         (v.ua||"").includes("Android") ? "📱" :
                         (v.ua||"").includes("iPad") ? "📱" :
                         (v.ua||"").includes("Mac") ? "💻" :
                         (v.ua||"").includes("Windows") ? "💻" : "🌐";
          const geoStr = v.country ? `${flag(v.countryCode)} ${v.country}${v.city ? " · "+v.city : ""}` : "🌐 查詢中";
          return `<div class="visit-row">
            <span class="visit-time">${device} ${timeStr}</span>
            <span class="visit-geo">${geoStr}</span>
            <span class="visit-detail">${v.ip}</span>
          </div>`;
        }).join("")
      }
    </div>

    <a class="refresh" href="/admin/${DASHBOARD_KEY}${filterCountry ? '?country='+filterCountry : ''}${filterDate ? (filterCountry?'&':'?')+'date='+filterDate : ''}">🔄 重新整理</a>
  </div>
</body>
</html>`);
});

// ============================================================
// SPA FALLBACK
// ============================================================
app.get("*", (req, res) => {
  res.sendFile(join(__dirname, "dist", "index.html"));
});

// ============================================================
// START
// ============================================================
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🌿 Holy Week server running on port ${PORT}`);
  console.log(`📊 Dashboard: /admin/${DASHBOARD_KEY}`);
});
