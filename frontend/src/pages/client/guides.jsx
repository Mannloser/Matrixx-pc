import { useState } from "react";
import { Link } from "react-router-dom";
import "./css/guides.css";

/* ─────────────────────────────────────────────
   DATA — mirrors GuidePage.jsx slugs
───────────────────────────────────────────── */
const GUIDES = [
  {
    slug:       "entry-intel-gaming",
    category:   "Gaming",
    tier:       "Entry",
    tierClass:  "entry",
    emoji:      "🖥️",
    name:       "Entry Intel Gaming Build",
    tagline:    "Your first serious 1080p gaming machine",
    price:      "$1,115",
    builds:     80,
    tags:       ["1080p Gaming", "First Build", "Intel"],
    accentColor:"#3b82f6",
    cpu:        "Intel Core i3-13100",
    gpu:        "NVIDIA RTX 4060",
    ram:        "16GB DDR4",
    perfTargets:[
      { label: "Resolution", value: "1080p" },
      { label: "FPS",        value: "60–120" },
      { label: "Settings",   value: "High" },
    ],
  },
  {
    slug:       "amd-gaming-streaming",
    category:   "Streaming",
    tier:       "Mid",
    tierClass:  "mid",
    emoji:      "⚡",
    name:       "AMD Gaming / Streaming",
    tagline:    "Game at 1440p and stream simultaneously",
    price:      "$1,692",
    builds:     67,
    tags:       ["1440p Gaming", "OBS Ready", "AMD"],
    accentColor:"#f59e0b",
    cpu:        "AMD Ryzen 5 7600X",
    gpu:        "NVIDIA RTX 5070",
    ram:        "32GB DDR5",
    perfTargets:[
      { label: "Resolution", value: "1440p" },
      { label: "Stream",     value: "1080p60" },
      { label: "Settings",   value: "Ultra" },
    ],
  },
  {
    slug:       "magnificent-amd-build",
    category:   "Gaming",
    tier:       "High End",
    tierClass:  "high",
    emoji:      "🏆",
    name:       "Magnificent AMD Build",
    tagline:    "4K gaming with zero compromises",
    price:      "$2,756",
    builds:     36,
    tags:       ["4K Gaming", "No Limits", "AMD"],
    accentColor:"#ef4444",
    cpu:        "AMD Ryzen 7 9800X3D",
    gpu:        "NVIDIA RTX 5080",
    ram:        "64GB DDR5",
    perfTargets:[
      { label: "Resolution", value: "4K" },
      { label: "FPS",        value: "120–240" },
      { label: "RT + DLSS",  value: "Ultra" },
    ],
  },
];

const TIERS      = ["All", "Entry", "Mid", "High End"];
const CATEGORIES = ["All", "Gaming", "Streaming"];

const TIER_STYLE = {
  entry: { bg: "rgba(59,130,246,0.12)",  color: "#3b82f6", border: "rgba(59,130,246,0.3)" },
  mid:   { bg: "rgba(245,158,11,0.12)",  color: "#f59e0b", border: "rgba(245,158,11,0.3)" },
  high:  { bg: "rgba(239,68,68,0.12)",   color: "#ef4444", border: "rgba(239,68,68,0.3)"  },
};

