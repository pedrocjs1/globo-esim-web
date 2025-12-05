import { getCountryGuide } from "@/lib/countryGuides";
import { getEsimPlansForCountry } from "@/lib/esimPlans";
import { PlanCard } from "@/components/PlanCard";

interface CountryPageProps {
  params: Promise<{ slug: string }>;
}

export default async function CountryPage({ params }: CountryPageProps) {
  const { slug } = await params;
  const guide = getCountryGuide(slug);
  const plans = getEsimPlansForCountry(slug);

  if (!guide) {
    return (
      <div className="min-h-screen bg-black text-red-400 p-10">
        Destino no encontrado. (slug: {slug})
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-4xl mx-auto py-10 px-4">
        <h1 className="text-3xl font-bold">{guide.heroTitle}</h1>
        <p className="text-slate-300 mt-2">{guide.heroSubtitle}</p>

        {/* Lugares */}
        <section className="mt-10">
          <h2 className="text-2xl font-semibold">
            Lugares imperdibles en {guide.name}
          </h2>
          <ul className="mt-4 space-y-4">
            {guide.popularPlaces.map((place) => (
              <li key={place.id} className="border border-slate-700 p-4 rounded-xl">
                <p className="text-lg font-medium">{place.name}</p>
                {place.city && <p className="text-sm text-slate-400">Ciudad: {place.city}</p>}
                <p className="text-slate-300">{place.shortDescription}</p>
                {place.highlight && (
                  <p className="text-emerald-300 text-sm mt-1">{place.highlight}</p>
                )}
              </li>
            ))}
          </ul>
        </section>

        {/* Tips */}
        <section className="mt-10">
          <h2 className="text-2xl font-semibold">Tips para viajeros</h2>
          <ul className="mt-4 space-y-4">
            {guide.tips.map((tip) => (
              <li key={tip.id} className="border border-slate-700 p-4 rounded-xl">
                <p className="uppercase text-xs text-slate-400">{tip.category}</p>
                <p className="font-medium">{tip.title}</p>
                <p className="text-slate-300">{tip.description}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* Planes eSIM */}
        {plans.length > 0 && (
          <section className="mt-12 border-t border-slate-800 pt-8">
            <h2 className="text-2xl font-semibold">
              Planes eSIM recomendados para {guide.name}
            </h2>

            <p className="mt-2 text-slate-300">
              Estos son planes de ejemplo para mostrar cómo va a verse Globo eSIM.
              Más adelante se van a cargar automáticamente desde la API de Airalo
              y tu backend.
            </p>

            <div className="mt-6 grid gap-6 md:grid-cols-2">
              {plans.map((plan) => (
                <PlanCard key={plan.id} plan={plan} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
