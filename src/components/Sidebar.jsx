import { C, F } from "../api/Tokens";
import { getRol } from "../api/Auth";

const NAV_ITEMS = [
  { page: "dashboard",    label: "Dashboard",    icon: "◈",  roles: ["admin", "docente", "alumno"] },
  { page: "usuarios",     label: "Usuarios",     icon: "👤", roles: ["admin"] },
  { page: "materias",     label: "Materias",     icon: "📚", roles: ["admin", "docente"] },
  { page: "criterios",    label: "Criterios",    icon: "📋", roles: ["admin", "docente"] },
  { page: "grupos",       label: "Grupos",       icon: "🏫", roles: ["admin", "docente"] },
  { page: "alumnos",      label: "Alumnos",      icon: "🎓", roles: ["admin", "docente"] },
  { page: "equipos",      label: "Equipos",      icon: "👥", roles: ["admin", "docente"] },
  { page: "exposiciones", label: "Exposiciones", icon: "🎤", roles: ["admin", "docente", "alumno"] },
  { page: "evaluaciones", label: "Evaluaciones", icon: "⭐", roles: ["admin", "docente", "alumno"] },
];

export default function Sidebar({ page, setPage, usuario, onLogout }) {
  const rol = getRol();

  return (
    <div style={{ width: "240px", minWidth: "240px", background: C.sidebar, display: "flex", flexDirection: "column" }}>
      {/* Brand */}
      <div style={{ padding: "28px 22px 22px", borderBottom: "1px solid #1a2840" }}>
        <div style={{ fontFamily: F.display, fontSize: "22px", fontWeight: "800", color: "#fff", letterSpacing: "-0.5px", lineHeight: 1 }}>
          Expos<span style={{ color: C.accent }}>Calif</span>
        </div>
        <div style={{ fontSize: "10px", fontWeight: "700", color: C.accent, textTransform: "uppercase", letterSpacing: "1.5px", marginTop: "4px" }}>{rol}</div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "14px 10px", display: "flex", flexDirection: "column", gap: "3px" }}>
        {NAV_ITEMS.filter((n) => n.roles.includes(rol)).map((item) => {
          const active = page === item.page;
          return (
            <button key={item.page} onClick={() => setPage(item.page)} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "9px 13px", borderRadius: "10px", border: "none", background: active ? C.accent : "transparent", color: active ? "#fff" : "#94a3b8", fontWeight: active ? "700" : "500", fontSize: "13.5px", fontFamily: F.body, cursor: "pointer", width: "100%", textAlign: "left", transition: "all 0.15s" }}
              onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = "#162033"; }}
              onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = "transparent"; }}
            >
              <span style={{ fontSize: "16px", flexShrink: 0, width: "20px", textAlign: "center" }}>{item.icon}</span>
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Usuario card + Perfil + Logout */}
      <div style={{ padding: "14px 10px", borderTop: "1px solid #1a2840" }}>
        {/* Avatar clickeable → perfil */}
        <button
          onClick={() => setPage("perfil")}
          style={{ width: "100%", padding: "10px 13px", borderRadius: "10px", background: page === "perfil" ? "#1e3a5f" : "#162033", border: page === "perfil" ? `1px solid ${C.accent}` : "1px solid transparent", cursor: "pointer", textAlign: "left", marginBottom: "6px", transition: "all 0.15s" }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "#1e3a5f"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = page === "perfil" ? "#1e3a5f" : "#162033"; }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ width: "30px", height: "30px", borderRadius: "50%", background: C.accent, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F.display, fontWeight: "800", fontSize: "12px", color: "#fff", flexShrink: 0 }}>
              {usuario?.nombre?.[0]}{usuario?.apellido?.[0]}
            </div>
            <div style={{ overflow: "hidden" }}>
              <p style={{ fontSize: "12px", fontWeight: "700", color: "#fff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{usuario?.nombre} {usuario?.apellido}</p>
              <p style={{ fontSize: "10px", color: "#64748b" }}>Ver mi perfil</p>
            </div>
          </div>
        </button>

        <button
          onClick={onLogout}
          style={{ width: "100%", padding: "8px 13px", borderRadius: "10px", border: "none", background: "transparent", color: "#64748b", fontSize: "13px", fontWeight: "600", fontFamily: F.body, cursor: "pointer", textAlign: "left", display: "flex", alignItems: "center", gap: "8px" }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "#162033"; e.currentTarget.style.color = "#f87171"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#64748b"; }}
        >
          <span>⎋</span> Cerrar sesión
        </button>
      </div>
    </div>
  );
}
