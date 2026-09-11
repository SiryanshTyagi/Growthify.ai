import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Context } from "../context/AuthContext.jsx";
import { C, font } from "../theme/theme.js";

const Register = () => {
  const navigate = useNavigate();
  const { registerUser } = useContext(Context);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await registerUser(form);
      toast.success("Account created");
      navigate("/");
    } catch (error) {
      const message = error.response?.data?.message || "Registration failed";
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
        <h1 style={{ color: C.textPrimary, fontSize: 28, margin: 0 }}>Register</h1>
        <p style={{ color: C.textSecondary, fontSize: 13, marginTop: 8 }}>Create your GrowthSync account.</p>

        <div style={{ marginTop: 16 }}>
          <label style={{ color: C.textSecondary, fontSize: 12 }}>Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={onChange}
            required
            style={{ width: "100%", marginTop: 6, background: C.bgSidebar, border: `1px solid ${C.border}`, color: C.textPrimary, borderRadius: 8, padding: "10px 12px" }}
          />
        </div>

        <div style={{ marginTop: 12 }}>
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
          {loading ? "Creating account..." : "Register"}
        </button>

        <p style={{ color: C.textSecondary, fontSize: 12, marginTop: 14, textAlign: "center" }}>
          Already have an account? <Link to="/login" style={{ color: C.accent }}>Login</Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
