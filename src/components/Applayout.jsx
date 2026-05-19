import { C, F } from "../api/Tokens";
import Sidebar from "./Sidebar";

const PAGE_TITLES = {
  dashboard:    "Dashboard",
  materias:     "Materias",
  criterios:    "Criterios",
  grupos:       "Grupos",
  alumnos:      "Alumnos",
  equipos:      "Equipos",
  exposiciones: "Exposiciones",
  evaluaciones: "Evaluaciones",
};

export default function AppLayout({ page, setPage, usuario, onLogout, children }) {
  return (
    <div style={{ minHeight: "100vh", background: `radial-gradient(ellipse at 20% 20%, #0d2240 0%, #08101e 70%)`, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px", fontFamily: "'Nunito', sans-serif" }}>
      <div style={{ width: "100%", maxWidth: "1340px", minHeight: "88vh", background: "#fff", borderRadius: "20px", boxShadow: "0 30px 100px rgba(0,0,0,0.6)", display: "flex", overflow: "hidden" }}>
        <Sidebar page={page} setPage={setPage} usuario={usuario} onLogout={onLogout} />
        <div style={{ flex: 1, display: "flex", flexDirection: "column", background: C.contentBg, minWidth: 0 }}>
          {/* Topbar */}
          <div style={{ background: "#fff", borderBottom: `1px solid ${C.border}`, padding: "14px 28px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
            <h1 style={{ fontFamily: F.display, fontSize: "20px", fontWeight: "700", color: C.textPrimary }}>{PAGE_TITLES[page]}</h1>
            <span style={{ fontSize: "12px", color: C.textMuted }}>{new Date().toLocaleDateString("es-MX", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</span>
          </div>
          {/* Content */}
          <div className="page-anim" style={{ flex: 1, padding: "24px 28px", overflowY: "auto" }}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}