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
// MIDDLEWARE
// ============================================================
app.use(express.json());
app.use(express.static(join(__dirname, "dist")));

// ============================================================
// TRACKING API (called silently by frontend)
// ============================================================
app.post("/api/track", (req, res) => {
  const data = loadData();
  const today = todayKey();
  const now = new Date().toISOString();
  const ua = req.headers["user-agent"] || "unknown";
  const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress || "unknown";

  // Record visit
  data.visits.push({ time: now, date: today, ua: ua.substring(0, 200), ip });

  // Update daily count
  if (!data.daily[today]) data.daily[today] = 0;
  data.daily[today]++;

  saveData(data);
  res.json({ ok: true });
});

// ============================================================
// DASHBOARD (password protected via URL key)
// ============================================================
app.get("/admin/:key", (req, res) => {
  if (req.params.key !== DASHBOARD_KEY) {
    return res.status(403).send("Access denied");
  }

  const data = loadData();
  const today = todayKey();
  const todayCount = data.daily[today] || 0;
  const totalCount = data.visits.length;

  // Get last 30 days
  const days = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
    days.push({ date: key, count: data.daily[key] || 0 });
  }

  const maxCount = Math.max(...days.map(d => d.count), 1);

  // Last 20 visits for today
  const recentVisits = data.visits
    .filter(v => v.date === today)
    .slice(-20)
    .reverse();

  res.send(`<!DOCTYPE html>
<html lang="zh-TW">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>聖週體驗 - 使用統計</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { background: #0e0e18; color: #fff; font-family: -apple-system, sans-serif; min-height: 100vh; }
    .container { max-width: 800px; margin: 0 auto; padding: 32px 20px; }
    h1 { font-size: 24px; font-weight: 300; margin-bottom: 8px; color: #E8C86A; }
    .subtitle { font-size: 13px; color: rgba(255,255,255,0.4); margin-bottom: 32px; }
    .cards { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; margin-bottom: 32px; }
    .card { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 20px; text-align: center; }
    .card-num { font-size: 36px; font-weight: 600; color: #E8C86A; }
    .card-label { font-size: 12px; color: rgba(255,255,255,0.5); margin-top: 4px; letter-spacing: 1px; }
    .section-title { font-size: 14px; color: rgba(255,255,255,0.5); letter-spacing: 2px; margin-bottom: 16px; text-transform: uppercase; }
    .chart { display: flex; align-items: flex-end; gap: 3px; height: 150px; margin-bottom: 32px; padding: 0 4px; }
    .bar-wrap { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 4px; height: 100%; justify-content: flex-end; }
    .bar { width: 100%; min-height: 2px; border-radius: 3px 3px 0 0; background: #E8C86A; transition: height 0.3s; }
    .bar-label { font-size: 9px; color: rgba(255,255,255,0.3); writing-mode: vertical-lr; text-orientation: mixed; height: 40px; overflow: hidden; }
    .bar-count { font-size: 9px; color: rgba(255,255,255,0.5); }
    .today-bar .bar { background: #7BC98E; }
    .visits { margin-bottom: 32px; }
    .visit-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.05); font-size: 13px; }
    .visit-time { color: rgba(255,255,255,0.7); }
    .visit-ua { color: rgba(255,255,255,0.35); font-size: 11px; max-width: 60%; text-align: right; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .refresh { display: inline-block; padding: 8px 16px; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; color: rgba(255,255,255,0.6); text-decoration: none; font-size: 13px; margin-top: 16px; }
    .refresh:hover { background: rgba(255,255,255,0.1); }
    .empty { text-align: center; padding: 32px; color: rgba(255,255,255,0.25); font-size: 14px; }
    @media (max-width: 500px) { .cards { grid-template-columns: 1fr; } }
  </style>
</head>
<body>
  <div class="container">
    <h1>📊 聖週體驗 · 使用統計</h1>
    <div class="subtitle">Dashboard · ${today} · 自動更新請重新整理頁面</div>

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
        <div class="card-label">總累計</div>
      </div>
    </div>

    <div class="section-title">近 30 天趨勢</div>
    <div class="chart">
      ${days.map(d => {
        const h = Math.max((d.count / maxCount) * 120, d.count > 0 ? 4 : 2);
        const isToday = d.date === today;
        return `<div class="bar-wrap ${isToday ? 'today-bar' : ''}">
          <div class="bar-count">${d.count || ''}</div>
          <div class="bar" style="height:${h}px;${d.count === 0 ? 'opacity:0.15' : ''}"></div>
          <div class="bar-label">${d.date.slice(5)}</div>
        </div>`;
      }).join("")}
    </div>

    <div class="section-title">今日訪問記錄（最近 20 筆）</div>
    <div class="visits">
      ${recentVisits.length === 0 ? '<div class="empty">今天還沒有訪問記錄</div>' :
        recentVisits.map(v => {
          const t = new Date(v.time);
          const timeStr = `${String(t.getHours()).padStart(2,"0")}:${String(t.getMinutes()).padStart(2,"0")}:${String(t.getSeconds()).padStart(2,"0")}`;
          const device = v.ua.includes("iPhone") ? "📱 iPhone" :
                         v.ua.includes("Android") ? "📱 Android" :
                         v.ua.includes("iPad") ? "📱 iPad" :
                         v.ua.includes("Mac") ? "💻 Mac" :
                         v.ua.includes("Windows") ? "💻 Windows" : "🌐 Other";
          return `<div class="visit-row"><span class="visit-time">${timeStr} · ${device}</span><span class="visit-ua">${v.ip}</span></div>`;
        }).join("")
      }
    </div>

    <a class="refresh" href="/admin/${DASHBOARD_KEY}">🔄 重新整理</a>
  </div>
</body>
</html>`);
});

// ============================================================
// SPA FALLBACK (all other routes serve frontend)
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