export default function GuidesPage() {
  const [activeTier, setActiveTier]         = useState("All");
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered = GUIDES.filter(g => {
    const tierMatch = activeTier     === "All" || g.tier === activeTier;
    const catMatch  = activeCategory === "All" || g.category === activeCategory;
    return tierMatch && catMatch;
  });

  return (
    <>

      <div className="guides-page">

        {/* ── HERO ── */}
        <div className="guides-hero">
          <div className="guides-hero-inner">
            <div>
              <div className="guides-hero-eyebrow">Expert curated · Every budget</div>
              <h1 className="guides-hero-title">
                Build <em>Guides</em><br />for every builder
              </h1>
              <p className="guides-hero-desc">
                Not sure where to start? Pick a guide that matches your budget and
                use case, then open it in the builder to make it yours.
              </p>
              <div className="guides-hero-stats">
                <div className="guides-hero-stat">
                  <span className="guides-hero-stat-val">{GUIDES.length}</span>
                  <span className="guides-hero-stat-label">Curated guides</span>
                </div>
                <div className="guides-hero-stat-div" />
                <div className="guides-hero-stat">
                  <span className="guides-hero-stat-val">
                    {GUIDES.reduce((s, g) => s + g.builds, 0)}
                  </span>
                  <span className="guides-hero-stat-label">Builds made</span>
                </div>
                <div className="guides-hero-stat-div" />
                <div className="guides-hero-stat">
                  <span className="guides-hero-stat-val">$589</span>
                  <span className="guides-hero-stat-label">Starting from</span>
                </div>
              </div>
            </div>

            {/* Quick jump to each guide */}
            <div className="guides-hero-tiers">
              {GUIDES.map(g => {
                const t = TIER_STYLE[g.tierClass];
                return (
                  <Link key={g.slug} to={`/guides/${g.slug}`} className="guides-hero-tier-card">
                    <span className="guides-hero-tier-emoji">{g.emoji}</span>
                    <div>
                      <div className="guides-hero-tier-name">{g.name}</div>
                      <div className="guides-hero-tier-sub">{g.price} · {g.tier}</div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── FILTER BAR ── */}
        <div className="guides-filter-bar">
          <div className="guides-filter-inner">
            <div className="guides-filter-tabs">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  className={`guides-filter-tab ${activeCategory === cat ? "on" : ""}`}
                  onClick={() => setActiveCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
            <div className="guides-tier-pills">
              {TIERS.map(t => (
                <button
                  key={t}
                  className={`guides-tier-pill ${activeTier === t ? "on" : ""}`}
                  onClick={() => setActiveTier(t)}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── GUIDE LIST ── */}
        <div className="guides-body">
          <div className="guides-body-header">
            <div className="guides-body-count">
              Showing <strong>{filtered.length}</strong> of <strong>{GUIDES.length}</strong> guides
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="guides-empty">
              <div className="guides-empty-icon">📖</div>
              No guides match that filter.
            </div>
          ) : (
            <div className="guides-list">
              {filtered.map(g => {
                const t = TIER_STYLE[g.tierClass];
                return (
                  <Link key={g.slug} to={`/guides/${g.slug}`} className="guide-card-h">

                    {/* Visual */}
                    <div className="guide-card-h-visual">
                      <div className="guide-card-h-grid" />
                      <div
                        className="guide-card-h-glow"
                        style={{ background: `radial-gradient(circle at 60% 50%, ${g.accentColor}40 0%, transparent 65%)` }}
                      />
                      <span className="guide-card-h-emoji">{g.emoji}</span>
                      <span
                        className="guide-card-h-tier"
                        style={{ color: t.color, background: t.bg, borderColor: t.border }}
                      >
                        {g.tier}
                      </span>
                    </div>

                    {/* Info */}
                    <div className="guide-card-h-info">
                      <div className="guide-card-h-top">
                        <div className="guide-card-h-category">{g.category}</div>
                        <div className="guide-card-h-name">{g.name}</div>
                        <div className="guide-card-h-tagline">{g.tagline}</div>
                      </div>
                      <div>
                        <div className="guide-card-h-specs" style={{ marginBottom: 10 }}>
                          <span className="guide-card-h-spec">🧠 {g.cpu}</span>
                          <span className="guide-card-h-spec">🎮 {g.gpu}</span>
                          <span className="guide-card-h-spec">💾 {g.ram}</span>
                        </div>
                        <div className="guide-card-h-tags">
                          {g.tags.map(tag => (
                            <span key={tag} className="guide-card-h-tag">{tag}</span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Right */}
                    <div className="guide-card-h-right">
                      <div className="guide-card-h-perf">
                        {g.perfTargets.map(p => (
                          <div key={p.label} className="guide-card-h-perf-item">
                            <div className="guide-card-h-perf-val">{p.value}</div>
                            <div className="guide-card-h-perf-label">{p.label}</div>
                          </div>
                        ))}
                      </div>
                      <div className="guide-card-h-bottom">
                        <div className="guide-card-h-price">{g.price}</div>
                        <div className="guide-card-h-builds">👤 {g.builds} builds</div>
                        <span className="guide-card-h-btn">View Guide →</span>
                      </div>
                    </div>

                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
