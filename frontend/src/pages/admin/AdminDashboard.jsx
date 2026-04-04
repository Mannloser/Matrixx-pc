import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";
import "./css/adminDashboard.css";

const QUICK_ACTIONS = [
  { to: "/admin/users",     icon: "👥", label: "Manage Users",   desc: "View, edit and delete users",          color: "#6366f1" },
  { to: "/admin/parts",     icon: "🧩", label: "Add New Part",   desc: "Add a component to the database",      color: "#0ea5e9" },
  { to: "/admin/prebuilds", icon: "🖥️", label: "Add Pre-built",  desc: "Create a new template build",          color: "#10b981" },
  { to: "/admin/parts",     icon: "✏️", label: "Edit Parts",     desc: "Update existing component data",       color: "#f59e0b" },
];

const CAT_ICONS = {
  CPU: "🧠", GPU: "🎮", Motherboard: "🔌", Memory: "💾",
  Storage: "💿", "CPU Cooler": "❄️", PSU: "⚡", Case: "🏠",
};

function timeAgo(date) {
  const diff = Date.now() - new Date(date).getTime();
  const m = Math.floor(diff / 60000);
  const h = Math.floor(diff / 3600000);
  const d = Math.floor(diff / 86400000);
  if (m < 1)  return "just now";
  if (m < 60) return `${m}m ago`;
  if (h < 24) return `${h}h ago`;
  return `${d}d ago`;
}

