import { useParams, Link } from "react-router-dom";
import "./css/guide.css";

/* ─────────────────────────────────────────────────────────
   GUIDE DATA
───────────────────────────────────────────────────────── */
const GUIDES = {
  "entry-intel-gaming": {
    tier:       "Entry Level",
    tierClass:  "entry",
    emoji:      "🖥️",
    title:      "Entry Intel Gaming Build",
    subtitle:   "1080p Gaming · Budget Friendly · First-Time Builder",
    totalPrice: "$1,115",
    buildsCount:"80",
    accentColor:"#3b82f6",
    description:`A carefully selected entry-level build that punches well above its price tag. 
    The Intel Core i3-13100 delivers solid gaming performance, and the RTX 4060 handles 
    1080p at high settings with ease. Perfect for first-time builders who want a smooth 
    experience without overspending.`,
    useCases:   ["1080p Gaming","Everyday Use","Light Streaming","College / Student"],
    perfTargets:[
      { label: "Resolution",    value: "1080p" },
      { label: "Target FPS",   value: "60–120 fps" },
      { label: "Gaming Perf",  value: "High Settings" },
      { label: "Noise Level",  value: "Quiet" },
    ],
    parts: [
      { cat: "CPU",         icon: "🧠", name: "Intel Core i3-13100",        detail: "4C/8T · 3.4–4.5 GHz · LGA1700",        price: "$129", watts: "60W" },
      { cat: "GPU",         icon: "🎮", name: "NVIDIA GeForce RTX 4060",    detail: "8GB GDDR6 · Boost 2460 MHz",             price: "$299", watts: "115W" },
      { cat: "Motherboard", icon: "🟩", name: "MSI PRO B660M-A DDR4",       detail: "LGA1700 · B660 · mATX · DDR4",          price: "$129", watts: "45W" },
      { cat: "Memory",      icon: "💾", name: "Kingston Fury Beast 16GB",   detail: "2×8GB · DDR4-3200 · CL16",              price: "$59",  watts: "5W" },
      { cat: "Storage",     icon: "💿", name: "WD Blue SN580 1TB NVMe",     detail: "M.2 PCIe 4.0 · 4150 MB/s read",         price: "$69",  watts: "4W" },
      { cat: "Case",        icon: "🏠", name: "Phanteks Eclipse P400A",     detail: "ATX Mid Tower · Mesh Front",             price: "$89",  watts: "—" },
      { cat: "CPU Cooler",  icon: "❄️", name: "Cooler Master Hyper 212",    detail: "Air Cooler · 120mm · 150W TDP",          price: "$39",  watts: "5W" },
      { cat: "PSU",         icon: "⚡", name: "EVGA SuperNOVA 650W G6",     detail: "80+ Gold · Fully Modular",               price: "$89",  watts: "—" },
      { cat: "OS",          icon: "💻", name: "Windows 11 Home",            detail: "Digital License",                        price: "$139", watts: "—" },
    ],
    pros: [
      "Lowest entry price in our guide lineup",
      "RTX 4060 handles 1080p high settings comfortably",
      "Intel platform is well-supported and stable",
      "Quiet stock cooler — great for small spaces",
    ],
    cons: [
      "Not suitable for 1440p or 4K gaming",
      "i3 will bottleneck heavier GPU upgrades later",
      "16GB RAM may need an upgrade for future games",
    ],
    tips: [
      "Enable XMP/EXPO in BIOS for full DDR4-3200 speed",
      "Add a second stick of RAM later for dual-channel performance boost",
      "Keep an eye on GPU temps — the RTX 4060 runs warm in small cases",
    ],
  },

  "amd-gaming-streaming": {
    tier:       "Mid Range",
    tierClass:  "mid",
    emoji:      "⚡",
    title:      "AMD Gaming / Streaming Build",
    subtitle:   "1440p Gaming · Content Creation · Streaming Ready",
    totalPrice: "$1,692",
    buildsCount:"67",
    accentColor:"#f59e0b",
    description:`The sweet spot between price and performance. The Ryzen 5 7600X is a 
    six-core powerhouse ideal for gaming and streaming simultaneously. The RTX 5070 
    crushes 1440p and makes a decent stab at 4K. Add 32GB of DDR5 and you've got a 
    machine that handles everything you throw at it.`,
    useCases:   ["1440p Gaming","Game Streaming","Content Creation","Multi-tasking"],
    perfTargets:[
      { label: "Resolution",   value: "1440p" },
      { label: "Target FPS",  value: "100–165 fps" },
      { label: "Gaming Perf", value: "Ultra Settings" },
      { label: "Streaming",   value: "1080p60 OBS" },
    ],
    parts: [
      { cat: "CPU",         icon: "🧠", name: "AMD Ryzen 5 7600X",             detail: "6C/12T · 4.7–5.3 GHz · AM5",           price: "$249", watts: "105W" },
      { cat: "GPU",         icon: "🎮", name: "NVIDIA GeForce RTX 5070",       detail: "12GB GDDR7 · Boost 2610 MHz",            price: "$599", watts: "200W" },
      { cat: "Motherboard", icon: "🟩", name: "MSI MAG B650 Tomahawk WiFi",    detail: "AM5 · B650 · ATX · DDR5 · WiFi 6E",     price: "$199", watts: "45W" },
      { cat: "Memory",      icon: "💾", name: "G.Skill Trident Z5 32GB",       detail: "2×16GB · DDR5-6000 · CL30",             price: "$149", watts: "7W" },
      { cat: "Storage",     icon: "💿", name: "Samsung 990 Pro 1TB",           detail: "M.2 PCIe 4.0 · 7450 MB/s read",         price: "$109", watts: "6W" },
      { cat: "Case",        icon: "🏠", name: "Fractal Design Meshify C",      detail: "ATX Mid Tower · High Airflow",           price: "$99",  watts: "—" },
      { cat: "CPU Cooler",  icon: "❄️", name: "Deepcool AK620",                detail: "Dual Tower Air · Dual 120mm · 260W TDP", price: "$59",  watts: "5W" },
      { cat: "PSU",         icon: "⚡", name: "Corsair RM750x 750W",           detail: "80+ Gold · Fully Modular · Zero RPM",    price: "$109", watts: "—" },
      { cat: "OS",          icon: "💻", name: "Windows 11 Home",               detail: "Digital License",                        price: "$139", watts: "—" },
    ],
    pros: [
      "Ryzen 5 7600X is one of the best value CPUs for gaming",
      "AM5 socket has a long upgrade path ahead",
      "32GB DDR5 is future-proof for years",
      "Meshify C has excellent airflow for sustained performance",
    ],
    cons: [
      "B650 limits PCIe 5.0 lanes vs X670",
      "DDR5 still more expensive than DDR4",
      "Ryzen 7600X runs hot — good cooler is essential",
    ],
    tips: [
      "Enable EXPO profile in BIOS for DDR5-6000 speeds",
      "Enable Eco Mode in Ryzen Master to reduce temps with minimal perf loss",
      "Set Resizable BAR on in BIOS for extra GPU performance",
    ],
  },

  "magnificent-amd-build": {
    tier:       "High End",
    tierClass:  "high",
    emoji:      "🏆",
    title:      "Magnificent AMD Build",
    subtitle:   "4K Gaming · Creative Workstation · No Compromises",
    totalPrice: "$2,756",
    buildsCount:"36",
    accentColor:"#ef4444",
    description:`The absolute pinnacle of consumer PC building. The Ryzen 7 9800X3D's 
    3D V-Cache technology makes it the undisputed gaming CPU king. Paired with the RTX 5080 
    and 64GB of fast DDR5, this machine dominates 4K gaming, handles professional 
    creative workloads, and still has thermal headroom to spare.`,
    useCases:   ["4K Gaming","Video Editing","3D Rendering","Professional Streaming"],
    perfTargets:[
      { label: "Resolution",   value: "4K / 1440p" },
      { label: "Target FPS",  value: "120–240 fps" },
      { label: "Gaming Perf", value: "Max Everything" },
      { label: "Ray Tracing", value: "Ultra RT + DLSS 4" },
    ],
    parts: [
      { cat: "CPU",         icon: "🧠", name: "AMD Ryzen 7 9800X3D",           detail: "8C/16T · 4.7–5.2 GHz · AM5 · 3D V-Cache", price: "$479", watts: "120W" },
      { cat: "GPU",         icon: "🎮", name: "NVIDIA GeForce RTX 5080",       detail: "16GB GDDR7 · Boost 2617 MHz · DLSS 4",      price: "$999", watts: "320W" },
      { cat: "Motherboard", icon: "🟩", name: "ASUS ROG Strix X870-E Gaming",  detail: "AM5 · X870E · ATX · DDR5 · WiFi 7",         price: "$449", watts: "60W" },
      { cat: "Memory",      icon: "💾", name: "G.Skill Trident Z5 64GB",       detail: "2×32GB · DDR5-6400 · CL32",                 price: "$279", watts: "10W" },
      { cat: "Storage",     icon: "💿", name: "Samsung 990 Pro 2TB",           detail: "M.2 PCIe 4.0 · 7450 MB/s read",             price: "$149", watts: "6W" },
      { cat: "Case",        icon: "🏠", name: "Lian Li PC-O11 Dynamic EVO",   detail: "Mid/Full Tower · Dual Chamber",              price: "$169", watts: "—" },
      { cat: "CPU Cooler",  icon: "❄️", name: "Arctic Liquid Freezer III 360", detail: "360mm AIO · High-Density Radiator",          price: "$129", watts: "18W" },
      { cat: "PSU",         icon: "⚡", name: "Seasonic Prime TX-1000 1000W",  detail: "80+ Titanium · Fully Modular · Fanless",     price: "$279", watts: "—" },
      { cat: "OS",          icon: "💻", name: "Windows 11 Pro",                detail: "Digital License",                            price: "$199", watts: "—" },
    ],
    pros: [
      "Ryzen 9800X3D is the fastest gaming CPU money can buy",
      "RTX 5080 handles 4K ultra with ray tracing enabled",
      "64GB RAM future-proofs for any workload",
      "Titanium PSU is the most efficient you can get",
    ],
    cons: [
      "High price — significant investment",
      "Overkill for 1080p or casual gaming",
      "360mm AIO requires a case with top/front 360mm support",
    ],
    tips: [
      "Pair with a 4K 144Hz or 1440p 240Hz monitor to see full benefit",
      "Use DLSS 4 Multi Frame Generation for maximum fps at 4K",
      "The 9800X3D prefers lower-latency RAM — CL30 or below is ideal",
    ],
  },
};

