import { useState, useEffect } from "react";
import axios from "../../api/axios";
import "./css/adminPrebuildsManager.css";

const TIER_OPTIONS     = ["Entry", "Mid", "High"];
const CATEGORY_OPTIONS = ["Gaming", "Workstation", "Streaming", "Budget"];
const PART_COMPONENTS  = [
  { key: "cpu",               label: "CPU",                emoji: "🧠" },
  { key: "gpu",               label: "GPU",                emoji: "🎮" },
  { key: "motherboard",       label: "Motherboard",        emoji: "🔌" },
  { key: "memory",            label: "Memory",             emoji: "💾" },
  { key: "storage_primary",   label: "Storage (Primary)",  emoji: "💿" },
  { key: "storage_secondary", label: "Storage (Secondary)",emoji: "💿" },
  { key: "cpu_cooler",        label: "CPU Cooler",         emoji: "❄️" },
  { key: "psu",               label: "PSU",                emoji: "⚡" },
  { key: "case",              label: "Case",               emoji: "📦" },
];

const TIER_BADGE = { Entry: "admin-badge-blue", Mid: "admin-badge-yellow", High: "admin-badge-red" };
const CAT_BADGE  = { Gaming: "admin-badge-blue", Workstation: "admin-badge-green", Streaming: "admin-badge-red", Budget: "admin-badge-gray" };

const EMPTY_FORM = {
  name: "", category: "Gaming", tier: "Entry", tierClass: "entry",
  price: "", emoji: "🖥️", tagline: "", accentColor: "#3b82f6",
  tags: [], pros: [],
  perfTargets: [{ label: "", value: "" }, { label: "", value: "" }, { label: "", value: "" }],
  parts: {}
};

