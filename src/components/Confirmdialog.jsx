import { C, F, btn } from "../api/Tokens";

export default function ConfirmDialog({ open, message = "¿Estás seguro de eliminar este registro?", onConfirm, onCancel, loading }) {
  if (!open) return null;
  return (
    <div onClick={onCancel} style={{ position: "fixed", inset: 0, background: "rgba(8,16,30,0.65)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1100, padding: "20px" }}>
      <div className="modal-anim" onClick={(e) => e.stopPropagation()} style={{ background: "#fff", borderRadius: "14px", width: "100%", maxWidth: "400px", padding: "28px 28px 22px", boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}>
        <div style={{ display: "flex", gap: "14px", marginBottom: "20px" }}>
          <div style={{ width: "42px", height: "42px", borderRadius: "10px", background: C.dangerLight, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", flexShrink: 0 }}>⚠️</div>
          <div>
            <p style={{ fontFamily: F.display, fontWeight: "700", fontSize: "16px", color: C.textPrimary, marginBottom: "6px" }}>Confirmar eliminación</p>
            <p style={{ fontSize: "14px", color: C.textSecond, lineHeight: 1.5 }}>{message}</p>
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
          <button onClick={onCancel} style={btn("ghost")} disabled={loading}>Cancelar</button>
          <button onClick={onConfirm} style={btn("danger")} disabled={loading}>{loading ? "Eliminando..." : "Sí, eliminar"}</button>
        </div>
      </div>
    </div>
  );
}