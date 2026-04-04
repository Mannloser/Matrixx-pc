import { useState, useEffect, useRef } from "react";
import { Link, useLocation, Outlet, useNavigate } from "react-router-dom";
import "./css/adminLayout.css";

const NAV_ITEMS = [
  { to: "/admin",            icon: "⚡", label: "Dashboard"           },
  { to: "/admin/parts",      icon: "🧩", label: "Parts Manager"       },
  { to: "/admin/prebuilds",  icon: "🖥️", label: "Pre-built Templates" },
  { to: "/admin/users",      icon: "👥", label: "Users Manager"       },
];

export default function AdminLayout() {
  const [collapsed, setCollapsed]       = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [adminUser, setAdminUser]       = useState(null);

  const location   = useLocation();
  const navigate   = useNavigate();
  const dropdownRef = useRef(null);

  /* ── Load admin info from localStorage ── */
  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      try { setAdminUser(JSON.parse(stored)); } catch { /* ignore */ }
    }
  }, []);

  /* ── Close dropdown on outside click ── */
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const isActive = (path) =>
    path === "/admin"
      ? location.pathname === "/admin"
      : location.pathname.startsWith(path);

  /* ── Derive initial from stored user ── */
  const getInitial = () => {
    if (adminUser?.username) return adminUser.username[0].toUpperCase();
    if (adminUser?.name)     return adminUser.name[0].toUpperCase();
    return "A";
  };

  const getDisplayName = () =>
    adminUser?.name || adminUser?.username || "Admin";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <>
      <div className="admin-root">

        {/* ── SIDEBAR ── */}
        <aside className={`admin-sidebar ${collapsed ? "collapsed" : ""}`}>

          {/* Top: logo + toggle */}
          <div className="admin-sidebar-top">
            <Link to="/admin" className="admin-logo">
              Matri<span>xx</span>
            </Link>
            <button className="admin-toggle-btn" onClick={() => setCollapsed(p => !p)}>
              {collapsed ? "▶" : "◀"}
            </button>
          </div>

          {/* Nav */}
          <nav className="admin-nav">
            <div className="admin-nav-section">Navigation</div>

            {NAV_ITEMS.map(item => (
              <Link
                key={item.to}
                to={item.to}
                className={`admin-nav-item ${isActive(item.to) ? "active" : ""}`}
              >
                <span className="admin-nav-icon">{item.icon}</span>
                <span className="admin-nav-label">{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* Bottom: back to site */}
          <div className="admin-sidebar-bottom">
            <Link to="/" className="admin-back-link">
              <span>←</span>
              <span>Back to site</span>
            </Link>
          </div>

        </aside>

        {/* ── MAIN ── */}
        <div className={`admin-main ${collapsed ? "collapsed" : ""}`}>

          {/* Top bar */}
          <header className="admin-topbar">
            <div className="admin-topbar-left">
              <span className="admin-topbar-title">
                {NAV_ITEMS.find(n => isActive(n.to))?.label ?? "Admin"}
              </span>
            </div>

            <div className="admin-topbar-right">
              <span className="admin-topbar-badge">Admin</span>

              {/* Avatar with dropdown */}
              <div className="admin-avatar-wrapper" ref={dropdownRef}>
                <div
                  className="admin-topbar-avatar"
                  title={getDisplayName()}
                  onClick={() => setDropdownOpen(p => !p)}
                >
                  {getInitial()}
                </div>

                {dropdownOpen && (
                  <div className="admin-avatar-dropdown">
                    {/* User info header */}
                    <div className="admin-dd-header">
                      <div className="admin-dd-avatar">{getInitial()}</div>
                      <div className="admin-dd-info">
                        <div className="admin-dd-name">{getDisplayName()}</div>
                        {adminUser?.email && (
                          <div className="admin-dd-email">{adminUser.email}</div>
                        )}
                      </div>
                    </div>

                    <div className="admin-dd-divider" />

                    {/* Menu items */}
                    <Link
                      to="/profile"
                      className="admin-dd-item"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <span className="admin-dd-icon">👤</span>
                      My Profile
                    </Link>

                    <Link
                      to="/"
                      className="admin-dd-item"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <span className="admin-dd-icon">🏠</span>
                      Back to Website
                    </Link>

                    <div className="admin-dd-divider" />

                    <button
                      className="admin-dd-item admin-dd-logout"
                      onClick={handleLogout}
                    >
                      <span className="admin-dd-icon">🚪</span>
                      Log Out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </header>

          {/* Page content injected here */}
          <main className="admin-content">
            <Outlet />
          </main>

        </div>
      </div>
    </>
  );
}
