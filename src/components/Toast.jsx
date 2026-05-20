import React from 'react';

const icons = {
  success: "✨",
  error:   "🛑",
  info:    "ℹ️",
};

const colors = {
  success: {
    border: "border-emerald-500/30",
    iconBg: "bg-emerald-500/10 text-emerald-400",
    indicator: "bg-emerald-500"
  },
  error: {
    border: "border-red-500/30",
    iconBg: "bg-red-500/10 text-red-400",
    indicator: "bg-red-500"
  },
  info: {
    border: "border-sky-500/30",
    iconBg: "bg-sky-500/10 text-sky-400",
    indicator: "bg-sky-500"
  },
};

export default function ToastContainer({ toasts, dismiss }) {
  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      {toasts.map((t) => {
        const c = colors[t.type] || colors.info;
        const icon = icons[t.type] || icons.info;

        return (
          <div
            key={t.id}
            onClick={() => dismiss(t.id)}
            className={`pointer-events-auto cursor-pointer bg-zinc-900/95 backdrop-blur-md border ${c.border} text-zinc-100 p-4 rounded-xl shadow-2xl flex items-start gap-3 justify-between overflow-hidden relative transition-all duration-300 hover:translate-y-[-2px] animate-fade-in-up`}
          >
            {/* Barra indicadora lateral */}
            <div className={`absolute left-0 top-0 bottom-0 w-1 ${c.indicator}`} />

            <div className="flex gap-3 items-center">
              {/* Contenedor del Icono */}
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm shrink-0 font-bold ${c.iconBg}`}>
                {icon}
              </div>

              {/* Mensaje de la alerta */}
              <p className="text-sm font-medium tracking-wide text-zinc-200 leading-snug pr-2">
                {t.text || t.message || (typeof t === 'string' ? t : '')}
              </p>
            </div>

            {/* Botón de cierre */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                dismiss(t.id);
              }}
              className="text-zinc-500 hover:text-zinc-300 transition-colors text-xs shrink-0 self-center px-1"
              aria-label="Cerrar notificación"
            >
              ✕
            </button>
          </div>
        );
      })}
    </div>
  );
}