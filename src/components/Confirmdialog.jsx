import React from 'react';

export default function ConfirmDialog({ open, message = "¿Estás seguro de eliminar este registro?", onConfirm, onCancel, loading }) {
  if (!open) return null;

  return (
    <div
      onClick={onCancel}
      className="fixed inset-0 bg-zinc-950/80 backdrop-blur-sm flex items-center justify-center z-[1100] p-4 animate-fade-in"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-zinc-900 border border-zinc-800 rounded-xl w-full max-w-md p-6 shadow-2xl text-zinc-50"
      >
        <div className="flex gap-4 items-start mb-6">
          {/* Icono de advertencia en tonos rojos sutiles */}
          <div className="w-10 h-10 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center text-xl text-red-400 shrink-0">
            ⚠️
          </div>
          
          <div>
            <h3 className="text-base font-bold tracking-tight text-zinc-50 mb-1">
              Confirmar eliminación
            </h3>
            <p className="text-sm text-zinc-400 leading-relaxed">
              {message}
            </p>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex items-center justify-end gap-3">
          <button
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 rounded-lg text-sm font-medium text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>
          
          <button
            onClick={onConfirm}
            disabled={loading}
            className="px-4 py-2 rounded-lg text-sm font-medium bg-red-600 hover:bg-red-500 text-white shadow-sm transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                Eliminando…
              </>
            ) : (
              "Eliminar registro"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}