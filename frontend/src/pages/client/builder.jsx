import { useState, useEffect } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import "./css/builder.css";
import axios from "../../api/axios";

// Category mapping from UI keys to database categories
const CATEGORY_MAP = {
  cpu: "CPU",
  gpu: "GPU",
  motherboard: "Motherboard",
  memory: "Memory",
  storage_primary: "Storage",
  storage_secondary: "Storage",
  cpu_cooler: "CPU Cooler",
  psu: "PSU",
  case: "Case",
};

const UI_CATEGORIES = [
  { key: "cpu",              label: "CPU",               icon: "🧠", desc: "Central Processing Unit" },
  { key: "cpu_cooler",       label: "CPU Cooler",        icon: "❄️", desc: "Cooling solution" },
  { key: "motherboard",      label: "Motherboard",       icon: "🟩", desc: "Main circuit board" },
  { key: "memory",           label: "Memory",            icon: "💾", desc: "RAM modules" },
  { key: "storage_primary",  label: "Storage (Primary)", icon: "💿", desc: "Boot drive / NVMe SSD" },
  { key: "storage_secondary",label: "Storage (Secondary)",icon: "🗄️", desc: "Extra HDD or SSD" },
  { key: "gpu",              label: "Video Card",        icon: "🎮", desc: "Graphics Processing Unit" },
  { key: "case",             label: "Case",              icon: "🏠", desc: "PC chassis" },
  { key: "psu",              label: "Power Supply",      icon: "⚡", desc: "Power Supply Unit" },
];

/* ── Compatibility engine ── */
function checkCompatibility(selections, allParts) {
  const issues   = [];
  const warnings = [];
  
  // Helper to get full part object from ID
  const getPartById = (id) => allParts.find(p => p._id === id);
  
  const cpu  = getPartById(selections.cpu);
  const mobo = getPartById(selections.motherboard);
  const ram  = getPartById(selections.memory);
  const psu  = getPartById(selections.psu);

  // 1. CPU ↔ Motherboard socket
  if (cpu && mobo) {
    const cpuSock  = cpu.specs?.socket;
    const moboSock = mobo.specs?.socket;
    if (cpuSock && moboSock && cpuSock !== moboSock) {
      issues.push({
        type:  "error",
        parts: ["cpu", "motherboard"],
        title: "Socket Mismatch",
        detail: `${cpu.name} uses socket ${cpuSock} but ${mobo.name} has socket ${moboSock}. They won't physically fit.`,
        fix:   `Use a ${cpuSock} motherboard or a CPU that fits ${moboSock}.`,
      });
    }
  }

  // 2. Motherboard ↔ RAM type
  if (mobo && ram) {
    const moboRam = mobo.specs?.ddr;
    const ramType = ram.specs?.type;
    if (moboRam && ramType && moboRam !== ramType) {
      issues.push({
        type:  "error",
        parts: ["motherboard", "memory"],
        title: "RAM Type Mismatch",
        detail: `${mobo.name} supports ${moboRam} but ${ram.name} is ${ramType}. These slots are physically incompatible.`,
        fix:   `Switch to ${moboRam} memory or a board that supports ${ramType}.`,
      });
    }
  }

  // 3. PSU wattage vs system draw
  const totalDraw = Object.entries(selections).reduce((sum, [key, partId]) => {
    if (key === "psu" || !partId) return sum;
    const part = getPartById(partId);
    return sum + (part?.watts ?? 0);
  }, 0);
  const needed = Math.round(totalDraw * 1.2);
  if (psu && totalDraw > 0) {
    const psuW = psu.specs?.wattage || psu.watts;
    const pct  = Math.round((needed / psuW) * 100);
    if (needed > psuW) {
      issues.push({
        type:  "error",
        parts: ["psu"],
        title: "PSU Underpowered",
        detail: `System needs ~${needed}W (with 20% headroom) but your PSU only provides ${psuW}W.`,
        fix:   `Upgrade to at least a ${needed > 850 ? "1000W" : needed > 700 ? "850W" : "750W"} PSU.`,
      });
    } else if (pct > 80) {
      warnings.push({
        type:  "warning",
        parts: ["psu"],
        title: "PSU Near Capacity",
        detail: `PSU is at ${pct}% load (${needed}W of ${psuW}W). Little headroom for load spikes.`,
        fix:   "Consider upgrading to the next PSU tier for better stability.",
      });
    }
  }

  // 4. High TDP CPU with no cooler
  if (cpu && !selections.cpu_cooler) {
    const cpuWatts = cpu.watts || cpu.specs?.tdp;
    if (cpuWatts && cpuWatts > 100) {
      warnings.push({
        type:  "warning",
        parts: ["cpu_cooler"],
        title: "Missing Cooler",
        detail: `${cpu.name} has a ${cpuWatts}W TDP. Without a proper cooler it will thermal throttle.`,
        fix:   "Add a high-performance air or AIO liquid cooler.",
      });
    }
  }

  return { issues, warnings };
}

