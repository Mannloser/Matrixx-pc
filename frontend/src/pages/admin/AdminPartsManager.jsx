import { useState, useEffect } from "react";
import api from "../../api/axios";
import "./css/adminPartManager.css";

const CATEGORIES = ["CPU", "GPU", "Motherboard", "Memory", "Storage", "CPU Cooler", "PSU", "Case"];
const CAT_ICONS  = { CPU: "🧠", GPU: "🎮", Motherboard: "🟩", Memory: "💾", Storage: "💿", "CPU Cooler": "❄️", PSU: "⚡", Case: "🏠" };

const SPEC_FIELDS = {
  CPU:         [{ key: "cores", label: "Cores", placeholder: "e.g. 6C/12T" }, { key: "clock", label: "Clock Speed", placeholder: "e.g. 3.8–5.1 GHz" }, { key: "socket", label: "Socket", placeholder: "e.g. AM5" }, { key: "tdp", label: "TDP (W)", placeholder: "e.g. 65", type: "number" }],
  GPU:         [{ key: "vram", label: "VRAM", placeholder: "e.g. 8GB GDDR6" }, { key: "boost", label: "Boost Clock", placeholder: "e.g. 2460 MHz" }, { key: "tdp", label: "TDP (W)", placeholder: "e.g. 115", type: "number" }],
  Memory:      [{ key: "capacity", label: "Capacity", placeholder: "e.g. 32GB (2×16)" }, { key: "speed", label: "Speed", placeholder: "e.g. DDR5-6000" }, { key: "cl", label: "CAS Latency", placeholder: "e.g. CL30" }],
  Storage:     [{ key: "capacity", label: "Capacity", placeholder: "e.g. 1TB" }, { key: "type", label: "Type", placeholder: "e.g. NVMe M.2" }, { key: "read", label: "Read Speed", placeholder: "e.g. 7450 MB/s" }, { key: "write", label: "Write Speed", placeholder: "e.g. 6900 MB/s" }],
  Motherboard: [{ key: "socket", label: "Socket", placeholder: "e.g. AM5" }, { key: "chipset", label: "Chipset", placeholder: "e.g. B650" }, { key: "formFactor", label: "Form Factor", placeholder: "e.g. ATX" }, { key: "ddr", label: "DDR", placeholder: "e.g. DDR5" }],
  Case:        [{ key: "formFactor", label: "Form Factor", placeholder: "e.g. Mid Tower" }, { key: "color", label: "Color", placeholder: "e.g. Black" }, { key: "psu", label: "PSU Included", placeholder: "e.g. No PSU" }],
  "CPU Cooler":[{ key: "type", label: "Type", placeholder: "e.g. Air or AIO" }, { key: "size", label: "Size", placeholder: "e.g. 360mm" }, { key: "tdpRating", label: "TDP Rating (W)", placeholder: "e.g. 250", type: "number" }],
  PSU:         [{ key: "wattage", label: "Wattage (W)", placeholder: "e.g. 750", type: "number" }, { key: "rating", label: "Efficiency Rating", placeholder: "e.g. 80+ Gold" }, { key: "modular", label: "Modular", placeholder: "e.g. Fully" }],
};

const SERIES_OPTIONS = {
  CPU:         ["Ryzen 3", "Ryzen 5", "Ryzen 7", "Ryzen 9", "Core i3", "Core i5", "Core i7", "Core i9"],
  GPU:         ["RTX 40", "RX 7000"],
  Memory:      ["DDR5", "DDR4"],
  Storage:     ["NVMe PCIe 4", "NVMe PCIe 3", "SATA SSD", "HDD"],
  Motherboard: ["AM5 B650", "AM5 X670", "LGA1700 Z790", "AM4 B550"],
  Case:        ["Mid Tower", "Full Tower", "mATX Tower"],
  "CPU Cooler":["Air Cooler", "AIO Liquid"],
  PSU:         ["Gold", "Platinum", "Titanium"],
};

const TAG_OPTIONS = ["Best Value", "Flagship", "Popular", "Budget", "Gaming King", "Top Tier", "Top Pick", "Sweet Spot", "High Cap", "Reliable", "Premium", "Value Pick", "Top Rated", "Value AIO", "Stylish"];

const makeEmptyForm = (category = "CPU") => ({
  category,
  name: "", brand: "", series: "", price: "", watts: "", tag: "",
  specs: {}
});

