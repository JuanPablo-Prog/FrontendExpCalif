import { useState } from "react";
import { apiFetch, saveSession } from "../api/Client";

export default function LoginPage({ onLogin }) {
  const [form, setForm]     = useState({ email: "", password: "" });
  const [error, setError]   = useState("");
  const [loading, setLoading] = useState(false);

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) return setError("Completa todos los campos.");
    setError(""); 
    setLoading(true);
    try {
      const data = await apiFetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(form),
      });

      console.log("Respuesta del backend:", data);

      saveSession(data.access_token, data.usuario);
      onLogin(data.usuario);
    } catch (err) {
      setError(err.message || "Credenciales incorrectas.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4 relative overflow-hidden font-sans selection:bg-zinc-800 selection:text-zinc-200">
      {/* Luces de fondo difuminadas estéticas (Glow effects) */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-zinc-900/30 rounded-full blur-[120px] pointer-events-none animate-pulse duration-[6000ms]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-zinc-800/20 rounded-full blur-[100px] pointer-events-none" />

      {/* Tarjeta del Formulario */}
      <div className="w-full max-w-md bg-zinc-900/40 backdrop-blur-xl border border-zinc-800/80 rounded-2xl p-8 shadow-2xl relative z-10 animate-fade-in">
        {/* Encabezado */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-800 text-2xl shadow-inner mb-4 select-none">
            🎤
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight text-zinc-50">
            ExposCalif
          </h2>
          <p className="text-sm text-zinc-400 mt-1.5">
            Ingresa al panel de control de exposiciones
          </p>
        </div>

        {/* Formulario */}
        <form onSubmit={submit} className="flex flex-col gap-5">
          {/* Campo: Correo Electrónico */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider select-none">
              Correo electrónico
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handle}
              placeholder="nombre@ejemplo.com"
              autoComplete="email"
              disabled={loading}
              className="w-full bg-zinc-950 border border-zinc-800/80 rounded-xl px-4 py-3 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-zinc-700 focus:ring-1 focus:ring-zinc-700 transition-all duration-150 disabled:opacity-50"
            />
          </div>

          {/* Campo: Contraseña */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider select-none">
              Contraseña
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handle}
              placeholder="••••••••"
              autoComplete="current-password"
              disabled={loading}
              className="w-full bg-zinc-950 border border-zinc-800/80 rounded-xl px-4 py-3 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-zinc-700 focus:ring-1 focus:ring-zinc-700 transition-all duration-150 disabled:opacity-50"
            />
          </div>

          {/* Alerta de Error */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3.5 text-xs text-red-400 font-medium flex items-center gap-2.5 animate-shake">
              <span className="shrink-0 text-sm">🛑</span>
              <span>{error}</span>
            </div>
          )}

          {/* Botón de Enviar */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-zinc-50 hover:bg-zinc-200 text-zinc-950 font-bold py-3 px-4 rounded-xl text-sm transition-all duration-150 shadow-md hover:shadow-lg active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none mt-2 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-zinc-900/20 border-t-zinc-900 rounded-full animate-spin" />
                Validando credenciales…
              </>
            ) : (
              "Iniciar sesión"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}