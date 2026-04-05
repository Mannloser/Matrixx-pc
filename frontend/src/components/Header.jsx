import { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./css/header.css"; // adjust path if needed

const Header = () => {
  const [productsOpen, setProductsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const profileRef = useRef(null);
  const productsRef = useRef(null);

  const token = localStorage.getItem("token");
  const user = (() => {
    try { return JSON.parse(localStorage.getItem("user")); }
    catch { return null; }
  })();

  const isActive = (path) => location.pathname === path;

  // Close profile dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
      if (productsRef.current && !productsRef.current.contains(e.target)) {
        setProductsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setMobileProductsOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setProfileOpen(false);
    navigate("/");
    window.location.reload();
  };

  const getInitial = () => {
    if (user?.username) return user.username[0].toUpperCase();
    if (user?.name) return user.name[0].toUpperCase();
    return "?";
  };

  return (
    <>
      <style>{`
        .profile-wrap { position: relative; }
        .profile-avatar-btn {
          width: 36px; height: 36px; border-radius: 50%;
          background: var(--navy); border: 2px solid var(--sky);
          display: flex; align-items: center; justify-content: center;
          font-family: var(--font-display); font-size: 0.8rem; font-weight: 700;
          color: var(--white); cursor: pointer; outline: none;
          transition: all 0.18s;
        }
        .profile-avatar-btn:hover, .profile-avatar-btn.open {
          border-color: var(--teal);
          box-shadow: 0 0 0 3px rgba(93,124,141,0.2);
        }
        .profile-dropdown {
          position: absolute; top: calc(100% + 10px); right: 0;
          background: var(--white); border: 1.5px solid var(--sky);
          border-radius: 14px; min-width: 210px;
          box-shadow: 0 16px 48px rgba(47,65,86,0.14);
          overflow: hidden; z-index: 999;
          opacity: 0; pointer-events: none;
          transform: translateY(-6px);
          transition: opacity 0.18s ease, transform 0.18s ease;
        }
        .profile-dropdown.open { opacity: 1; pointer-events: all; transform: translateY(0); }
        .profile-dd-head { padding: 13px 16px 11px; border-bottom: 1px solid var(--sky); background: var(--beige); }
        .profile-dd-name { font-family: var(--font-display); font-size: 0.88rem; font-weight: 700; color: var(--navy); }
        .profile-dd-username { font-size: 0.72rem; color: var(--teal); margin-top: 2px; }
        .profile-dd-menu { padding: 6px; }
        .profile-dd-item {
          display: flex; align-items: center; gap: 9px;
          padding: 9px 10px; border-radius: 8px;
          font-size: 0.82rem; color: var(--navy); text-decoration: none;
          transition: background 0.13s; cursor: pointer;
          background: none; border: none; width: 100%;
          font-family: var(--font-body); text-align: left;
        }
        .profile-dd-item:hover { background: var(--beige); }
        .profile-dd-item.danger { color: #ef4444; }
        .profile-dd-item.danger:hover { background: #fee2e2; }
        .profile-dd-icon { font-size: 0.9rem; width: 18px; text-align: center; }
        .profile-dd-divider { height: 1px; background: var(--sky); margin: 4px 6px; }
      `}</style>

      {/* ── TOP NAVBAR ── */}
      <nav className="top-nav">
        <Link to="/" className="logo">Matri<span>xx</span></Link>

        {/* Hamburger (mobile only) */}
        <button
          className={`hamburger ${mobileMenuOpen ? "open" : ""}`}
          onClick={() => setMobileMenuOpen(p => !p)}
          aria-label="Toggle menu"
        >
          <span /><span /><span />
        </button>

        <div className="top-nav-actions">
          {token && user ? (
            <div className="profile-wrap" ref={profileRef}>
              <button
                className={`profile-avatar-btn ${profileOpen ? "open" : ""}`}
                onClick={() => setProfileOpen(p => !p)}
                title={user.username || user.name}
              >
                {getInitial()}
              </button>
              <div className={`profile-dropdown ${profileOpen ? "open" : ""}`}>
                <div className="profile-dd-head">
                  <div className="profile-dd-name">{user.name}</div>
                  {user.username && <div className="profile-dd-username">@{user.username}</div>}
                </div>
                <div className="profile-dd-menu">
                  <Link to="/profile" className="profile-dd-item" onClick={() => setProfileOpen(false)}>
                    <span className="profile-dd-icon">👤</span> My Profile
                  </Link>
                  <Link to="/builder" className="profile-dd-item" onClick={() => setProfileOpen(false)}>
                    <span className="profile-dd-icon">⚡</span> My Builds
                  </Link>
                  {user.role === "admin" && (
                    <>
                      <div className="profile-dd-divider" />
                      <Link to="/admin" className="profile-dd-item" onClick={() => setProfileOpen(false)}>
                        <span className="profile-dd-icon">🛡️</span> Dashboard
                      </Link>
                    </>
                  )}
                  <div className="profile-dd-divider" />
                  <button className="profile-dd-item danger" onClick={handleLogout}>
                    <span className="profile-dd-icon">🚪</span> Sign out
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <>
              <Link to="/login"><button className="btn btn-ghost">Log In</button></Link>
              <Link to="/register"><button className="btn btn-primary">Register</button></Link>
            </>
          )}
        </div>
      </nav>

      {/* ── SEMI NAVBAR (desktop) ── */}
      <nav className="semi-nav">

        {/* Builder */}
        <div className="semi-nav-item">
          <Link
            to="/builder"
            className={`semi-nav-link ${isActive("/builder") ? "active" : ""}`}
          >
            ⚡ Builder
          </Link>
        </div>

        {/* Products dropdown */}
        <div className="semi-nav-item" ref={productsRef}>
          <button
            className={`semi-nav-link ${productsOpen ? "active" : ""}`}
            onClick={() => setProductsOpen((prev) => !prev)}
          >
            Products
            <span className={`chevron ${productsOpen ? "open" : ""}`} />
          </button>

          <div className={`dropdown ${productsOpen ? "open" : ""}`}>
            <div className="dropdown-group-label">Core Components</div>
            <Link to="/products/cpu" className="dropdown-link">
              <span className="dropdown-icon">🧠</span> CPUs &amp; Processors
            </Link>
            <Link to="/products/gpu" className="dropdown-link">
              <span className="dropdown-icon">🎮</span> Graphics Cards
            </Link>
            <Link to="/products/motherboard" className="dropdown-link">
              <span className="dropdown-icon">🟩</span> Motherboards
            </Link>
            <Link to="/products/ram" className="dropdown-link">
              <span className="dropdown-icon">💾</span> Memory (RAM)
            </Link>

            <div className="dropdown-divider" />
            <div className="dropdown-group-label">Storage &amp; Power</div>
            <Link to="/products/storage" className="dropdown-link">
              <span className="dropdown-icon">💿</span> SSDs &amp; HDDs
            </Link>
            <Link to="/products/psu" className="dropdown-link">
              <span className="dropdown-icon">⚡</span> Power Supplies
            </Link>

            <div className="dropdown-divider" />
            <div className="dropdown-group-label">Cooling &amp; Case</div>
            <Link to="/products/cooling" className="dropdown-link">
              <span className="dropdown-icon">❄️</span> CPU Coolers
            </Link>
            <Link to="/products/case" className="dropdown-link">
              <span className="dropdown-icon">🏠</span> PC Cases
            </Link>
          </div>
        </div>

        {/* Pre-builds */}
        <div className="semi-nav-item">
          <Link
            to="/prebuilds"
            className={`semi-nav-link ${isActive("/prebuilds") ? "active" : ""}`}
          >
            🖥️ Pre-built Systems
          </Link>
        </div>

      </nav>

      {/* ── MOBILE DRAWER ── */}
      {mobileMenuOpen && (
        <div className="mobile-overlay" onClick={() => setMobileMenuOpen(false)} />
      )}
      <div className={`mobile-drawer ${mobileMenuOpen ? "open" : ""}`}>
        <Link
          to="/builder"
          className={`mobile-nav-link ${isActive("/builder") ? "active" : ""}`}
        >
          ⚡ Builder
        </Link>

        {/* Mobile Products accordion */}
        <div className="mobile-nav-section">
          <button
            className={`mobile-nav-link mobile-nav-toggle ${mobileProductsOpen ? "active" : ""}`}
            onClick={() => setMobileProductsOpen(p => !p)}
          >
            Products
            <span className={`chevron ${mobileProductsOpen ? "open" : ""}`} />
          </button>

          {mobileProductsOpen && (
            <div className="mobile-products-list">
              <div className="mobile-group-label">Core Components</div>
              <Link to="/products/cpu" className="mobile-product-link"><span>🧠</span> CPUs &amp; Processors</Link>
              <Link to="/products/gpu" className="mobile-product-link"><span>🎮</span> Graphics Cards</Link>
              <Link to="/products/motherboard" className="mobile-product-link"><span>🟩</span> Motherboards</Link>
              <Link to="/products/ram" className="mobile-product-link"><span>💾</span> Memory (RAM)</Link>

              <div className="mobile-group-label" style={{ marginTop: "10px" }}>Storage &amp; Power</div>
              <Link to="/products/storage" className="mobile-product-link"><span>💿</span> SSDs &amp; HDDs</Link>
              <Link to="/products/psu" className="mobile-product-link"><span>⚡</span> Power Supplies</Link>

              <div className="mobile-group-label" style={{ marginTop: "10px" }}>Cooling &amp; Case</div>
              <Link to="/products/cooling" className="mobile-product-link"><span>❄️</span> CPU Coolers</Link>
              <Link to="/products/case" className="mobile-product-link"><span>🏠</span> PC Cases</Link>
            </div>
          )}
        </div>

        <Link
          to="/prebuilds"
          className={`mobile-nav-link ${isActive("/prebuilds") ? "active" : ""}`}
        >
          🖥️ Pre-built Systems
        </Link>
      </div>
    </>
  );
};

export default Header;