export default function AdminPartsManager() {
  const [parts,        setParts]        = useState([]);
  const [filterCat,    setFilterCat]    = useState("All");
  const [search,       setSearch]       = useState("");
  const [modal,        setModal]        = useState(null);
  const [editTarget,   setEditTarget]   = useState(null);
  const [form,         setForm]         = useState(makeEmptyForm());
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState("");

  useEffect(() => {
    api.get("/parts")
      .then(res => setParts(res.data))
      .catch(() => setError("Failed to load parts"))
      .finally(() => setLoading(false));
  }, []);

  const filtered = parts.filter(p => {
    const catMatch    = filterCat === "All" || p.category === filterCat;
    const searchMatch = p.name.toLowerCase().includes(search.toLowerCase()) ||
                        p.brand.toLowerCase().includes(search.toLowerCase());
    return catMatch && searchMatch;
  });

  const openAdd    = () => { setForm(makeEmptyForm()); setModal("add"); };
  const openEdit   = (part) => { setEditTarget(part); setForm({ ...part, specs: { ...part.specs } }); setModal("edit"); };
  const openDelete = (part) => { setDeleteTarget(part); setModal("delete"); };
  const closeModal = () => { setModal(null); setEditTarget(null); setDeleteTarget(null); setError(""); };

  const updField = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }));
  const updSpec  = (key)   => (e) => setForm(f => ({ ...f, specs: { ...f.specs, [key]: e.target.value } }));
  const updCat   = (e) => setForm(makeEmptyForm(e.target.value));

  const handleSave = async () => {
    if (!form.name.trim() || !form.brand.trim()) return;

    const cleaned = { ...form, price: +form.price, watts: +form.watts };
    SPEC_FIELDS[form.category]?.forEach(f => {
      if (f.type === "number" && cleaned.specs[f.key] !== undefined)
        cleaned.specs[f.key] = +cleaned.specs[f.key];
    });

    try {
      if (modal === "add") {
        const res = await api.post("/parts", cleaned);
        setParts(prev => [res.data.part, ...prev]);
      } else {
        const res = await api.put(`/parts/${editTarget._id}`, cleaned);
        setParts(prev => prev.map(p => p._id === editTarget._id ? res.data.part : p));
      }
      closeModal();
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/parts/${deleteTarget._id}`);
      setParts(prev => prev.filter(p => p._id !== deleteTarget._id));
      closeModal();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete part");
    }
  };

  const specSummary = (part) => {
    const fields = SPEC_FIELDS[part.category] || [];
    return fields.map(f => part.specs?.[f.key] ?? "").filter(Boolean).join(" · ");
  };

  if (loading) return (
    <div className="admin-empty">
      <div className="admin-empty-icon">⏳</div>
      <div className="admin-empty-title">Loading parts...</div>
    </div>
  );

  return (
    <>
      {/* Page header */}
      <div className="admin-page-header">
        <div>
          <div className="admin-page-title">Parts Manager</div>
          <div className="admin-page-sub">{parts.length} components across {CATEGORIES.length} categories</div>
        </div>
        <button className="admin-btn admin-btn-primary" onClick={openAdd}>+ Add Part</button>
      </div>

      {/* Toolbar */}
      <div className="pm-toolbar">
        <div className="pm-search-wrap">
          <span className="pm-search-icon">🔍</span>
          <input className="pm-search" placeholder="Search by name or brand..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="pm-cat-pills">
          {["All", ...CATEGORIES].map(cat => (
            <button key={cat} className={`pm-cat-pill ${filterCat === cat ? "on" : ""}`} onClick={() => setFilterCat(cat)}>
              {cat !== "All" && CAT_ICONS[cat] + " "}{cat}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="admin-card">
        <div className="admin-card-head">
          <span className="admin-card-title">
            {filtered.length} part{filtered.length !== 1 ? "s" : ""}{filterCat !== "All" && ` · ${filterCat}`}
          </span>
        </div>

        {filtered.length === 0 ? (
          <div className="admin-empty">
            <div className="admin-empty-icon">🔍</div>
            <div className="admin-empty-title">No parts found</div>
            <div className="admin-empty-sub">Try a different search or category</div>
          </div>
        ) : (
          /* ↓ scroll wrapper — clips the table on tablet, becomes invisible on mobile */
          <div className="pm-table-scroll">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Cat</th>
                  <th>Name</th>
                  <th>Brand</th>
                  <th>Specs</th>
                  <th>Price</th>
                  <th>Watts</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(part => (
                  <tr key={part._id}>
                    {/* No data-label — floated as icon in card mode */}
                    <td>
                      <div className="pm-part-icon-cell">{CAT_ICONS[part.category]}</div>
                    </td>
                    <td data-label="Name" style={{ fontWeight: 600 }}>{part.name}</td>
                    <td data-label="Brand">
                      <span className="admin-badge admin-badge-gray">{part.brand}</span>
                    </td>
                    <td data-label="Specs" style={{ color: "var(--teal)", fontSize: "0.75rem" }} title={specSummary(part)}>
                      {specSummary(part)}
                    </td>
                    <td data-label="Price" style={{ fontFamily: "var(--font-display)", fontWeight: 700 }}>
                      ₹{part.price}
                    </td>
                    <td data-label="Watts" style={{ color: "var(--teal)" }}>
                      {part.watts}W
                    </td>
                    <td data-label="Actions">
                      <div className="pm-actions">
                        <button className="admin-btn admin-btn-ghost" style={{ padding: "5px 10px", fontSize: "0.72rem" }} onClick={() => openEdit(part)}>✏️ Edit</button>
                        <button className="admin-btn admin-btn-danger" style={{ padding: "5px 10px", fontSize: "0.72rem" }} onClick={() => openDelete(part)}>🗑</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── ADD / EDIT MODAL ── */}
      {(modal === "add" || modal === "edit") && (
        <div className="admin-modal-overlay" onClick={closeModal}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <div className="admin-modal-header">
              <div className="admin-modal-title">{modal === "add" ? "➕ Add New Part" : "✏️ Edit Part"}</div>
              <button className="admin-modal-close" onClick={closeModal}>✕</button>
            </div>
            <div className="admin-modal-body">

              {error && <div className="admin-error">{error}</div>}

              <div className="admin-form-group">
                <label className="admin-label">Category</label>
                <select className="admin-select" value={form.category} onChange={updCat}>
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>

              <div className="admin-form-grid-2">
                <div className="admin-form-group">
                  <label className="admin-label">Part Name</label>
                  <input className="admin-input" placeholder="e.g. AMD Ryzen 7 7800X" value={form.name} onChange={updField("name")} />
                </div>
                <div className="admin-form-group">
                  <label className="admin-label">Brand</label>
                  <input className="admin-input" placeholder="e.g. AMD" value={form.brand} onChange={updField("brand")} />
                </div>
              </div>

              <div className="admin-form-grid-2">
                <div className="admin-form-group">
                  <label className="admin-label">Series</label>
                  <select className="admin-select" value={form.series} onChange={updField("series")}>
                    <option value="">— Select Series —</option>
                    {(SERIES_OPTIONS[form.category] || []).map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div className="admin-form-group">
                  <label className="admin-label">Tag <span style={{ opacity: 0.5 }}>(optional)</span></label>
                  <select className="admin-select" value={form.tag} onChange={updField("tag")}>
                    <option value="">— No Tag —</option>
                    {TAG_OPTIONS.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
              </div>

              <div className="admin-form-grid-2">
                <div className="admin-form-group">
                  <label className="admin-label">Price (₹)</label>
                  <input className="admin-input" type="number" placeholder="0" value={form.price} onChange={updField("price")} />
                </div>
                <div className="admin-form-group">
                  <label className="admin-label">Power Draw (W)</label>
                  <input className="admin-input" type="number" placeholder="0" value={form.watts} onChange={updField("watts")} />
                </div>
              </div>

              <div className="admin-specs-section">
                <div className="admin-specs-title">⚙️ {form.category} Specs</div>
                <div className="admin-form-grid-2">
                  {(SPEC_FIELDS[form.category] || []).map(f => (
                    <div className="admin-form-group" key={f.key}>
                      <label className="admin-label">{f.label}</label>
                      <input
                        className="admin-input"
                        type={f.type || "text"}
                        placeholder={f.placeholder}
                        value={form.specs?.[f.key] ?? ""}
                        onChange={updSpec(f.key)}
                      />
                    </div>
                  ))}
                </div>
              </div>

            </div>
            <div className="admin-modal-footer">
              <button className="admin-btn admin-btn-ghost" onClick={closeModal}>Cancel</button>
              <button className="admin-btn admin-btn-primary" onClick={handleSave}>
                {modal === "add" ? "Add Part" : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── DELETE CONFIRM MODAL ── */}
      {modal === "delete" && deleteTarget && (
        <div className="admin-modal-overlay" onClick={closeModal}>
          <div className="admin-modal" style={{ maxWidth: 420 }} onClick={e => e.stopPropagation()}>
            <div className="admin-modal-header">
              <div className="admin-modal-title">🗑 Delete Part</div>
              <button className="admin-modal-close" onClick={closeModal}>✕</button>
            </div>
            <div className="admin-modal-body">
              {error && <div className="admin-error">{error}</div>}
              <p style={{ fontSize: "0.875rem", color: "var(--navy)", lineHeight: 1.6 }}>
                Are you sure you want to delete <strong>{deleteTarget.name}</strong>? This action cannot be undone.
              </p>
            </div>
            <div className="admin-modal-footer">
              <button className="admin-btn admin-btn-ghost" onClick={closeModal}>Cancel</button>
              <button className="admin-btn" style={{ background: "#dc2626", color: "#fff" }} onClick={handleDelete}>Yes, Delete</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
