import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("login");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const ADMIN_CREDENTIALS = {
    phone: "9999999999",
    password: "admin@123",
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    if (tab === "login" && (phone.length < 10 || !password)) return;
    if (tab === "signup" && (!name || !email || phone.length < 6)) return;

    setLoading(true);
    setTimeout(() => {
      if (tab === "login") {
        if (phone === ADMIN_CREDENTIALS.phone && password === ADMIN_CREDENTIALS.password) {
          localStorage.setItem("adminAuth", "true");
          navigate("/Admin");
          setLoading(false);
          return;
        }
      }

      localStorage.removeItem("adminAuth");
      localStorage.setItem("user", JSON.stringify({ phone, name: name || "Traveller", email }));
      navigate("/home");
    }, 1200);
  };

  return (
    <div className="login-page">
      {/* Left: Background image with tagline */}
      <div className="login-bg">
        <div className="login-bg-content">
          <h1>Move Freely.<br />Deliver Smartly.</h1>
          <p>
            Book rides, ship goods, explore cities — all from one platform.
            Your trusted travel companion, available 24/7.
          </p>
          <div style={{ display: "flex", gap: "1.5rem", marginTop: "2rem" }}>
            {[
              { n: "50K+", l: "Happy Riders" },
              { n: "1200+", l: "Drivers" },
              { n: "4.9★", l: "App Rating" },
            ].map((s) => (
              <div key={s.l}>
                <div style={{ fontFamily: "Poppins, sans-serif", fontSize: "1.6rem", fontWeight: 800, color: "#f5a623" }}>{s.n}</div>
                <div style={{ fontSize: "0.78rem", opacity: 0.7 }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right: Form */}
      <div className="login-form-panel">
        <div className="login-form-box">
          <div className="login-logo">TravelGo</div>
          <div className="login-subtitle">Your journey starts here ✈️</div>

          {/* Tabs */}
          <div className="login-tabs">
            <button className={`login-tab${tab === "login" ? " active" : ""}`} onClick={() => setTab("login")}>
              Sign In
            </button>
            <button className={`login-tab${tab === "signup" ? " active" : ""}`} onClick={() => setTab("signup")}>
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {tab === "signup" && (
              <>
                <div className="input-group">
                  <label>Full Name</label>
                  <input
                    className="input-field"
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="input-group">
                  <label>Email Address</label>
                  <input
                    className="input-field"
                    type="email"
                    placeholder="john@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </>
            )}

            <div className="input-group">
              <label>Phone Number</label>
              <div className="phone-input-group">
                <div className="phone-prefix">🇮🇳 +91</div>
                <input
                  className="input-field"
                  type="tel"
                  placeholder="98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/, ""))}
                  maxLength={10}
                  required
                />
              </div>
            </div>

            {tab === "login" && (
              <div className="input-group">
                <label>Password</label>
                <input
                  className="input-field"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            )}

            {tab === "signup" && (
              <div className="input-group">
                <label>Create Password</label>
                <input className="input-field" type="password" placeholder="Min 8 characters" />
              </div>
            )}

            {error && (
              <div
                style={{
                  padding: "0.7rem 0.8rem",
                  borderRadius: "10px",
                  fontSize: "0.82rem",
                  color: "#b91c1c",
                  background: "#fee2e2",
                  border: "1px solid #fecaca",
                }}
              >
                {error}
              </div>
            )}

            <div className="login-form-actions">
              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: "100%", padding: "1rem", fontSize: "1rem", borderRadius: "12px" }}
                disabled={loading}
              >
                {loading ? (
                  <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <span style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "white", borderRadius: "50%", animation: "spin 0.8s linear infinite", display: "inline-block" }} />
                    Processing...
                  </span>
                ) : tab === "login" ? "Sign In →" : "Create Account →"}
              </button>
            </div>

            <div className="divider">or continue with</div>

            <div style={{ display: "flex", gap: "0.75rem" }}>
              <button type="button" className="social-btn" style={{ flex: 1 }}>
                <span style={{ fontSize: "1.1rem" }}>🌐</span> Google
              </button>
              <button type="button" className="social-btn" style={{ flex: 1 }}>
                <span style={{ fontSize: "1.1rem" }}>📘</span> Facebook
              </button>
            </div>
          </form>

          <div className="login-footer">
            By continuing, you agree to our{" "}
            <span style={{ color: "#e94560", cursor: "pointer" }}>Terms of Service</span>{" "}
            and{" "}
            <span style={{ color: "#e94560", cursor: "pointer" }}>Privacy Policy</span>
          </div>

        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

export default Login;
