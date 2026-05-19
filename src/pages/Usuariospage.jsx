import { useState, useEffect } from "react";
import { apiFetch } from "../api/Client";
import { C, F, btn, card, th, td } from "../api/Tokens";
import Modal from "../components/Modal";
import ConfirmDialog from "../components/Confirmdialog";
import { EmptyState, LoadingSpinner, FormGroup, Inp, Sel, Badge } from "../components/Emptystate";

// Solo admin puede ver esta página (App.jsx ya lo controla con el sidebar)
// Panel completo: ver usuarios, cambiar rol, crear docentes/alumnos, eliminar

const ROLES = ["alumno", "docente", "admin"];

const EMPTY_NEW = {
  nombre: "", apellido: "", email: "",
  password: "", rol: "alumno", matricula: "",
};

export default function UsuariosPage({ toast }) {
  const [usuarios, setUsuarios]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState("");
  const [filtroRol, setFiltroRol] = useState("");

  // Modal: crear usuario
  const [createModal, setCreateModal] = useState(false);
  const [createForm, setCreateForm]   = useState(EMPTY_NEW);
  const [saving, setSaving]           = useState(false);

  // Modal: editar rol de usuario existente
  const [rolModal, setRolModal]   = useState({ open: false, usuario: null });
  const [nuevoRol, setNuevoRol]   = useState("");
  const [savingRol, setSavingRol] = useState(false);

  // Confirm: eliminar usuario
  const [confirm, setConfirm]     = useState({ open: false, id: null, nombre: "" });
  const [deleting, setDeleting]   = useState(false);

  // ── Fetch ──────────────────────────────────────────────────────────────────
  const fetchData = async () => {
    setLoading(true);
    try {
      setUsuarios(await apiFetch("/api/usuarios"));
    } catch (e) { toast(e.message, "error"); }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  // ── Filtrado local ──────────────────────────────────────────────────────────
  const filtered = usuarios.filter((u) => {
    const matchSearch =
      !search ||
      [u.nombre, u.apellido, u.email, u.matricula]
        .some((v) => v?.toLowerCase().includes(search.toLowerCase()));
    const matchRol = !filtroRol || u.rol === filtroRol;
    return matchSearch && matchRol;
  });

  // ── Crear usuario ──────────────────────────────────────────────────────────
  const handleCreate = async () => {
    const { nombre, apellido, email, password, rol, matricula } = createForm;
    if (!nombre || !apellido || !email || !password) {
      return toast("Nombre, apellido, email y contraseña son obligatorios.", "error");
    }
    if (password.length < 6) {
      return toast("La contraseña debe tener al menos 6 caracteres.", "error");
    }
    setSaving(true);
    try {
      await apiFetch("/api/usuarios", {
        method: "POST",
        body: JSON.stringify({ nombre, apellido, email, password, rol, matricula: matricula || undefined }),
      });
      toast(`Usuario ${nombre} ${apellido} creado como ${rol}.`);
      setCreateModal(false);
      setCreateForm(EMPTY_NEW);
      fetchData();
    } catch (e) { toast(e.message, "error"); }
    setSaving(false);
  };

  // ── Cambiar rol ────────────────────────────────────────────────────────────
  const abrirRolModal = (u) => {
    setNuevoRol(u.rol);
    setRolModal({ open: true, usuario: u });
  };

  const handleCambiarRol = async () => {
    if (nuevoRol === rolModal.usuario.rol) {
      return toast("El rol seleccionado es igual al actual.", "info");
    }
    setSavingRol(true);
    try {
      await apiFetch(`/api/usuarios/${rolModal.usuario.id_usuario}`, {
        method: "PUT",
        body: JSON.stringify({ rol: nuevoRol }),
      });
      toast(`Rol de ${rolModal.usuario.nombre} actualizado a ${nuevoRol}.`);
      setRolModal({ open: false, usuario: null });
      fetchData();
    } catch (e) { toast(e.message, "error"); }
    setSavingRol(false);
  };

  // ── Eliminar usuario ───────────────────────────────────────────────────────
  const handleDelete = async () => {
    setDeleting(true);
    try {
      await apiFetch(`/api/usuarios/${confirm.id}`, { method: "DELETE" });
      toast("Usuario eliminado junto con toda su información asociada.");
      setConfirm({ open: false, id: null, nombre: "" });
      fetchData();
    } catch (e) { toast(e.message, "error"); }
    setDeleting(false);
  };

  // ── Contadores por rol ─────────────────────────────────────────────────────
  const contadores = ROLES.reduce((acc, r) => {
    acc[r] = usuarios.filter((u) => u.rol === r).length;
    return acc;
  }, {});

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="page-anim">

      {/* Tarjetas de resumen */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "14px", marginBottom: "20px" }}>
        {[
          { rol: "admin",   icon: "👑", color: "#f59e0b", label: "Administradores" },
          { rol: "docente", icon: "📝", color: "#2563eb", label: "Docentes"         },
          { rol: "alumno",  icon: "🎓", color: "#16a34a", label: "Alumnos"          },
        ].map(({ rol, icon, color, label }) => (
          <div
            key={rol}
            onClick={() => setFiltroRol(filtroRol === rol ? "" : rol)}
            style={{ ...card, borderLeft: `4px solid ${color}`, cursor: "pointer", transition: "box-shadow 0.15s", opacity: filtroRol && filtroRol !== rol ? 0.5 : 1 }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <span style={{ fontSize: "24px" }}>{icon}</span>
              <div>
                <p style={{ fontFamily: F.display, fontSize: "26px", fontWeight: "800", color: C.textPrimary, lineHeight: 1 }}>
                  {contadores[rol] ?? 0}
                </p>
                <p style={{ fontSize: "12px", color: C.textMuted, marginTop: "2px" }}>{label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "16px", alignItems: "center" }}>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por nombre, email o matrícula…"
          style={{ flex: 1, padding: "9px 14px", borderRadius: "9px", border: `1px solid ${C.border}`, fontSize: "14px", fontFamily: F.body }}
        />
        <Sel value={filtroRol} onChange={(e) => setFiltroRol(e.target.value)} style={{ width: "160px" }}>
          <option value="">Todos los roles</option>
          <option value="admin">Admin</option>
          <option value="docente">Docente</option>
          <option value="alumno">Alumno</option>
        </Sel>
        <button onClick={fetchData} style={btn("ghost")}>↻</button>
        <button onClick={() => { setCreateForm(EMPTY_NEW); setCreateModal(true); }} style={btn("primary")}>
          ＋ Nuevo usuario
        </button>
      </div>

      {/* Tabla */}
      <div style={{ ...card, padding: 0, overflow: "hidden" }}>
        {loading ? (
          <LoadingSpinner />
        ) : filtered.length === 0 ? (
          <EmptyState icon="👤" title="Sin usuarios" description="No hay usuarios que coincidan con el filtro." />
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={th}>Usuario</th>
                <th style={th}>Email</th>
                <th style={th}>Matrícula</th>
                <th style={th}>Rol</th>
                <th style={th}>Registrado</th>
                <th style={{ ...th, textAlign: "right" }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr
                  key={u.id_usuario}
                  onMouseEnter={(e) => e.currentTarget.style.background = "#f8fafc"}
                  onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                >
                  <td style={{ ...td, fontWeight: "600", color: C.textPrimary }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <div style={{
                        width: "34px", height: "34px", borderRadius: "50%",
                        background: u.rol === "admin" ? "#fef3c7" : u.rol === "docente" ? "#dbeafe" : "#dcfce7",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontFamily: F.display, fontWeight: "800", fontSize: "13px",
                        color: u.rol === "admin" ? "#92400e" : u.rol === "docente" ? "#1e40af" : "#166534",
                        flexShrink: 0,
                      }}>
                        {u.nombre?.[0]}{u.apellido?.[0]}
                      </div>
                      {u.nombre} {u.apellido}
                    </div>
                  </td>
                  <td style={td}>{u.email}</td>
                  <td style={td}>
                    {u.matricula
                      ? <code style={{ fontSize: "12px", background: "#f1f5f9", padding: "2px 7px", borderRadius: "5px" }}>{u.matricula}</code>
                      : <span style={{ color: C.textMuted, fontSize: "12px" }}>—</span>
                    }
                  </td>
                  <td style={td}><Badge color={u.rol}>{u.rol}</Badge></td>
                  <td style={{ ...td, fontSize: "12px" }}>
                    {new Date(u.created_at).toLocaleDateString("es-MX")}
                  </td>
                  <td style={{ ...td, textAlign: "right" }}>
                    <div style={{ display: "flex", gap: "6px", justifyContent: "flex-end" }}>
                      <button onClick={() => abrirRolModal(u)} style={btn("ghost", "sm")}>
                        🔑 Rol
                      </button>
                      <button
                        onClick={() => setConfirm({ open: true, id: u.id_usuario, nombre: `${u.nombre} ${u.apellido}` })}
                        style={btn("danger", "sm")}
                      >
                        🗑
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ── Modal: Crear usuario ─────────────────────────────────────────────── */}
      <Modal
        open={createModal}
        title="Nuevo usuario"
        onClose={() => setCreateModal(false)}
        width="540px"
        footer={
          <>
            <button onClick={() => setCreateModal(false)} style={btn("ghost")}>Cancelar</button>
            <button onClick={handleCreate} disabled={saving} style={btn("primary")}>
              {saving ? "Creando…" : "Crear usuario"}
            </button>
          </>
        }
      >
        {/* Rol selector visual */}
        <div>
          <label style={{ fontSize: "11px", fontWeight: "700", color: C.textSecond, textTransform: "uppercase", letterSpacing: "0.6px", display: "block", marginBottom: "8px" }}>
            Rol del usuario
          </label>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px" }}>
            {[
              { value: "alumno",  icon: "🎓", desc: "Puede evaluar exposiciones" },
              { value: "docente", icon: "📝", desc: "Gestiona grupos y exposiciones" },
              { value: "admin",   icon: "👑", desc: "Acceso completo al sistema" },
            ].map((r) => (
              <div
                key={r.value}
                onClick={() => setCreateForm({ ...createForm, rol: r.value })}
                style={{
                  border: `2px solid ${createForm.rol === r.value ? C.primary : C.border}`,
                  borderRadius: "10px", padding: "12px 10px", cursor: "pointer",
                  background: createForm.rol === r.value ? "#eff6ff" : "#fff",
                  transition: "all 0.15s", textAlign: "center",
                }}
              >
                <div style={{ fontSize: "22px", marginBottom: "4px" }}>{r.icon}</div>
                <div style={{ fontWeight: "700", fontSize: "13px", color: C.textPrimary, textTransform: "capitalize" }}>{r.value}</div>
                <div style={{ fontSize: "11px", color: C.textMuted, marginTop: "3px", lineHeight: 1.3 }}>{r.desc}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
          <FormGroup label="Nombre">
            <Inp value={createForm.nombre} onChange={(e) => setCreateForm({ ...createForm, nombre: e.target.value })} placeholder="Juan" />
          </FormGroup>
          <FormGroup label="Apellido">
            <Inp value={createForm.apellido} onChange={(e) => setCreateForm({ ...createForm, apellido: e.target.value })} placeholder="García" />
          </FormGroup>
        </div>

        <FormGroup label="Correo electrónico">
          <Inp type="email" value={createForm.email} onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })} placeholder="usuario@ejemplo.com" />
        </FormGroup>

        <FormGroup label="Contraseña inicial">
          <Inp type="password" value={createForm.password} onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })} placeholder="Mínimo 6 caracteres" />
        </FormGroup>

        {(createForm.rol === "alumno" || createForm.rol === "docente") && (
          <FormGroup label="Matrícula / ID (opcional)">
            <Inp value={createForm.matricula} onChange={(e) => setCreateForm({ ...createForm, matricula: e.target.value })} placeholder="Ej. A230001" />
          </FormGroup>
        )}

        <div style={{ background: "#fef9c3", border: "1px solid #fde68a", borderRadius: "9px", padding: "10px 14px", fontSize: "12px", color: "#92400e" }}>
          💡 El usuario podrá iniciar sesión inmediatamente con estas credenciales. Compártelas de forma segura.
        </div>
      </Modal>

      {/* ── Modal: Cambiar rol ───────────────────────────────────────────────── */}
      <Modal
        open={rolModal.open}
        title={`Cambiar rol — ${rolModal.usuario?.nombre} ${rolModal.usuario?.apellido}`}
        onClose={() => setRolModal({ open: false, usuario: null })}
        width="400px"
        footer={
          <>
            <button onClick={() => setRolModal({ open: false, usuario: null })} style={btn("ghost")}>Cancelar</button>
            <button onClick={handleCambiarRol} disabled={savingRol} style={btn("primary")}>
              {savingRol ? "Guardando…" : "Guardar cambio"}
            </button>
          </>
        }
      >
        <div style={{ background: "#f8fafc", borderRadius: "10px", padding: "12px 16px", marginBottom: "4px" }}>
          <p style={{ fontSize: "13px", color: C.textMuted }}>Rol actual</p>
          <div style={{ marginTop: "6px" }}><Badge color={rolModal.usuario?.rol}>{rolModal.usuario?.rol}</Badge></div>
        </div>

        <FormGroup label="Nuevo rol">
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {[
              { value: "alumno",  icon: "🎓", desc: "Puede evaluar exposiciones" },
              { value: "docente", icon: "📝", desc: "Gestiona grupos y exposiciones" },
              { value: "admin",   icon: "👑", desc: "Acceso completo al sistema" },
            ].map((r) => (
              <div
                key={r.value}
                onClick={() => setNuevoRol(r.value)}
                style={{
                  display: "flex", alignItems: "center", gap: "12px",
                  border: `2px solid ${nuevoRol === r.value ? C.primary : C.border}`,
                  borderRadius: "10px", padding: "10px 14px", cursor: "pointer",
                  background: nuevoRol === r.value ? "#eff6ff" : "#fff",
                  transition: "all 0.15s",
                }}
              >
                <span style={{ fontSize: "20px" }}>{r.icon}</span>
                <div>
                  <p style={{ fontWeight: "700", fontSize: "13px", color: C.textPrimary, textTransform: "capitalize" }}>{r.value}</p>
                  <p style={{ fontSize: "11px", color: C.textMuted }}>{r.desc}</p>
                </div>
                {nuevoRol === r.value && (
                  <span style={{ marginLeft: "auto", color: C.primary, fontWeight: "900", fontSize: "16px" }}>✓</span>
                )}
              </div>
            ))}
          </div>
        </FormGroup>

        {nuevoRol !== rolModal.usuario?.rol && (
          <div style={{ background: "#fef9c3", border: "1px solid #fde68a", borderRadius: "9px", padding: "10px 14px", fontSize: "12px", color: "#92400e" }}>
            ⚠️ Este cambio afecta inmediatamente los permisos del usuario en la plataforma.
          </div>
        )}
      </Modal>

      {/* ── Confirm eliminar ─────────────────────────────────────────────────── */}
      <ConfirmDialog
        open={confirm.open}
        message={`Se eliminará a ${confirm.nombre} junto con todas sus evaluaciones y registros asociados. Esta acción no se puede deshacer.`}
        onConfirm={handleDelete}
        onCancel={() => setConfirm({ open: false, id: null, nombre: "" })}
        loading={deleting}
      />
    </div>
  );
}
