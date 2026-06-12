"use client";

import { useState } from "react";
import { Plan, startCheckout } from "@/lib/api";

// --- MODAL DE CHECKOUT: captura el email y arranca el pago ---
function CheckoutModal({
  plan,
  slug,
  onClose,
}: {
  plan: Plan;
  slug: string;
  onClose: () => void;
}) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePay = async () => {
    const trimmed = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setError("Necesitamos un email válido — ahí te enviamos la eSIM.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const { redirectUrl } = await startCheckout(plan.id, slug, trimmed);
      // Redirigimos al checkout hosted de dLocal Go.
      window.location.href = redirectUrl;
    } catch (e: any) {
      setError(e.message || "No pudimos iniciar el pago. Probá de nuevo.");
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#0f172a] border border-slate-700 w-full max-w-md rounded-3xl shadow-2xl p-6 relative">
        <button
          onClick={onClose}
          disabled={loading}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition disabled:opacity-40"
        >
          ✕
        </button>

        <h2 className="text-xl font-bold text-white mb-1">Confirmá tu compra 🎈</h2>
        <p className="text-sm text-slate-400 mb-5">
          Plan <b className="text-slate-200">{plan.data}</b> · {plan.validity}
        </p>

        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 mb-5 flex justify-between items-center">
          <span className="text-slate-400 text-sm">Total a pagar</span>
          <span className="text-2xl font-bold text-emerald-400">${plan.price} USD</span>
        </div>

        <label className="block text-xs text-slate-400 mb-2 uppercase font-semibold">
          Email para recibir tu eSIM
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handlePay()}
          placeholder="tu@email.com"
          autoFocus
          disabled={loading}
          className="w-full bg-black/50 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:border-emerald-500 focus:outline-none transition mb-2"
        />

        {error && <p className="text-red-400 text-xs mb-2">{error}</p>}

        <button
          onClick={handlePay}
          disabled={loading}
          className={`w-full mt-3 py-3 rounded-xl font-bold transition flex items-center justify-center gap-2 ${
            loading
              ? "bg-slate-800 text-slate-400 cursor-wait"
              : "bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg hover:shadow-emerald-500/20"
          }`}
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Redirigiendo al pago...
            </>
          ) : (
            "Pagar de forma segura"
          )}
        </button>

        <p className="text-[11px] text-slate-600 mt-3 text-center">
          Pago procesado por dLocal Go. Tu eSIM se genera apenas se confirma el pago.
        </p>
      </div>
    </div>
  );
}

// --- COMPONENTE PRINCIPAL: PLAN CARD ---
export function PlanCard({ plan, slug }: { plan: Plan; slug: string }) {
  const [showCheckout, setShowCheckout] = useState(false);

  return (
    <>
      <div className="border border-slate-700 bg-slate-900/50 rounded-xl p-6 hover:border-emerald-500 transition relative overflow-hidden group flex flex-col h-full">
        {/* Badge de Operador (Opcional) */}
        {plan.operator && (
          <span className="absolute top-4 right-4 text-[10px] uppercase font-bold text-slate-500 bg-slate-800 px-2 py-0.5 rounded">
            {plan.operator}
          </span>
        )}

        <div className="mb-4 mt-2">
          <h3 className="text-2xl font-bold text-white mb-1">{plan.data}</h3>
          <div className="flex items-center gap-2 text-slate-400 text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0h18M5.25 12h13.5h-13.5v6h13.5v-6H5.25z" />
            </svg>
            <span>{plan.validity}</span>
          </div>
        </div>

        <div className="border-t border-slate-800 my-4 pt-4 flex justify-between items-end">
          <div>
            <p className="text-xs text-slate-500 mb-1">Precio final</p>
            <p className="text-3xl font-bold text-emerald-400">${plan.price}</p>
          </div>
          <div className="text-right">
            <span className="text-xs text-slate-500">USD</span>
          </div>
        </div>

        <div className="mt-auto">
          <button
            onClick={() => setShowCheckout(true)}
            className="w-full py-3 rounded-lg font-semibold transition flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg hover:shadow-emerald-500/20"
          >
            Comprar Ahora
          </button>
        </div>
      </div>

      {showCheckout && (
        <CheckoutModal plan={plan} slug={slug} onClose={() => setShowCheckout(false)} />
      )}
    </>
  );
}
