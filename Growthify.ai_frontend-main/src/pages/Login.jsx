import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Context } from "../context/AuthContext.jsx";
import { C, font } from "../theme/theme.js";

const Login = () => {
  const navigate = useNavigate();
  const { loginUser } = useContext(Context);
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await loginUser(form);
      toast.success("Login successful");
      navigate("/");
    } catch (error) {
      const message = error.response?.data?.message || "Login failed";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: C.bgPage, display: "grid", placeItems: "center", padding: 16, fontFamily: font }}>
      <form
        onSubmit={onSubmit}
        style={{ width: "100%", maxWidth: 420, background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 14, padding: 24 }}
      >
        <h1 style={{ color: C.textPrimary, fontSize: 28, margin: 0 }}>Login</h1>
        <p style={{ color: C.textSecondary, fontSize: 13, marginTop: 8 }}>Access your GrowthSync dashboard.</p>

        <div style={{ marginTop: 16 }}>
          <label style={{ color: C.textSecondary, fontSize: 12 }}>Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={onChange}
            required
            style={{ width: "100%", marginTop: 6, background: C.bgSidebar, border: `1px solid ${C.border}`, color: C.textPrimary, borderRadius: 8, padding: "10px 12px" }}
          />
        </div>

        <div style={{ marginTop: 12 }}>
          <label style={{ color: C.textSecondary, fontSize: 12 }}>Password</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={onChange}
            required
            minLength={6}
            style={{ width: "100%", marginTop: 6, background: C.bgSidebar, border: `1px solid ${C.border}`, color: C.textPrimary, borderRadius: 8, padding: "10px 12px" }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{ marginTop: 16, width: "100%", background: C.accent, color: C.textDark, border: "none", borderRadius: 8, padding: "10px 12px", fontWeight: 700, cursor: "pointer", opacity: loading ? 0.7 : 1 }}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p style={{ color: C.textSecondary, fontSize: 12, marginTop: 14, textAlign: "center" }}>
          New user? <Link to="/register" style={{ color: C.accent }}>Create account</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
