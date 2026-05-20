import React from 'react';

export default function Modal({ open, title, onClose, children, footer, width = "520px" }) {
  if (!open) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-zinc-950/80 backdrop-blur-sm flex items-center justify-center z-[1000] p-4 animate-fade-in"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-zinc-900 border border-zinc-800 rounded-xl w-full flex flex-col shadow-2xl max-h-[90vh] text-zinc-50"
        style={{ maxWidth: width }}
      >
        {/* Header / Cabecera del Modal */}
        <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between shrink-0">
          <h3 className="text-lg font-bold tracking-tight text-zinc-50">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 w-8 h-8 flex items-center justify-center rounded-lg transition-colors text-xl"
            aria-label="Cerrar modal"
          >
            &times;
          </button>
        </div>

        {/* Body / Contenido del Modal */}
        <div className="px-6 py-5 overflow-y-auto flex-1 flex flex-col gap-4 text-sm text-zinc-300">
          {children}
        </div>

        {/* Footer / Botones de Acción (Si existen) */}
        {footer && (
          <div className="px-6 py-4 border-t border-zinc-800 flex items-center justify-end gap-3 shrink-0 bg-zinc-900/40 rounded-b-xl">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}