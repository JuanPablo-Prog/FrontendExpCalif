import { useState, useEffect } from "react";
import { apiFetch } from "../api/Client";
import { C, F, btn, card, th, td } from "../api/Tokens";
import { puedeEscribir, puedeEliminar } from "../api/Auth";
import Modal from "../components/Modal";
import ConfirmDialog from "../components/Confirmdialog";
import { EmptyState, LoadingSpinner, FormGroup, Inp } from "../components/Emptystate";

const EMPTY = { matricula: "", nombre: "", apellido: "", email: "" };

export default function AlumnosPage({ toast }) {
  const [items, setItems]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modal, setModal]   = useState({ open: false, mode: "create", data: null });
  const [form, setForm]     = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [confirm, setConfirm] = useState({ open: false, id: null });
  const [deleting, setDeleting] = useState(false);

  const canWrite  = puedeEscribir();
  const canDelete = puedeEliminar();

  const fetchData = async () => {
    setLoading(true);
    try {
      const qs = search ? `?search=${encodeURIComponent(search)}` : "";
      setItems(await apiFetch(`/api/alumnos${qs}`));
    } catch (e) { toast(e.message, "error"); }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const openCreate = () => { setForm(EMPTY); setModal({ open: true, mode: "create" }); };
  const openEdit   = (item) => {
    setForm({ matricula: item.matricula, nombre: item.nombre, apellido: item.apellido, email: item.email });
    setModal({ open: true, mode: "edit", data: item });
  };
  const closeModal = () => setModal({ open: false });

  const handleSubmit = async () => {
    if (!form.matricula || !form.nombre || !form.apellido || !form.email) return toast("Todos los campos son obligatorios.", "error");
    setSaving(true);
    try {
      if (modal.mode === "create") {
        await apiFetch("/api/alumnos", { method: "POST", body: JSON.stringify(form) });
        toast("Alumno creado.");
      } else {
        await apiFetch(`/api/alumnos/${modal.data.id_alumno}`, { method: "PUT", body: JSON.stringify(form) });
        toast("Alumno actualizado.");
      }
      closeModal(); fetchData();
    } catch (e) { toast(e.message, "error"); }
    setSaving(false);
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await apiFetch(`/api/alumnos/${confirm.id}`, { method: "DELETE" });
      toast("Alumno eliminado."); setConfirm({ open: false, id: null }); fetchData();
    } catch (e) { toast(e.message, "error"); }
    setDeleting(false);
  };

  const filtered = items.filter((i) =>
    [i.nombre, i.apellido, i.matricula, i.email].some((v) => v?.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="page-anim">
      <div style={{ display: "flex", gap: "12px", marginBottom: "18px", alignItems: "center" }}>
        <input value={search} onChange={(e) => setSearch(e.target.value)} onKeyDown={(e) => e.key === "Enter" && fetchData()} placeholder="Buscar por nombre, matrícula o email…"
          style={{ flex: 1, padding: "9px 14px", borderRadius: "9px", border: `1px solid ${C.border}`, fontSize: "14px", fontFamily: F.body }} />
        <button onClick={fetchData} style={btn("ghost")}>↻ Buscar</button>
        {canWrite && <button onClick={openCreate} style={btn("primary")}>＋ Nuevo alumno</button>}
      </div>

      <div style={{ ...card, padding: 0, overflow: "hidden" }}>
        {loading ? <LoadingSpinner /> : filtered.length === 0 ? (
          <EmptyState icon="🎓" title="Sin alumnos" description="No se encontraron alumnos con ese criterio." />
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={th}>Matrícula</th>
                <th style={th}>Nombre</th>
                <th style={th}>Correo</th>
                <th style={th}>Cuenta vinculada</th>
                {(canWrite || canDelete) && <th style={{ ...th, textAlign: "right" }}>Acciones</th>}
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr key={item.id_alumno}
                  onMouseEnter={(e) => e.currentTarget.style.background = "#f8fafc"}
                  onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                >
                  <td style={td}><code style={{ fontSize: "13px" }}>{item.matricula}</code></td>
                  <td style={{ ...td, fontWeight: "600", color: C.textPrimary }}>{item.nombre} {item.apellido}</td>
                  <td style={td}>{item.email}</td>
                  <td style={td}>
                    <span style={{ background: item.id_usuario ? "#dcfce7" : "#f3f4f6", color: item.id_usuario ? "#166534" : "#6b7280", padding: "3px 10px", borderRadius: "20px", fontSize: "11px", fontWeight: "700" }}>
                      {item.id_usuario ? "✓ Vinculado" : "Sin cuenta"}
                    </span>
                  </td>
                  {(canWrite || canDelete) && (
                    <td style={{ ...td, textAlign: "right" }}>
                      <div style={{ display: "flex", gap: "6px", justifyContent: "flex-end" }}>
                        {canWrite  && <button onClick={() => openEdit(item)} style={btn("ghost", "sm")}>✏️ Editar</button>}
                        {canDelete && <button onClick={() => setConfirm({ open: true, id: item.id_alumno })} style={btn("danger", "sm")}>🗑</button>}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Modal open={modal.open} title={modal.mode === "create" ? "Nuevo alumno" : "Editar alumno"} onClose={closeModal}
        footer={<>
          <button onClick={closeModal} style={btn("ghost")}>Cancelar</button>
          <button onClick={handleSubmit} disabled={saving} style={btn("primary")}>{saving ? "Guardando…" : "Guardar"}</button>
        </>}
      >
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
          <FormGroup label="Nombre">
            <Inp value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} placeholder="Juan" />
          </FormGroup>
          <FormGroup label="Apellido">
            <Inp value={form.apellido} onChange={(e) => setForm({ ...form, apellido: e.target.value })} placeholder="García" />
          </FormGroup>
        </div>
        <FormGroup label="Matrícula">
          <Inp value={form.matricula} onChange={(e) => setForm({ ...form, matricula: e.target.value })} placeholder="A230001" />
        </FormGroup>
        <FormGroup label="Correo electrónico">
          <Inp type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="alumno@ejemplo.com" />
        </FormGroup>
      </Modal>

      <ConfirmDialog open={confirm.open} onConfirm={handleDelete} onCancel={() => setConfirm({ open: false, id: null })} loading={deleting} />
    </div>
  );
}