import { useState } from "react";
import { apiFetch, saveSession } from "../api/Client";
import { C, F, btn } from "../api/Tokens";

export default function LoginPage({ onLogin }) {
  const [form, setForm]     = useState({ email: "", password: "" });
  const [error, setError]   = useState("");
  const [loading, setLoading] = useState(false);

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) return setError("Completa todos los campos.");
    setError(""); setLoading(true);
    try {
      const data = await apiFetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(form),
      });

      console.log("Respuesta del backend:", data);

      saveSession(data.access_token, data.usuario);
      onLogin(data.usuario);
    } catch (err) {
      setError(err.message || "Credenciales incorrectas.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: `radial-gradient(ellipse at 20% 20%, #0d2240 0%, #08101e 70%)`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F.body }}>
      <div className="modal-anim" style={{ width: "100%", maxWidth: "440px", margin: "20px" }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{ fontFamily: F.display, fontSize: "38px", fontWeight: "800", color: "#fff", letterSpacing: "-1px" }}>
            Expos<span style={{ color: C.accent }}>Calif</span>
          </div>
          <p style={{ color: "#64748b", fontSize: "14px", marginTop: "6px" }}>Sistema de calificación de exposiciones</p>
        </div>

        {/* Card */}
        <div style={{ background: "#fff", borderRadius: "18px", padding: "36px", boxShadow: "0 30px 80px rgba(0,0,0,0.5)" }}>
          <h2 style={{ fontFamily: F.display, fontSize: "22px", fontWeight: "700", color: C.textPrimary, marginBottom: "24px" }}>Iniciar sesión</h2>

          <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
              <label style={{ fontSize: "11px", fontWeight: "700", color: C.textSecond, textTransform: "uppercase", letterSpacing: "0.6px" }}>Correo electrónico</label>
              <input
                type="email" name="email" value={form.email} onChange={handle}
                placeholder="usuario@ejemplo.com" autoComplete="email"
                style={{ padding: "11px 14px", borderRadius: "9px", border: `1px solid ${C.border}`, fontSize: "14px", fontFamily: F.body, color: C.textPrimary }}
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
              <label style={{ fontSize: "11px", fontWeight: "700", color: C.textSecond, textTransform: "uppercase", letterSpacing: "0.6px" }}>Contraseña</label>
              <input
                type="password" name="password" value={form.password} onChange={handle}
                placeholder="••••••••" autoComplete="current-password"
                style={{ padding: "11px 14px", borderRadius: "9px", border: `1px solid ${C.border}`, fontSize: "14px", fontFamily: F.body, color: C.textPrimary }}
              />
            </div>

            {error && (
              <div style={{ background: "#fee2e2", border: "1px solid #fca5a5", borderRadius: "8px", padding: "10px 14px", fontSize: "13px", color: "#991b1b", fontWeight: "600" }}>
                {error}
              </div>
            )}

            <button type="submit" disabled={loading} style={{ ...btn("primary", "lg"), justifyContent: "center", marginTop: "4px", opacity: loading ? 0.7 : 1 }}>
              {loading ? "Ingresando..." : "Ingresar"}
            </button>
          </form>
        </div>

        <p style={{ textAlign: "center", color: "#334155", fontSize: "12px", marginTop: "20px" }}>
          ¿No tienes cuenta? Solicítala a tu docente o administrador.
        </p>
      </div>
    </div>
  );
}