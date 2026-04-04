import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api/axios";

import "./css/login.css";

export default function LoginPage() {
  const [credential, setCredential]    = useState("");
  const [msg,    setMsg]    = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [focused,  setFocused]  = useState("");
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate(); 

  // Validation functions
  const validateCredential = (credentialValue) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!credentialValue.trim()) {
      return "Email or username is required";
    }
    
    // Check if it's a valid email format
    const isEmail = emailRegex.test(credentialValue);
    
    // Check if it's a valid username (3-20 chars, lowercase alphanumeric with - and _)
    const isUsername = /^[a-z0-9_-]{3,20}$/.test(credentialValue.trim());
    
    if (!isEmail && !isUsername) {
      return "Please enter a valid email or username (lowercase only)";
    }
    return "";
  };

  const validatePassword = (passwordValue) => {
    if (!passwordValue) {
      return "Password is required";
    }
    if (passwordValue.length < 6) {
      return "Password must be at least 6 characters long";
    }
    return "";
  };

  const validateForm = () => {
    const newErrors = {};
    
    const credentialError = validateCredential(credential);
    if (credentialError) newErrors.credential = credentialError;
    
    const passwordError = validatePassword(password);
    if (passwordError) newErrors.password = passwordError;
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCredentialChange = (e) => {
    const value = e.target.value;
    setCredential(value);
    // Real-time validation
    if (errors.credential) {
      setErrors({ ...errors, credential: validateCredential(value) || "" });
    }
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    // Real-time validation
    if (errors.password) {
      setErrors({ ...errors, password: validatePassword(value) || "" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setMsg("");
      return;
    }

    setIsSubmitting(true);
    setMsg("");

    try {
      const response = await api.post("/auth/login", { credential, password });
      console.log("Login successful:", response.data);

      // Save token AND user data to localStorage
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      setMsg("Login successful! Redirecting...");
      setTimeout(() => navigate("/"), 1000); 
    } catch (error) {
      setMsg(error.response?.data?.message || "An error occurred");
      setIsSubmitting(false);
    }
  };

  return (
    <>

      <div className="auth-root">

        {/* ── LEFT: BRAND PANEL ── */}
        <div className="auth-left">
          <Link to="/" className="auth-left-logo">Matri<span>xx</span></Link>

          <div className="auth-left-content">
            <div className="auth-left-eyebrow">PC Part Picker</div>
            <h1 className="auth-left-headline">
              Build your<br /><em>dream rig.</em><br />Your way.
            </h1>
            <p className="auth-left-desc">
              Save builds, track prices, and compare components — all in one place designed for builders.
            </p>

            <div className="auth-features">
              {[
                ["⚡", "Smart compatibility checking"],
                ["💾", "Save unlimited builds"],
                ["📊", "Real-time price tracking"],
              ].map(([icon, text]) => (
                <div className="auth-feature" key={text}>
                  <div className="auth-feature-icon">{icon}</div>
                  <span className="auth-feature-text">{text}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="auth-left-bottom">© 2025 Matrixx. All rights reserved.</div>
        </div>

        {/* ── RIGHT: FORM PANEL ── */}
        <div className="auth-right">
          <div className="auth-form-wrap">

            <div className="auth-form-eyebrow">Welcome back</div>
            <h2 className="auth-form-title">Sign in to Matrixx</h2>
            <p className="auth-form-sub">
              New here? <Link to="/register">Create an account →</Link>
            </p>

            <form onSubmit={handleSubmit}>
              
              {msg && (
                <div className={`auth-message ${msg.includes("successful") ? "success" : "error"}`}>
                  {msg}
                </div>
              )}

              <div className="input-group">
                <label className={`input-label ${focused === "credential" || credential ? "active" : ""}`}>
                  Email or Username
                </label>
                <div className="input-field-wrap">
                  <input
                    type="text"
                    className={`input-field ${errors.credential ? "input-error" : ""}`}
                    placeholder="you@example.com or john_builds"
                    value={credential}
                    onChange={handleCredentialChange}
                    onFocus={() => setFocused("credential")}
                    onBlur={() => setFocused("")}
                    required
                  />
                </div>
                {errors.credential && <p className="error-text">{errors.credential}</p>}
              </div>

              <div className="input-group">
                <label className={`input-label ${focused === "password" || password ? "active" : ""}`}>
                  Password
                </label>
                <div className="input-field-wrap">
                  <input
                    type={showPass ? "text" : "password"}
                    className={`input-field has-suffix ${errors.password ? "input-error" : ""}`}
                    placeholder="Enter your password"
                    value={password}
                    onChange={handlePasswordChange}
                    onFocus={() => setFocused("password")}
                    onBlur={() => setFocused("")}
                    required
                  />
                  <button
                    type="button"
                    className="input-suffix"
                    onClick={() => setShowPass(!showPass)}
                    tabIndex={-1}
                  >
                    {showPass ? "🙈" : "👁️"}
                  </button>
                </div>
                {errors.password && <p className="error-text">{errors.password}</p>}
              </div>

              <Link to="/forgot-password" className="forgot-link">Forgot password?</Link>

              <button 
                type="submit" 
                className="auth-submit"
                disabled={isSubmitting || Object.keys(errors).length > 0}
              >
                {isSubmitting ? "Signing in..." : "Sign in to Matrixx"}
              </button>

            </form>

          </div>
        </div>

      </div>
    </>
  );
}