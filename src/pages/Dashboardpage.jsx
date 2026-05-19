import { useState, useEffect } from "react";
import { apiFetch, getUsuario } from "../api/Client";
import { C, F, card } from "../api/Tokens";
import { getRol } from "../api/Auth";
import { LoadingSpinner, Badge } from "../components/Emptystate";

function StatCard({ icon, label, value, color }) {
  return (
    <div style={{ ...card, display: "flex", alignItems: "center", gap: "18px", borderLeft: `4px solid ${color}` }}>
      <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: color + "20", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", flexShrink: 0 }}>
        {icon}
      </div>
      <div>
        <p style={{ fontSize: "28px", fontWeight: "800", fontFamily: F.display, color: C.textPrimary, lineHeight: 1 }}>{value ?? "—"}</p>
        <p style={{ fontSize: "13px", color: C.textMuted, marginTop: "3px" }}>{label}</p>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const usuario = getUsuario();
  const rol = getRol();
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        if (rol !== "alumno") {
          const [materias, grupos, alumnos, exposiciones] = await Promise.all([
            apiFetch("/api/materias"),
            apiFetch("/api/grupos"),
            apiFetch("/api/alumnos"),
            apiFetch("/api/exposiciones"),
          ]);
          setStats({
            materias:     materias.length,
            grupos:       grupos.length,
            alumnos:      alumnos.length,
            exposiciones: exposiciones.length,
          });
        } else {
          const exposiciones = await apiFetch("/api/exposiciones");
          const evaluaciones = await apiFetch("/api/evaluaciones");
          setStats({
            exposiciones: exposiciones.length,
            evaluaciones: evaluaciones.length,
          });
        }
      } catch (_) {}
      setLoading(false);
    };
    load();
  }, [rol]);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="page-anim">
      {/* Welcome */}
      <div style={{ ...card, marginBottom: "20px", background: `linear-gradient(135deg, #0c1628 0%, #1e3a5f 100%)`, border: "none" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div style={{ width: "52px", height: "52px", borderRadius: "50%", background: C.accent, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F.display, fontWeight: "800", fontSize: "20px", color: "#fff" }}>
            {usuario?.nombre?.[0]}{usuario?.apellido?.[0]}
          </div>
          <div>
            <p style={{ color: "#94a3b8", fontSize: "13px", marginBottom: "2px" }}>Bienvenido de vuelta,</p>
            <p style={{ fontFamily: F.display, fontWeight: "700", fontSize: "22px", color: "#fff" }}>{usuario?.nombre} {usuario?.apellido}</p>
            <div style={{ marginTop: "6px" }}><Badge color={rol}>{rol}</Badge></div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
        {rol !== "alumno" && (
          <>
            <StatCard icon="📚" label="Materias registradas"  value={stats.materias}     color={C.primary} />
            <StatCard icon="🏫" label="Grupos activos"        value={stats.grupos}        color={C.accent} />
            <StatCard icon="🎓" label="Alumnos registrados"   value={stats.alumnos}       color={C.success} />
          </>
        )}
        <StatCard icon="🎤" label="Exposiciones"         value={stats.exposiciones} color={C.warning} />
        {rol === "alumno" && (
          <StatCard icon="⭐" label="Mis evaluaciones"    value={stats.evaluaciones} color={C.primary} />
        )}
      </div>

      {/* Info box */}
      <div style={{ ...card, marginTop: "20px", background: "#f0f9ff", border: `1px solid #bae6fd` }}>
        <p style={{ fontSize: "13px", color: "#0369a1", fontWeight: "600" }}>
          {rol === "admin"   && "👑 Tienes acceso completo al sistema: puedes gestionar todos los módulos y eliminar registros."}
          {rol === "docente" && "📝 Puedes crear y editar materias, grupos, alumnos, equipos y exposiciones. Contacta al administrador para eliminar registros."}
          {rol === "alumno"  && "🎤 Puedes ver las exposiciones programadas y enviar tus evaluaciones. Solo puedes evaluar una vez por exposición."}
        </p>
      </div>
    </div>
  );
}