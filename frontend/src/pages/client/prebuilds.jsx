import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./css/prebuilds.css";

/* ─────────────────────────────────────────────
   CONSTANTS
───────────────────────────────────────────── */
const CATEGORIES = ["All", "Gaming", "Workstation", "Streaming", "Budget"];

const TIER_STYLE = {
  entry: { label: "Entry",    bg: "rgba(59,130,246,0.12)",  color: "#3b82f6",  border: "rgba(59,130,246,0.25)" },
  mid:   { label: "Mid",      bg: "rgba(245,158,11,0.12)",  color: "#f59e0b",  border: "rgba(245,158,11,0.25)" },
  high:  { label: "High End", bg: "rgba(239,68,68,0.12)",   color: "#ef4444",  border: "rgba(239,68,68,0.25)" },
};

const CAT_ICONS = { Gaming: "🎮", Workstation: "🖥️", Streaming: "📡", Budget: "💰" };

/* ─────────────────────────────────────────────
   HELPERS — map DB fields → UI shape
───────────────────────────────────────────── */

/** Return a display string for a populated part object */
function partDetail(part) {
  if (!part) return "—";
  // Parts model likely has: name, price, watts, specs/description etc.
  // Use whatever extra fields exist, fall back gracefully
  const extras = [part.socket, part.wattage && `${part.wattage}W`, part.type]
    .filter(Boolean)
    .join(" · ");
  return extras || `$${part.price ?? ""}`;
}

/**
 * Transform a raw DB prebuild document into the shape the UI expects.
 * Handles both populated part objects and bare ObjectId strings.
 */
function transformPrebuild(raw) {
  const p = raw.parts || {};

  return {
    // Identity
    id:          raw._id,
    name:        raw.name        ?? "Unnamed Build",
    category:    raw.category    ?? "Gaming",
    tier:        raw.tier        ?? "Entry",
    tierClass:   raw.tierClass   ?? "entry",
    emoji:       raw.emoji       ?? "🖥️",
    tagline:     raw.tagline     ?? "",
    accentColor: raw.accentColor ?? "#3b82f6",
    tags:        raw.tags        ?? [],
    pros:        raw.pros        ?? [],
    perfTargets: raw.perfTargets ?? [],
    builds:      raw.builds      ?? 0,

    // Price — prefer the human-readable string field, fall back to totalPrice
    price: raw.price
      ? raw.price
      : raw.totalPrice
        ? `$${Number(raw.totalPrice).toLocaleString()}`
        : "N/A",

    // Flatten parts into the {name, detail} shape the UI uses.
    // DB uses cpu_cooler; UI uses cooler. DB uses storage_primary; UI uses storage.
    specs: {
      cpu:         { name: p.cpu?.name         ?? "—", detail: partDetail(p.cpu) },
      gpu:         { name: p.gpu?.name         ?? "—", detail: partDetail(p.gpu) },
      motherboard: { name: p.motherboard?.name ?? "—", detail: partDetail(p.motherboard) },
      memory:      { name: p.memory?.name      ?? "—", detail: partDetail(p.memory) },
      storage:     { name: p.storage_primary?.name ?? (p.storage_secondary?.name ?? "—"),
                     detail: partDetail(p.storage_primary ?? p.storage_secondary) },
      cooler:      { name: p.cpu_cooler?.name  ?? "—", detail: partDetail(p.cpu_cooler) },
      psu:         { name: p.psu?.name         ?? "—", detail: partDetail(p.psu) },
      case:        { name: p.case?.name        ?? "—", detail: partDetail(p.case) },
    },

    // Raw part IDs for the builder — matches the keys builder's categoryMap expects
    builderSelections: {
      ...(p.cpu?._id               && { cpu:         p.cpu._id }),
      ...(p.gpu?._id               && { gpu:         p.gpu._id }),
      ...(p.motherboard?._id       && { motherboard: p.motherboard._id }),
      ...(p.memory?._id            && { memory:      p.memory._id }),
      ...(p.storage_primary?._id   && { storage:     p.storage_primary._id }),
      ...(p.cpu_cooler?._id        && { cooler:      p.cpu_cooler._id }),
      ...(p.psu?._id               && { psu:         p.psu._id }),
      ...(p.case?._id              && { case:        p.case._id }),
    },
  };
}

