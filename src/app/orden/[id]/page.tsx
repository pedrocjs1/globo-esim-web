"use client";

import { useEffect, useState, useCallback, Suspense } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Image from "next/image";
import { getOrderStatus, OrderStatus } from "@/lib/api";

const POLL_INTERVAL_MS = 3000;
const MAX_POLLS = 40; // ~2 minutos

// useSearchParams() exige un Suspense boundary para el build de Next.
export default function OrderPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black" />}>
      <OrderView />
    </Suspense>
  );
}

function OrderView() {
  const params = useParams();
  const search = useSearchParams();
  const orderId = String(params.id);
  const token = search.get("t");
  const cancelled = search.get("cancelado") === "1";

  const [order, setOrder] = useState<OrderStatus | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [polls, setPolls] = useState(0);
  const [deviceTab, setDeviceTab] = useState<"iphone" | "android">("iphone");

  const done = order?.status === "completed" || order?.status === "failed";
  const timedOut = polls >= MAX_POLLS && !done;

  const check = useCallback(async () => {
    try {
      const data = await getOrderStatus(orderId, token);
      setOrder(data);
      setError(null);
    } catch (e: any) {
      setError(e.message || "No pudimos consultar tu orden.");
    }
  }, [orderId, token]);

  useEffect(() => {
    check();
  }, [check]);

  useEffect(() => {
    if (done || timedOut) return;
    const t = setTimeout(() => {
      setPolls((p) => p + 1);
      check();
    }, POLL_INTERVAL_MS);
    return () => clearTimeout(t);
  }, [polls, done, timedOut, check]);

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="bg-[#0f172a] border border-slate-700 w-full max-w-lg rounded-3xl shadow-2xl p-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-slate-800 to-slate-950 flex items-center justify-center border border-slate-700 shadow-lg">
            <Image src="/globo-logo.png" width={28} height={28} alt="Globiesim" className="rounded-md" />
          </div>
          <h1 className="text-xl font-bold text-white">Globiesim</h1>
        </div>

        {/* ESTADO: pago cancelado */}
        {cancelled && order?.status !== "completed" && (
          <div className="text-center py-6">
            <p className="text-3xl mb-2">🚫</p>
            <h2 className="text-lg font-bold text-white mb-1">Pago cancelado</h2>
            <p className="text-sm text-slate-400">
              No se realizó ningún cobro. Podés volver a intentarlo cuando quieras.
            </p>
          </div>
        )}

        {/* ESTADO: procesando (pendiente de pago o generando eSIM) */}
        {!cancelled && !done && !timedOut && (
          <div className="text-center py-8">
            <div className="w-12 h-12 border-4 border-slate-700 border-t-emerald-500 rounded-full animate-spin mx-auto mb-4" />
            <h2 className="text-lg font-bold text-white mb-1">
              {order?.status === "paid" ? "Generando tu eSIM..." : "Confirmando tu pago..."}
            </h2>
            <p className="text-sm text-slate-400">
              Esto puede tardar unos segundos. No cierres esta ventana.
            </p>
          </div>
        )}

        {/* ESTADO: tardando más de lo normal */}
        {!cancelled && timedOut && (
          <div className="text-center py-8">
            <p className="text-3xl mb-2">⏳</p>
            <h2 className="text-lg font-bold text-white mb-1">Está tardando un poco más</h2>
            <p className="text-sm text-slate-400">
              Si pagaste, tu eSIM llegará a tu email apenas se confirme. Podés cerrar esta
              ventana — también te avisamos por correo.
            </p>
            <button
              onClick={() => { setPolls(0); check(); }}
              className="mt-4 text-emerald-400 text-sm underline hover:text-emerald-300"
            >
              Volver a chequear
            </button>
          </div>
        )}

        {/* ESTADO: fallido */}
        {order?.status === "failed" && (
          <div className="text-center py-6">
            <p className="text-3xl mb-2">❌</p>
            <h2 className="text-lg font-bold text-white mb-1">El pago no se completó</h2>
            <p className="text-sm text-slate-400">
              No se generó la eSIM. Si creés que es un error, escribinos.
            </p>
          </div>
        )}

        {/* ESTADO: completado → QR + instrucciones */}
        {order?.status === "completed" && (
          <>
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-white">¡Tu eSIM está lista! 🌍✨</h2>
              <p className="text-sm text-slate-400 mt-1">
                También te la enviamos a <b>{/* email no expuesto */}tu correo</b>.
              </p>
            </div>

            {order.qrcode_url && (
              <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 text-center mb-6">
                <div className="bg-white p-2 rounded-xl inline-block mb-3">
                  <Image
                    src={order.qrcode_url}
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

            <div className="mb-6">
              <p className="text-xs text-slate-500 uppercase font-bold mb-2">
                Código de activación manual (LPA)
              </p>
              <div
                className="bg-black/50 border border-slate-800 rounded-xl p-3 font-mono text-xs text-emerald-400 break-all select-all cursor-pointer hover:bg-black/70 transition"
                onClick={() => navigator.clipboard.writeText(order.qrcode || "")}
              >
                {order.qrcode || "No disponible"}
              </div>
              <p className="text-[10px] text-slate-600 mt-1 text-right">Clic para copiar</p>
            </div>

            {/* Tabs de guía */}
            <div className="bg-slate-900 rounded-xl p-1 flex gap-1 mb-4">
              {(["iphone", "android"] as const).map((d) => (
                <button
                  key={d}
                  onClick={() => setDeviceTab(d)}
                  className={`flex-1 py-2 text-xs font-semibold rounded-lg transition ${
                    deviceTab === d ? "bg-slate-700 text-white shadow" : "text-slate-500 hover:text-slate-300"
                  }`}
                >
                  {d === "iphone" ? "iPhone" : "Android"}
                </button>
              ))}
            </div>

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
          </>
        )}

        {error && !order && (
          <p className="text-red-400 text-sm text-center mt-4">{error}</p>
        )}

        <a
          href="/destinos"
          className="block w-full mt-6 text-center bg-slate-800 hover:bg-slate-700 text-white font-semibold py-3 rounded-xl transition"
        >
          Volver a destinos
        </a>
      </div>
    </div>
  );
}
