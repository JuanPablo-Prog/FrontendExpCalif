import { useState, useEffect } from "react";
import { apiFetch } from "../api/Client";
import { C, F, btn, card, th, td } from "../api/Tokens";
import { puedeEscribir, puedeEliminar } from "../api/Auth";
import Modal from "../components/Modal";
import ConfirmDialog from "../components/Confirmdialog";
import { EmptyState, LoadingSpinner, FormGroup, Inp, Sel } from "../components/Emptystate";

const EMPTY = { nombre_grupo: "", periodo: "", id_materia: "" };

export default function GruposPage({ toast }) {
  const [items, setItems]     = useState([]);
  const [materias, setMaterias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtroMateria, setFiltroMateria] = useState("");
  const [modal, setModal]     = useState({ open: false, mode: "create", data: null });
  const [form, setForm]       = useState(EMPTY);
  const [saving, setSaving]   = useState(false);
  const [confirm, setConfirm] = useState({ open: false, id: null });
  const [deleting, setDeleting] = useState(false);

  const canWrite  = puedeEscribir();
  const canDelete = puedeEliminar();

  const fetchData = async () => {
    setLoading(true);
    try {
      const [grps, mats] = await Promise.all([
        apiFetch(`/api/grupos${filtroMateria ? `?id_materia=${filtroMateria}` : ""}`),
        apiFetch("/api/materias"),
      ]);
      setItems(grps); setMaterias(mats);
    } catch (e) { toast(e.message, "error"); }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, [filtroMateria]);

  const openCreate = () => { setForm({ ...EMPTY, id_materia: filtroMateria || "" }); setModal({ open: true, mode: "create" }); };
  const openEdit   = (item) => {
    setForm({ nombre_grupo: item.nombre_grupo, periodo: item.periodo, id_materia: item.id_materia });
    setModal({ open: true, mode: "edit", data: item });
  };
  const closeModal = () => setModal({ open: false });

  const handleSubmit = async () => {
    if (!form.nombre_grupo || !form.periodo || !form.id_materia) return toast("Todos los campos son obligatorios.", "error");
    setSaving(true);
    try {
      const body = { ...form, id_materia: parseInt(form.id_materia) };
      if (modal.mode === "create") {
        await apiFetch("/api/grupos", { method: "POST", body: JSON.stringify(body) });
        toast("Grupo creado.");
      } else {
        await apiFetch(`/api/grupos/${modal.data.id_grupo}`, { method: "PUT", body: JSON.stringify(body) });
        toast("Grupo actualizado.");
      }
      closeModal(); fetchData();
    } catch (e) { toast(e.message, "error"); }
    setSaving(false);
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await apiFetch(`/api/grupos/${confirm.id}`, { method: "DELETE" });
      toast("Grupo eliminado."); setConfirm({ open: false, id: null }); fetchData();
    } catch (e) { toast(e.message, "error"); }
    setDeleting(false);
  };

  return (
    <div className="page-anim">
      <div style={{ display: "flex", gap: "12px", marginBottom: "18px", alignItems: "center" }}>
        <Sel value={filtroMateria} onChange={(e) => setFiltroMateria(e.target.value)} style={{ flex: 1 }}>
          <option value="">Todas las materias</option>
          {materias.map((m) => <option key={m.id_materia} value={m.id_materia}>{m.clave_materia} – {m.nombre_materia}</option>)}
        </Sel>
        <button onClick={fetchData} style={btn("ghost")}>↻</button>
        {canWrite && <button onClick={openCreate} style={btn("primary")}>＋ Nuevo grupo</button>}
      </div>

      <div style={{ ...card, padding: 0, overflow: "hidden" }}>
        {loading ? <LoadingSpinner /> : items.length === 0 ? (
          <EmptyState icon="🏫" title="Sin grupos" description="Crea grupos para organizar a los alumnos." />
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={th}>Grupo</th>
                <th style={th}>Periodo</th>
                <th style={th}>Materia</th>
                <th style={th}>Equipos</th>
                {(canWrite || canDelete) && <th style={{ ...th, textAlign: "right" }}>Acciones</th>}
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id_grupo}
                  onMouseEnter={(e) => e.currentTarget.style.background = "#f8fafc"}
                  onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                >
                  <td style={{ ...td, fontWeight: "600", color: C.textPrimary }}>{item.nombre_grupo}</td>
                  <td style={td}><span style={{ background: "#f1f5f9", padding: "3px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: "700" }}>{item.periodo}</span></td>
                  <td style={td}>{item.materias?.nombre_materia || "—"}</td>
                  <td style={td}>{item.equipos?.[0]?.count ?? 0}</td>
                  {(canWrite || canDelete) && (
                    <td style={{ ...td, textAlign: "right" }}>
                      <div style={{ display: "flex", gap: "6px", justifyContent: "flex-end" }}>
                        {canWrite  && <button onClick={() => openEdit(item)} style={btn("ghost", "sm")}>✏️ Editar</button>}
                        {canDelete && <button onClick={() => setConfirm({ open: true, id: item.id_grupo })} style={btn("danger", "sm")}>🗑</button>}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Modal open={modal.open} title={modal.mode === "create" ? "Nuevo grupo" : "Editar grupo"} onClose={closeModal}
        footer={<>
          <button onClick={closeModal} style={btn("ghost")}>Cancelar</button>
          <button onClick={handleSubmit} disabled={saving} style={btn("primary")}>{saving ? "Guardando…" : "Guardar"}</button>
        </>}
      >
        <FormGroup label="Nombre del grupo">
          <Inp value={form.nombre_grupo} onChange={(e) => setForm({ ...form, nombre_grupo: e.target.value })} placeholder="Ej. Grupo A" />
        </FormGroup>
        <FormGroup label="Periodo">
          <Inp value={form.periodo} onChange={(e) => setForm({ ...form, periodo: e.target.value })} placeholder="Ej. 2025-1" />
        </FormGroup>
        <FormGroup label="Materia">
          <Sel value={form.id_materia} onChange={(e) => setForm({ ...form, id_materia: e.target.value })}>
            <option value="">Selecciona una materia</option>
            {materias.map((m) => <option key={m.id_materia} value={m.id_materia}>{m.clave_materia} – {m.nombre_materia}</option>)}
          </Sel>
        </FormGroup>
      </Modal>

      <ConfirmDialog open={confirm.open} onConfirm={handleDelete} onCancel={() => setConfirm({ open: false, id: null })} loading={deleting}
        message="Se eliminarán también los equipos y exposiciones de este grupo." />
    </div>
  );
}