export default function BuilderPage() {
  const location      = useLocation();
  const [searchParams] = useSearchParams();

  const [selections,   setSelections]   = useState({});
  const [openModal,    setOpenModal]     = useState(null);
  const [buildName,    setBuildName]     = useState("My Build");
  const [editingName,  setEditingName]   = useState(false);

  // All parts from database
  const [allParts,     setAllParts]      = useState([]);
  const [loading,      setLoading]       = useState(false);

  // Save build state
  const [isSaving,    setIsSaving]    = useState(false);
  const [saveMessage, setSaveMessage] = useState(null);

  // Auth modal (shown when guest tries to save/rename)
  const [authModal,   setAuthModal]   = useState(false);

  // Modal filter state
  const [mSearch,   setMSearch]   = useState("");
  const [mSort,     setMSort]     = useState("default");
  const [mBrands,   setMBrands]   = useState([]);
  const [mSeries,   setMSeries]   = useState([]);
  const [mPriceMin, setMPriceMin] = useState(null);
  const [mPriceMax, setMPriceMax] = useState(null);

  // Fetch all parts on mount
  useEffect(() => {
    const fetchParts = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/parts");
        setAllParts(response.data);
      } catch (error) {
        console.error("Error fetching parts:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchParts();
  }, []);

  // If ?build=ID is in the URL, fetch that shared build and pre-fill
  useEffect(() => {
    if (allParts.length === 0) return;
    const buildId = searchParams.get("build");
    if (!buildId) return;

    const fetchSharedBuild = async () => {
      try {
        const res = await axios.get(`/profile/build/${buildId}`);
        const { name, parts } = res.data;

        if (name) setBuildName(name);

        // parts is already { cpu: "id", gpu: "id", ... } — apply directly
        const filled = {};
        Object.entries(parts).forEach(([key, id]) => {
          if (id) filled[key] = id;
        });
        if (Object.keys(filled).length > 0) {
          setSelections(filled);
        }
      } catch (err) {
        console.error("Could not load shared build:", err);
        setSaveMessage({ type: "error", text: "This build link is invalid or private." });
        setTimeout(() => setSaveMessage(null), 4000);
      }
    };

    fetchSharedBuild();
  }, [allParts, searchParams]);

  // Pre-populate selections from compatibility page or product page
  useEffect(() => {
    if (allParts.length === 0) return;

    const mappedSelections = {};
    
    // Map compatibility/product page categories to builder categories
    const categoryMap = {
      "cpu": "cpu",
      "gpu": "gpu",
      "motherboard": "motherboard",
      "memory": "memory",
      "storage": "storage_primary",
      "cooler": "cpu_cooler",
      "psu": "psu",
      "case": "case",
    };

    // First, check for temp selections from product page (localStorage)
    const tempSelections = JSON.parse(localStorage.getItem("builderTempSelections") || "{}");
    if (Object.keys(tempSelections).length > 0) {
      Object.assign(mappedSelections, tempSelections);
      // Clear the temporary storage after reading
      localStorage.removeItem("builderTempSelections");
    }

    // Then check for compatibility page selections (location.state)
    if (location.state?.compatibilitySelections) {
      const compatSelections = location.state.compatibilitySelections;
      Object.entries(compatSelections).forEach(([compatKey, partId]) => {
        // Use categoryMap if key needs remapping, otherwise use key directly
        // (profile sends builder-ready keys; compat page sends short keys)
        const builderKey = categoryMap[compatKey] ?? compatKey;
        if (builderKey && partId) {
          mappedSelections[builderKey] = partId;
        }
      });
    }

    // Pre-fill build name if passed (e.g. from profile View button)
    if (location.state?.buildName) {
      setBuildName(location.state.buildName);
    }

    // Apply selections if any exist
    if (Object.keys(mappedSelections).length > 0) {
      setSelections(prev => ({ ...prev, ...mappedSelections }));
    }
  }, [allParts, location]);

  const closeModal = () => {
    setOpenModal(null);
    setMSearch(""); setMSort("default");
    setMBrands([]); setMSeries([]);
    setMPriceMin(null); setMPriceMax(null);
  };

  /* ── Save Build ── */
  const handleSaveBuild = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setAuthModal(true);
      return;
    }

    if (Object.keys(selections).length === 0) {
      setSaveMessage({ type: "error", text: "Please select at least one part first." });
      setTimeout(() => setSaveMessage(null), 3000);
      return;
    }

    try {
      setIsSaving(true);

      const totalPrice = Object.entries(selections).reduce((sum, [key, partId]) => {
        const part = allParts.find(p => p._id === partId);
        return sum + (part?.price ?? 0);
      }, 0);

      const totalWattage = Object.entries(selections).reduce((sum, [key, partId]) => {
        if (key === "psu") return sum;
        const part = allParts.find(p => p._id === partId);
        return sum + (part?.watts ?? 0);
      }, 0);

      const buildData = {
        name: buildName,
        description: `PC Build with ${Object.keys(selections).length} components`,
        parts: selections,
        totalPrice,
        totalWattage,
      };

      await axios.post("/profile/create-build", buildData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSaveMessage({ type: "success", text: "Build saved successfully!" });
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (error) {
      console.error("Error saving build:", error);
      setSaveMessage({ type: "error", text: error.response?.data?.message || "Failed to save build" });
      setTimeout(() => setSaveMessage(null), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  /* ── Share Build ── */
  const handleShare = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setAuthModal(true);
      return;
    }

    if (Object.keys(selections).length === 0) {
      setSaveMessage({ type: "error", text: "Save your build first before sharing." });
      setTimeout(() => setSaveMessage(null), 3000);
      return;
    }

    try {
      // First save the build, then share it
      setIsSaving(true);
      const totalPrice = Object.entries(selections).reduce((sum, [, partId]) => {
        const part = allParts.find(p => p._id === partId);
        return sum + (part?.price ?? 0);
      }, 0);
      const totalWattage = Object.entries(selections).reduce((sum, [key, partId]) => {
        if (key === "psu") return sum;
        const part = allParts.find(p => p._id === partId);
        return sum + (part?.watts ?? 0);
      }, 0);

      const saveRes = await axios.post("/profile/create-build", {
        name: buildName,
        description: `PC Build with ${Object.keys(selections).length} components`,
        parts: selections,
        totalPrice,
        totalWattage,
      }, { headers: { Authorization: `Bearer ${token}` } });

      const buildId = saveRes.data.build._id;

      // Mark as public
      await axios.patch(`/profile/share-build/${buildId}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const url = `${window.location.origin}/builder?build=${buildId}`;
      await navigator.clipboard.writeText(url);
      setSaveMessage({ type: "success", text: "Build saved & link copied!" });
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (err) {
      console.error("Share error:", err);
      setSaveMessage({ type: "error", text: "Failed to share build." });
      setTimeout(() => setSaveMessage(null), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  const select = (catKey, partId) => {
    setSelections((prev) => ({ ...prev, [catKey]: partId }));
    closeModal();
  };

  const remove = (catKey) => {
    setSelections((prev) => { const n = { ...prev }; delete n[catKey]; return n; });
  };

  /* ── Get parts for current category ── */
  const getCategoryParts = (catKey) => {
    const dbCategory = CATEGORY_MAP[catKey];
    return allParts.filter(p => p.category === dbCategory);
  };

  /* ── Wattage ── */
  const estimatedWattage = Object.entries(selections).reduce((sum, [key, partId]) => {
    if (key === "psu" || !partId) return sum;
    const part = allParts.find(p => p._id === partId);
    return sum + (part?.watts ?? 0);
  }, 0);
  const systemWattage  = Math.round(estimatedWattage * 1.2);
  const selectedPsu    = selections.psu ? allParts.find(p => p._id === selections.psu) : null;
  const psuwatts       = selectedPsu ? (selectedPsu.specs?.wattage || selectedPsu.watts) : 0;
  const wattagePercent = psuwatts > 0 ? Math.min(100, Math.round((systemWattage / psuwatts) * 100)) : 0;
  const wattageColor   = wattagePercent > 90 ? "#ef4444" : wattagePercent > 70 ? "#f59e0b" : "#4ade80";

  /* ── Price ── */
  const totalPrice = Object.entries(selections).reduce((sum, [key, partId]) => {
    if (!partId) return sum;
    const part = allParts.find(p => p._id === partId);
    return sum + (part?.price ?? 0);
  }, 0);
  const partsCount = Object.keys(selections).length;

  /* ── Compatibility ── */
  const { issues, warnings } = checkCompatibility(selections, allParts);
  const allIssues     = [...issues, ...warnings];
  const conflictParts = new Set(allIssues.flatMap(i => i.parts));

  /* ── Modal data ── */
  const rawParts    = openModal ? getCategoryParts(openModal) : [];
  
  // Helper functions for filtering
  const getBrand = (part) => part.brand;
  const getSeries = (part) => part.series || null;

  const allPrices   = rawParts.map(p => p.price ?? 0);
  const globalMin   = rawParts.length ? Math.min(...allPrices) : 0;
  const globalMax   = rawParts.length ? Math.max(...allPrices) : 999;
  const priceMin    = mPriceMin ?? globalMin;
  const priceMax    = mPriceMax ?? globalMax;

  const availBrands = [...new Set(rawParts.map(p => getBrand(p)).filter(Boolean))];
  const availSeries = [...new Set(rawParts.map(p => getSeries(p)).filter(Boolean))];

  const toggleBrand  = (b) => setMBrands(prev => prev.includes(b) ? prev.filter(x=>x!==b) : [...prev, b]);
  const toggleSeries = (s) => setMSeries(prev => prev.includes(s) ? prev.filter(x=>x!==s) : [...prev, s]);

  const filteredParts = rawParts
    .filter(p => p.name.toLowerCase().includes(mSearch.toLowerCase()) || p.brand.toLowerCase().includes(mSearch.toLowerCase()))
    .filter(p => mBrands.length  === 0 || mBrands.includes(getBrand(p)))
    .filter(p => mSeries.length  === 0 || mSeries.includes(getSeries(p)))
    .filter(p => { const pr = p.price ?? 0; return pr >= priceMin && pr <= priceMax; })
    .sort((a, b) => {
      const pa = a.price ?? 0, pb = b.price ?? 0;
      if (mSort === "price-asc")  return pa - pb;
      if (mSort === "price-desc") return pb - pa;
      return 0;
    });

  const hasFilters = mSearch || mSort !== "default" || mBrands.length || mSeries.length || mPriceMin !== null || mPriceMax !== null;
  const clearFilters = () => { setMSearch(""); setMSort("default"); setMBrands([]); setMSeries([]); setMPriceMin(null); setMPriceMax(null); };

  return (
    <>
      <div className="builder-page">

        {/* ── PAGE HEADER ── */}
        <div className="builder-header">
          <div>
            <div className="builder-eyebrow">PC Part Picker</div>
            <div className="builder-name-row">
              {editingName ? (
                <input
                  className="builder-name"
                  value={buildName}
                  onChange={(e) => setBuildName(e.target.value)}
                  onBlur={() => setEditingName(false)}
                  onKeyDown={(e) => e.key === "Enter" && setEditingName(false)}
                  autoFocus
                />
              ) : (
                <h1 className="builder-name" style={{ cursor: "default" }}>{buildName}</h1>
              )}
              <button className="edit-name-btn" onClick={() => {
                const token = localStorage.getItem("token");
                if (!token) { setAuthModal(true); return; }
                setEditingName(true);
              }}>✏️ Rename</button>
            </div>
          </div>
          <div className="builder-actions">
            <button className="btn-share" onClick={handleShare} disabled={isSaving}>🔗 Share</button>
            <button className="btn-save" onClick={handleSaveBuild} disabled={isSaving}>
              {isSaving ? "💾 Saving..." : "💾 Save Build"}
            </button>
          </div>
        </div>

        <div className="builder-layout">

          {/* ── PARTS TABLE ── */}
          <div className="parts-table">
            <div className="parts-table-head">
              <div>Component</div>
              <div>Selection</div>
              <div>Price</div>
              <div></div>
            </div>

            {UI_CATEGORIES.map((cat) => {
              const chosenPartId = selections[cat.key];
              const chosenPart   = chosenPartId ? allParts.find(p => p._id === chosenPartId) : null;
              const price        = chosenPart?.price ?? null;
              return (
                <div
                  key={cat.key}
                  className={`part-row ${!chosenPartId ? "empty" : ""} ${
                    conflictParts.has(cat.key)
                      ? issues.some(i => i.parts.includes(cat.key)) ? "compat-error"
                      : warnings.some(i => i.parts.includes(cat.key)) ? "compat-warn"
                      : ""
                    : ""
                  }`}
                  onClick={!chosenPartId ? () => setOpenModal(cat.key) : undefined}
                >
                  <div className="part-cat">
                    <div className="part-cat-icon">{cat.icon}</div>
                    <div>
                      <div className="part-cat-label">{cat.label}</div>
                      <div className="part-cat-desc">{cat.desc}</div>
                    </div>
                  </div>

                  <div className="part-name-cell">
                    {chosenPartId ? (
                      <div className="part-chosen-wrap">
                        <span className="part-chosen-name">{chosenPart?.name}</span>
                        {(() => {
                          const issue = allIssues.find(i => i.parts.includes(cat.key));
                          if (!issue) return null;
                          return (
                            <span className={`part-compat-badge ${issue.type}`}>
                              {issue.type === "error" ? "❌" : "⚠️"} {issue.title}
                            </span>
                          );
                        })()}
                        <button className="part-change-link"
                          onClick={(e) => { e.stopPropagation(); setOpenModal(cat.key); }}>
                          Change part →
                        </button>
                      </div>
                    ) : (
                      <button className="part-choose-btn"
                        onClick={(e) => { e.stopPropagation(); setOpenModal(cat.key); }}>
                        + Choose {cat.label}
                      </button>
                    )}
                  </div>

                  <div className={`part-price ${!price ? "empty" : ""}`}>
                    {price != null ? `₹${price}` : "—"}
                  </div>

                  <div>
                    {chosenPartId && (
                      <button className="part-remove" title="Remove"
                        onClick={(e) => { e.stopPropagation(); remove(cat.key); }}>✕</button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── SIDEBAR CARDS ── */}
          <div className="builder-sidebar">

            <div className="sidebar-card">
              <div className="sidebar-card-title">Build Progress</div>
              <div className="parts-progress">
                {UI_CATEGORIES.map((cat) => (
                  <div key={cat.key} className={`progress-dot ${selections[cat.key] ? "filled" : ""}`} title={cat.label} />
                ))}
              </div>
              <div className="parts-count-text">
                <strong>{partsCount}</strong> of <strong>{UI_CATEGORIES.length}</strong> parts selected
              </div>
            </div>

            <div className="sidebar-card">
              <div className="sidebar-card-title">Price Summary</div>
              <div className="price-total-value">₹{totalPrice.toLocaleString()}</div>
              <div className="price-total-label">Estimated total</div>
              {partsCount > 0 && (
                <div className="price-breakdown">
                  {UI_CATEGORIES.filter((c) => selections[c.key]).map((cat) => {
                    const part = allParts.find(p => p._id === selections[cat.key]);
                    return (
                      <div className="price-row" key={cat.key}>
                        <span>{cat.icon} {cat.label}</span>
                        <span>₹{part?.price ?? "—"}</span>
                      </div>
                    );
                  })}
                  <div className="price-divider" />
                  <div className="price-total-row"><span>Total</span><span>₹{totalPrice.toLocaleString()}</span></div>
                </div>
              )}
            </div>

            <div className="sidebar-card">
              <div className="sidebar-card-title">Power Estimate</div>
              <div className="wattage-number">{systemWattage} <span className="wattage-unit">W</span></div>
              <div className="wattage-sub">Required (incl. 20% headroom)</div>
              {selections.psu && (
                <>
                  <div className="wattage-bar-wrap">
                    <div className="wattage-bar-fill" style={{ width: `${wattagePercent}%`, background: wattageColor }} />
                  </div>
                  <div className="wattage-psu-row">
                    <span>{wattagePercent}% of PSU capacity</span>
                    <span>{psuwatts}W PSU</span>
                  </div>
                  <div className={`wattage-warning ${wattagePercent > 90 ? "danger" : wattagePercent > 70 ? "caution" : "good"}`}>
                    {wattagePercent > 90 ? "⚠️ PSU may be underpowered!" : wattagePercent > 70 ? "⚡ Getting close to limit" : "✅ PSU headroom looks good"}
                  </div>
                </>
              )}
              {!selections.psu && partsCount > 0 && (
                <div className="tip-box">💡 Add a PSU to see utilisation %</div>
              )}
              {estimatedWattage > 0 && (
                <div className="wattage-breakdown">
                  {UI_CATEGORIES.filter((c) => c.key !== "psu" && selections[c.key]).map((cat) => {
                    const part = allParts.find(p => p._id === selections[cat.key]);
                    const watts = part?.watts;
                    if (!watts) return null;
                    return (
                      <div className="wattage-breakdown-row" key={cat.key}>
                        <span>{cat.icon} {cat.label}</span>
                        <span>{watts}W</span>
                      </div>
                    );
                  })}
                  <div style={{ height: 1, background: "var(--sky)", margin: "4px 0" }} />
                  <div className="wattage-breakdown-row" style={{ fontWeight: 600 }}>
                    <span>Base draw</span><span style={{ color: "var(--navy)" }}>{estimatedWattage}W</span>
                  </div>
                  <div className="wattage-breakdown-row">
                    <span>+ 20% headroom</span><span style={{ color: "var(--navy)" }}>{systemWattage}W needed</span>
                  </div>
                </div>
              )}
            </div>

            {/* ── COMPATIBILITY CARD ── */}
            {allIssues.length > 0 && (
              <div className="sidebar-card compat-card">
                <div className="sidebar-card-title">
                  {issues.length > 0 ? "❌ Compatibility Issues" : "⚠️ Warnings"}
                </div>
                <div className="compat-issues-list">
                  {allIssues.map((issue, i) => (
                    <div key={i} className={`compat-issue compat-issue-${issue.type}`}>
                      <div className="compat-issue-title">
                        {issue.type === "error" ? "❌" : "⚠️"} {issue.title}
                      </div>
                      <div className="compat-issue-detail">{issue.detail}</div>
                      <div className="compat-issue-fix">💡 {issue.fix}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {partsCount >= 2 && allIssues.length === 0 && (
              <div className="sidebar-card">
                <div className="compat-all-good">
                  <span className="compat-good-icon">✅</span>
                  <div>
                    <div className="compat-good-title">All parts compatible</div>
                    <div className="compat-good-sub">No conflicts detected</div>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* ── MODAL ── */}
      {openModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-wide" onClick={(e) => e.stopPropagation()}>

            {/* Header */}
            <div className="modal-header">
              <div className="modal-title">
                {UI_CATEGORIES.find((c) => c.key === openModal)?.icon}&nbsp;
                Choose {UI_CATEGORIES.find((c) => c.key === openModal)?.label}
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                {hasFilters && (
                  <button className="modal-clear-btn" onClick={clearFilters}>Reset filters</button>
                )}
                <button className="modal-close" onClick={closeModal}>✕</button>
              </div>
            </div>

            {/* Body = sidebar + list */}
            <div className="modal-body-layout">

              {/* ── FILTER SIDEBAR ── */}
              <div className="modal-filter-sidebar">

                {/* Search */}
                <div className="mfs-block">
                  <input
                    className="mfs-search"
                    placeholder="Search…"
                    value={mSearch}
                    onChange={(e) => setMSearch(e.target.value)}
                    autoFocus
                  />
                </div>

                {/* Sort */}
                <div className="mfs-block">
                  <div className="mfs-label">Sort by</div>
                  <div className="mfs-sort-list">
                    {[["default","Default"],["price-asc","Price: Low → High"],["price-desc","Price: High → Low"]].map(([val, label]) => (
                      <button key={val} className={`mfs-sort-btn ${mSort === val ? "on" : ""}`} onClick={() => setMSort(val)}>
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Brand filter */}
                {availBrands.length > 1 && (
                  <div className="mfs-block">
                    <div className="mfs-label">Brand</div>
                    <div className="mfs-check-list">
                      {availBrands.map(b => (
                        <div key={b} className="mfs-check-row" onClick={() => toggleBrand(b)}>
                          <div className={`mfs-check-box ${mBrands.includes(b) ? "on" : ""}`}>
                            {mBrands.includes(b) && "✓"}
                          </div>
                          <span className="mfs-check-label">{b}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Series filter */}
                {availSeries.length > 1 && (
                  <div className="mfs-block">
                    <div className="mfs-label">Series</div>
                    <div className="mfs-check-list">
                      {availSeries.map(s => (
                        <div key={s} className="mfs-check-row" onClick={() => toggleSeries(s)}>
                          <div className={`mfs-check-box ${mSeries.includes(s) ? "on" : ""}`}>
                            {mSeries.includes(s) && "✓"}
                          </div>
                          <span className="mfs-check-label">{s}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Price range */}
                <div className="mfs-block">
                  <div className="mfs-label">Price Range</div>
                  <div className="mfs-price-vals">
                    <span>${priceMin}</span><span>₹{priceMax}</span>
                  </div>
                  <div className="mfs-range-track">
                    <div className="mfs-range-fill" style={{
                      left:  `${((priceMin - globalMin) / (globalMax - globalMin || 1)) * 100}%`,
                      right: `${100 - ((priceMax - globalMin) / (globalMax - globalMin || 1)) * 100}%`,
                    }} />
                    <input type="range" className="mfs-range-input"
                      min={globalMin} max={globalMax} step={5} value={priceMin}
                      onChange={(e) => { const v = +e.target.value; if (v < priceMax - 20) setMPriceMin(v); }}
                    />
                    <input type="range" className="mfs-range-input"
                      min={globalMin} max={globalMax} step={5} value={priceMax}
                      onChange={(e) => { const v = +e.target.value; if (v > priceMin + 20) setMPriceMax(v); }}
                    />
                  </div>
                </div>

              </div>
              <div className="modal-product-list">
                <div className="modal-list-count">
                  {filteredParts.length} product{filteredParts.length !== 1 ? "s" : ""}
                </div>

                {filteredParts.length === 0 ? (
                  <div className="modal-no-results">
                    <div style={{ fontSize: "2rem", marginBottom: 10 }}>🔍</div>
                    No products match your filters
                    <button className="modal-clear-btn" style={{ display:"block", margin:"12px auto 0" }} onClick={clearFilters}>
                      Clear filters
                    </button>
                  </div>
                ) : (
                  filteredParts.map((part) => {
                    const watts = part.watts;
                    const price = part.price;
                    const isSel = selections[openModal] === part._id;
                    const brand = part.brand;
                    const serie = part.series;
                    return (
                      <div key={part._id} className={`modal-option ${isSel ? "selected" : ""}`} onClick={() => select(openModal, part._id)}>
                        <div className="modal-option-info">
                          <div className="modal-option-top">
                            {brand && <span className="modal-brand-pill">{brand}</span>}
                            {serie && <span className="modal-series-pill">{serie}</span>}
                          </div>
                          <div className="modal-option-name">{part.name}</div>
                          <div className="modal-option-meta">
                            {openModal === "psu" ? `${part.specs?.wattage || part.watts}W · ATX` : watts != null ? `~${watts}W TDP` : ""}
                          </div>
                        </div>
                        <div className="modal-option-right">
                          {price != null && <div className="modal-option-price">₹{price}</div>}
                          {watts != null && <div className="modal-option-watts">{watts}W</div>}
                          {isSel && <span className="selected-badge">✓ Selected</span>}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ── Save Message Toast ── */}
      {saveMessage && (
        <div style={{
          position: "fixed",
          top: "20px",
          right: "20px",
          padding: "16px 20px",
          borderRadius: "8px",
          background: saveMessage.type === "success" ? "#dcfce7" : "#fee2e2",
          color: saveMessage.type === "success" ? "#166534" : "#991b1b",
          border: `1.5px solid ${saveMessage.type === "success" ? "#86efac" : "#fca5a5"}`,
          zIndex: 1000,
          fontWeight: "600",
          maxWidth: "300px",
          animation: "slideIn 0.3s ease",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
        }}>
          {saveMessage.type === "success" ? "✅" : "❌"} {saveMessage.text}
        </div>
      )}

      {/* ── Auth Modal ── */}
      {authModal && (
        <div style={{
          position: "fixed", inset: 0,
          background: "rgba(47,65,86,0.55)", backdropFilter: "blur(5px)",
          zIndex: 600, display: "flex", alignItems: "center", justifyContent: "center",
          padding: 24,
        }} onClick={() => setAuthModal(false)}>
          <div style={{
            background: "#fff", borderRadius: 18, border: "1.5px solid #C8D9E6",
            width: "100%", maxWidth: 400, overflow: "hidden",
            boxShadow: "0 32px 80px rgba(47,65,86,0.22)",
            animation: "slideIn 0.25s ease",
          }} onClick={e => e.stopPropagation()}>

            {/* Header */}
            <div style={{ background: "#2F4156", padding: "22px 24px 18px", position: "relative" }}>
              <div style={{ fontSize: "2rem", marginBottom: 8 }}>🔒</div>
              <div style={{ fontFamily: "Syne, sans-serif", fontSize: "1.2rem", fontWeight: 800, color: "#fff", letterSpacing: "-0.3px" }}>
                Login Required
              </div>
              <div style={{ fontSize: "0.8rem", color: "rgba(200,217,230,0.6)", marginTop: 4 }}>
                You need an account to save or share builds
              </div>
              <button onClick={() => setAuthModal(false)} style={{
                position: "absolute", top: 16, right: 16,
                background: "rgba(200,217,230,0.1)", border: "1px solid rgba(200,217,230,0.15)",
                color: "rgba(200,217,230,0.7)", borderRadius: 8,
                width: 30, height: 30, cursor: "pointer", fontSize: "0.85rem",
              }}>✕</button>
            </div>

            {/* Body */}
            <div style={{ padding: "20px 24px 24px" }}>
              <p style={{ fontSize: "0.85rem", color: "#5D7C8D", marginBottom: 20, lineHeight: 1.6 }}>
                Create a free account to save your builds, share them with others, and access them from anywhere.
              </p>
              <div style={{ display: "flex", gap: 10 }}>
                <a href="/login" style={{
                  flex: 1, background: "#2F4156", color: "#fff",
                  borderRadius: 10, padding: "12px 0", fontWeight: 700,
                  fontSize: "0.875rem", textAlign: "center", textDecoration: "none",
                  transition: "background 0.15s",
                }}>
                  Login
                </a>
                <a href="/register" style={{
                  flex: 1, background: "#F5EFEB", color: "#2F4156",
                  border: "1.5px solid #C8D9E6", borderRadius: 10, padding: "12px 0",
                  fontWeight: 600, fontSize: "0.875rem", textAlign: "center",
                  textDecoration: "none",
                }}>
                  Create Account
                </a>
              </div>
            </div>

          </div>
        </div>
      )}

      <style>{`
        @keyframes slideIn {
          from { transform: translateX(400px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </>
  );
}
