import { useState, useMemo, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "../../api/axios";
import "./css/compatibility.css";

// Category mapping from UI keys to database categories
const CATEGORY_MAP = {
  cpu: "CPU",
  gpu: "GPU",
  motherboard: "Motherboard",
  memory: "Memory",
  storage: "Storage",
  cooler: "CPU Cooler",
  psu: "PSU",
  case: "Case",
};

const CATEGORIES = [
  { key: "cpu",         label: "CPU",         icon: "🧠", desc: "Processor" },
  { key: "motherboard", label: "Motherboard", icon: "🟩", desc: "Main board" },
  { key: "memory",      label: "Memory",      icon: "💾", desc: "RAM" },
  { key: "gpu",         label: "GPU",         icon: "🎮", desc: "Graphics card" },
  { key: "storage",     label: "Storage",     icon: "💿", desc: "SSD / HDD" },
  { key: "cooler",      label: "CPU Cooler",  icon: "❄️", desc: "Cooling solution" },
  { key: "psu",         label: "PSU",         icon: "⚡", desc: "Power supply" },
  { key: "case",        label: "Case",        icon: "🏠", desc: "PC chassis" },
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
  if (cpu && !selections.cooler) {
    const cpuWatts = cpu.watts || cpu.specs?.tdp;
    if (cpuWatts && cpuWatts > 100) {
      warnings.push({
        type:  "warning",
        parts: ["cooler"],
        title: "Missing Cooler",
        detail: `${cpu.name} has a ${cpuWatts}W TDP. Without a proper cooler it will thermal throttle.`,
        fix:   "Add a high-performance air or AIO liquid cooler.",
      });
    }
  }

  return { issues, warnings, totalDraw, systemWatts: needed };
}

/* ─────────────────────────────────────────────
   PART PICKER MODAL
───────────────────────────────────────────── */
function PickerModal({ catKey, onSelect, onClose, current, allParts }) {
  const [search, setSearch] = useState("");
  const dbCategory = CATEGORY_MAP[catKey];
  const parts = allParts.filter(p => p.category === dbCategory);
  const filtered = parts.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="cp-modal-overlay" onClick={onClose}>
      <div className="cp-modal" onClick={e => e.stopPropagation()}>
        <div className="cp-modal-header">
          <div className="cp-modal-title">
            {CATEGORIES.find(c => c.key === catKey)?.icon}&nbsp;
            Choose {CATEGORIES.find(c => c.key === catKey)?.label}
          </div>
          <button className="cp-modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="cp-modal-search-wrap">
          <span className="cp-modal-search-icon">🔍</span>
          <input
            className="cp-modal-search"
            placeholder="Search parts..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            autoFocus
          />
        </div>

        <div className="cp-modal-list">
          {filtered.length === 0 ? (
            <div className="cp-modal-empty">No parts match "{search}"</div>
          ) : filtered.map(part => {
            const isCurrent = current?._id === part._id;
            return (
              <div
                key={part._id}
                className={`cp-modal-option ${isCurrent ? "selected" : ""}`}
                onClick={() => { onSelect(catKey, part); onClose(); }}
              >
                <div className="cp-modal-option-info">
                  <div className="cp-modal-option-name">{part.name}</div>
                  <div className="cp-modal-option-meta">
                    {part.specs?.socket   && `Socket ${part.specs.socket} · `}
                    {part.specs?.ddr  && `${part.specs.ddr} · `}
                    {part.specs?.wattage ? `${part.specs.wattage}W` : part.watts ? `${part.watts}W TDP` : ""}
                  </div>
                </div>
                {isCurrent && <span className="cp-selected-badge">✓ Selected</span>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────── */
export default function CompatibilityPage() {
  const [selections, setSelections] = useState({});
  const [openModal,  setOpenModal]  = useState(null);
  const [allParts,   setAllParts]   = useState([]);
  const [loading,    setLoading]    = useState(false);

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

  const select = (catKey, part) => {
    setSelections(prev => ({ ...prev, [catKey]: part._id }));
    setOpenModal(null);
  };

  const remove = (catKey) => {
    setSelections(prev => { const n = { ...prev }; delete n[catKey]; return n; });
  };

  // Get selected part objects for display/compatibility
  const getSelectedParts = () => {
    const result = {};
    Object.entries(selections).forEach(([key, partId]) => {
      const part = allParts.find(p => p._id === partId);
      if (part) result[key] = part;
    });
    return result;
  };

  const selectedParts = getSelectedParts();
  const partsCount  = Object.keys(selections).length;
  const { issues, warnings, totalDraw, systemWatts } = useMemo(
    () => checkCompatibility(selections, allParts),
    [selections, allParts]
  );

  const allIssues     = [...issues, ...warnings];
  const conflictParts = new Set(allIssues.flatMap(i => i.parts));
  const isAllGood     = partsCount >= 2 && allIssues.length === 0;

  return (
    <>

      <div className="cp-page">

        {/* ── HERO ── */}
        <div className="cp-hero">
          <div className="cp-hero-inner">
            <div className="cp-hero-eyebrow">Real-time · Instant results</div>
            <h1 className="cp-hero-title">
              Compatibility <em>Checker</em>
            </h1>
            <p className="cp-hero-desc">
              Pick your parts below. We'll instantly check for socket mismatches,
              RAM type conflicts, and whether your PSU can handle the load.
            </p>
          </div>
        </div>

        {/* ── LOADING ── */}
        {loading && (
          <div style={{ maxWidth: "1100px", margin: "36px auto", padding: "32px", textAlign: "center", color: "#5D7C8D" }}>
            Loading parts from database...
          </div>
        )}

        {/* ── BODY ── */}
        {!loading && (
        <div className="cp-body">

          {/* ── PARTS TABLE ── */}
          <div>
            <div className="cp-table">
              <div className="cp-table-head">
                <div>Component</div>
                <div>Selected Part</div>
                <div></div>
              </div>

              {CATEGORIES.map(cat => {
                const partId    = selections[cat.key];
                const part      = partId ? allParts.find(p => p._id === partId) : null;
                const isError  = conflictParts.has(cat.key) && issues.some(i => i.parts.includes(cat.key));
                const isWarn   = conflictParts.has(cat.key) && warnings.some(i => i.parts.includes(cat.key));
                const rowClass = isError ? "conflict" : isWarn ? "warn" : "";
                const dotClass = isError ? "error" : isWarn ? "warning" : part ? "ok" : "";

                return (
                  <div key={cat.key} className={`cp-row ${rowClass}`}>

                    {/* Category */}
                    <div className="cp-row-cat">
                      <div className="cp-row-icon">{cat.icon}</div>
                      <div>
                        <div className="cp-row-cat-label">{cat.label}</div>
                        <div className="cp-row-cat-desc">{cat.desc}</div>
                      </div>
                    </div>

                    {/* Part */}
                    <div className="cp-row-part">
                      {part ? (
                        <div className="cp-part-chosen">
                          <span className="cp-part-name">{part.name}</span>
                          <span className="cp-part-meta">
                            {part.specs?.socket  && `${part.specs.socket} · `}
                            {part.specs?.ddr && `${part.specs.ddr} · `}
                            {part.specs?.wattage ? `${part.specs.wattage}W` : part.watts ? `${part.watts}W TDP` : ""}
                          </span>
                          <button
                            className="cp-part-change"
                            onClick={() => setOpenModal(cat.key)}
                          >
                            Change →
                          </button>
                        </div>
                      ) : (
                        <button className="cp-choose-btn" onClick={() => setOpenModal(cat.key)}>
                          + Choose {cat.label}
                        </button>
                      )}
                    </div>

                    {/* Status dot / remove */}
                    <div className="cp-row-status">
                      {part ? (
                        <button
                          className="cp-remove-btn"
                          onClick={() => remove(cat.key)}
                          title="Remove"
                        >
                          ✕
                        </button>
                      ) : (
                        <div className={`cp-status-dot ${dotClass}`} />
                      )}
                    </div>

                  </div>
                );
              })}
            </div>
          </div>

          {/* ── SIDEBAR ── */}
          <aside className="cp-sidebar">

            {/* Overall status */}
            <div className="cp-card">
              <div className="cp-card-head">Compatibility Status</div>
              <div className="cp-card-body">
                <div className="cp-status-card-inner">

                  {/* Overall badge */}
                  <div className={`cp-overall-status ${
                    partsCount < 2     ? "idle"
                    : issues.length    ? "bad"
                    : warnings.length  ? "warning"
                    : "good"
                  }`}>
                    <span className="cp-overall-icon">
                      {partsCount < 2 ? "🔧"
                        : issues.length   ? "❌"
                        : warnings.length ? "⚠️"
                        : "✅"}
                    </span>
                    <div>
                      <div className="cp-overall-title">
                        {partsCount < 2     ? "Add parts to check"
                          : issues.length   ? `${issues.length} conflict${issues.length > 1 ? "s" : ""} found`
                          : warnings.length ? `${warnings.length} warning${warnings.length > 1 ? "s" : ""}`
                          : "All parts compatible!"}
                      </div>
                      <div className="cp-overall-sub">
                        {partsCount < 2
                          ? "Select at least 2 parts"
                          : `${partsCount} of 8 parts selected`}
                      </div>
                    </div>
                  </div>

                  {/* Issues list */}
                  {allIssues.length > 0 && (
                    <div className="cp-issues-list">
                      {allIssues.map((issue, i) => (
                        <div key={i} className={`cp-issue ${issue.type}`}>
                          <div className="cp-issue-head">
                            {issue.type === "error" ? "❌" : "⚠️"} {issue.title}
                          </div>
                          <div className="cp-issue-body">
                            <div className="cp-issue-detail">{issue.detail}</div>
                            <div className="cp-issue-fix">
                              <span className="cp-issue-fix-icon">💡</span>
                              {issue.fix}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* All good message */}
                  {isAllGood && (
                    <div style={{ fontSize: "0.78rem", color: "#15803d", lineHeight: 1.6, background: "#dcfce7", padding: "10px 12px", borderRadius: 8 }}>
                      🎉 No conflicts detected. Your selected parts should work together.
                    </div>
                  )}

                </div>
              </div>
            </div>

            {/* Power estimate */}
            {totalDraw > 0 && (
              <div className="cp-card">
                <div className="cp-card-head">Power Estimate</div>
                <div className="cp-card-body">
                  <div className="cp-power-val">
                    {systemWatts} <span className="cp-power-unit">W</span>
                  </div>
                  <div className="cp-power-label">Required (incl. 20% headroom)</div>

                  {selections.psu && (
                    <>
                      {(() => {
                        const psuPart = allParts.find(p => p._id === selections.psu);
                        const psuWatts = psuPart?.specs?.wattage || psuPart?.watts;
                        const pct   = psuWatts ? Math.min(100, Math.round((systemWatts / psuWatts) * 100)) : 0;
                        const color = pct > 90 ? "#ef4444" : pct > 80 ? "#f59e0b" : "#22c55e";
                        return (
                          <>
                            <div className="cp-power-bar-wrap">
                              <div className="cp-power-bar-fill" style={{ width: `${pct}%`, background: color }} />
                            </div>
                            <div className="cp-power-bar-info">
                              <span>{pct}% of PSU</span>
                              <span>{psuWatts}W PSU</span>
                            </div>
                          </>
                        );
                      })()}
                    </>
                  )}

                  {!selections.psu && (
                    <div style={{ fontSize: "0.72rem", color: "var(--teal)", marginTop: 8, padding: "8px 10px", background: "var(--beige)", borderRadius: 7, border: "1px solid var(--sky)" }}>
                      💡 Add a PSU to see utilisation %
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="cp-card">
              <div className="cp-card-head">Actions</div>
              <div className="cp-card-body" style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <button
                  className="cp-reset-btn"
                  onClick={() => setSelections({})}
                  disabled={partsCount === 0}
                >
                  🗑 Reset all parts
                </button>
                <Link to="/builder" state={{ compatibilitySelections: selections }} className="cp-builder-btn">
                  ⚡ Open in Builder
                </Link>
              </div>
            </div>

          </aside>
        </div>
        )}
      </div>

      {/* ── PICKER MODAL ── */}
      {openModal && (
        <PickerModal
          catKey={openModal}
          onSelect={select}
          onClose={() => setOpenModal(null)}
          current={selections[openModal] ? allParts.find(p => p._id === selections[openModal]) : null}
          allParts={allParts}
        />
      )}
    </>
  );
}
