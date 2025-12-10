import { getCountryGuide } from "@/lib/countryGuides";
import { getCountryPlans } from "@/lib/api"; // API Real del backend
import { PlanCard } from "@/components/PlanCard"; // Componente interactivo (Client Component)

interface CountryPageProps {
  params: Promise<{ slug: string }>;
}

export default async function CountryPage({ params }: CountryPageProps) {
  const { slug } = await params;
  
  // 1. Intentamos cargar la guía de texto local (Tips, Lugares) si existe
  const guide = getCountryGuide(slug);
  
  // 2. Cargamos los planes REALES desde Airalo (Backend)
  const plans = await getCountryPlans(slug);

  // Si no hay guía ni planes, mostramos error 404 custom
  if (!guide && plans.length === 0) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <h1 className="text-2xl">Destino no encontrado o sin cobertura actualmente.</h1>
      </div>
    );
  }

  // Fallback para el título si no hay guía escrita a mano
  const pageTitle = guide ? guide.heroTitle : `eSIM para ${slug.toUpperCase()}`;
  const pageSubtitle = guide ? guide.heroSubtitle : "Conéctate al instante con precios locales.";

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-4xl mx-auto py-10 px-4">
        
        {/* HEADER */}
        <h1 className="text-4xl font-bold text-emerald-400">{pageTitle}</h1>
        <p className="text-slate-300 mt-2 text-lg">{pageSubtitle}</p>

        {/* PLANES (Datos Reales) */}
        <section className="mt-12">
          <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
            📲 Planes disponibles ahora
            <span className="text-xs bg-emerald-900 text-emerald-300 px-2 py-1 rounded-full">En vivo</span>
          </h2>
          
          {plans.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2">
              {plans.map((plan) => (
                // ✅ CAMBIO CLAVE: Usamos el componente PlanCard aquí
                // Esto habilita la lógica de compra y el loading
                <PlanCard key={plan.id} plan={plan} />
              ))}
            </div>
          ) : (
            <p className="text-slate-400">Cargando planes o no hay stock disponible...</p>
          )}
        </section>

        {/* GUÍA DE VIAJE (Solo si existe en countryGuides.ts) */}
        {guide && (
          <>
            {/* Lugares */}
            <section className="mt-16 border-t border-slate-800 pt-10">
              <h2 className="text-2xl font-semibold mb-6">📍 Lugares imperdibles</h2>
              <ul className="space-y-4">
                {guide.popularPlaces.map((place) => (
                  <li key={place.id} className="bg-slate-900/30 border border-slate-800 p-5 rounded-xl">
                    <p className="text-lg font-medium text-emerald-200">{place.name}</p>
                    <p className="text-slate-300 mt-1">{place.shortDescription}</p>
                  </li>
                ))}
              </ul>
            </section>

            {/* Tips */}
            <section className="mt-10">
              <h2 className="text-2xl font-semibold mb-6">💡 Tips para viajeros</h2>
              <div className="grid gap-4 md:grid-cols-2">
                {guide.tips.map((tip) => (
                  <div key={tip.id} className="bg-slate-900/30 border border-slate-800 p-5 rounded-xl">
                    <p className="uppercase text-xs text-slate-500 font-bold mb-1">{tip.category}</p>
                    <p className="font-medium mb-1">{tip.title}</p>
                    <p className="text-sm text-slate-400">{tip.description}</p>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}

      </div>
    </div>
  );
}