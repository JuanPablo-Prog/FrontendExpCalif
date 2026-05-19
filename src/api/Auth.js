import { getUsuario } from "./Client";

export const getRol    = () => getUsuario()?.rol || null;
export const esAdmin   = () => getRol() === "admin";
export const esDocente = () => getRol() === "docente";
export const esAlumno  = () => getRol() === "alumno";

// Puede crear / actualizar (no puede eliminar)
export const puedeEscribir = () => ["admin", "docente"].includes(getRol());

// Solo admin elimina
export const puedeEliminar = () => getRol() === "admin";