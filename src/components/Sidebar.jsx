import React from 'react';
import { getRol } from "../api/Auth";

const NAV_ITEMS = [
  { page: "dashboard",    label: "Dashboard",    icon: "◈",  roles: ["admin", "docente", "alumno"] },
  { page: "usuarios",     label: "Usuarios",     icon: "👤", roles: ["admin"] },
  { page: "materias",     label: "Materias",     icon: "📚", roles: ["admin", "docente"] },
  { page: "criterios",    label: "Criterios",    icon: "📋", roles: ["admin", "docente"] },
  { page: "grupos",       label: "Grupos",       icon: "🏫", roles: ["admin", "docente"] },
  { page: "alumnos",      label: "Alumnos",      icon: "🎓", roles: ["admin", "docente"] },
  { page: "equipos",      label: "Equipos",      icon: "👥", roles: ["admin", "docente"] },
  { page: "exposiciones", label: "Exposiciones", icon: "🎤", roles: ["admin", "docente", "alumno"] },
  { page: "evaluaciones", label: "Evaluaciones", icon: "⭐", roles: ["admin", "docente", "alumno"] },
];

export default function Sidebar({ page, setPage, usuario, onLogout }) {
  const rol = getRol();

  // Filtrar los elementos del menú según el rol del usuario
  const menuFiltrado = NAV_ITEMS.filter(item => item.roles.includes(rol));

  return (
    <header className="w-full bg-zinc-900 border-b border-zinc-800 px-6 py-3 flex items-center justify-between sticky top-0 z-50 shrink-0">
      
      {/* Lado Izquierdo: Logo y Navegación */}
      <div className="flex items-center gap-6 min-w-0 flex-1">
        <div className="text-xl font-black tracking-wider text-zinc-50 shrink-0 flex items-center gap-2">
          <span className="text-amber-400">⚡</span> EVALUA
        </div>
        
        {/* Enlaces de navegación horizontales (con scroll si no caben en pantallas chicas) */}
        <nav className="flex items-center gap-1 overflow-x-auto no-scrollbar py-1 pr-4">
          {menuFiltrado.map((item) => {
            const isActive = page === item.page;
            return (
              <button
                key={item.page}
                onClick={() => setPage(item.page)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                  isActive
                    ? "bg-zinc-800 text-zinc-50 border border-zinc-700 shadow-sm"
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40"
                }`}
              >
                <span className={isActive ? "text-amber-400" : "text-zinc-500"}>{item.icon}</span>
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Lado Derecho: Usuario y Salir */}
      <div className="flex items-center gap-4 shrink-0 pl-4 border-l border-zinc-800">
        <button
          onClick={() => setPage("perfil")}
          className="flex items-center gap-2 group text-left"
        >
          <div className="w-8 height-8 min-w-[32px] rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs border border-amber-500/30 group-hover:bg-amber-500/30 transition-colors">
            {usuario?.nombre?.[0]}{usuario?.apellido?.[0]}
          </div>
          <div className="hidden md:block max-w-[120px] overflow-hidden">
            <p className="text-xs font-semibold text-zinc-200 truncate group-hover:text-zinc-50 transition-colors">
              {usuario?.nombre}
            </p>
            <p className="text-[10px] text-zinc-500 truncate">Mi Perfil</p>
          </div>
        </button>

        <button
          onClick={onLogout}
          className="p-2 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
          title="Cerrar sesión"
        >
          🚪
        </button>
      </div>
    </header>
  );
}