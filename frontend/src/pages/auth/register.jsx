import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";
import "./css/register.css";


export default function RegisterPage() {
  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirm: ""
  });
  const [showPass, setShowPass] = useState(false);
  const [focused, setFocused] = useState("");
  const [msg, setMsg] = useState("");
  const [step, setStep] = useState(1); // 1 = details, 2 = success
  const [errors, setErrors] = useState({});
  const [checking, setChecking] = useState({ username: false, email: false });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const update = (field) => (e) => {
    const value = e.target.value;
    setForm({ ...form, [field]: value });
    // Real-time validation
    if (errors[field]) {
      validateField(field, value);
    }
  };

  // Validation functions
  const validateName = (name) => {
    if (!name.trim()) return "Full name is required";
    if (name.trim().length < 2) return "Name must be at least 2 characters";
    return "";
  };

  const validateUsername = (username) => {
    if (!username.trim()) return "Username is required";
    if (username.length < 3) return "Username must be at least 3 characters";
    if (username.length > 20) return "Username must be at most 20 characters";
    if (!/^[a-z0-9_-]+$/.test(username)) return "Username can only contain lowercase letters, numbers, hyphens, and underscores";
    return "";
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) return "Email is required";
    if (!emailRegex.test(email)) return "Please enter a valid email address";
    return "";
  };

  const validatePassword = (password) => {
    if (!password) return "Password is required";
    if (password.length < 8) return "Password must be at least 8 characters";
    if (!/[A-Z]/.test(password)) return "Password must contain at least one uppercase letter";
    if (!/[0-9]/.test(password)) return "Password must contain at least one number";
    return "";
  };

  const validateConfirmPassword = (confirm, password) => {
    if (!confirm) return "Please confirm your password";
    if (confirm !== password) return "Passwords don't match";
    return "";
  };

  // Check if username exists
  const checkUsernameExists = async (username) => {
    if (!username || username.length < 3) return;
    
    setChecking(prev => ({ ...prev, username: true }));
    try {
      const response = await api.post("/auth/check-username", { username });
      if (response.data.exists) {
        setErrors(prev => ({ ...prev, username: "Username already taken. Try another one." }));
      } else {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors.username;
          return newErrors;
        });
      }
    } catch (error) {
      setErrors(prev => ({ ...prev, username: "Error checking username" }));
    } finally {
      setChecking(prev => ({ ...prev, username: false }));
    }
  };

  // Check if email exists
  const checkEmailExists = async (email) => {
    if (!email || !email.includes("@")) return;
    
    setChecking(prev => ({ ...prev, email: true }));
    try {
      const response = await api.post("/auth/check-email", { email });
      if (response.data.exists) {
        setErrors(prev => ({ ...prev, email: "Email already exists. Try logging in instead." }));
      } else {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors.email;
          return newErrors;
        });
      }
    } catch (error) {
      setErrors(prev => ({ ...prev, email: "Error checking email" }));
    } finally {
      setChecking(prev => ({ ...prev, email: false }));
    }
  };

  // Validate individual field
  const validateField = (field, value) => {
    let error = "";
    
    switch(field) {
      case "name":
        error = validateName(value);
        break;
      case "username":
        error = validateUsername(value);
        if (!error && value.trim().length >= 3) {
          checkUsernameExists(value.trim());
        }
        break;
      case "email":
        error = validateEmail(value);
        if (!error && value.includes("@")) {
          checkEmailExists(value.trim());
        }
        break;
      case "password":
        error = validatePassword(value);
        break;
      case "confirm":
        error = validateConfirmPassword(value, form.password);
        break;
      default:
        break;
    }
    
    if (error) {
      setErrors(prev => ({ ...prev, [field]: error }));
    } else {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  // Validate entire form
  const validateFormComplete = () => {
    const newErrors = {};
    
    if (validateName(form.name)) newErrors.name = validateName(form.name);
    if (validateUsername(form.username)) newErrors.username = validateUsername(form.username);
    if (validateEmail(form.email)) newErrors.email = validateEmail(form.email);
    if (validatePassword(form.password)) newErrors.password = validatePassword(form.password);
    if (validateConfirmPassword(form.confirm, form.password)) newErrors.confirm = validateConfirmPassword(form.confirm, form.password);
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0 && !checking.username && !checking.email;
  };

  const passwordStrength = (pw) => {
    if (!pw) return 0;
    let score = 0;
    if (pw.length >= 8) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    return score;
  };

  const strength = passwordStrength(form.password);
  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"][strength];
  const strengthColor = ["", "#ef4444", "#f59e0b", "#3b82f6", "#22c55e"][strength];
  const passwordsMatch = form.password && form.confirm && form.password === form.confirm;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateFormComplete()) {
      setMsg("");
      return;
    }

    setIsSubmitting(true);
    setMsg("");

    try {
      const { confirm, ...data } = form;
      const response = await api.post("/auth/register", data);

      setMsg(response.data.message);
      setStep(2);
    } catch (error) {
      setMsg(error.response?.data?.message || "An error occurred");
      setIsSubmitting(false);
    }
  };

  if (step === 2) return (
    <>
      <div className="success-page">
        <div className="success-card">
          <div className="success-icon">🎉</div>
          <div className="success-title">You're in, {form.name.split(" ")[0]}!</div>
          <p className="success-sub">Your Matrixx account is ready. Time to start building your dream rig.</p>
          <Link to="/login" className="success-btn">Sign in to your account →</Link>
        </div>
      </div>
    </>
  );

  return (
    <>

      <div className="auth-root">

        {/* ── LEFT PANEL ── */}
        <div className="auth-left">
          <Link to="/" className="auth-left-logo">Matri<span>xx</span></Link>

          <div className="auth-left-content">
            <div className="auth-left-eyebrow">Get started</div>
            <h1 className="auth-left-headline">
              Join the<br /><em>builder</em><br />community.
            </h1>
            <p className="auth-left-desc">
              Thousands of PC builders trust Matrixx to plan, compare, and perfect their builds.
            </p>

            <div className="auth-steps">
              {[
                ["01", "Create your account", "Takes less than 2 minutes"],
                ["02", "Start your first build", "Pick parts with smart filters"],
                ["03", "Save & share your rig", "Show off your build to others"],
              ].map(([num, title, sub]) => (
                <div className="auth-step" key={num}>
                  <div className="auth-step-num">{num}</div>
                  <div>
                    <div className="auth-step-text-title">{title}</div>
                    <div className="auth-step-text-sub">{sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="auth-left-bottom">© 2025 Matrixx. All rights reserved.</div>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div className="auth-right">
          <div className="auth-form-wrap">

            <div className="auth-form-eyebrow">Create account</div>
            <h2 className="auth-form-title">Join Matrixx</h2>
            <p className="auth-form-sub">
              Already have an account? <Link to="/login">Sign in →</Link>
            </p>

            <form onSubmit={handleSubmit}>

              {msg && (
                <div className={`auth-message ${msg.includes("error") || msg.includes("Error") ? "error" : "success"}`}>
                  {msg}
                </div>
              )}

              {/* Name row */}
              <div className="input-row">
                <div className="input-group">
                  <label className={`input-label ${focused === "fname" || form.name ? "active" : ""}`}>
                    Full name
                  </label>
                  <input
                    type="text" 
                    className={`input-field ${errors.name ? "input-error" : ""}`}
                    placeholder="John Doe"
                    value={form.name}
                    onChange={update("name")}
                    onFocus={() => setFocused("fname")}
                    onBlur={() => {
                      setFocused("");
                      validateField("name", form.name);
                    }}
                  />
                  {errors.name && <p className="error-text">{errors.name}</p>}
                </div>
                <div className="input-group">
                  <label className={`input-label ${focused === "username" ? "active" : ""}`}>
                    Username
                  </label>
                  <div className="input-field-wrap">
                    <input
                      type="text" 
                      className={`input-field ${errors.username ? "input-error" : ""}`}
                      value={form.username}
                      placeholder="john_builds"
                      onChange={update("username")}
                      onFocus={() => setFocused("username")}
                      onBlur={() => {
                        setFocused("");
                        validateField("username", form.username);
                      }}
                      required
                    />
                    {checking.username && <span className="checking-indicator">Checking...</span>}
                  </div>
                  {errors.username && <p className="error-text">{errors.username}</p>}
                </div>
              </div>

              {/* Email */}
              <div className="input-group">
                <label className={`input-label ${focused === "email" || form.email ? "active" : ""}`}>
                  Email address
                </label>
                <div className="input-field-wrap">
                  <input
                    type="email" 
                    className={`input-field ${errors.email ? "input-error" : ""}`}
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={update("email")}
                    onFocus={() => setFocused("email")}
                    onBlur={() => {
                      setFocused("");
                      validateField("email", form.email);
                    }}
                    required
                  />
                  {checking.email && <span className="checking-indicator">Checking...</span>}
                </div>
                {errors.email && <p className="error-text">{errors.email}</p>}
              </div>

              {/* Password */}
              <div className="input-group">
                <label className={`input-label ${focused === "password" || form.password ? "active" : ""}`}>
                  Password
                </label>
                <div className="input-field-wrap">
                  <input
                    type={showPass ? "text" : "password"}
                    className={`input-field has-suffix ${errors.password ? "input-error" : ""}`}
                    placeholder="Min 8 characters"
                    value={form.password}
                    onChange={update("password")}
                    onFocus={() => setFocused("password")}
                    onBlur={() => {
                      setFocused("");
                      validateField("password", form.password);
                    }}
                    required
                  />
                  <button type="button" className="input-suffix" onClick={() => setShowPass(!showPass)} tabIndex={-1}>
                    {showPass ? "🙈" : "👁️"}
                  </button>
                </div>
                {errors.password && <p className="error-text">{errors.password}</p>}
                {form.password && (
                  <>
                    <div className="pw-strength-bar">
                      {[1, 2, 3, 4].map(i => (
                        <div key={i} className="pw-strength-seg"
                          style={{ background: i <= strength ? strengthColor : undefined }} />
                      ))}
                    </div>
                    <div className="pw-strength-label" style={{ color: strengthColor }}>
                      {strengthLabel}
                    </div>
                  </>
                )}
              </div>

              {/* Confirm password */}
              <div className="input-group">
                <label className={`input-label ${focused === "confirm" || form.confirm ? "active" : ""}`}>
                  Confirm password
                </label>
                <div className="input-field-wrap">
                  <input
                    type={showPass ? "text" : "password"}
                    className={`input-field ${form.confirm && passwordsMatch ? "valid" : ""} ${errors.confirm ? "input-error" : ""}`}
                    placeholder="Repeat your password"
                    value={form.confirm}
                    onChange={update("confirm")}
                    onFocus={() => setFocused("confirm")}
                    onBlur={() => {
                      setFocused("");
                      validateField("confirm", form.confirm);
                    }}
                    required
                  />
                </div>
                {errors.confirm && <p className="error-text">{errors.confirm}</p>}
                {form.confirm && !errors.confirm && (
                  <div className="pw-match" style={{ color: passwordsMatch ? "#22c55e" : "#ef4444" }}>
                    {passwordsMatch ? "✓ Passwords match" : "✗ Passwords don't match"}
                  </div>
                )}
              </div>

              <p className="auth-terms">
                By creating an account you agree to our{" "}
                <a href="#">Terms of Service</a> and{" "}
                <a href="#">Privacy Policy</a>.
              </p>

              <button 
                type="submit" 
                className="auth-submit"
                disabled={isSubmitting || Object.keys(errors).length > 0 || checking.username || checking.email}
              >
                {isSubmitting ? "Creating account..." : "Create my account"}
              </button>

            </form>

          </div>
        </div>

      </div>
    </>
  );
}