export default function AdminDashboard() {
  const [stats,        setStats]        = useState({ users: 0, builds: 0, parts: 0 });
  const [recentBuilds, setRecentBuilds] = useState([]);
  const [popularParts, setPopularParts] = useState([]);
  const [loading,      setLoading]      = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [usersRes, buildsRes, partsRes] = await Promise.all([
          api.get("/admin/users"),
          api.get("/admin/builds"),
          api.get("/parts"),
        ]);

        const users  = usersRes.data  || [];
        const builds = buildsRes.data || [];
        const parts  = partsRes.data  || [];

        // Stats — exclude admins from user count
        setStats({
          users:  users.filter(u => u.role !== "admin").length,
          builds: builds.length,
          parts:  parts.length,
        });

        // Recent builds — top 5 sorted by createdAt desc
        const sorted = [...builds]
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 5);
        setRecentBuilds(sorted);

        // Most picked parts — count part usage across all builds
        const pickCount = {};
        builds.forEach(build => {
          if (!build.parts) return;
          Object.values(build.parts).forEach(partId => {
            if (partId && typeof partId === "string") {
              pickCount[partId] = (pickCount[partId] || 0) + 1;
            }
          });
        });

        // Map counts to part objects
        const withCounts = parts
          .map(p => ({ ...p, picks: pickCount[p._id] || 0 }))
          .filter(p => p.picks > 0)
          .sort((a, b) => b.picks - a.picks)
          .slice(0, 5);

        // If no builds yet, just show top 5 parts
        if (withCounts.length === 0) {
          setPopularParts(parts.slice(0, 5).map(p => ({ ...p, picks: 0 })));
        } else {
          setPopularParts(withCounts);
        }

      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    const token = localStorage.getItem("token");

    if (!token) {
    console.log("No token → skipping dashboard fetch");
    setLoading(false);
    return;
  }

  fetchAll();
  }, []);

  const STAT_CARDS = [
    {
      icon: "👤", label: "Total Users",    value: stats.users,
      color: "#6366f1", bg: "rgba(99,102,241,0.08)", border: "rgba(99,102,241,0.2)",
      sub: "Registered members",
    },
    {
      icon: "⚡", label: "Builds Created", value: stats.builds,
      color: "#10b981", bg: "rgba(16,185,129,0.08)", border: "rgba(16,185,129,0.2)",
      sub: "Total user builds",
    },
    {
      icon: "🧩", label: "Parts Listed",   value: stats.parts,
      color: "#f59e0b", bg: "rgba(245,158,11,0.08)", border: "rgba(245,158,11,0.2)",
      sub: "In the database",
    },
    {
      icon: "📖", label: "Guide Views",    value: "23.1K",
      color: "#ec4899", bg: "rgba(236,72,153,0.08)", border: "rgba(236,72,153,0.2)",
      sub: "This month",
    },
  ];

  return (
    <>
      {/* ── BANNER ── */}
      <div className="db-banner">
        <div className="db-banner-inner">
          <div>
            <div className="db-banner-eyebrow">Admin Panel · Matrixx</div>
            <div className="db-banner-title">Welcome back 👋</div>
            <div className="db-banner-sub">Here's what's happening with Matrixx today.</div>
          </div>
          <div className="db-banner-badge">⚡ Live Dashboard</div>
        </div>
      </div>

      {/* ── STAT CARDS ── */}
      <div className="db-stats">
        {STAT_CARDS.map((s, i) => (
          <div key={s.label} className="db-stat" style={{ animationDelay: `${i * 0.07}s` }}>
            <div className="db-stat-accent" style={{ background: s.color }} />
            <div className="db-stat-icon" style={{ background: s.bg, border: `1px solid ${s.border}` }}>
              {s.icon}
            </div>
            {loading ? (
              <div className="db-skeleton" style={{ height: 36, width: 80, marginBottom: 8 }} />
            ) : (
              <div className="db-stat-val" style={{ animationDelay: `${i * 0.07 + 0.2}s` }}>
                {s.value}
              </div>
            )}
            <div className="db-stat-label">{s.label}</div>
            <div className="db-stat-sub">{s.sub}</div>
          </div>
        ))}
      </div>

      {/* ── QUICK ACTIONS ── */}
      <div className="db-actions">
        {QUICK_ACTIONS.map((q, i) => (
          <Link key={q.label} to={q.to} className="db-action" style={{ animationDelay: `${i * 0.06 + 0.2}s` }}>
            <div className="db-action-dot" style={{ background: q.color }} />
            <span className="db-action-icon">{q.icon}</span>
            <div className="db-action-label">{q.label}</div>
            <div className="db-action-desc">{q.desc}</div>
          </Link>
        ))}
      </div>

      {/* ── BOTTOM: RECENT BUILDS + POPULAR PARTS ── */}
      <div className="db-bottom">

        {/* Recent Builds */}
        <div className="db-card">
          <div className="db-card-head">
            <div className="db-card-title">
              <div className="db-live-dot" />
              Recent Builds
            </div>
            <span style={{ fontSize:"0.7rem", color:"var(--teal)" }}>Top 5 latest</span>
          </div>

          {loading ? (
            <div className="db-empty"><div className="db-skeleton" style={{ height:200, margin:"20px" }} /></div>
          ) : recentBuilds.length === 0 ? (
            <div className="db-empty">
              <div className="db-empty-icon">🔨</div>
              No builds yet
            </div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Build Name</th>
                  <th>Parts</th>
                  <th>When</th>
                </tr>
              </thead>
              <tbody>
                {recentBuilds.map(b => {
                  const partsCount = Object.values(b.parts || {}).filter(Boolean).length;
                  const userName   = b.userId?.username || b.userId?.name || "Unknown";
                  const initial    = userName.slice(0, 2).toUpperCase();
                  return (
                    <tr key={b._id}>
                      <td>
                        <div className="db-user-cell">
                          <div className="db-avatar">{initial}</div>
                          <div>
                            <div className="db-user-name">{userName}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ fontWeight:600, fontSize:"0.82rem" }}>
                        {b.name || "Untitled Build"}
                      </td>
                      <td>
                        <span className="admin-badge admin-badge-gray">{partsCount} parts</span>
                      </td>
                      <td style={{ color:"var(--teal)", fontSize:"0.72rem" }}>
                        {timeAgo(b.createdAt)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Most Picked Parts */}
        <div className="db-card">
          <div className="db-card-head">
            <div className="db-card-title">🏆 Most Picked Parts</div>
          </div>

          {loading ? (
            <div className="db-empty"><div className="db-skeleton" style={{ height:200, margin:"20px" }} /></div>
          ) : popularParts.length === 0 ? (
            <div className="db-empty">
              <div className="db-empty-icon">🧩</div>
              No data yet
            </div>
          ) : (
            popularParts.map((p, i) => (
              <div key={p._id} className="db-part-row">
                <div className="db-part-rank">#{i + 1}</div>
                <div className="db-part-icon">{CAT_ICONS[p.category] || "📦"}</div>
                <div className="db-part-info">
                  <div className="db-part-name">{p.name}</div>
                  <div className="db-part-cat">{p.category}</div>
                </div>
                <div className="db-part-count">{p.picks} {p.picks === 1 ? "pick" : "picks"}</div>
              </div>
            ))
          )}
        </div>

      </div>
    </>
  );
}
