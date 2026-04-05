import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./css/home.css";

const TIER_STYLE = {
  entry: { label: "Entry",    color: "#3b82f6", bg: "rgba(59,130,246,0.15)"  },
  mid:   { label: "Mid",      color: "#f59e0b", bg: "rgba(245,158,11,0.15)"  },
  high:  { label: "High End", color: "#ef4444", bg: "rgba(239,68,68,0.15)"   },
};

/* Pick N random items from an array */
function pickRandom(arr, n) {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n);
}

function Home() {
  const [prebuilds, setPrebuilds] = useState([]);
  const [pbLoading, setPbLoading] = useState(true);

  useEffect(() => {
    const fetchPrebuilds = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/prebuilds`);
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        // Pick 6 random from however many are in the DB
        setPrebuilds(pickRandom(data, 6));
      } catch (err) {
        console.error("Could not load prebuilds:", err);
      } finally {
        setPbLoading(false);
      }
    };
    fetchPrebuilds();
  }, []);

  return (
    <>
      {/* ══════════════════════════════════════════════════
          HERO
      ═════════════════════════════════════════════════════ */}
      <section className="hero">

        <div className="hero-left">

          {/* hero-badge is intentionally commented out.
              Uncomment below (and its CSS) if you want it back */}
          {/* <div className="hero-badge">
            <span className="hero-badge-dot"></span>
            Live compatibility checker
          </div> */}

          <h1 className="hero-headline">
            Build Your<br />
            Dream PC.<br />
            <em>Part by Part.</em>
          </h1>

          <p className="hero-sub">
            Intelligent part selection, real-time pricing, and compatibility checks —
            all in one place. Pick parts. Build. Share.
          </p>

          <div className="hero-cta-row">
            <Link to="/builder" className="btn-hero-primary">
              ⚡ Start Your Build
            </Link>
          </div>

          <div className="hero-stats">
            <div className="stat-item">
              <div className="stat-num">2.4M+</div>
              <div className="stat-label">Completed builds</div>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <div className="stat-num">340K</div>
              <div className="stat-label">Products indexed</div>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <div className="stat-num">99.8%</div>
              <div className="stat-label">Compat accuracy</div>
            </div>
          </div>

        </div>

        <div className="hero-right">
          <div className="pc-showcase-wrap">
            <div className="pc-showcase-bg"></div>

            {/* Floating part chips */}
            <div className="float-part float-part-1">
              <span className="float-part-icon">🧠</span>
              <div>
                <div>AMD Ryzen 9 9950X</div>
                <div className="float-part-sub">$699 · In Stock</div>
              </div>
            </div>

            <div className="float-part float-part-2">
              <span className="float-part-icon">🎮</span>
              <div>
                <div>RTX 5080 16GB</div>
                <div className="float-part-sub">$999 · Compatible ✓</div>
              </div>
            </div>

            <div className="float-part float-part-3">
              <span className="float-part-icon">💾</span>
              <div>
                <div>32GB DDR5-6000</div>
                <div className="float-part-sub">$149 · 2× 16GB</div>
              </div>
            </div>

            {/* Main showcase card */}
            <div className="pc-showcase-card">
              <div className="pc-showcase-screen">
                <div className="pc-glow"></div>
                <span className="pc-emoji">🖥️</span>
              </div>
              <div className="pc-info">
                <div className="pc-info-title">Matrixx Flagship Build — 2026</div>
                <div className="pc-info-specs">
                  <div className="pc-spec">
                    <span className="pc-spec-label">CPU</span>
                    <span className="pc-spec-val">Ryzen 9 9950X</span>
                  </div>
                  <div className="pc-spec">
                    <span className="pc-spec-label">GPU</span>
                    <span className="pc-spec-val">RTX 5080 16GB</span>
                  </div>
                  <div className="pc-spec">
                    <span className="pc-spec-label">RAM</span>
                    <span className="pc-spec-val">32GB DDR5-6000</span>
                  </div>
                  <div className="pc-spec">
                    <span className="pc-spec-label">Storage</span>
                    <span className="pc-spec-val">2TB NVMe Gen5</span>
                  </div>
                </div>
                <div className="pc-info-footer">
                  <div className="pc-price">$3,249</div>
                  <div className="pc-badge">All Compatible ✓</div>
                </div>
              </div>
            </div>

          </div>
        </div>

      </section>


      {/* ══════════════════════════════════════════════════
          BUILD GUIDES
      ═════════════════════════════════════════════════════ */}
      <section className="section guides-section">
        <div className="section-header">
          <div>
            <div className="section-label">Curated for every budget</div>
            <h2 className="section-heading">Build <em>Guides</em></h2>
            <p className="section-sub">
              Not sure where to start? Our expert-curated guides take you from zero to
              build-ready across any budget or use-case.
            </p>
          </div>
          <Link to="/guides" className="view-all-link">View all guides →</Link>
        </div>

        <div className="guides-grid">

          <Link to="/guides/entry-intel-gaming" className="guide-card guide-card-link">
            <div className="guide-card-visual">
              <div className="vc-overlay"></div>
              <div className="vc-glow"></div>
              <span className="vc-tier entry">Entry Level</span>
              <span className="vc-emoji">🖥️</span>
            </div>
            <div className="guide-card-body">
              <div className="guide-card-name">Entry Intel Gaming Build</div>
              <div className="guide-card-desc">
                A budget-friendly powerhouse for 1080p gaming. Great for first-time builders
                looking to get into PC gaming without breaking the bank.
              </div>
              <div className="guide-card-tags">
                <span className="guide-tag">1080p Gaming</span>
                <span className="guide-tag">Intel Core i3</span>
                <span className="guide-tag">RTX 4060</span>
              </div>
              <div className="guide-card-footer">
                <div className="guide-price">$1,115</div>
                <div className="guide-stat">👤 80 builds</div>
              </div>
            </div>
          </Link>

          <Link to="/guides/amd-gaming-streaming" className="guide-card guide-card-link">
            <div className="guide-card-visual">
              <div className="vc-overlay"></div>
              <div className="vc-glow"></div>
              <span className="vc-tier mid">Mid Range</span>
              <span className="vc-emoji">⚡</span>
            </div>
            <div className="guide-card-body">
              <div className="guide-card-name">AMD Gaming / Streaming</div>
              <div className="guide-card-desc">
                The perfect balance of performance and price for 1440p gaming and streaming.
                AMD's Ryzen platform with excellent multi-threaded chops.
              </div>
              <div className="guide-card-tags">
                <span className="guide-tag">1440p Gaming</span>
                <span className="guide-tag">Ryzen 5 9800X</span>
                <span className="guide-tag">RTX 5070</span>
              </div>
              <div className="guide-card-footer">
                <div className="guide-price">$1,692</div>
                <div className="guide-stat">👤 67 builds</div>
              </div>
            </div>
          </Link>

          <Link to="/guides/magnificent-amd-build" className="guide-card guide-card-link">
            <div className="guide-card-visual">
              <div className="vc-overlay"></div>
              <div className="vc-glow"></div>
              <span className="vc-tier high">High End</span>
              <span className="vc-emoji">🏆</span>
            </div>
            <div className="guide-card-body">
              <div className="guide-card-name">Magnificent AMD Build</div>
              <div className="guide-card-desc">
                No-compromise 4K gaming and creative workstation build. Ryzen 7 9800X3D
                paired with RTX 5080 for breathtaking performance.
              </div>
              <div className="guide-card-tags">
                <span className="guide-tag">4K Gaming</span>
                <span className="guide-tag">Ryzen 7 9800X3D</span>
                <span className="guide-tag">RTX 5080</span>
              </div>
              <div className="guide-card-footer">
                <div className="guide-price">$2,756</div>
                <div className="guide-stat">👤 36 builds</div>
              </div>
            </div>
          </Link>

        </div>
      </section>


      {/* ══════════════════════════════════════════════════
          FEATURED PREBUILDS (live from DB)
      ═════════════════════════════════════════════════════ */}
      <section className="section completed-section">
        <div className="section-header">
          <div>
            <div className="section-label">Ready to use · Fully customisable</div>
            <h2 className="section-heading">Featured <em>Prebuilds</em></h2>
            <p className="section-sub">
              Hand-picked templates for every use case and budget. Open any build
              in the builder and make it your own in seconds.
            </p>
          </div>
          <Link to="/prebuilds" className="view-all-link">View all prebuilds →</Link>
        </div>

        <div className="completed-grid">

          {/* Loading skeletons */}
          {pbLoading && Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="completed-card">
              <div className="completed-card-img" style={{ background: "#dde6ee" }} />
              <div className="completed-card-body">
                <div style={{ height: 13, borderRadius: 6, background: "linear-gradient(90deg,#dde6ee 25%,#eaf0f5 50%,#dde6ee 75%)", backgroundSize: "200% 100%", animation: "pbShimmer 1.4s infinite", marginBottom: 8, width: "60%" }} />
                <div style={{ height: 10, borderRadius: 6, background: "linear-gradient(90deg,#dde6ee 25%,#eaf0f5 50%,#dde6ee 75%)", backgroundSize: "200% 100%", animation: "pbShimmer 1.4s infinite", marginBottom: 6, width: "90%" }} />
                <div style={{ height: 10, borderRadius: 6, background: "linear-gradient(90deg,#dde6ee 25%,#eaf0f5 50%,#dde6ee 75%)", backgroundSize: "200% 100%", animation: "pbShimmer 1.4s infinite", width: "70%" }} />
              </div>
            </div>
          ))}

          {/* Live prebuild cards */}
          {!pbLoading && prebuilds.map((build) => {
            const tier = TIER_STYLE[build.tierClass] ?? TIER_STYLE.entry;
            const cpu  = build.parts?.cpu?.name ?? "—";
            const gpu  = build.parts?.gpu?.name ?? "—";

            return (
              <Link
                key={build._id}
                to="/prebuilds"
                className="completed-card"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <div className="completed-card-img" style={{ background: "linear-gradient(135deg, #2F4156, #3a5272)", position: "relative" }}>
                  <div style={{
                    position: "absolute", inset: 0,
                    background: `radial-gradient(circle at 70% 50%, ${build.accentColor ?? "#5D7C8D"}40 0%, transparent 65%)`,
                  }} />
                  <span className="cc-emoji">{build.emoji ?? "🖥️"}</span>
                  <span style={{
                    position: "absolute", top: 10, left: 10, zIndex: 2,
                    fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.1em",
                    textTransform: "uppercase", padding: "3px 9px", borderRadius: 100,
                    color: tier.color, background: tier.bg,
                    border: `1px solid ${tier.color}55`,
                  }}>{tier.label}</span>
                  <span style={{
                    position: "absolute", top: 10, right: 10, zIndex: 2,
                    fontSize: "0.62rem", fontWeight: 600,
                    color: "rgba(200,217,230,0.75)",
                    background: "rgba(47,65,86,0.6)",
                    padding: "3px 9px", borderRadius: 100,
                    border: "1px solid rgba(200,217,230,0.15)",
                  }}>{build.category}</span>
                </div>

                <div className="completed-card-body">
                  <div className="cc-title">{build.name}</div>
                  <div className="cc-specs" style={{ marginTop: 4 }}>🧠 {cpu}</div>
                  <div className="cc-specs" style={{ marginTop: 2 }}>🎮 {gpu}</div>
                  <div className="cc-footer" style={{ marginTop: 10 }}>
                    <div className="cc-price">
                      {build.price ?? (build.totalPrice ? `$${Number(build.totalPrice).toLocaleString()}` : "—")}
                    </div>
                    <div className="cc-likes">🔨 {build.builds ?? 0} builds</div>
                  </div>
                </div>
              </Link>
            );
          })}

          {/* Empty state */}
          {!pbLoading && prebuilds.length === 0 && (
            <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "60px 20px", color: "#5D7C8D" }}>
              <div style={{ fontSize: "2.5rem", marginBottom: 12 }}>📦</div>
              No prebuilds added yet.
            </div>
          )}

        </div>
      </section>

      <style>{`
        @keyframes pbShimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </>
  );
}

export default Home;

