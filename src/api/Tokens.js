export const C = {
  // Backgrounds
  pageBg:      "#08101e",
  containerBg: "#ffffff",
  sidebar:     "#0c1628",
  sidebarHov:  "#162033",
  contentBg:   "#f1f5f9",
  cardBg:      "#ffffff",
  rowHov:      "#f8fafc",

  // Brand
  accent:      "#f59e0b",
  accentHov:   "#d97706",
  accentLight: "#fef3c7",

  // Semantic
  primary:     "#2563eb",
  primaryHov:  "#1d4ed8",
  danger:      "#dc2626",
  dangerLight: "#fee2e2",
  success:     "#16a34a",
  successLight:"#dcfce7",
  warning:     "#d97706",
  warningLight:"#fef9c3",

  // Text
  textPrimary: "#0f172a",
  textSecond:  "#475569",
  textMuted:   "#94a3b8",
  textInverse: "#ffffff",

  // Borders
  border:      "#e2e8f0",
  borderDark:  "#cbd5e1",
};

export const F = {
  display: "'Outfit', sans-serif",
  body:    "'Nunito', sans-serif",
};

export const S = {
  // Sidebar
  sidebar: {
    width: "240px",
    minWidth: "240px",
  },
  // Container
  container: {
    maxWidth: "1340px",
    minHeight: "88vh",
    borderRadius: "20px",
  },
};

// Shared component styles
export const btn = (variant = "primary", size = "md") => {
  const variants = {
    primary: { background: C.primary,  color: C.textInverse },
    accent:  { background: C.accent,   color: C.textInverse },
    danger:  { background: C.danger,   color: C.textInverse },
    success: { background: C.success,  color: C.textInverse },
    ghost:   { background: "transparent", color: C.textSecond, border: `1px solid ${C.border}` },
    link:    { background: "transparent", color: C.primary, padding: "0" },
  };
  const sizes = {
    sm: { padding: "5px 12px",  fontSize: "12px", borderRadius: "7px" },
    md: { padding: "8px 16px",  fontSize: "13px", borderRadius: "9px" },
    lg: { padding: "11px 22px", fontSize: "15px", borderRadius: "10px" },
  };
  return {
    ...variants[variant],
    ...sizes[size],
    border: variants[variant].border || "none",
    fontWeight: "700",
    fontFamily: F.body,
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    cursor: "pointer",
    transition: "opacity 0.15s, transform 0.1s",
    whiteSpace: "nowrap",
  };
};

export const input = {
  padding: "9px 13px",
  borderRadius: "8px",
  border: `1px solid ${C.border}`,
  fontSize: "14px",
  fontFamily: F.body,
  color: C.textPrimary,
  background: "#fff",
  width: "100%",
};

export const label = {
  fontSize: "11px",
  fontWeight: "700",
  color: C.textSecond,
  textTransform: "uppercase",
  letterSpacing: "0.6px",
  marginBottom: "4px",
  display: "block",
};

export const card = {
  background: C.cardBg,
  borderRadius: "14px",
  border: `1px solid ${C.border}`,
  padding: "22px 24px",
};

export const th = {
  padding: "10px 16px",
  fontSize: "11px",
  fontWeight: "700",
  textTransform: "uppercase",
  letterSpacing: "0.7px",
  color: C.textMuted,
  background: "#f8fafc",
  borderBottom: `2px solid ${C.border}`,
  textAlign: "left",
  whiteSpace: "nowrap",
};

export const td = {
  padding: "12px 16px",
  fontSize: "14px",
  color: C.textSecond,
  borderBottom: `1px solid #f1f5f9`,
  verticalAlign: "middle",
};