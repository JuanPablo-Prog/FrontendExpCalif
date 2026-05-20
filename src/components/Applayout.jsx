import React from 'react';
import Sidebar from "./Sidebar";

const PAGE_TITLES = {
  dashboard:    "Dashboard",
  usuarios:     "Gestión de Usuarios",
  materias:     "Materias",
  criterios:    "Criterios de Evaluación",
  grupos:       "Grupos",
  alumnos:      "Alumnos",
  equipos:      "Equipos",
  exposiciones: "Exposiciones",
  evaluaciones: "Evaluaciones",
  perfil:       "Mi Perfil"
};

export default function AppLayout({ page, setPage, usuario, onLogout, children }) {
  return (
    <div className="min-h-screen flex flex-col text-zinc-50 bg-zinc-950 font-sans">
      {/* Menú Superior */}
      <Sidebar page={page} setPage={setPage} usuario={usuario} onLogout={onLogout} />
      
      {/* Contenedor del contenido */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Título de la página actual */}
        <div className="max-w-7xl w-full mx-auto px-6 md:px-8 pt-8 pb-2 flex items-center justify-between shrink-0">
          <h1 className="text-2xl font-bold tracking-tight text-zinc-50">
            {PAGE_TITLES[page] || "Panel General"}
          </h1>
          <span className="text-xs font-semibold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-md border border-amber-500/20 uppercase tracking-wider">
            {usuario?.rol || "Usuario"}
          </span>
        </div>

        {/* Área donde se inyectan las páginas de la app */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-6 md:px-8 py-6">
          {children}
        </main>
      </div>
    </div>
  );
}