/* ─────────────────────────────────────────────
   LOADING SKELETON
───────────────────────────────────────────── */
function SkeletonCard() {
  return (
    <div className="pb-card pb-card--skeleton">
      <div className="pb-card-visual" style={{ background: "#e2e8f0" }} />
      <div className="pb-card-body">
        <div className="pb-skeleton-line" style={{ width: "60%", height: 14, marginBottom: 8 }} />
        <div className="pb-skeleton-line" style={{ width: "85%", height: 10, marginBottom: 16 }} />
        <div className="pb-skeleton-line" style={{ width: "100%", height: 9, marginBottom: 6 }} />
        <div className="pb-skeleton-line" style={{ width: "90%",  height: 9, marginBottom: 6 }} />
        <div className="pb-skeleton-line" style={{ width: "70%",  height: 9, marginBottom: 0 }} />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   SPEC MODAL
───────────────────────────────────────────── */
function SpecModal({ build, onClose, onCustomise }) {
  if (!build) return null;
  const tier = TIER_STYLE[build.tierClass] ?? TIER_STYLE.entry;

  return (
    <div className="pb-modal-overlay" onClick={onClose}>
      <div className="pb-modal" onClick={(e) => e.stopPropagation()}>

        {/* Modal header */}
        <div className="pb-modal-header">
          <div className="pb-modal-header-left">
            <div className="pb-modal-emoji">{build.emoji}</div>
            <div>
              <div
                className="pb-modal-tier"
                style={{ color: tier.color, background: tier.bg, border: `1px solid ${tier.border}` }}
              >
                {tier.label} · {build.category}
              </div>
              <div className="pb-modal-title">{build.name}</div>
              <div className="pb-modal-tagline">{build.tagline}</div>
            </div>
          </div>
          <button className="pb-modal-close" onClick={onClose}>✕</button>
        </div>

        {/* Performance strip */}
        <div className="pb-modal-perf-strip">
          {build.perfTargets.map(t => (
            <div key={t.label} className="pb-modal-perf-item">
              <span className="pb-modal-perf-val">{t.value}</span>
              <span className="pb-modal-perf-label">{t.label}</span>
            </div>
          ))}
          <div className="pb-modal-perf-div" />
          <div className="pb-modal-perf-item">
            <span className="pb-modal-perf-val" style={{ color: "var(--navy)" }}>{build.price}</span>
            <span className="pb-modal-perf-label">Est. Cost</span>
          </div>
          <div className="pb-modal-perf-item">
            <span className="pb-modal-perf-val">{build.builds}</span>
            <span className="pb-modal-perf-label">Builds made</span>
          </div>
        </div>

        {/* Specs table */}
        <div className="pb-modal-body">
          <div className="pb-modal-section-label">Full Parts List</div>
          <div className="pb-modal-specs">
            {Object.entries(build.specs).map(([cat, part]) => {
              const icons  = { cpu:"🧠", gpu:"🎮", motherboard:"🟩", memory:"💾", storage:"💿", cooler:"❄️", psu:"⚡", case:"🏠" };
              const labels = { cpu:"CPU", gpu:"GPU", motherboard:"Motherboard", memory:"Memory", storage:"Storage", cooler:"Cooler", psu:"PSU", case:"Case" };
              return (
                <div key={cat} className="pb-modal-spec-row">
                  <div className="pb-modal-spec-cat">
                    <span className="pb-modal-spec-icon">{icons[cat]}</span>
                    <span className="pb-modal-spec-cat-label">{labels[cat]}</span>
                  </div>
                  <div className="pb-modal-spec-info">
                    <div className="pb-modal-spec-name">{part.name}</div>
                    <div className="pb-modal-spec-detail">{part.detail}</div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pros */}
          {build.pros.length > 0 && (
            <>
              <div className="pb-modal-section-label" style={{ marginTop: 20 }}>Why this build?</div>
              <div className="pb-modal-pros">
                {build.pros.map(p => (
                  <div key={p} className="pb-modal-pro-row">
                    <div className="pb-modal-pro-dot">✓</div>
                    <span>{p}</span>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Tags */}
          {build.tags.length > 0 && (
            <div className="pb-modal-tags">
              {build.tags.map(t => (
                <span key={t} className="pb-modal-tag">{t}</span>
              ))}
            </div>
          )}
        </div>

        {/* Footer CTA */}
        <div className="pb-modal-footer">
          <Link
            to="/builder"
            className="pb-modal-cta"
            state={{ compatibilitySelections: build.builderSelections }}
            onClick={() => { onCustomise(build.id); onClose(); }}
          >
            ⚡ Customise in Builder
          </Link>
          <button className="pb-modal-cta-outline" onClick={onClose}>
            Close
          </button>
        </div>

      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────── */
export default function PreBuildsPage() {
  const [prebuilds,      setPrebuilds]      = useState([]);
  const [loading,        setLoading]        = useState(true);
  const [error,          setError]          = useState(null);
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeTier,     setActiveTier]     = useState("All");
  const [selectedBuild,  setSelectedBuild]  = useState(null);

  /* ── Fetch from backend ── */
  useEffect(() => {
    const controller = new AbortController();

    const fetchPrebuilds = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/admin/prebuilds", {
          signal: controller.signal,
        });

        if (!res.ok) {
          throw new Error(`Server error: ${res.status} ${res.statusText}`);
        }

        const data = await res.json();
        // data is an array of populated prebuild documents
        setPrebuilds(data.map(transformPrebuild));
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Failed to load prebuilds:", err);
          setError(err.message ?? "Failed to load prebuilds.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPrebuilds();
    return () => controller.abort();
  }, []);

  /* ── Increment builds count when user customises a prebuild ── */
  const handleCustomise = async (id) => {
    // Optimistically update the counter in UI immediately
    setPrebuilds(prev =>
      prev.map(b => b.id === id ? { ...b, builds: b.builds + 1 } : b)
    );
    try {
      await fetch(`/api/admin/prebuilds/${id}/use`, { method: "PATCH" });
    } catch (err) {
      // Silently fail — counter will re-sync on next page load
      console.warn("Could not increment build count:", err);
    }
  };

  /* ── Filtering ── */
  const filtered = prebuilds.filter(b => {
    const catMatch  = activeCategory === "All" || b.category === activeCategory;
    const tierMatch = activeTier     === "All" || b.tierClass === activeTier.toLowerCase();
    return catMatch && tierMatch;
  });

  /* ── Derived stats ── */
  const totalBuilds = prebuilds.reduce((s, b) => s + b.builds, 0);

  /* ── Unique categories from live data (for hero quick-pick) ── */
  const liveCategories = Object.keys(CAT_ICONS).filter(cat =>
    prebuilds.some(b => b.category === cat)
  );

  return (
    <>
      <div className="pb-page">

        {/* ── HERO ── */}
        <div className="pb-hero">
          <div className="pb-hero-inner">
            <div>
              <div className="pb-hero-eyebrow">Ready to use · Fully customisable</div>
              <h1 className="pb-hero-title">
                Pre-built<br /><em>System</em> Templates
              </h1>
              <p className="pb-hero-desc">
                Hand-picked builds for every use case and budget. Click any build to see
                the full spec sheet, then open it in the builder to make it your own.
              </p>
              <div className="pb-hero-stats">
                <div>
                  <div className="pb-hero-stat-val">
                    {loading ? "—" : prebuilds.length}
                  </div>
                  <div className="pb-hero-stat-label">Template builds</div>
                </div>
                <div className="pb-hero-stat-div" />
                <div>
                  <div className="pb-hero-stat-val">
                    {loading ? "—" : liveCategories.length}
                  </div>
                  <div className="pb-hero-stat-label">Categories</div>
                </div>
                <div className="pb-hero-stat-div" />
                <div>
                  <div className="pb-hero-stat-val">
                    {loading ? "—" : totalBuilds.toLocaleString()}
                  </div>
                  <div className="pb-hero-stat-label">Total builds made</div>
                </div>
              </div>
            </div>

            {/* Category quick-pick cards */}
            <div className="pb-hero-cats">
              {Object.entries(CAT_ICONS).map(([cat, icon]) => (
                <div
                  key={cat}
                  className="pb-hero-cat-card"
                  onClick={() => setActiveCategory(cat)}
                >
                  <div className="pb-hero-cat-emoji">{icon}</div>
                  <div className="pb-hero-cat-label">{cat}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── FILTER BAR ── */}
        <div className="pb-filters">
          <div className="pb-filters-inner">
            <div className="pb-filter-tabs">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  className={`pb-filter-tab ${activeCategory === cat ? "on" : ""}`}
                  onClick={() => setActiveCategory(cat)}
                >
                  {cat !== "All" && CAT_ICONS[cat] + " "}{cat}
                </button>
              ))}
            </div>
            <div className="pb-tier-filters">
              {["All", "Entry", "Mid", "High"].map(t => (
                <button
                  key={t}
                  className={`pb-tier-pill ${activeTier === t ? "on" : ""}`}
                  onClick={() => setActiveTier(t)}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── GRID ── */}
        <div className="pb-grid-wrap">

          {/* Error banner */}
          {error && (
            <div className="pb-error-banner">
              <span>⚠️ {error}</span>
              <button onClick={() => window.location.reload()}>Retry</button>
            </div>
          )}

          <div className="pb-grid-header">
            <div className="pb-grid-count">
              {loading
                ? "Loading prebuilds…"
                : <>Showing <strong>{filtered.length}</strong> of <strong>{prebuilds.length}</strong> builds</>
              }
            </div>
          </div>

          {/* Loading skeletons */}
          {loading && (
            <div className="pb-grid">
              {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          )}

          {/* Empty state (not loading, no error) */}
          {!loading && !error && filtered.length === 0 && (
            <div className="pb-empty">
              <div className="pb-empty-icon">
                {prebuilds.length === 0 ? "📦" : "🔍"}
              </div>
              {prebuilds.length === 0
                ? "No prebuilds have been added yet."
                : "No builds match that filter combination."}
            </div>
          )}

          {/* Grid */}
          {!loading && filtered.length > 0 && (
            <div className="pb-grid">
              {filtered.map(build => {
                const tier = TIER_STYLE[build.tierClass] ?? TIER_STYLE.entry;
                return (
                  <div key={build.id} className="pb-card" onClick={() => setSelectedBuild(build)}>

                    {/* Visual */}
                    <div className="pb-card-visual">
                      <div className="pb-card-visual-bg" />
                      <div className="pb-card-visual-grid" />
                      <div
                        className="pb-card-visual-glow"
                        style={{ background: `radial-gradient(circle at 70% 50%, ${build.accentColor}30 0%, transparent 65%)` }}
                      />
                      <span className="pb-card-emoji">{build.emoji}</span>
                      <span
                        className="pb-card-tier-badge"
                        style={{ color: tier.color, background: tier.bg, borderColor: tier.border }}
                      >
                        {tier.label}
                      </span>
                      <span className="pb-card-cat-badge">{build.category}</span>
                    </div>

                    {/* Body */}
                    <div className="pb-card-body">
                      <div className="pb-card-name">{build.name}</div>
                      <div className="pb-card-tagline">{build.tagline}</div>

                      {/* Spec preview — CPU, GPU, RAM */}
                      <div className="pb-card-spec-preview">
                        <div className="pb-card-spec-row">
                          <span className="pb-card-spec-icon">🧠</span>
                          <span className="pb-card-spec-text">{build.specs.cpu.name}</span>
                        </div>
                        <div className="pb-card-spec-row">
                          <span className="pb-card-spec-icon">🎮</span>
                          <span className="pb-card-spec-text">{build.specs.gpu.name}</span>
                        </div>
                        <div className="pb-card-spec-row">
                          <span className="pb-card-spec-icon">💾</span>
                          <span className="pb-card-spec-text">{build.specs.memory.name}</span>
                        </div>
                      </div>

                      <div className="pb-card-tags">
                        {build.tags.map(t => (
                          <span key={t} className="pb-card-tag">{t}</span>
                        ))}
                      </div>

                      <div className="pb-card-footer">
                        <div className="pb-card-price">{build.price}</div>
                        <button className="pb-card-cta">View Specs →</button>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ── SPEC MODAL ── */}
      <SpecModal build={selectedBuild} onClose={() => setSelectedBuild(null)} onCustomise={handleCustomise} />
    </>
  );
}
