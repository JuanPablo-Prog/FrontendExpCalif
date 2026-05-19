import { C, F } from "../api/Tokens";

export default function Modal({ open, title, onClose, children, footer, width = "520px" }) {
  if (!open) return null;
  return (
    <div
      onClick={onClose}
      style={{ position: "fixed", inset: 0, background: "rgba(8,16,30,0.65)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "20px" }}
    >
      <div
        className="modal-anim"
        onClick={(e) => e.stopPropagation()}
        style={{ background: "#fff", borderRadius: "16px", width: "100%", maxWidth: width, maxHeight: "90vh", display: "flex", flexDirection: "column", boxShadow: "0 24px 80px rgba(0,0,0,0.35)" }}
      >
        {/* Header */}
        <div style={{ padding: "20px 24px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
          <span style={{ fontFamily: F.display, fontSize: "17px", fontWeight: "700", color: C.textPrimary }}>{title}</span>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: "20px", color: C.textMuted, cursor: "pointer", lineHeight: 1, padding: "2px 6px", borderRadius: "6px" }}>×</button>
        </div>
        {/* Body */}
        <div style={{ padding: "20px 24px", overflowY: "auto", flex: 1, display: "flex", flexDirection: "column", gap: "14px" }}>
          {children}
        </div>
        {/* Footer */}
        {footer && (
          <div style={{ padding: "14px 24px", borderTop: `1px solid ${C.border}`, display: "flex", justifyContent: "flex-end", gap: "10px", flexShrink: 0 }}>
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}