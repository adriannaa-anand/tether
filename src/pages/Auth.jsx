import { useState } from "react";
import { loginUser, registerUser } from "../api";
import "./Auth.css";

export default function Auth({ onLogin }) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState(null);

  const update = (field, val) => {
    setForm((prev) => ({ ...prev, [field]: val }));
    setErrors((prev) => ({ ...prev, [field]: null }));
    setServerError(null);
  };

  const validate = () => {
    const e = {};
    if (mode === "register" && !form.name.trim()) e.name = "Name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email";
    if (!form.password) e.password = "Password is required";
    else if (form.password.length < 6) e.password = "At least 6 characters";
    if (mode === "register" && form.password !== form.confirm) e.confirm = "Passwords don't match";
    return e;
  };

  const submit = async () => {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    setLoading(true);
    setServerError(null);
    try {
      const res = mode === "login"
        ? await loginUser({ email: form.email, password: form.password })
        : await registerUser({ name: form.name, email: form.email, password: form.password });
      if (res.error) { setServerError(res.error); return; }
      localStorage.setItem("tether-token", res.token);
      onLogin(res.user);
    } catch {
      setServerError("Something went wrong. Is the server running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-screen">
      <div className="auth-orbs">
        <div className="auth-orb auth-orb1" />
        <div className="auth-orb auth-orb2" />
        <div className="auth-orb auth-orb3" />
      </div>
      <div className="auth-box">
        <div className="auth-logo">◎ Tether</div>
        <p className="auth-tagline">A quiet space for hard feelings.</p>
        <div className="auth-tabs">
          <button className={`auth-tab ${mode === "login" ? "active" : ""}`} onClick={() => { setMode("login"); setErrors({}); setServerError(null); }}>Sign in</button>
          <button className={`auth-tab ${mode === "register" ? "active" : ""}`} onClick={() => { setMode("register"); setErrors({}); setServerError(null); }}>Create account</button>
        </div>
        <div className="auth-form">
          {mode === "register" && (
            <div className="field">
              <label>Your name</label>
              <input type="text" placeholder="What should we call you?" value={form.name} onChange={(e) => update("name", e.target.value)} className={errors.name ? "error" : ""} />
              {errors.name && <span className="field-error">{errors.name}</span>}
            </div>
          )}
          <div className="field">
            <label>Email</label>
            <input type="text" placeholder="you@example.com" value={form.email} onChange={(e) => update("email", e.target.value)} className={errors.email ? "error" : ""} />
            {errors.email && <span className="field-error">{errors.email}</span>}
          </div>
          <div className="field">
            <label>Password</label>
            <input type="password" placeholder={mode === "register" ? "At least 6 characters" : "Your password"} value={form.password} onChange={(e) => update("password", e.target.value)} className={errors.password ? "error" : ""} />
            {errors.password && <span className="field-error">{errors.password}</span>}
          </div>
          {mode === "register" && (
            <div className="field">
              <label>Confirm password</label>
              <input type="password" placeholder="Repeat your password" value={form.confirm} onChange={(e) => update("confirm", e.target.value)} className={errors.confirm ? "error" : ""} />
              {errors.confirm && <span className="field-error">{errors.confirm}</span>}
            </div>
          )}
          {serverError && <div className="server-error">{serverError}</div>}
          <button className="btn btn-primary auth-submit" onClick={submit} disabled={loading}>
            {loading ? "Just a moment..." : mode === "login" ? "Sign in →" : "Create my account →"}
          </button>
        </div>
        <p className="auth-switch">
          {mode === "login" ? "New here?" : "Already have an account?"}{" "}
          <button onClick={() => { setMode(mode === "login" ? "register" : "login"); setErrors({}); setServerError(null); }}>
            {mode === "login" ? "Create an account" : "Sign in"}
          </button>
        </p>
        <p className="auth-privacy">🔒 Your data is private. We never sell or share it.</p>
      </div>
    </div>
  );
}
