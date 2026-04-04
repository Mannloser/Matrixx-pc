import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "../../api/axios";
import "./css/profile.css";

export default function ProfilePage() {
  const navigate = useNavigate();

  const [user,    setUser]    = useState(null);
  const [builds,  setBuilds]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  const [editModal,              setEditModal]              = useState(false);
  const [securityModal,          setSecurityModal]          = useState(false);
  const [deleteConfirmModal,     setDeleteConfirmModal]     = useState(false);
  const [deleteAccountModal,     setDeleteAccountModal]     = useState(false);
  const [deletingBuildId,        setDeletingBuildId]        = useState(null);

  const [viewBuildModal,         setViewBuildModal]         = useState(false);
  const [viewingBuild,           setViewingBuild]           = useState(null);
  const [partsCache,             setPartsCache]             = useState({});
  const [partsLoading,           setPartsLoading]           = useState(false);

  const [toasts, setToasts] = useState([]);

  const [editForm, setEditForm] = useState({ name: "", username: "", email: "", bio: "" });
  const [securityForm, setSecurityForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });

  /* ── Toast system ── */
  const addToast = (type, message) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, type, message }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  };
  const removeToast = (id) => setToasts(prev => prev.filter(t => t.id !== id));

  /* ── Fetch data ── */
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        if (!token) { navigate("/login"); return; }

        const [profileRes, buildsRes] = await Promise.all([
          axios.get("/profile/my-profile",  { headers: { Authorization: `Bearer ${token}` } }),
          axios.get("/profile/my-builds",   { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        const u = profileRes.data.user;
        setUser(u);
        setEditForm({ name: u.name || "", username: u.username || "", email: u.email || "", bio: u.bio || "" });
        setBuilds(buildsRes.data || []);
      } catch (err) {
        // 401 is handled globally by the axios interceptor (shows SessionExpiredModal)
        if (err.response?.status !== 401) {
          setError("Failed to load profile");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [navigate]);

  /* ── Handlers ── */
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleSaveProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put("/profile/update-profile",
        { name: editForm.name, username: editForm.username, email: editForm.email, bio: editForm.bio },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUser(res.data.user);
      // Update localStorage user too
      localStorage.setItem("user", JSON.stringify(res.data.user));
      setEditModal(false);
      addToast("success", "Profile updated successfully!");
    } catch (err) {
      addToast("error", err.response?.data?.message || "Failed to update profile");
    }
  };

  const handleChangePassword = async () => {
    if (securityForm.newPassword !== securityForm.confirmPassword) {
      addToast("error", "Passwords don't match"); return;
    }
    if (securityForm.newPassword.length < 6) {
      addToast("error", "Password must be at least 6 characters"); return;
    }
    try {
      const token = localStorage.getItem("token");
      await axios.post("/profile/change-password",
        { currentPassword: securityForm.currentPassword, newPassword: securityForm.newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSecurityForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setSecurityModal(false);
      addToast("success", "Password changed successfully!");
    } catch (err) {
      addToast("error", err.response?.data?.message || "Failed to change password");
    }
  };

  const handleDeleteBuild = (id) => { setDeletingBuildId(id); setDeleteConfirmModal(true); };

  /* ── View Build Modal ── */
  const handleViewBuild = async (build) => {
    setViewingBuild(build);
    setViewBuildModal(true);
    const partIds = Object.values(build.parts || {}).filter(Boolean);
    const missing = partIds.filter(id => !partsCache[id]);
    if (missing.length === 0) return;
    try {
      setPartsLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get("/parts", { headers: { Authorization: `Bearer ${token}` } });
      const allParts = res.data || [];
      const map = {};
      allParts.forEach(p => { map[p._id] = p; });
      setPartsCache(prev => ({ ...prev, ...map }));
    } catch {
      addToast("error", "Failed to load part details");
    } finally {
      setPartsLoading(false);
    }
  };

  const confirmDeleteBuild = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`/profile/delete-build/${deletingBuildId}`, { headers: { Authorization: `Bearer ${token}` } });
      setBuilds(prev => prev.filter(b => (b._id || b.id) !== deletingBuildId));
      setDeleteConfirmModal(false);
      addToast("success", "Build deleted!");
    } catch (err) {
      addToast("error", "Failed to delete build");
    }
  };

  const confirmDeleteAccount = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete("/profile/delete-account", { headers: { Authorization: `Bearer ${token}` } });
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      addToast("success", "Account deleted");
      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      addToast("error", "Failed to delete account");
    }
  };

  const getInitial = () => {
    if (user?.username) return user.username[0].toUpperCase();
    if (user?.name)     return user.name[0].toUpperCase();
    return "?";
  };

  const formatDate = (d) => {
    if (!d) return "Recently";
    return new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  };

  /* ── Loading / Error ── */
  if (loading) return (
    <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", background:"#F5EFEB", fontFamily:"DM Sans,sans-serif" }}>
      <div style={{ textAlign:"center" }}>
        <div style={{ fontSize:"2.5rem", marginBottom:16, animation:"spin 1s linear infinite" }}>⚙️</div>
        <div style={{ color:"#5D7C8D", fontSize:"0.9rem" }}>Loading your profile...</div>
      </div>
    </div>
  );

  if (error) return (
    <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", background:"#F5EFEB", fontFamily:"DM Sans,sans-serif" }}>
      <div style={{ textAlign:"center" }}>
        <div style={{ fontSize:"2.5rem", marginBottom:12 }}>⚠️</div>
        <div style={{ color:"#2F4156", fontWeight:700, marginBottom:8 }}>Something went wrong</div>
        <div style={{ color:"#5D7C8D", fontSize:"0.85rem" }}>{error}</div>
      </div>
    </div>
  );

  return (
    <>

      {/* ── TOASTS ── */}
      <div className="toast-container">
        {toasts.map(t => (
          <div key={t.id} className={`toast ${t.type}`} onClick={() => removeToast(t.id)}>
            <span className="toast-icon">{t.type === "success" ? "✅" : "❌"}</span>
            <span className="toast-msg">{t.message}</span>
            <span className="toast-close">✕</span>
          </div>
        ))}
      </div>

      <div className="profile-page">

        {/* ── HERO BANNER ── */}
        <div className="profile-hero">
          <div className="profile-hero-inner">
            <div className="profile-avatar-wrap">
              <div className="profile-avatar">{getInitial()}</div>
              <div className="profile-online-dot" />
            </div>

            <div style={{ flex: 1 }}>
              <div className="profile-hero-name">{user?.name}</div>
              {user?.username && (
                <div className="profile-hero-username">@{user.username}</div>
              )}
              {user?.bio && (
                <div className="profile-hero-bio">{user.bio}</div>
              )}
              <div className="profile-hero-meta">
                <span className="profile-hero-meta-item">📅 Joined {formatDate(user?.createdAt)}</span>
                <span className="profile-hero-meta-item">✉️ {user?.email}</span>
              </div>
            </div>

            <div className="profile-hero-actions">
              <button className="ph-btn ph-btn-primary" onClick={() => setEditModal(true)}>
                ✏️ Edit Profile
              </button>
              <button className="ph-btn ph-btn-ghost" onClick={() => setSecurityModal(true)}>
                🔒 Security
              </button>
              <button className="ph-btn ph-btn-danger" onClick={handleLogout}>
                🚪 Sign out
              </button>
            </div>
          </div>
        </div>
       

        {/* ── BODY ── */}
        <div className="profile-body">

          {/* ── LEFT: BUILDS ── */}
          <div>
            <div className="profile-card">
              <div className="profile-card-head">
                <div className="profile-card-title">⚡ My Builds</div>
                <Link to="/builder" style={{ fontSize:"0.72rem", color:"var(--teal)", textDecoration:"none", fontWeight:600 }}>
                  + New build
                </Link>
              </div>
              <div className="profile-card-body">
                {builds.length === 0 ? (
                  <div className="builds-empty">
                    <div className="builds-empty-icon">🔨</div>
                    <div className="builds-empty-title">No builds yet</div>
                    <div className="builds-empty-sub">Start planning your first PC build</div>
                    <Link to="/builder" className="builds-empty-btn">⚡ Open Builder</Link>
                  </div>
                ) : (
                  <div className="builds-list">
                    {builds.map(build => {
                      // Map DB slot keys → builder's categoryMap keys
                      const builderSelections = {};
                      const keyMap = {
                        cpu:               "cpu",
                        gpu:               "gpu",
                        motherboard:       "motherboard",
                        memory:            "memory",
                        storage_primary:   "storage_primary",
                        storage_secondary: "storage_secondary",
                        cpu_cooler:        "cpu_cooler",
                        psu:               "psu",
                        case:              "case",
                      };
                      Object.entries(build.parts || {}).forEach(([key, id]) => {
                        if (keyMap[key] && id) builderSelections[keyMap[key]] = id;
                      });

                      return (
                      <div key={build._id || build.id} className="build-row">
                        <div>
                          <div className="build-row-name">{build.name || "Untitled Build"}</div>
                          <div className="build-row-meta">
                            {build.partsCount || 0} parts
                            {build.totalPrice ? ` · $${build.totalPrice.toLocaleString()}` : ""}
                            {" · "}
                            {formatDate(build.createdAt)}
                          </div>
                        </div>
                        <div className="build-row-actions">
                          <button className="build-action-btn build-view"
                            onClick={() => handleViewBuild(build)}>
                            👁 View
                          </button>
                          <button className="build-action-btn build-share"
                            onClick={async () => {
                              try {
                                const token = localStorage.getItem("token");
                                // Mark build as public so the shared link works
                                await axios.patch(
                                  `/profile/share-build/${build._id || build.id}`,
                                  {},
                                  { headers: { Authorization: `Bearer ${token}` } }
                                );
                                const url = `${window.location.origin}/builder?build=${build._id || build.id}`;
                                navigator.clipboard.writeText(url);
                                addToast("success", "Build link copied!");
                              } catch {
                                addToast("error", "Failed to share build");
                              }
                            }}
                            title="Copy build link">
                            🔗 Share
                          </button>
                          <button className="build-action-btn build-delete"
                            onClick={() => handleDeleteBuild(build._id || build.id)}>
                            🗑
                          </button>
                        </div>
                      </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ── RIGHT: SIDEBAR ── */}
          <div className="profile-sidebar">

            {/* Account info */}
            <div className="profile-card">
              <div className="profile-card-head">
                <div className="profile-card-title">👤 Account Info</div>
              </div>
              <div className="profile-card-body" style={{ padding:"10px 22px" }}>
                {[
                  { icon:"🏷️", label:"Name",     val: user?.name },
                  { icon:"@",  label:"Username", val: user?.username ? `@${user.username}` : "—" },
                  { icon:"✉️", label:"Email",    val: user?.email },
                  { icon:"🛡️", label:"Role",     val: user?.role === "admin" ? "Admin" : "Member" },
                  { icon:"📅", label:"Joined",   val: formatDate(user?.createdAt) },
                ].map(item => (
                  <div key={item.label} className="info-row">
                    <div className="info-row-icon">{item.icon}</div>
                    <div>
                      <div className="info-row-label">{item.label}</div>
                      <div className="info-row-val">{item.val || "—"}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Security */}
            <div className="profile-card">
              <div className="profile-card-head">
                <div className="profile-card-title">🔐 Security</div>
              </div>
              <div className="profile-card-body" style={{ padding:"6px 22px" }}>
                <div className="security-row">
                  <div>
                    <div className="security-row-label">Password</div>
                    <div className="security-row-sub">Change your password</div>
                  </div>
                  <button className="sec-btn sec-btn-ghost" onClick={() => setSecurityModal(true)}>
                    Change
                  </button>
                </div>
                <div className="security-row">
                  <div>
                    <div className="security-row-label">Sign out</div>
                    <div className="security-row-sub">End your session</div>
                  </div>
                  <button className="sec-btn sec-btn-danger" onClick={handleLogout}>
                    Logout
                  </button>
                </div>
                <div className="security-row">
                  <div>
                    <div className="security-row-label">Delete account</div>
                    <div className="security-row-sub">Permanent action</div>
                  </div>
                  <button className="sec-btn sec-btn-danger" onClick={() => setDeleteAccountModal(true)}>
                    Delete
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ── VIEW BUILD MODAL ── */}
      {viewBuildModal && viewingBuild && (() => {
        const SLOT_META = {
          cpu:               { label: "CPU",               icon: "🧠" },
          gpu:               { label: "GPU",               icon: "🎮" },
          motherboard:       { label: "Motherboard",       icon: "🖥️" },
          memory:            { label: "Memory (RAM)",      icon: "💾" },
          storage_primary:   { label: "Primary Storage",   icon: "💿" },
          storage_secondary: { label: "Secondary Storage", icon: "📀" },
          cpu_cooler:        { label: "CPU Cooler",        icon: "❄️" },
          psu:               { label: "Power Supply",      icon: "⚡" },
          case:              { label: "Case",              icon: "🗄️" },
        };

        const getSpecLine = (part) => {
          if (!part?.specs) return part?.brand || null;
          const s = part.specs;
          switch (part.category) {
            case "CPU":         return [s.cores && `${s.cores} Cores`, s.clock && `${s.clock} GHz`, s.socket].filter(Boolean).join(" · ");
            case "GPU":         return [s.vram && `${s.vram}GB VRAM`, s.boost && `${s.boost} MHz`].filter(Boolean).join(" · ");
            case "Memory":      return [s.capacity && `${s.capacity}GB`, s.speed && `${s.speed} MHz`, s.cl && `CL${s.cl}`].filter(Boolean).join(" · ");
            case "Storage":     return [s.capacity && `${s.capacity}GB`, s.type, s.read && `${s.read} MB/s`].filter(Boolean).join(" · ");
            case "Motherboard": return [s.socket, s.chipset, s.formFactor].filter(Boolean).join(" · ");
            case "CPU Cooler":  return [s.type, s.tdpRating && `${s.tdpRating}W TDP`].filter(Boolean).join(" · ");
            case "PSU":         return [s.wattage && `${s.wattage}W`, s.rating, s.modular].filter(Boolean).join(" · ");
            case "Case":        return [s.formFactor, s.color].filter(Boolean).join(" · ");
            default:            return part.brand || null;
          }
        };

        const builderSelections = {};
        Object.entries(viewingBuild.parts || {}).forEach(([k, id]) => { if (id) builderSelections[k] = id; });

        return (
          <div className="vbm-overlay" onClick={() => setViewBuildModal(false)}>
            <div className="vbm-box" onClick={e => e.stopPropagation()}>

              {/* ── DARK BANNER HEADER ── */}
              <div className="vbm-head">
                <div className="vbm-head-inner">
                  <div className="vbm-head-left">
                    <div className="vbm-head-eyebrow">
                      <span className="vbm-head-dot" />
                      PC Build
                    </div>
                    <div className="vbm-head-title">{viewingBuild.name || "Untitled Build"}</div>
                    <div className="vbm-head-stats">
                      <span className="vbm-head-stat">⚙️ {viewingBuild.partsCount || 0} / 9 parts</span>
                      {viewingBuild.totalPrice > 0 && (
                        <span className="vbm-head-stat">💰 ${viewingBuild.totalPrice.toLocaleString()}</span>
                      )}
                      {viewingBuild.totalWattage > 0 && (
                        <span className="vbm-head-stat">⚡ {viewingBuild.totalWattage}W</span>
                      )}
                      <span className="vbm-head-stat">📅 {formatDate(viewingBuild.createdAt)}</span>
                    </div>
                  </div>
                  <button className="vbm-close" onClick={() => setViewBuildModal(false)}>✕</button>
                </div>
              </div>

              {/* ── 2-COLUMN PARTS GRID ── */}
              <div className="vbm-body">
                {partsLoading ? (
                  <div className="vbm-shimmer-grid">
                    {[...Array(8)].map((_, i) => (
                      <div key={i} className="vbm-shimmer-card"
                        style={{ animationDelay: `${i * 0.06}s` }} />
                    ))}
                  </div>
                ) : (
                  <div className="vbm-grid">
                    {Object.entries(SLOT_META).map(([slot, meta], i) => {
                      const partId = viewingBuild.parts?.[slot];
                      const part   = partId ? partsCache[partId] : null;
                      const specs  = part ? getSpecLine(part) : null;

                      if (!partId) return (
                        <div key={slot} className="vbm-card-empty">
                          <div className="vbm-card-empty-icon">{meta.icon}</div>
                          <div>
                            <div className="vbm-card-empty-slot">{meta.label}</div>
                            <div className="vbm-card-empty-label">Not selected</div>
                          </div>
                        </div>
                      );

                      return (
                        <div key={slot} className="vbm-card"
                          style={{ animationDelay: `${i * 0.05}s` }}>
                          <div className="vbm-card-icon">{meta.icon}</div>
                          <div className="vbm-card-body">
                            <div className="vbm-card-slot">{meta.label}</div>
                            <div className="vbm-card-name">{part ? part.name : "—"}</div>
                            {specs && <div className="vbm-card-specs">{specs}</div>}
                            {part?.price != null && (
                              <div className="vbm-card-price">${part.price.toLocaleString()}</div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* ── SUMMARY STRIP ── */}
              <div className="vbm-summary">
                <div className="vbm-sum-cell">
                  <div className="vbm-sum-label">💰 Total Price</div>
                  <div className="vbm-sum-val">
                    {viewingBuild.totalPrice ? `$${viewingBuild.totalPrice.toLocaleString()}` : "—"}
                  </div>
                </div>
                <div className="vbm-sum-cell">
                  <div className="vbm-sum-label">⚡ Total Wattage</div>
                  <div className="vbm-sum-val">
                    {viewingBuild.totalWattage ? `${viewingBuild.totalWattage}W` : "—"}
                  </div>
                </div>
                <div className="vbm-sum-cell">
                  <div className="vbm-sum-label">🔧 Parts</div>
                  <div className="vbm-sum-val">{viewingBuild.partsCount || 0} / 9</div>
                </div>
              </div>

              {/* ── FOOTER ── */}
              <div className="vbm-foot">
                <div className="vbm-foot-left">
                  <button className="vbm-btn vbm-btn-ghost-danger" onClick={() => {
                    setViewBuildModal(false);
                    handleDeleteBuild(viewingBuild._id || viewingBuild.id);
                  }}>
                    🗑️ Delete Build
                  </button>
                </div>
                <div className="vbm-foot-right">
                  <button className="vbm-btn vbm-btn-primary" onClick={() => {
                    setViewBuildModal(false);
                    navigate("/builder", {
                      state: { compatibilitySelections: builderSelections, buildName: viewingBuild.name }
                    });
                  }}>
                    ✏️ Edit in Builder
                  </button>
                </div>
              </div>

            </div>
          </div>
        );
      })()}

      {/* ── EDIT PROFILE MODAL ── */}
      {editModal && (
        <div className="modal-overlay" onClick={() => setEditModal(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <div className="modal-head">
              <div className="modal-head-title">✏️ Edit Profile</div>
              <button className="modal-x" onClick={() => setEditModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              {[
                { label:"Full Name",   field:"name",     type:"text",  placeholder:"Your name" },
                { label:"Username",    field:"username", type:"text",  placeholder:"your_username" },
                { label:"Email",       field:"email",    type:"email", placeholder:"you@example.com" },
                { label:"Bio",         field:"bio",      type:"text",  placeholder:"Tell something about yourself" },
              ].map(f => (
                <div key={f.field} className="field-group">
                  <label className="field-label">{f.label}</label>
                  <input
                    className="field-input" type={f.type}
                    placeholder={f.placeholder}
                    value={editForm[f.field]}
                    onChange={e => setEditForm(prev => ({ ...prev, [f.field]: e.target.value }))}
                  />
                </div>
              ))}
            </div>
            <div className="modal-foot">
              <button className="m-cancel" onClick={() => setEditModal(false)}>Cancel</button>
              <button className="m-save" onClick={handleSaveProfile}>Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {/* ── CHANGE PASSWORD MODAL ── */}
      {securityModal && (
        <div className="modal-overlay" onClick={() => setSecurityModal(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <div className="modal-head">
              <div className="modal-head-title">🔒 Change Password</div>
              <button className="modal-x" onClick={() => setSecurityModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              {[
                { label:"Current Password", field:"currentPassword" },
                { label:"New Password",     field:"newPassword" },
                { label:"Confirm Password", field:"confirmPassword" },
              ].map(f => (
                <div key={f.field} className="field-group">
                  <label className="field-label">{f.label}</label>
                  <input
                    className="field-input" type="password"
                    value={securityForm[f.field]}
                    onChange={e => setSecurityForm(prev => ({ ...prev, [f.field]: e.target.value }))}
                  />
                </div>
              ))}
            </div>
            <div className="modal-foot">
              <button className="m-cancel" onClick={() => setSecurityModal(false)}>Cancel</button>
              <button className="m-save" onClick={handleChangePassword}>Update Password</button>
            </div>
          </div>
        </div>
      )}

      {/* ── DELETE BUILD MODAL ── */}
      {deleteConfirmModal && (
        <div className="modal-overlay" onClick={() => setDeleteConfirmModal(false)}>
          <div className="modal-box" style={{ maxWidth:420 }} onClick={e => e.stopPropagation()}>
            <div className="modal-head">
              <div className="modal-head-title">🗑 Delete Build</div>
              <button className="modal-x" onClick={() => setDeleteConfirmModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="danger-box">
                Are you sure you want to delete this build? This action cannot be undone.
              </div>
            </div>
            <div className="modal-foot">
              <button className="m-cancel" onClick={() => setDeleteConfirmModal(false)}>Cancel</button>
              <button className="m-danger" onClick={confirmDeleteBuild}>Yes, Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* ── DELETE ACCOUNT MODAL ── */}
      {deleteAccountModal && (
        <div className="modal-overlay" onClick={() => setDeleteAccountModal(false)}>
          <div className="modal-box" style={{ maxWidth:420 }} onClick={e => e.stopPropagation()}>
            <div className="modal-head">
              <div className="modal-head-title">🚨 Delete Account</div>
              <button className="modal-x" onClick={() => setDeleteAccountModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="danger-box">
                <strong>This cannot be undone.</strong><br /><br />
                Deleting your account will permanently remove all your builds and data from Matrixx.
              </div>
            </div>
            <div className="modal-foot">
              <button className="m-cancel" onClick={() => setDeleteAccountModal(false)}>Cancel</button>
              <button className="m-danger" onClick={confirmDeleteAccount}>Delete My Account</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}