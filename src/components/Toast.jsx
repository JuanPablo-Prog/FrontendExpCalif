import { C, F } from "../api/Tokens";

const icons = {
  success: "✓",
  error:   "✕",
  info:    "i",
};

const colors = {
  success: { bg: C.success,  border: "#15803d" },
  error:   { bg: C.danger,   border: "#b91c1c" },
  info:    { bg: C.primary,  border: "#1d4ed8" },
};

export default function ToastContainer({ toasts, dismiss }) {
  return (
    <div style={{ position: "fixed", bottom: "24px", right: "24px", zIndex: 9999, display: "flex", flexDirection: "column", gap: "8px", alignItems: "flex-end" }}>
      {toasts.map((t) => {
        const c = colors[t.type] || colors.info;
        return (
          <div
            key={t.id}
            className="toast-anim"
            onClick={() => dismiss(t.id)}
            style={{
              background: c.bg,
              border: `1px solid ${c.border}`,
              color: "#fff",
              padding: "11px 18px",
              borderRadius: "10px",
              fontSize: "13px",
              fontWeight: "600",
              fontFamily: F.body,
              boxShadow: "0 4px 20px rgba(0,0,0,0.25)",
              maxWidth: "320px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <span style={{ width: "20px", height: "20px", borderRadius: "50%", background: "rgba(255,255,255,0.25)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "900", fontSize: "12px", flexShrink: 0 }}>
              {icons[t.type]}
            </span>
            {t.message}
          </div>
        );
      })}
    </div>
  );
}