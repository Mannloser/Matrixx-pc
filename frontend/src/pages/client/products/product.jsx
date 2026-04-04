import { useState, useMemo, useEffect, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "../../../api/axios";
import "../css/product.css";

/* ─────────────────────────────────────────────
   PAGE META — label, icon, filters per slug
   (UI-only config — no product data here)
───────────────────────────────────────────── */
const PAGE_META = {
  cpu: {
    title: "CPUs & Processors", icon: "🧠",
    specs: (p) => [p.cores, p.clock, p.socket, p.tdp ? `${p.tdp}W TDP` : null].filter(Boolean).join(" · "),
    seriesLabel: "Series",
  },
  gpu: {
    title: "Graphics Cards", icon: "🎮",
    specs: (p) => [p.vram, p.boost ? `Boost ${p.boost}` : null, p.tdp ? `${p.tdp}W TDP` : null].filter(Boolean).join(" · "),
    seriesLabel: "Generation",
  },
  ram: {
    title: "Memory (RAM)", icon: "💾",
    specs: (p) => [p.capacity, p.speed, p.cl].filter(Boolean).join(" · "),
    seriesLabel: "Type",
  },
  storage: {
    title: "Storage", icon: "💿",
    specs: (p) => [p.capacity, p.type, p.read ? `R: ${p.read}` : null, p.write ? `W: ${p.write}` : null].filter(Boolean).join(" · "),
    seriesLabel: "Type",
  },
  motherboard: {
    title: "Motherboards", icon: "🟩",
    specs: (p) => [p.socket, p.chipset, p.formFactor, p.ddr].filter(Boolean).join(" · "),
    seriesLabel: "Platform",
  },
  case: {
    title: "PC Cases", icon: "🏠",
    specs: (p) => [p.formFactor, p.color, p.psu].filter(Boolean).join(" · "),
    seriesLabel: "Form Factor",
  },
  cooler: {
    title: "CPU Coolers", icon: "❄️",
    specs: (p) => [p.type, p.size, p.tdpRating ? `Up to ${p.tdpRating}W TDP` : null].filter(Boolean).join(" · "),
    seriesLabel: "Type",
  },
  psu: {
    title: "Power Supplies", icon: "⚡",
    specs: (p) => [p.wattage ? `${p.wattage}W` : null, p.rating, p.modular ? `${p.modular} Modular` : null].filter(Boolean).join(" · "),
    seriesLabel: "Efficiency",
  },
};

/* Brand colours */
const BRAND_COLORS = {
  AMD: "#ED1C24", NVIDIA: "#76B900", Intel: "#0071C5",
  Corsair: "#FFD700", "G.Skill": "#E31837", Kingston: "#CE1126",
  Samsung: "#1428A0", WD: "#007DB8", Crucial: "#EE2323", Seagate: "#008B02",
  ASUS: "#00539B", MSI: "#DD1021", Gigabyte: "#E31837", ASRock: "#B0060D",
  "Lian Li": "#C8A86B", Fractal: "#4A4A4A", NZXT: "#CC0000",
  Phanteks: "#E31837", "be quiet!": "#1A1A1A", Noctua: "#9B5E00", Deepcool: "#00B4E6",
  Arctic: "#00AEEF", EVGA: "#E31837", Seasonic: "#F5A623", Thermaltake: "#C8102E",
  "Cooler Master": "#D10000",
};
const getBrandColor = (brand) => BRAND_COLORS[brand] ?? "#5D7C8D";

const SLUG_MAP = {
  "cpu": "cpu", "cpu-processors": "cpu", "cpus": "cpu", "processors": "cpu",
  "gpu": "gpu", "gpus": "gpu", "graphics-cards": "gpu", "graphics": "gpu", "video-cards": "gpu",
  "ram": "ram", "memory": "ram", "memories": "ram",
  "storage": "storage", "ssds": "storage", "hdds": "storage", "drives": "storage",
  "motherboard": "motherboard", "motherboards": "motherboard", "mobo": "motherboard",
  "case": "case", "cases": "case", "pc-cases": "case", "chassis": "case",
  "cooler": "cooler", "coolers": "cooler", "cpu-coolers": "cooler", "cooling": "cooler",
  "psu": "psu", "psus": "psu", "power-supplies": "psu", "power-supply": "psu",
};

export default function ProductListPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const key = SLUG_MAP[slug?.toLowerCase()] ?? slug;
  const meta = PAGE_META[key];

  /* ── Notification state ── */
  const [notification, setNotification] = useState(null);

  /* ── Server data ── */
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /* ── Filter / sort state ── */
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("default");
  const [series, setSeries] = useState([]);
  const [priceMin, setPriceMin] = useState(0);
  const [priceMax, setPriceMax] = useState(9999);

  /* ── Derived price bounds from real data ── */
  const globalMin = products.length ? Math.min(...products.map(p => p.price)) : 0;
  const globalMax = products.length ? Math.max(...products.map(p => p.price)) : 9999;

  /* ── Unique series options from real data ── */
  const seriesOptions = useMemo(
    () => [...new Set(products.map(p => p.series).filter(Boolean))].sort(),
    [products]
  );

  /* ── Fetch from API ── */
  const fetchProducts = useCallback(async () => {
    if (!key) return;
    setLoading(true);
    setError(null);
    try {
      const CATEGORY_MAP = {
        cpu: "CPU",
        gpu: "GPU",
        ram: "Memory",
        storage: "Storage",
        motherboard: "Motherboard",
        case: "Case",
        cooler: "CPU Cooler",
        psu: "PSU"
      };
      const res = await axios.get("/parts", {
        params: { category: CATEGORY_MAP[key] },
      });
      const data = Array.isArray(res.data) ? res.data : [];
      setProducts(data);
      // Reset price range to match real data
      if (data.length) {
        const min = Math.min(...data.map(p => p.price));
        const max = Math.max(...data.map(p => p.price));
        setPriceMin(min);
        setPriceMax(max);
      }
    } catch (err) {
      setError("Failed to load products. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [key]);

  /* ── Reset filters + fetch when category slug changes ── */
  useEffect(() => {
    setSort("default");
    setSeries([]);
    setSearch("");
    fetchProducts();
  }, [key]);

  /* ── Client-side filter + sort (search handled here for instant feel) ── */
  const filtered = useMemo(() => {
    let list = [...products];

    if (search.trim())
      list = list.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        (p.brand && p.brand.toLowerCase().includes(search.toLowerCase()))
      );

    if (series.length > 0)
      list = list.filter(p => series.includes(p.series));

    list = list.filter(p => p.price >= priceMin && p.price <= priceMax);

    if (sort === "price-asc") list.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") list.sort((a, b) => b.price - a.price);

    return list;
  }, [products, search, series, sort, priceMin, priceMax]);

  const toggleSeries = (s) =>
    setSeries(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);

  const clearFilters = () => {
    setSeries([]); setSort("default");
    setPriceMin(globalMin); setPriceMax(globalMax); setSearch("");
  };

  const hasFilters =
    series.length > 0 || sort !== "default" ||
    priceMin !== globalMin || priceMax !== globalMax || search.trim();

  /* ── Add to Builder ── */
  const handleAddToBuilder = (part) => {
    // Map product category to builder category
    const categoryMap = {
      cpu: "cpu",
      gpu: "gpu",
      motherboard: "motherboard",
      memory: "memory",
      storage: "storage_primary",
      "cpu cooler": "cpu_cooler",
      psu: "psu",
      case: "case",
    };

    const builderCat = categoryMap[key];
    if (!builderCat) return;

    // Store in localStorage temporarily for builder to pick up
    const tempSelections = JSON.parse(localStorage.getItem("builderTempSelections") || "{}");
    tempSelections[builderCat] = part._id;
    localStorage.setItem("builderTempSelections", JSON.stringify(tempSelections));

    // Show notification
    setNotification({ partName: part.name, builderCat });

    // Auto-hide after 5 seconds
    setTimeout(() => setNotification(null), 5000);
  };

  /* ── Unknown category ── */
  if (!meta) return (
    <div style={{ padding: 40, fontFamily: "sans-serif", background: "#F5EFEB", minHeight: "100vh" }}>
      <h2 style={{ color: "#2F4156" }}>Category not found</h2>
      <p style={{ color: "#5D7C8D" }}>Slug received: <code>"{slug}"</code> → key: <code>"{key}"</code></p>
      <p style={{ color: "#5D7C8D" }}>Valid slugs: cpu, gpu, ram, storage, motherboard, case, cooler, psu (and their aliases)</p>
    </div>
  );

  return (
    <>
      <div className="plp">

        {/* ── HEADER ── */}
        <div className="plp-header">
          <div>
            <div className="plp-breadcrumb">
              <Link to="/">Home</Link>
              <span className="plp-breadcrumb-sep">›</span>
              <span>Products</span>
              <span className="plp-breadcrumb-sep">›</span>
              <span style={{ color: "var(--navy)", fontWeight: 600 }}>{meta.title}</span>
            </div>
            <div className="plp-h1">
              <div className="plp-h1-icon">{meta.icon}</div>
              {meta.title}
            </div>
          </div>
          <div className="plp-header-meta">
            {loading ? (
              <span style={{ color: "var(--teal)", fontSize: "0.82rem" }}>Loading…</span>
            ) : (
              <>
                <strong>{filtered.length}</strong>
                {filtered.length !== products.length ? ` of ${products.length} products` : " products"}
              </>
            )}
          </div>
        </div>

        <div className="plp-wrap">

          {/* ── SIDEBAR ── */}
          <aside className="plp-sidebar">

            {/* Search */}
            <div className="sb-block">
              <div className="sb-label">Search</div>
              <input
                className="sb-search"
                placeholder="Type to filter…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* Sort */}
            <div className="sb-block">
              <div className="sb-label">Sort by</div>
              <div className="sb-sort-list">
                {[["default", "Default"], ["price-asc", "Price: Low to High"], ["price-desc", "Price: High to Low"]].map(([val, label]) => (
                  <button key={val} className={`sb-sort-btn ${sort === val ? "on" : ""}`} onClick={() => setSort(val)}>
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Series — built dynamically from real data */}
            {seriesOptions.length > 0 && (
              <div className="sb-block">
                <div className="sb-label">{meta.seriesLabel}</div>
                <div className="sb-check-list">
                  {seriesOptions.map((s) => {
                    const count = products.filter(p => p.series === s).length;
                    return (
                      <div key={s} className="sb-check-row" onClick={() => toggleSeries(s)}>
                        <div className={`sb-check-box ${series.includes(s) ? "on" : ""}`}>
                          {series.includes(s) && "✓"}
                        </div>
                        <span className="sb-check-text">{s}</span>
                        <span className="sb-check-count">{count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Price Range */}
            {products.length > 0 && (
              <div className="sb-block">
                <div className="sb-label">Price Range</div>
                <div className="sb-price-row">
                  <span className="sb-price-val">₹{priceMin}</span>
                  <span className="sb-price-val">₹{priceMax}</span>
                </div>
                <div className="range-track">
                  <div className="range-fill" style={{
                    left: `${((priceMin - globalMin) / (globalMax - globalMin || 1)) * 100}%`,
                    right: `${100 - ((priceMax - globalMin) / (globalMax - globalMin || 1)) * 100}%`,
                  }} />
                  <input type="range" className="range-input"
                    min={globalMin} max={globalMax} step={5} value={priceMin}
                    onChange={(e) => { const v = Number(e.target.value); if (v < priceMax - 20) setPriceMin(v); }}
                  />
                  <input type="range" className="range-input"
                    min={globalMin} max={globalMax} step={5} value={priceMax}
                    onChange={(e) => { const v = Number(e.target.value); if (v > priceMin + 20) setPriceMax(v); }}
                  />
                </div>
                <button className="sb-clear-btn" onClick={clearFilters} disabled={!hasFilters}>
                  Reset filters
                </button>
              </div>
            )}

          </aside>

          {/* ── RIGHT ── */}
          <div className="plp-right">

            {/* Toolbar */}
            <div className="plp-toolbar">
              <div className="plp-result-text">
                {loading
                  ? "Loading products…"
                  : <>Showing <strong>{filtered.length}</strong> {filtered.length === 1 ? "product" : "products"}</>
                }
              </div>
              {(series.length > 0 || search) && (
                <div className="active-pills">
                  {search && (
                    <span className="a-pill">
                      "{search}"
                      <button className="a-pill-x" onClick={() => setSearch("")}>✕</button>
                    </span>
                  )}
                  {series.map((s) => (
                    <span key={s} className="a-pill">
                      {s}
                      <button className="a-pill-x" onClick={() => toggleSeries(s)}>✕</button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Loading skeleton */}
            {loading && (
              <div className="p-list">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="p-row" style={{ opacity: 0.5, pointerEvents: "none" }}>
                    <div className="p-row-icon" style={{ background: "#e2e8f0", borderRadius: 12 }} />
                    <div className="p-row-mid" style={{ gap: 8 }}>
                      <div style={{ height: 14, width: "60%", background: "#e2e8f0", borderRadius: 6 }} />
                      <div style={{ height: 11, width: "80%", background: "#f1f5f9", borderRadius: 6 }} />
                    </div>
                    <div className="p-row-right" style={{ gap: 8 }}>
                      <div style={{ height: 18, width: 60, background: "#e2e8f0", borderRadius: 6 }} />
                      <div style={{ height: 32, width: 100, background: "#e2e8f0", borderRadius: 8 }} />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Error state */}
            {!loading && error && (
              <div className="plp-empty">
                <div className="plp-ico">⚠️</div>
                <div className="plp-empty-title">Something went wrong</div>
                <div className="plp-empty-sub">{error}</div>
                <button className="plp-empty-btn" onClick={fetchProducts}>Try again</button>
              </div>
            )}

            {/* Product list */}
            {!loading && !error && filtered.length > 0 && (
              <div className="p-list">
                {filtered.map((p) => (
                  <div key={p._id} className="p-row">
                    <div className="p-row-icon">{meta.icon}</div>

                    <div className="p-row-mid">
                      <div className="p-row-top">
                        <span className="p-row-brand" style={{ background: getBrandColor(p.brand) }}>
                          {p.brand}
                        </span>
                        <span className="p-row-name">{p.name}</span>
                        {p.tag && <span className="p-row-tag">{p.tag}</span>}
                      </div>
                      <div className="p-row-specs">{meta.specs(p)}</div>
                    </div>

                    <div className="p-row-right">
                      <div className="p-row-price">₹{p.price}</div>
                      <button className="p-row-btn" onClick={() => handleAddToBuilder(p)}>Add to Build</button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Empty state — no results after filtering */}
            {!loading && !error && products.length > 0 && filtered.length === 0 && (
              <div className="plp-empty">
                <div className="plp-ico">🔍</div>
                <div className="plp-empty-title">No results found</div>
                <div className="plp-empty-sub">Try changing your filters or search term</div>
                <button className="plp-empty-btn" onClick={clearFilters}>Clear filters</button>
              </div>
            )}

            {/* Empty state — no products in DB for this category */}
            {!loading && !error && products.length === 0 && (
              <div className="plp-empty">
                <div className="plp-ico">📦</div>
                <div className="plp-empty-title">No products yet</div>
                <div className="plp-empty-sub">No {meta.title.toLowerCase()} have been added to the database.</div>
              </div>
            )}

          </div>
        </div>

        {/* ── NOTIFICATION ── */}
        {notification && (
          <div style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            background: "#2F4156",
            color: "#FFFFFF",
            padding: "16px 20px",
            borderRadius: "8px",
            boxShadow: "0 8px 24px rgba(47, 65, 86, 0.3)",
            zIndex: 1000,
            maxWidth: "320px",
            fontSize: "0.875rem",
            lineHeight: "1.5",
            animation: "slideIn 0.3s ease",
          }}>
            <div style={{ marginBottom: "10px" }}>
              ✅ <strong>{notification.partName}</strong> added to builder!
            </div>
            <button onClick={() => navigate("/builder")} style={{
              background: "#5D7C8D",
              color: "#FFFFFF",
              border: "none",
              padding: "6px 12px",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "0.8rem",
              fontWeight: "600",
              transition: "background 0.2s",
            }} 
            onMouseEnter={(e) => e.target.style.background = "#7a93a6"}
            onMouseLeave={(e) => e.target.style.background = "#5D7C8D"}
            >
              View in Builder →
            </button>
          </div>
        )}

        <style>{`
          @keyframes slideIn {
            from { transform: translateX(400px); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
          }
        `}</style>
      </div>
    </>
  );
}