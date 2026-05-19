import { useState, useEffect } from "react";
import { apiFetch } from "../api/Client";
import { C, F, btn, card, th, td } from "../api/Tokens";
import { puedeEscribir, puedeEliminar } from "../api/Auth";
import Modal from "../components/Modal";
import ConfirmDialog from "../components/Confirmdialog"
import { EmptyState, LoadingSpinner, FormGroup, Inp, Sel } from "../components/Emptystate";

const EMPTY = { nombre_equipo: "", id_grupo: "" };

export default function EquiposPage({ toast }) {
  const [items, setItems]     = useState([]);
  const [grupos, setGrupos]   = useState([]);
  const [alumnos, setAlumnos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtroGrupo, setFiltroGrupo] = useState("");
  const [modal, setModal]     = useState({ open: false, mode: "create", data: null });
  const [membersModal, setMembersModal] = useState({ open: false, equipo: null });
  const [form, setForm]       = useState(EMPTY);
  const [saving, setSaving]   = useState(false);
  const [confirm, setConfirm] = useState({ open: false, id: null });
  const [deleting, setDeleting] = useState(false);
  const [addAlumnoId, setAddAlumnoId] = useState("");

  const canWrite  = puedeEscribir();
  const canDelete = puedeEliminar();

  const fetchData = async () => {
    setLoading(true);
    try {
      const [eqs, grps, alms] = await Promise.all([
        apiFetch(`/api/equipos${filtroGrupo ? `?id_grupo=${filtroGrupo}` : ""}`),
        apiFetch("/api/grupos"),
        apiFetch("/api/alumnos"),
      ]);
      setItems(eqs); setGrupos(grps); setAlumnos(alms);
    } catch (e) { toast(e.message, "error"); }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, [filtroGrupo]);

  const openCreate = () => { setForm({ nombre_equipo: "", id_grupo: filtroGrupo || "" }); setModal({ open: true, mode: "create" }); };
  const openEdit   = (item) => { setForm({ nombre_equipo: item.nombre_equipo, id_grupo: item.id_grupo }); setModal({ open: true, mode: "edit", data: item }); };
  const closeModal = () => setModal({ open: false });

  const openMembers = (equipo) => { setAddAlumnoId(""); setMembersModal({ open: true, equipo }); };
  const closeMembers = () => { setMembersModal({ open: false, equipo: null }); fetchData(); };

  const handleSubmit = async () => {
    if (!form.nombre_equipo || !form.id_grupo) return toast("Nombre de equipo y grupo son obligatorios.", "error");
    setSaving(true);
    try {
      const body = { ...form, id_grupo: parseInt(form.id_grupo) };
      if (modal.mode === "create") {
        await apiFetch("/api/equipos", { method: "POST", body: JSON.stringify(body) });
        toast("Equipo creado.");
      } else {
        await apiFetch(`/api/equipos/${modal.data.id_equipo}`, { method: "PUT", body: JSON.stringify(body) });
        toast("Equipo actualizado.");
      }
      closeModal(); fetchData();
    } catch (e) { toast(e.message, "error"); }
    setSaving(false);
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await apiFetch(`/api/equipos/${confirm.id}`, { method: "DELETE" });
      toast("Equipo eliminado."); setConfirm({ open: false, id: null }); fetchData();
    } catch (e) { toast(e.message, "error"); }
    setDeleting(false);
  };

  const addMember = async () => {
    if (!addAlumnoId) return toast("Selecciona un alumno.", "error");
    try {
      await apiFetch(`/api/equipos/${membersModal.equipo.id_equipo}/alumnos`, {
        method: "POST", body: JSON.stringify({ alumno_ids: [parseInt(addAlumnoId)] }),
      });
      toast("Alumno agregado al equipo.");
      // Refresh equipo detail
      const updated = await apiFetch(`/api/equipos/${membersModal.equipo.id_equipo}`);
      setMembersModal({ open: true, equipo: updated });
      setAddAlumnoId("");
    } catch (e) { toast(e.message, "error"); }
  };

  const removeMember = async (alumnoId) => {
    try {
      await apiFetch(`/api/equipos/${membersModal.equipo.id_equipo}/alumnos/${alumnoId}`, { method: "DELETE" });
      toast("Alumno removido.");
      const updated = await apiFetch(`/api/equipos/${membersModal.equipo.id_equipo}`);
      setMembersModal({ open: true, equipo: updated });
    } catch (e) { toast(e.message, "error"); }
  };

  const miembros = membersModal.equipo?.equipo_alumno?.map((r) => r.alumnos) || [];
  const miembrosIds = miembros.map((a) => a.id_alumno);
  const alumnosDisponibles = alumnos.filter((a) => !miembrosIds.includes(a.id_alumno));

  return (
    <div className="page-anim">
      <div style={{ display: "flex", gap: "12px", marginBottom: "18px", alignItems: "center" }}>
        <Sel value={filtroGrupo} onChange={(e) => setFiltroGrupo(e.target.value)} style={{ flex: 1 }}>
          <option value="">Todos los grupos</option>
          {grupos.map((g) => <option key={g.id_grupo} value={g.id_grupo}>{g.nombre_grupo} – {g.periodo}</option>)}
        </Sel>
        <button onClick={fetchData} style={btn("ghost")}>↻</button>
        {canWrite && <button onClick={openCreate} style={btn("primary")}>＋ Nuevo equipo</button>}
      </div>

      <div style={{ ...card, padding: 0, overflow: "hidden" }}>
        {loading ? <LoadingSpinner /> : items.length === 0 ? (
          <EmptyState icon="👥" title="Sin equipos" description="Crea equipos dentro de un grupo." />
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={th}>Equipo</th>
                <th style={th}>Grupo</th>
                <th style={th}>Materia</th>
                <th style={th}>Miembros</th>
                <th style={{ ...th, textAlign: "right" }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => {
                const miembrosCount = item.equipo_alumno?.length || 0;
                return (
                  <tr key={item.id_equipo}
                    onMouseEnter={(e) => e.currentTarget.style.background = "#f8fafc"}
                    onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                  >
                    <td style={{ ...td, fontWeight: "600", color: C.textPrimary }}>{item.nombre_equipo}</td>
                    <td style={td}>{item.grupos?.nombre_grupo} <span style={{ color: C.textMuted }}>({item.grupos?.periodo})</span></td>
                    <td style={td}>{item.grupos?.materias?.nombre_materia || "—"}</td>
                    <td style={td}>
                      <span style={{ background: miembrosCount > 0 ? "#dbeafe" : "#f3f4f6", color: miembrosCount > 0 ? "#1e40af" : "#6b7280", padding: "3px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: "700" }}>
                        {miembrosCount} {miembrosCount === 1 ? "alumno" : "alumnos"}
                      </span>
                    </td>
                    <td style={{ ...td, textAlign: "right" }}>
                      <div style={{ display: "flex", gap: "6px", justifyContent: "flex-end" }}>
                        {canWrite  && <button onClick={() => openMembers(item)} style={btn("ghost", "sm")}>👥 Miembros</button>}
                        {canWrite  && <button onClick={() => openEdit(item)} style={btn("ghost", "sm")}>✏️</button>}
                        {canDelete && <button onClick={() => setConfirm({ open: true, id: item.id_equipo })} style={btn("danger", "sm")}>🗑</button>}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Equipo form modal */}
      <Modal open={modal.open} title={modal.mode === "create" ? "Nuevo equipo" : "Editar equipo"} onClose={closeModal}
        footer={<>
          <button onClick={closeModal} style={btn("ghost")}>Cancelar</button>
          <button onClick={handleSubmit} disabled={saving} style={btn("primary")}>{saving ? "Guardando…" : "Guardar"}</button>
        </>}
      >
        <FormGroup label="Nombre del equipo">
          <Inp value={form.nombre_equipo} onChange={(e) => setForm({ ...form, nombre_equipo: e.target.value })} placeholder="Ej. Equipo Alpha" />
        </FormGroup>
        <FormGroup label="Grupo">
          <Sel value={form.id_grupo} onChange={(e) => setForm({ ...form, id_grupo: e.target.value })}>
            <option value="">Selecciona un grupo</option>
            {grupos.map((g) => <option key={g.id_grupo} value={g.id_grupo}>{g.nombre_grupo} – {g.periodo}</option>)}
          </Sel>
        </FormGroup>
      </Modal>

      {/* Members modal */}
      <Modal open={membersModal.open} title={`Miembros de ${membersModal.equipo?.nombre_equipo}`} onClose={closeMembers} width="560px"
        footer={<button onClick={closeMembers} style={btn("primary")}>Cerrar</button>}
      >
        {/* Current members */}
        {miembros.length === 0 ? (
          <p style={{ color: C.textMuted, fontSize: "14px", textAlign: "center", padding: "12px 0" }}>Sin miembros aún.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {miembros.map((a) => (
              <div key={a.id_alumno} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#f8fafc", borderRadius: "10px", padding: "10px 14px" }}>
                <div>
                  <span style={{ fontWeight: "600", fontSize: "14px", color: C.textPrimary }}>{a.nombre} {a.apellido}</span>
                  <span style={{ color: C.textMuted, fontSize: "12px", marginLeft: "8px" }}>{a.matricula}</span>
                </div>
                {canWrite && (
                  <button onClick={() => removeMember(a.id_alumno)} style={{ background: "none", border: "none", color: C.danger, cursor: "pointer", fontSize: "16px" }} title="Remover">×</button>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Add member */}
        {canWrite && alumnosDisponibles.length > 0 && (
          <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: "14px", marginTop: "4px" }}>
            <p style={{ fontSize: "12px", fontWeight: "700", color: C.textSecond, textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: "8px" }}>Agregar alumno</p>
            <div style={{ display: "flex", gap: "8px" }}>
              <Sel value={addAlumnoId} onChange={(e) => setAddAlumnoId(e.target.value)} style={{ flex: 1 }}>
                <option value="">Selecciona un alumno</option>
                {alumnosDisponibles.map((a) => <option key={a.id_alumno} value={a.id_alumno}>{a.nombre} {a.apellido} ({a.matricula})</option>)}
              </Sel>
              <button onClick={addMember} style={btn("success")}>Agregar</button>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog open={confirm.open} onConfirm={handleDelete} onCancel={() => setConfirm({ open: false, id: null })} loading={deleting}
        message="Se eliminarán también las exposiciones asociadas a este equipo." />
    </div>
  );
}