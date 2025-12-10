import Link from "next/link";
import Image from "next/image";
// IMPORTANTE: Agregamos 'Country' a la importación para usarlo como tipo
import { getCountries, Country } from "@/lib/api"; 

export default async function HomePage() {
  // 1. Obtenemos los datos reales del Backend
  // CORRECCIÓN: Le decimos explícitamente que esto es una lista de países (Country[])
  let countries: Country[] = []; 
  
  try {
    countries = await getCountries();
  } catch (error) {
    console.error("Error cargando países en Home:", error);
  }

  // 2. Filtramos destinos específicos para la sección "Populares"
  const popularSlugs = ['united-states', 'japan', 'france'];
  
  // Ahora TypeScript ya sabe que 'c' es un país, así que no se quejará de c.slug
  const popular = countries.length > 0 
    ? countries.filter(c => popularSlugs.includes(c.slug))
    : [];
    
  // Si no encontró los populares, usa los primeros 3
  const finalPopular = popular.length > 0 ? popular : countries.slice(0, 3);

  return (
    <main className="min-h-screen bg-black text-white">
      {/* HERO */}
      <section className="max-w-5xl mx-auto px-4 pt-16 pb-12">
        <div className="flex items-center gap-3 mb-4">
          {/* Asegúrate de que globo-logo.png esté en la carpeta public */}
          <Image
            src="/globo-logo.png" 
            alt="Logo de Globo eSIM"
            width={88}
            height={88}
            className="rounded-xl"
            priority 
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

      {/* DESTINOS POPULARES (DINÁMICO) */}
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
          <p className="mt-2 text-slate-300 max-w-2xl mb-6">
            Empezá por estos destinos que combinan mucho turismo con buena
            cobertura de eSIM.
          </p>

          <div className="mt-6 grid gap-6 md:grid-cols-3">
            {finalPopular.map((country) => (
              <Link
                key={country.slug}
                href={`/destinos/${country.slug}`}
                className="group relative rounded-2xl border border-slate-700 bg-slate-900 overflow-hidden hover:border-emerald-400 transition flex flex-col h-64"
              >
                {/* Imagen de Fondo del País */}
                <div className="absolute inset-0 bg-slate-800">
                   <Image 
                    src={country.image} 
                    alt={country.name}
                    fill
                    className="object-cover opacity-60 group-hover:opacity-40 transition-opacity duration-300"
                  />
                  {/* Gradiente para mejorar lectura */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                </div>

                <div className="relative p-5 flex flex-col h-full z-10">
                  <div className="flex justify-between items-start">
                    <span className="bg-emerald-500/20 text-emerald-300 text-xs font-bold px-2 py-1 rounded backdrop-blur-md border border-emerald-500/30">
                      {country.code}
                    </span>
                  </div>
                  
                  <div className="mt-auto">
                    <p className="text-xl font-bold text-white mb-1">{country.name}</p>
                    <span className="text-xs text-emerald-300 group-hover:underline flex items-center gap-1">
                      Ver planes disponibles 
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                        <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
                      </svg>
                    </span>
                  </div>
                </div>
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