import { useState, useEffect } from "react";
import axios from "../../api/axios";
import "./css/adminUsersManager.css";

export default function AdminUsersManager() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("All");
  const [viewModal, setViewModal] = useState(null); // user object
  const [deleteModal, setDeleteModal] = useState(null); // user object
  const [toast, setToast] = useState(null);
  const [editRole, setEditRole] = useState("");

  /* ── Fetch users ── */
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get("/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  /* ── Delete user ── */
  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`/admin/users/${deleteModal._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(prev => prev.filter(u => u._id !== deleteModal._id));
      setDeleteModal(null);
      showToast("success", `${deleteModal.name} has been deleted`);
    } catch (err) {
      showToast("error", err.response?.data?.message || "Failed to delete user");
    }
  };

  //update user role
  const handleUpdateRole = async () => {
  try {
    const token = localStorage.getItem("token");

    await axios.put(`/admin/users/${viewModal._id}`,
      { role: editRole },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setUsers(prev =>
      prev.map(u =>
        u._id === viewModal._id ? { ...u, role: editRole } : u
      )
    );

    showToast("success", "Role updated 🔥");
    setViewModal(null);

  } catch (err) {
    showToast("error", "Failed to update role");
  }
};

  const showToast = (type, msg) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3500);
  };

  const formatDate = (d) => d
    ? new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
    : "—";

  const getInitial = (u) =>
    (u.username?.[0] || u.name?.[0] || "?").toUpperCase();

  const filtered = users.filter(u => {
    const roleMatch = filterRole === "All" || u.role === filterRole.toLowerCase();
    const searchMatch = u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.username?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase());
    return roleMatch && searchMatch;
  });

  return (
    <>

      {/* Toast */}
      {toast && (
        <div className={`um-toast ${toast.type}`}>
          {toast.type === "success" ? "✅" : "❌"} {toast.msg}
        </div>
      )}

      {/* Page header */}
      <div className="admin-page-header">
        <div>
          <div className="admin-page-title">Users Manager</div>
          <div className="admin-page-sub">
            {users.length} registered user{users.length !== 1 ? "s" : ""} · {users.filter(u => u.role === "admin").length} admin{users.filter(u => u.role === "admin").length !== 1 ? "s" : ""}
          </div>
        </div>
        <button className="admin-btn admin-btn-ghost" onClick={fetchUsers}>
          🔄 Refresh
        </button>
      </div>

      {/* Toolbar */}
      <div className="um-toolbar">
        <div className="um-search-wrap">
          <span className="um-search-icon">🔍</span>
          <input
            className="um-search"
            placeholder="Search by name, username or email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="um-role-pills">
          {["All", "User", "Admin"].map(r => (
            <button
              key={r}
              className={`um-role-pill ${filterRole === r ? "on" : ""}`}
              onClick={() => setFilterRole(r)}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="admin-card">
        <div className="admin-card-head">
          <span className="admin-card-title">
            {filtered.length} user{filtered.length !== 1 ? "s" : ""}
            {filterRole !== "All" && ` · ${filterRole}s only`}
          </span>
        </div>

        {loading ? (
          <div className="um-loading">
            <div className="um-loading-icon">⚙️</div>
            Loading users...
          </div>
        ) : error ? (
          <div className="admin-empty">
            <div className="admin-empty-icon">⚠️</div>
            <div className="admin-empty-title">Failed to load users</div>
            <div className="admin-empty-sub">{error}</div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="admin-empty">
            <div className="admin-empty-icon">🔍</div>
            <div className="admin-empty-title">No users found</div>
            <div className="admin-empty-sub">Try a different search or filter</div>
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Username</th>
                <th>Role</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(u => (
                <tr key={u._id}>
                  <td>
                    <div className="um-user-cell">
                      <div className="um-avatar">{getInitial(u)}</div>
                      <div>
                        <div className="um-user-name">{u.name}</div>
                        <div className="um-user-email">{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ color: "var(--teal)", fontSize: "0.78rem" }}>
                    {u.username ? `@${u.username}` : "—"}
                  </td>
                  <td>
                    <span className={`admin-badge ${u.role === "admin" ? "admin-badge-red" : "admin-badge-blue"}`}>
                      {u.role}
                    </span>
                  </td>
                  <td style={{ color: "var(--teal)", fontSize: "0.75rem" }}>
                    {formatDate(u.createdAt)}
                  </td>
                  <td>
                    <div className="um-actions">
                      <button
                        className="um-btn um-btn-view"
                        onClick={() => {
                          setViewModal(u);
                          setEditRole(u.role);
                        }}
                      >
                        👁 View
                      </button>
                      <button
                        className="um-btn um-btn-delete"
                        onClick={() => setDeleteModal(u)}
                        disabled={u.role === "admin"}
                        style={{ opacity: u.role === "admin" ? 0.4 : 1, cursor: u.role === "admin" ? "not-allowed" : "pointer" }}
                        title={u.role === "admin" ? "Cannot delete admin accounts" : "Delete user"}
                      >
                        🗑 Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ── VIEW USER MODAL ── */}
      {viewModal && (
        <div className="um-modal-overlay" onClick={() => setViewModal(null)}>
          <div className="um-modal" onClick={e => e.stopPropagation()}>
            <div className="um-modal-head">
              <div className="um-modal-head-left">
                <div className="um-modal-avatar">{getInitial(viewModal)}</div>
                <div>
                  <div className="um-modal-name">{viewModal.name}</div>
                  <div className="um-modal-username">
                    {viewModal.username ? `@${viewModal.username}` : viewModal.email}
                  </div>
                </div>
              </div>
              <button className="um-modal-x" onClick={() => setViewModal(null)}>✕</button>
            </div>

            <div className="um-modal-body">
              {[
                { icon: "🏷️", label: "Full Name", val: viewModal.name },
                { icon: "@", label: "Username", val: viewModal.username ? `@${viewModal.username}` : "—" },
                { icon: "✉️", label: "Email", val: viewModal.email },
                {
                  icon: "🛡️",
                  label: "Role",
                  val: (
                    <select
                      value={editRole}
                      onChange={(e) => setEditRole(e.target.value)}
                      style={{ padding: "4px", borderRadius: "6px" }}
                    >
                      <option value="user">user</option>
                      <option value="admin">admin</option>
                    </select>
                  )
                },
                { icon: "📝", label: "Bio", val: viewModal.bio || "No bio" },
                { icon: "📅", label: "Joined", val: formatDate(viewModal.createdAt) },
                { icon: "🔄", label: "Last Updated", val: formatDate(viewModal.updatedAt) },
              ].map(row => (
                <div key={row.label} className="um-info-row">
                  <div className="um-info-icon">{row.icon}</div>
                  <div>
                    <div className="um-info-label">{row.label}</div>
                    <div className="um-info-val">{row.val}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="um-modal-foot">
              <button className="um-m-save" onClick={handleUpdateRole}>
                💾 Save Role
              </button>
              <button className="um-m-close" onClick={() => setViewModal(null)}>Close</button>
              {viewModal.role !== "admin" && (
                <button className="um-m-delete" onClick={() => { setViewModal(null); setDeleteModal(viewModal); }}>
                  🗑 Delete User
                </button>

              )}
            </div>
          </div>
        </div>
      )}

      {/* ── DELETE CONFIRM MODAL ── */}
      {deleteModal && (
        <div className="um-modal-overlay" onClick={() => setDeleteModal(null)}>
          <div className="um-modal" style={{ maxWidth: 420 }} onClick={e => e.stopPropagation()}>
            <div className="admin-modal-header">
              <div className="admin-modal-title">🗑 Delete User</div>
              <button className="admin-modal-close" onClick={() => setDeleteModal(null)}>✕</button>
            </div>
            <div className="admin-modal-body">
              <div className="um-danger-box">
                <strong>This cannot be undone.</strong><br /><br />
                Are you sure you want to delete <strong>{deleteModal.name}</strong> (@{deleteModal.username || deleteModal.email})?
                All their builds and data will be permanently removed.
              </div>
            </div>
            <div className="admin-modal-footer">
              <button className="admin-btn admin-btn-ghost" onClick={() => setDeleteModal(null)}>Cancel</button>
              <button className="admin-btn" style={{ background: "#dc2626", color: "#fff" }} onClick={handleDelete}>
                Yes, Delete User
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
