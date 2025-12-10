"use client";

import { useState } from "react";
import { Plan, buyEsim, OrderResponse } from "@/lib/api";
import Image from "next/image";

// --- COMPONENTE VISUAL: MODAL DE ÉXITO (Estilo Lemon adaptado a Web) ---
function SuccessModal({ 
  order, 
  planName, 
  onClose 
}: { 
  order: OrderResponse; 
  planName: string; 
  onClose: () => void;
}) {
  const [deviceTab, setDeviceTab] = useState<"iphone" | "android">("iphone");
  const hasQr = Boolean(order.qrcode_url);
  const hasLpa = Boolean(order.qrcode); // En Airalo 'qrcode' a veces trae el string LPA

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#0f172a] border border-slate-700 w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl p-6 relative">
        
        {/* Botón Cerrar */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition"
        >
          ✕
        </button>

        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-slate-800 to-slate-950 flex items-center justify-center border border-slate-700 shadow-lg">
             <Image src="/globo-logo.png" width={28} height={28} alt="Logo" className="rounded-md" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">¡Tu eSIM está lista! 🌍✨</h2>
            <p className="text-sm text-slate-400">Plan <b>{planName}</b> generado con éxito.</p>
          </div>
        </div>

        {/* QR Section */}
        {hasQr && (
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 text-center mb-6">
            <div className="bg-white p-2 rounded-xl inline-block mb-3">
              <Image 
                src={order.qrcode_url!} 
                alt="QR eSIM" 
                width={200} 
                height={200} 
                className="mix-blend-multiply"
              />
            </div>
            <p className="text-xs text-slate-400">
              Escaneá este código con la cámara de tu celular para instalar la eSIM.
            </p>
          </div>
        )}

        {/* LPA Section (Código Manual) */}
        <div className="mb-6">
          <p className="text-xs text-slate-500 uppercase font-bold mb-2">Código de activación manual (LPA)</p>
          <div className="bg-black/50 border border-slate-800 rounded-xl p-3 font-mono text-xs text-emerald-400 break-all select-all cursor-pointer hover:bg-black/70 transition"
               onClick={() => navigator.clipboard.writeText(order.qrcode || "")}>
            {order.qrcode || "No disponible en Sandbox"}
          </div>
          <p className="text-[10px] text-slate-600 mt-1 text-right">Clic para copiar</p>
        </div>

        {/* Tabs de Guía */}
        <div className="bg-slate-900 rounded-xl p-1 flex gap-1 mb-4">
          <button
            onClick={() => setDeviceTab("iphone")}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition ${
              deviceTab === "iphone" ? "bg-slate-700 text-white shadow" : "text-slate-500 hover:text-slate-300"
            }`}
          >
            iPhone
          </button>
          <button
            onClick={() => setDeviceTab("android")}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition ${
              deviceTab === "android" ? "bg-slate-700 text-white shadow" : "text-slate-500 hover:text-slate-300"
            }`}
          >
            Android
          </button>
        </div>

        {/* Pasos de Instalación */}
        <div className="bg-slate-900/30 rounded-xl p-4 border border-slate-800/50">
          <ol className="list-decimal list-inside space-y-3 text-sm text-slate-300">
            {deviceTab === "iphone" ? (
              <>
                <li>Abrí <b>Configuración</b> &gt; <b>Datos celulares</b>.</li>
                <li>Tocá <b>Agregar eSIM</b> &gt; <b>Usar código QR</b>.</li>
                <li>Escaneá el QR o ingresá los datos manualmente.</li>
                <li>Activá el <b>Roaming de datos</b> en la eSIM al llegar.</li>
              </>
            ) : (
              <>
                <li>Abrí <b>Ajustes</b> &gt; <b>Conexiones</b> &gt; <b>Admin. de SIM</b>.</li>
                <li>Tocá <b>Añadir eSIM</b> &gt; <b>Escanear código QR</b>.</li>
                <li>Escaneá el QR o tocá "Ingresar código" abajo.</li>
                <li>Asegurate de activar <b>Itinerancia de datos</b> al viajar.</li>
              </>
            )}
          </ol>
        </div>

        <button 
          onClick={onClose}
          className="w-full mt-6 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl transition"
        >
          Entendido, ¡gracias!
        </button>

      </div>
    </div>
  );
}


// --- COMPONENTE PRINCIPAL: PLAN CARD ---
export function PlanCard({ plan }: { plan: Plan }) {
  const [loading, setLoading] = useState(false);
  const [successOrder, setSuccessOrder] = useState<OrderResponse | null>(null);

  const handleBuy = async () => {
    // Simulación de confirmación (idealmente sería un modal de pago previo)
    if (!confirm(`Confirmar compra de ${plan.data} por $${plan.price} USD?`)) return;

    setLoading(true);
    try {
      const order = await buyEsim(plan.id);
      setSuccessOrder(order); // Esto activará el modal
    } catch (error: any) {
      alert(`Hubo un error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

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
            onClick={handleBuy}
            disabled={loading}
            className={`w-full py-3 rounded-lg font-semibold transition flex items-center justify-center gap-2 ${
              loading
                ? "bg-slate-800 text-slate-400 cursor-wait"
                : "bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg hover:shadow-emerald-500/20"
            }`}
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Procesando...
              </>
            ) : (
              "Comprar Ahora"
            )}
          </button>
        </div>
      </div>

      {/* RENDERIZADO DEL MODAL SI HAY ORDEN EXITOSA */}
      {successOrder && (
        <SuccessModal 
          order={successOrder} 
          planName={plan.data} 
          onClose={() => setSuccessOrder(null)} 
        />
      )}
    </>
  );
}