/* ─────────────────────────────────────────────────────────
   TIER COLORS
───────────────────────────────────────────────────────── */
const TIER_BG = {
  entry: "linear-gradient(135deg, #1a2a4a 0%, #2F4156 100%)",
  mid:   "linear-gradient(135deg, #2a1a0a 0%, #4a3010 100%)",
  high:  "linear-gradient(135deg, #2a0a0a 0%, #4a1010 100%)",
};
const TIER_ACCENT = { entry: "#3b82f6", mid: "#f59e0b", high: "#ef4444" };

/* ─────────────────────────────────────────────────────────
   COMPONENT
───────────────────────────────────────────────────────── */
export default function GuidePage() {
  const { slug } = useParams();
  const guide = GUIDES[slug];

  if (!guide) return (
    <div style={{ padding: 60, textAlign: "center", fontFamily: "sans-serif", background: "#F5EFEB", minHeight: "100vh" }}>
      <h2 style={{ color: "#2F4156" }}>Guide not found</h2>
      <Link to="/guides" style={{ color: "#5D7C8D" }}>← Back to guides</Link>
    </div>
  );

  const accent  = TIER_ACCENT[guide.tierClass];
  const totalW  = guide.parts.reduce((sum, p) => {
    const w = parseInt(p.watts);
    return sum + (isNaN(w) ? 0 : w);
  }, 0);

  return (
    <>

      <div className="gp">

        {/* ── HERO ── */}
        <div className="gp-hero">
          <div className="gp-hero-inner">
            <div>
              <div className="gp-breadcrumb">
                <Link to="/">Home</Link>
                <span className="gp-breadcrumb-sep">›</span>
                <Link to="/guides">Build Guides</Link>
                <span className="gp-breadcrumb-sep">›</span>
                <span style={{ color: "var(--sky)" }}>{guide.title}</span>
              </div>

              <div
                className="gp-tier-badge"
                style={{ color: accent, borderColor: `${accent}40`, background: `${accent}18` }}
              >
                <span>{guide.emoji}</span>
                {guide.tier}
              </div>

              <h1 className="gp-hero-title">{guide.title}</h1>
              <p className="gp-hero-subtitle">{guide.subtitle}</p>

              <div className="gp-hero-stats">
                <div className="gp-hero-stat">
                  <span className="gp-hero-stat-val">{guide.totalPrice}</span>
                  <span className="gp-hero-stat-label">Est. total cost</span>
                </div>
                <div className="gp-hero-stat-div" />
                <div className="gp-hero-stat">
                  <span className="gp-hero-stat-val">{guide.parts.length}</span>
                  <span className="gp-hero-stat-label">Components</span>
                </div>
                <div className="gp-hero-stat-div" />
                <div className="gp-hero-stat">
                  <span className="gp-hero-stat-val">{guide.buildsCount}</span>
                  <span className="gp-hero-stat-label">Builds made</span>
                </div>
              </div>
            </div>

            <div className="gp-hero-card">
              <div className="gp-hero-card-emoji">{guide.emoji}</div>
              <div className="gp-hero-card-label">{guide.tier}</div>
            </div>
          </div>
        </div>

        {/* ── STRIP: use cases + perf ── */}
        <div className="gp-strip">
          <div className="gp-strip-inner">
            <span className="gp-strip-label">Use cases</span>
            <div className="gp-use-cases">
              {guide.useCases.map(u => (
                <span key={u} className="gp-use-pill">{u}</span>
              ))}
            </div>
            <div className="gp-strip-div" />
            <span className="gp-strip-label">Performance</span>
            <div className="gp-perf-items">
              {guide.perfTargets.map(t => (
                <div key={t.label} className="gp-perf-item">
                  <span className="gp-perf-val">{t.value}</span>
                  <span className="gp-perf-lbl">{t.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── BODY ── */}
        <div className="gp-body">
          <div>

            {/* Description */}
            <div className="gp-desc-card">
              <div className="gp-card-title" style={{ color: "var(--teal)", fontSize: "0.68rem", fontFamily: "var(--font-display)", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10 }}>
                About this build
              </div>
              <p style={{ fontSize: "0.875rem", color: "var(--navy)", lineHeight: 1.7 }}>{guide.description}</p>
            </div>

            {/* Parts list */}
            <div className="gp-parts-card">
              <div className="gp-card-header">
                <span className="gp-card-title">Parts List</span>
                <span className="gp-parts-count">{guide.parts.length} components</span>
              </div>
              <div className="gp-parts-head">
                <div>Component</div>
                <div>Part</div>
                <div>Price</div>
                <div>Power</div>
              </div>
              {guide.parts.map((p) => (
                <div key={p.cat} className="gp-part-row">
                  <div className="gp-part-cat">
                    <div className="gp-part-icon">{p.icon}</div>
                    <span className="gp-part-cat-label">{p.cat}</span>
                  </div>
                  <div className="gp-part-info">
                    <div className="gp-part-name">{p.name}</div>
                    <div className="gp-part-detail">{p.detail}</div>
                  </div>
                  <div className="gp-part-price">{p.price}</div>
                  <div className="gp-part-watts">{p.watts}</div>
                </div>
              ))}
            </div>

            {/* Pros / Cons */}
            <div className="gp-proscons">
              <div className="gp-proscons-card">
                <div className="gp-proscons-head pros">✓ Pros</div>
                <div className="gp-proscons-list">
                  {guide.pros.map(p => (
                    <div key={p} className="gp-proscons-item">
                      <div className="gp-proscons-dot pro">✓</div>
                      {p}
                    </div>
                  ))}
                </div>
              </div>
              <div className="gp-proscons-card">
                <div className="gp-proscons-head cons">✗ Cons</div>
                <div className="gp-proscons-list">
                  {guide.cons.map(c => (
                    <div key={c} className="gp-proscons-item">
                      <div className="gp-proscons-dot con">✗</div>
                      {c}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Builder Tips */}
            <div className="gp-tips-card">
              <div className="gp-card-header">
                <span className="gp-card-title">💡 Builder Tips</span>
              </div>
              <div className="gp-tips-list">
                {guide.tips.map(t => (
                  <div key={t} className="gp-tip-row">
                    <div className="gp-tip-icon">💡</div>
                    {t}
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* ── SIDEBAR ── */}
          <aside className="gp-sidebar">

            {/* Price summary */}
            <div className="gp-sidebar-card">
              <div className="gp-sidebar-head">Price Summary</div>
              <div className="gp-sidebar-body">
                <div className="gp-total-price">{guide.totalPrice}</div>
                <div className="gp-total-label">Estimated total build cost</div>
                <div className="gp-price-breakdown">
                  {guide.parts.filter(p => p.price !== "—").map(p => (
                    <div key={p.cat} className="gp-price-row">
                      <span>{p.icon} {p.cat}</span>
                      <span>{p.price}</span>
                    </div>
                  ))}
                  <div className="gp-price-divider" />
                  <div className="gp-price-total-row">
                    <span>Total</span>
                    <span>{guide.totalPrice}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Power estimate */}
            <div className="gp-sidebar-card">
              <div className="gp-sidebar-head">Power Estimate</div>
              <div className="gp-sidebar-body">
                <div className="gp-power-val">{totalW} <span className="gp-power-unit">W</span></div>
                <div className="gp-power-label">Base draw (no 20% headroom)</div>
                <div style={{ height: 1, background: "var(--sky)", margin: "14px 0" }} />
                <div style={{ fontSize: "0.78rem", color: "var(--teal)", lineHeight: 1.6 }}>
                  Recommended PSU: <strong style={{ color: "var(--navy)" }}>
                    {totalW < 500 ? "650W" : totalW < 700 ? "750W" : "850W+"}
                  </strong>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="gp-sidebar-card">
              <div className="gp-sidebar-head">Use this build</div>
              <div className="gp-sidebar-body">
                <p style={{ fontSize: "0.78rem", color: "var(--teal)", lineHeight: 1.6, marginBottom: 14 }}>
                  Load all these parts into the builder and start customising your configuration.
                </p>
                <Link to="/builder" className="gp-cta-btn" >
                  ⚡ Open in Builder
                </Link>
                <Link to="/guides" className="gp-cta-btn outline">
                  ← All guides
                </Link>
              </div>
            </div>

          </aside>
        </div>
      </div>
    </>
  );
}
