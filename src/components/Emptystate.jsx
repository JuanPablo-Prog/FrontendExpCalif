import { C, F } from "../api/Tokens";

export function EmptyState({ icon = "📭", title = "Sin resultados", description = "No hay datos para mostrar." }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "64px 24px", gap: "10px", color: C.textMuted }}>
      <span style={{ fontSize: "48px", marginBottom: "4px" }}>{icon}</span>
      <p style={{ fontFamily: F.display, fontWeight: "700", fontSize: "16px", color: C.textSecond }}>{title}</p>
      <p style={{ fontSize: "13px", textAlign: "center", maxWidth: "260px", lineHeight: 1.5 }}>{description}</p>
    </div>
  );
}

export function LoadingSpinner({ text = "Cargando..." }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "64px 24px", gap: "12px", color: C.textMuted }}>
      <div style={{ width: "36px", height: "36px", border: `3px solid ${C.border}`, borderTop: `3px solid ${C.primary}`, borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
      <p style={{ fontSize: "13px", fontWeight: "600" }}>{text}</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

export function Badge({ children, color }) {
  const map = {
    admin:   { bg: "#fef3c7", text: "#92400e" },
    docente: { bg: "#dbeafe", text: "#1e40af" },
    alumno:  { bg: "#dcfce7", text: "#166534" },
    green:   { bg: "#dcfce7", text: "#166534" },
    blue:    { bg: "#dbeafe", text: "#1e40af" },
    amber:   { bg: "#fef3c7", text: "#92400e" },
    red:     { bg: "#fee2e2", text: "#991b1b" },
    gray:    { bg: "#f3f4f6", text: "#374151" },
  };
  const c = map[color] || map.gray;
  return (
    <span style={{ background: c.bg, color: c.text, padding: "3px 10px", borderRadius: "20px", fontSize: "11px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.5px", whiteSpace: "nowrap" }}>
      {children}
    </span>
  );
}

export function FormGroup({ label: lbl, children }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
      <label style={{ fontSize: "11px", fontWeight: "700", color: C.textSecond, textTransform: "uppercase", letterSpacing: "0.6px" }}>{lbl}</label>
      {children}
    </div>
  );
}

export function Inp({ style: s, ...props }) {
  return <input style={{ padding: "9px 13px", borderRadius: "8px", border: `1px solid ${C.border}`, fontSize: "14px", fontFamily: F.body, color: C.textPrimary, background: "#fff", width: "100%", ...s }} {...props} />;
}

export function Sel({ style: s, children, ...props }) {
  return <select style={{ padding: "9px 13px", borderRadius: "8px", border: `1px solid ${C.border}`, fontSize: "14px", fontFamily: F.body, color: C.textPrimary, background: "#fff", width: "100%", ...s }} {...props}>{children}</select>;
}

export function Txt({ style: s, ...props }) {
  return <textarea style={{ padding: "9px 13px", borderRadius: "8px", border: `1px solid ${C.border}`, fontSize: "14px", fontFamily: F.body, color: C.textPrimary, background: "#fff", width: "100%", minHeight: "80px", resize: "vertical", ...s }} {...props} />;
}