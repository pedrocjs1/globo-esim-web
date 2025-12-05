import Link from "next/link";
import Image from "next/image";
import { getAllCountryGuides } from "@/lib/countryGuides";


export default function HomePage() {
  const popular = getAllCountryGuides().slice(0, 3); // 3 destinos de ejemplo

  return (
    <main className="min-h-screen bg-black text-white">
      {/* HERO */}
      <section className="max-w-5xl mx-auto px-4 pt-16 pb-12">
        <div className="flex items-center gap-3 mb-4">
      <Image
        src="/globo-logo.png"
        alt="Logo de Globo eSIM"
        width={88}
        height={88}
        className="rounded-xl"
      />
      <p className="text-xs uppercase tracking-[0.25em] text-emerald-300">
        Globo eSIM
      </p>
    </div>

    <h1 className="mt-3 text-4xl md:text-5xl font-bold leading-tight">
      Viajar es más fácil <span className="text-emerald-400">conectado</span>.
    </h1>
    <p className="mt-4 text-slate-300 max-w-2xl">
      Comprá tu eSIM en minutos, evitá el roaming y mantenete online desde
      que aterrizás. Pagos en tu moneda local y soporte pensado para
      viajeros latinoamericanos.
    </p>

        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            href="/destinos"
            className="rounded-full bg-emerald-500 px-6 py-2.5 text-sm font-semibold text-black hover:bg-emerald-400 transition"
          >
            Ver destinos y guías de viaje
          </Link>
          <Link
            href="#planes"
            className="rounded-full border border-slate-600 px-6 py-2.5 text-sm font-semibold text-slate-100 hover:border-emerald-400 transition"
          >
            Cómo funciona Globo eSIM
          </Link>
        </div>

        <p className="mt-6 text-xs text-slate-500">
          Próximamente: integración directa como mini-app dentro de Lemon
          para pagar con USDC o pesos.
        </p>
      </section>

      {/* CÓMO FUNCIONA */}
      <section
        id="planes"
        className="border-t border-slate-800 bg-[#050509] py-12"
      >
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-2xl font-semibold">Cómo funciona Globo eSIM</h2>
          <p className="mt-2 text-slate-300 max-w-2xl">
            Pensado para que cualquier viajero pueda tener internet sin
            complicarse con chips físicos ni planes raros de roaming.
          </p>

          <div className="mt-8 grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-700 p-4">
              <p className="text-xs text-slate-400 mb-1">Paso 1</p>
              <h3 className="font-semibold mb-2">Elegís el destino</h3>
              <p className="text-sm text-slate-300">
                Buscás el país al que viajás y ves los planes disponibles con
                datos y duración claros.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-700 p-4">
              <p className="text-xs text-slate-400 mb-1">Paso 2</p>
              <h3 className="font-semibold mb-2">Pagás online</h3>
              <p className="text-sm text-slate-300">
                Pagás con tarjeta, crypto o (en un futuro) desde Lemon en USDC
                o pesos argentinos.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-700 p-4">
              <p className="text-xs text-slate-400 mb-1">Paso 3</p>
              <h3 className="font-semibold mb-2">Escaneás y viajás</h3>
              <p className="text-sm text-slate-300">
                Te llega el QR por mail y en tu cuenta. Lo escaneás en el
                celular y ya tenés internet al aterrizar.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* DESTINOS POPULARES */}
      <section className="py-12">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-2xl font-semibold">Destinos populares</h2>
            <Link
              href="/destinos"
              className="text-sm text-emerald-400 hover:underline"
            >
              Ver todos los destinos
            </Link>
          </div>
          <p className="mt-2 text-slate-300 max-w-2xl">
            Empezá por estos destinos que combinan mucho turismo con buena
            cobertura de eSIM.
          </p>

          <div className="mt-6 grid gap-6 md:grid-cols-3">
            {popular.map((guide) => (
              <Link
                key={guide.slug}
                href={`/destinos/${guide.slug}`}
                className="rounded-2xl border border-slate-700 p-4 hover:border-emerald-400 transition flex flex-col"
              >
                <p className="text-sm text-slate-400">{guide.region}</p>
                <p className="text-lg font-semibold">{guide.name}</p>
                <p className="mt-2 text-sm text-slate-300 line-clamp-3">
                  {guide.seoDescription}
                </p>
                <span className="mt-auto pt-3 text-xs text-emerald-300">
                  Ver guía y eSIM recomendadas →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER SIMPLE */}
      <footer className="border-t border-slate-800 py-6">
        <div className="max-w-5xl mx-auto px-4 text-xs text-slate-500 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <span>© {new Date().getFullYear()} Globo eSIM. Todos los derechos reservados.</span>
          <span className="text-slate-600">
            Construido por Violet Wave · Próximamente mini-app en Lemon.
          </span>
        </div>
      </footer>
    </main>
  );
}
