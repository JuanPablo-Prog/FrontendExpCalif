import React from 'react';

// 1. Pantalla cuando no hay registros en las tablas
export function EmptyState({ icon = "📭", title = "Sin resultados", description = "No hay datos para mostrar." }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center select-none animate-fade-in">
      <span className="text-5xl mb-4 filter drop-shadow-sm">{icon}</span>
      <h4 className="text-base font-bold tracking-tight text-zinc-300 mb-1">
        {title}
      </h4>
      <p className="text-sm text-zinc-500 max-w-xs leading-relaxed">
        {description}
      </p>
    </div>
  );
}

// 2. Spinner indicador de carga global
export function LoadingSpinner({ text = "Cargando..." }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 gap-3 text-zinc-400 select-none">
      <div className="w-9 h-9 border-3 border-zinc-800 border-t-zinc-400 rounded-full animate-spin" />
      <p className="text-xs font-semibold tracking-wide text-zinc-500 uppercase">
        {text}
      </p>
    </div>
  );
}

// 3. Insignias / Badges para Roles y Estatus
export function Badge({ children, color = "gray" }) {
  const colorMap = {
    success: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    danger:  "bg-red-500/10 text-red-400 border-red-500/20",
    error:   "bg-red-500/10 text-red-400 border-red-500/20",
    warning: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    primary: "bg-sky-500/10 text-sky-400 border-sky-500/20",
    info:    "bg-sky-500/10 text-sky-400 border-sky-500/20",
    gray:    "bg-zinc-800 text-zinc-400 border-zinc-700",
  };

  const currentStyle = colorMap[color] || colorMap.gray;

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider border ${currentStyle} white-space-nowrap`}>
      {children}
    </span>
  );
}

// 4. Envoltorio de campos con etiquetas uniformes
export function FormGroup({ label, children }) {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider select-none">
        {label}
      </label>
      {children}
    </div>
  );
}

// Estilos base compartidos para inputs oscuros estilo industrial
const baseInputClass = "w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3.5 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-600 focus:ring-1 focus:ring-zinc-600 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed";

// 5. Input estándar de texto / email / password
export function Inp({ style, ...props }) {
  return (
    <input 
      className={baseInputClass}
      style={style}
      {...props} 
    />
  );
}

// 6. Selector desplegable dinámico
export function Sel({ style, children, ...props }) {
  return (
    <div className="relative w-full">
      <select 
        className={`${baseInputClass} appearance-none cursor-pointer pr-8`}
        style={style}
        {...props}
      >
        {children}
      </select>
      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500 text-xs">
        ▼
      </div>
    </div>
  );
}

// 7. Área de texto multilínea para descripciones o comentarios
export function Txt({ style, ...props }) {
  return (
    <textarea 
      className={`${baseInputClass} min-h-[90px] resize-y`}
      style={style}
      {...props} 
    />
  );
}