export default function AdminPrebuildsManager() {
  const [prebuilds,    setPrebuilds]    = useState([]);
  const [parts,        setParts]        = useState({});
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState(null);
  const [filterCat,    setFilterCat]    = useState("All");
  const [search,       setSearch]       = useState("");
  const [modal,        setModal]        = useState(null);
  const [editTarget,   setEditTarget]   = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [viewTarget,   setViewTarget]   = useState(null);
  const [form,         setForm]         = useState(EMPTY_FORM);
  const [toast,        setToast]        = useState(null);

  useEffect(() => { Promise.all([fetchPrebuilds(), fetchParts()]); }, []);

  const fetchPrebuilds = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get("/admin/prebuilds", { headers: { Authorization: `Bearer ${token}` } });
      setPrebuilds((res.data || []).filter(Boolean));
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load prebuilds");
      setPrebuilds([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchParts = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("/parts", { headers: { Authorization: `Bearer ${token}` } });
      const categoryMap = { cpu:"CPU", gpu:"GPU", motherboard:"Motherboard", memory:"Memory", storage_primary:"Storage", storage_secondary:"Storage", cpu_cooler:"CPU Cooler", psu:"PSU", case:"Case" };
      const partsByType = {};
      PART_COMPONENTS.forEach(comp => {
        partsByType[comp.key] = res.data.filter(p => p.category === categoryMap[comp.key]) || [];
      });
      setParts(partsByType);
    } catch (err) { console.error("Failed to load parts", err); }
  };

  const showToast = (type, msg) => { setToast({ type, msg }); setTimeout(() => setToast(null), 3500); };

  const filtered = prebuilds.filter(p => p &&
    (filterCat === "All" || p.category === filterCat) &&
    p.name?.toLowerCase().includes(search.toLowerCase())
  );

  const openAdd  = () => { setForm(EMPTY_FORM); setModal("add"); };
  const openEdit = (pb) => {
    setEditTarget(pb);
    const partIds = {};
    if (pb.parts) {
      Object.entries(pb.parts).forEach(([key, val]) => {
        partIds[key] = val && typeof val === "object" ? val._id : val;
      });
    }
    setForm({ ...pb, parts: partIds, perfTargets: pb.perfTargets?.length ? pb.perfTargets : EMPTY_FORM.perfTargets });
    setModal("edit");
  };
  const openDel  = (pb) => { setDeleteTarget(pb); setModal("delete"); };
  const openView = (pb) => { setViewTarget(pb); setModal("view"); };
  const close    = () => { setModal(null); setEditTarget(null); setDeleteTarget(null); setViewTarget(null); };

  const handleSave = async () => {
    if (!form.name.trim()) return;
    try {
      const token = localStorage.getItem("token");
      if (modal === "add") {
        await axios.post("/admin/prebuilds", form, { headers: { Authorization: `Bearer ${token}` } });
        showToast("success", "Template added successfully!");
      } else {
        await axios.put(`/admin/prebuilds/${editTarget._id}`, form, { headers: { Authorization: `Bearer ${token}` } });
        showToast("success", "Template updated successfully!");
      }
      await fetchPrebuilds();
      close();
    } catch (err) { showToast("error", err.response?.data?.message || "Failed to save template"); }
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`/admin/prebuilds/${deleteTarget._id}`, { headers: { Authorization: `Bearer ${token}` } });
      showToast("success", "Template deleted!");
      await fetchPrebuilds();
      close();
    } catch (err) { showToast("error", err.response?.data?.message || "Failed to delete template"); }
  };

  const upd     = (field)   => (e) => setForm(f => ({ ...f, [field]: e.target.value }));
  const updPart = (partKey) => (e) => setForm(f => ({ ...f, parts: { ...f.parts, [partKey]: e.target.value } }));
  const updPerf = (i, key)  => (e) => setForm(f => {
    const pts = [...(f.perfTargets || [{},{},{}])];
    pts[i] = { ...pts[i], [key]: e.target.value };
    return { ...f, perfTargets: pts };
  });

  const totalBuilds   = prebuilds.reduce((s, p) => s + (p?.builds || 0), 0);
  const getPartName   = (partId) => {
    if (!partId) return "—";
    for (const k in parts) {
      const p = parts[k]?.find(p => p._id === (partId?._id || partId));
      if (p) return p.name;
    }
    return "Unknown";
  };
  const getPartsCount = (pb) => pb?.parts ? Object.values(pb.parts).filter(Boolean).length : 0;

  return (
    <>
      {toast && <div className={`pb-toast ${toast.type}`}>{toast.type === "success" ? "✅" : "❌"} {toast.msg}</div>}

      <div className="admin-page-header">
        <div>
          <div className="admin-page-title">Pre-built Templates</div>
          <div className="admin-page-sub">{prebuilds.length} templates · {totalBuilds.toLocaleString()} total builds made</div>
        </div>
        <button className="admin-btn admin-btn-primary" onClick={openAdd}>+ Add Template</button>
      </div>

      {loading && <div className="admin-card"><div className="pb-loading"><div className="pb-loading-icon">⚙️</div>Loading templates...</div></div>}
      {error   && <div className="admin-card"><div className="admin-empty"><div className="admin-empty-icon">⚠️</div><div className="admin-empty-title">Failed to load</div><div className="admin-empty-sub">{error}</div></div></div>}

      {!loading && !error && (
        <>
          <div className="pb-admin-toolbar">
            <div className="pb-search-wrap">
              <span className="pb-search-icon">🔍</span>
              <input className="pb-search" placeholder="Search templates..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <div className="pb-filter-pills">
              {["All", ...CATEGORY_OPTIONS].map(cat => (
                <button key={cat} className={`pb-filter-pill ${filterCat === cat ? "on" : ""}`} onClick={() => setFilterCat(cat)}>{cat}</button>
              ))}
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="admin-card"><div className="admin-empty"><div className="admin-empty-icon">🖥️</div><div className="admin-empty-title">No templates found</div><div className="admin-empty-sub">Try a different filter or add a new template</div></div></div>
          ) : (
            <div className="pb-admin-grid">
              {filtered.map(pb => (
                <div key={pb._id} className="pb-admin-card" onClick={() => openView(pb)}>
                  <div className="pb-admin-card-visual">
                    <div className="pb-admin-card-visual-grid" />
                    <span className="pb-admin-card-emoji">{pb.emoji}</span>
                    <div className="pb-admin-card-badges">
                      <span className={`admin-badge ${TIER_BADGE[pb.tier]}`}>{pb.tier}</span>
                      <span className={`admin-badge ${CAT_BADGE[pb.category]}`}>{pb.category}</span>
                    </div>
                  </div>
                  <div className="pb-admin-card-body">
                    <div className="pb-admin-card-name">{pb.name}</div>
                    <div className="pb-admin-card-tagline">{pb.tagline}</div>
                    <div className="pb-admin-card-specs">
                      <div className="pb-admin-card-spec">📦 {getPartsCount(pb)} components</div>
                      <div className="pb-admin-card-spec">💰 ₹{pb?.totalPrice || 0}</div>
                      <div className="pb-admin-card-spec">⚡ {pb?.totalWattage || 0}W</div>
                    </div>
                    <div className="pb-admin-card-footer">
                      <div>
                        <div className="pb-admin-card-price">₹{pb?.totalPrice || 0}</div>
                        <div className="pb-admin-card-builds">👤 {pb?.builds || 0} builds</div>
                      </div>
                      <div className="pb-admin-card-actions" onClick={e => e.stopPropagation()}>
                        <button className="admin-btn admin-btn-ghost" style={{ padding:"5px 10px", fontSize:"0.72rem" }} onClick={() => openEdit(pb)}>✏️ Edit</button>
                        <button className="admin-btn admin-btn-danger" style={{ padding:"5px 10px", fontSize:"0.72rem" }} onClick={() => openDel(pb)}>🗑</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* ── VIEW MODAL ── */}
      {modal === "view" && viewTarget && (
        <div className="pb-modal-overlay" onClick={close}>
          <div className="pb-view-modal" onClick={e => e.stopPropagation()}>
            <div className="pb-view-hero">
              <div className="pb-view-hero-grid" />
              <button className="pb-view-close" onClick={close}>✕</button>
              <div className="pb-view-hero-content">
                <div className="pb-view-hero-emoji">{viewTarget.emoji}</div>
                <div>
                  <div className="pb-view-hero-badges">
                    <span className={`admin-badge ${TIER_BADGE[viewTarget.tier]}`}>{viewTarget.tier}</span>
                    <span className={`admin-badge ${CAT_BADGE[viewTarget.category]}`}>{viewTarget.category}</span>
                  </div>
                  <div className="pb-view-hero-name">{viewTarget.name}</div>
                  <div className="pb-view-hero-tagline">{viewTarget.tagline}</div>
                </div>
              </div>
            </div>

            <div className="pb-view-stats">
              {[
                { label: "Est. Price",   value: viewTarget.price },
                { label: "Parts Total",  value: `₹${viewTarget.totalPrice || 0}` },
                { label: "Power Draw",   value: `${viewTarget.totalWattage || 0}W` },
                { label: "Builds Made",  value: viewTarget.builds || 0 },
              ].map((s, i) => (
                <div key={i} className="pb-view-stat">
                  <div className="pb-view-stat-label">{s.label}</div>
                  <div className="pb-view-stat-value">{s.value}</div>
                </div>
              ))}
            </div>

            <div className="pb-view-body">
              <div className="pb-view-section-title">Full Parts List</div>
              <div className="pb-parts-grid">
                {PART_COMPONENTS.map(comp => (
                  <div key={comp.key} className="pb-part-row">
                    <div className="pb-part-row-icon">{comp.emoji}</div>
                    <div>
                      <div className="pb-part-row-label">{comp.label}</div>
                      <div className="pb-part-row-name">{getPartName(viewTarget.parts?.[comp.key])}</div>
                    </div>
                  </div>
                ))}
              </div>

              {viewTarget.perfTargets?.some(p => p.label) && (
                <div style={{ marginTop: 16 }}>
                  <div className="pb-view-section-title">Performance Targets</div>
                  <div className="pb-perf-row">
                    {viewTarget.perfTargets.filter(p => p.label).map((p, i) => (
                      <div key={i} className="pb-perf-chip">
                        <div className="pb-perf-chip-label">{p.label}</div>
                        <div className="pb-perf-chip-value">{p.value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {viewTarget.tags?.length > 0 && (
                <div style={{ marginTop: 16 }}>
                  <div className="pb-view-section-title">Tags</div>
                  <div className="pb-tags-row">
                    {viewTarget.tags.map((t, i) => <span key={i} className="pb-tag-chip">{t}</span>)}
                  </div>
                </div>
              )}

              {viewTarget.pros?.length > 0 && (
                <div style={{ marginTop: 16 }}>
                  <div className="pb-view-section-title">Why This Build</div>
                  <div className="pb-pros-list">
                    {viewTarget.pros.map((p, i) => (
                      <div key={i} className="pb-pro-item"><div className="pb-pro-dot" />{p}</div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="pb-view-footer">
              <button className="admin-btn admin-btn-ghost" onClick={close}>Close</button>
              <button className="admin-btn admin-btn-primary" onClick={() => openEdit(viewTarget)}>✏️ Edit Template</button>
            </div>
          </div>
        </div>
      )}

      {/* ── ADD / EDIT MODAL ── */}
      {(modal === "add" || modal === "edit") && (
        <div className="pb-modal-overlay" onClick={close}>
          <div className="pb-form-modal" onClick={e => e.stopPropagation()}>

            <div className="pb-form-header">
              <div className="pb-form-header-left">
                <div className="pb-form-header-icon">{modal === "add" ? "➕" : "✏️"}</div>
                <div>
                  <div className="pb-form-header-title">{modal === "add" ? "Add New Template" : "Edit Template"}</div>
                  <div className="pb-form-header-sub">{modal === "add" ? "Create a new pre-built configuration" : `Editing · ${editTarget?.name}`}</div>
                </div>
              </div>
              <button className="pb-form-close" onClick={close}>✕</button>
            </div>

            <div className="pb-form-body">

              {/* Basic Info */}
              <div className="pb-section-header" style={{ marginTop: 0 }}>
                <span className="pb-section-label">Basic Info</span>
                <div className="pb-section-line" />
              </div>
              <div className="pb-grid-2">
                <div className="pb-field pb-col-full">
                  <label className="pb-label">Template Name</label>
                  <input className="pb-input" placeholder="e.g. Ultra Gaming Beast" value={form.name} onChange={upd("name")} />
                </div>
                <div className="pb-field pb-col-full">
                  <label className="pb-label">Tagline</label>
                  <input className="pb-input" placeholder="Short description of this build" value={form.tagline} onChange={upd("tagline")} />
                </div>
                <div className="pb-field">
                  <label className="pb-label">Category</label>
                  <select className="pb-select" value={form.category} onChange={upd("category")}>
                    {CATEGORY_OPTIONS.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="pb-field">
                  <label className="pb-label">Tier</label>
                  <select className="pb-select" value={form.tier} onChange={upd("tier")}>
                    {TIER_OPTIONS.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div className="pb-field">
                  <label className="pb-label">Tier Class</label>
                  <select className="pb-select" value={form.tierClass || ""} onChange={upd("tierClass")}>
                    <option value="">— Select —</option>
                    <option value="entry">entry</option>
                    <option value="mid">mid</option>
                    <option value="high">high</option>
                  </select>
                </div>
                <div className="pb-field">
                  <label className="pb-label">Est. Price</label>
                  <input className="pb-input" placeholder="e.g. ₹1,29,999" value={form.price} onChange={upd("price")} />
                </div>
                <div className="pb-field">
                  <label className="pb-label">Emoji Icon</label>
                  <input className="pb-input" placeholder="🖥️" value={form.emoji} onChange={upd("emoji")} />
                </div>
                <div className="pb-field">
                  <label className="pb-label">Accent Color</label>
                  <div className="pb-color-row">
                    <input type="color" className="pb-color-swatch" value={form.accentColor || "#3b82f6"} onChange={upd("accentColor")} />
                    <input className="pb-input" placeholder="#3b82f6" value={form.accentColor || ""} onChange={upd("accentColor")} />
                  </div>
                </div>
              </div>

              {/* Perf Targets */}
              <div className="pb-section-header">
                <span className="pb-section-label">Performance Targets</span>
                <div className="pb-section-line" />
              </div>
              <div className="pb-grid-3">
                {[0, 1, 2].map(i => (
                  <div key={i} className="pb-perf-card">
                    <div className="pb-perf-card-num">Target {i + 1}</div>
                    <div className="pb-field" style={{ marginBottom: 8 }}>
                      <label className="pb-label">Label</label>
                      <input className="pb-input" placeholder={["Resolution", "Target FPS", "Settings"][i]} value={form.perfTargets?.[i]?.label || ""} onChange={updPerf(i, "label")} />
                    </div>
                    <div className="pb-field">
                      <label className="pb-label">Value</label>
                      <input className="pb-input" placeholder={["1080p", "60–120", "High"][i]} value={form.perfTargets?.[i]?.value || ""} onChange={updPerf(i, "value")} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Tags & Pros */}
              <div className="pb-section-header">
                <span className="pb-section-label">Tags & Highlights</span>
                <div className="pb-section-line" />
              </div>
              <div className="pb-grid-2">
                <div className="pb-field pb-col-full">
                  <label className="pb-label">Tags <span style={{ fontWeight: 400, textTransform: "none", opacity: 0.55, letterSpacing: 0 }}>— comma separated</span></label>
                  <input className="pb-input" placeholder="e.g. 1080p Gaming, First Build, Intel" value={Array.isArray(form.tags) ? form.tags.join(", ") : (form.tags || "")} onChange={e => setForm(f => ({ ...f, tags: e.target.value.split(",").map(t => t.trim()).filter(Boolean) }))} />
                </div>
                <div className="pb-field pb-col-full">
                  <label className="pb-label">Why This Build <span style={{ fontWeight: 400, textTransform: "none", opacity: 0.55, letterSpacing: 0 }}>— one per line</span></label>
                  <textarea className="pb-textarea" rows={3} placeholder={"Best price-to-performance entry build\nQuiet cooler\nEasy to upgrade later"} value={Array.isArray(form.pros) ? form.pros.join("\n") : (form.pros || "")} onChange={e => setForm(f => ({ ...f, pros: e.target.value.split("\n").map(t => t.trim()).filter(Boolean) }))} />
                </div>
              </div>

              {/* Components */}
              <div className="pb-section-header">
                <span className="pb-section-label">Select Components</span>
                <div className="pb-section-line" />
              </div>
              <div className="pb-grid-parts">
                {PART_COMPONENTS.map(comp => (
                  <div key={comp.key} className="pb-part-card">
                    <div className="pb-part-card-head">
                      <span>{comp.emoji}</span>
                      <span className="pb-part-card-label">{comp.label}</span>
                    </div>
                    <select className="pb-select" value={form.parts?.[comp.key] || ""} onChange={updPart(comp.key)}>
                      <option value="">None</option>
                      {parts[comp.key]?.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
                    </select>
                  </div>
                ))}
              </div>

            </div>

            <div className="pb-form-footer">
              <button className="admin-btn admin-btn-ghost" onClick={close}>Cancel</button>
              <button className="admin-btn admin-btn-primary" onClick={handleSave}>{modal === "add" ? "Add Template" : "Save Changes"}</button>
            </div>
          </div>
        </div>
      )}

      {/* ── DELETE MODAL ── */}
      {modal === "delete" && deleteTarget && (
        <div className="pb-modal-overlay" onClick={close}>
          <div className="pb-delete-modal" onClick={e => e.stopPropagation()}>
            <div className="pb-delete-body">
              <div className="pb-delete-icon">🗑</div>
              <div className="pb-delete-title">Delete Template?</div>
              <div className="pb-delete-desc">
                You're about to permanently delete<br />
                <strong>"{deleteTarget.name}"</strong>.<br />
                This action cannot be undone.
              </div>
            </div>
            <div className="pb-delete-footer">
              <button className="admin-btn admin-btn-ghost" onClick={close}>Cancel</button>
              <button className="admin-btn" style={{ background: "#dc2626", color: "#fff" }} onClick={handleDelete}>Yes, Delete</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
