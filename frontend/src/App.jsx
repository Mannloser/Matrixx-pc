import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";

import Header        from "./components/Header";
import Footer        from "./components/Footer";
import SessionExpiredModal from "./components/SessionExpiredModal";

// Client pages
import Home          from "./pages/client/home";
import Builder       from "./pages/client/builder";
import Guide         from "./pages/client/guide";
import Guides        from "./pages/client/guides";
import PreBuilds     from "./pages/client/prebuilds";
import Compatibility from "./pages/client/compatibility";
import Login         from "./pages/auth/login";
import Register      from "./pages/auth/register";
import Product       from "./pages/client/products/product";
import NotFound      from "./pages/404";

// Admin pages
import AdminLayout           from "./pages/admin/AdminLayout";
import AdminDashboard        from "./pages/admin/AdminDashboard";
import AdminPartsManager     from "./pages/admin/AdminPartsManager";
import AdminPrebuildsManager from "./pages/admin/AdminPrebuildsManager";
import AdminUsersManager     from "./pages/admin/AdminUsersManager";

// Other pages
import ProfilePage from "./pages/other/profile";
import AboutPage   from "./pages/other/about";
import CareersPage from "./pages/other/careers";

/* ── Admin route guard ── */
function RequireAdmin({ children }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));

    // Token expired check
    if (payload.exp && payload.exp * 1000 < Date.now()) {
      localStorage.removeItem("token");
      return <Navigate to="/login" replace />;
    }

    if (payload.role !== "admin") {
      return <Navigate to="/" replace />;
    }
  } catch {
    localStorage.removeItem("token");
    return <Navigate to="/login" replace />;
  }

  return children;
}

function Layout() {
  const location = useLocation();
  const [sessionExpired, setSessionExpired] = useState(false);

  // Listen for session-expired event fired by axios interceptor
  useEffect(() => {
    const handler = () => setSessionExpired(true);
    window.addEventListener("session-expired", handler);
    return () => window.removeEventListener("session-expired", handler);
  }, []);

  // Auto-show modal when token expires (even if user is idle)
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const expiresAt = payload.exp * 1000; // convert seconds → ms
      const timeLeft  = expiresAt - Date.now();

      if (timeLeft <= 0) {
        setSessionExpired(true);
        return;
      }

      const timer = setTimeout(() => {
        setSessionExpired(true);
      }, timeLeft);

      return () => clearTimeout(timer);
    } catch {
      // Malformed token — ignore
    }
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const isAdmin   = location.pathname.startsWith("/admin");
  const hideLayout = location.pathname === "/login" ||
                     location.pathname === "/register" ||
                     isAdmin;

  return (
    <>
      {!hideLayout && <Header />}
      <Routes>
        {/* Client */}

        <Route path="/"               element={<Home />} />
        <Route path="/login"          element={<Login />} />
        <Route path="/register"       element={<Register />} />
        <Route path="/builder"        element={<Builder />} />
        <Route path="/prebuilds"      element={<PreBuilds />} />
        <Route path="/guides"         element={<Guides />} />
        <Route path="/guides/:slug"   element={<Guide />} />
        <Route path="/products/:slug" element={<Product />} />
        <Route path="/compatibility"  element={<Compatibility />} />
        <Route path="/about"          element={<AboutPage />} />
        <Route path="/profile"        element={<ProfilePage />} />
        <Route path="/careers"        element={<CareersPage />} />

        {/* Admin — protected by RequireAdmin */}
        <Route path="/admin" element={<RequireAdmin><AdminLayout /></RequireAdmin>}>
          <Route index            element={<AdminDashboard />} />
          <Route path="parts"     element={<AdminPartsManager />} />
          <Route path="prebuilds" element={<AdminPrebuildsManager />} />
          <Route path="users"     element={<AdminUsersManager />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
      {!hideLayout && <Footer />}

      {/* Session expired modal — always rendered, shown on 401 */}
      <SessionExpiredModal open={sessionExpired} />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}

export default App;
