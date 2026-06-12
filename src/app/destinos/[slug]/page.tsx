import type { Metadata } from "next";
import { getCountryGuide, getAllCountrySlugs } from "@/lib/countryGuides";
import { getCountryPlans } from "@/lib/api"; // API Real del backend
import { PlanCard } from "@/components/PlanCard"; // Componente interactivo (Client Component)

interface CountryPageProps {
  params: Promise<{ slug: string }>;
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

// ISR: la página se regenera como máximo cada 1h (catálogo Airalo cambia poco).
export const revalidate = 3600;
// Pre-renderizamos los países con guía; el resto se genera on-demand y se cachea.
export const dynamicParams = true;

export async function generateStaticParams() {
  return getAllCountrySlugs().map((slug) => ({ slug }));
}

// Nombre legible a partir del slug de Airalo (ej. "united-states" -> "United States")
function slugToName(slug: string): string {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export async function generateMetadata({
  params,
}: CountryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const guide = getCountryGuide(slug);
  const name = guide?.name ?? slugToName(slug);

  const title = guide?.seoTitle ?? `eSIM para ${name} — datos sin roaming | Globiesim`;
  const description =
    guide?.seoDescription ??
    `Comprá tu eSIM para ${name} en minutos: internet desde que aterrizás, sin roaming ni chips físicos. Planes con precios reales.`;
  const url = `${SITE_URL}/destinos/${slug}`;

  return {
    // absolute: evita que el layout raíz duplique el sufijo "| Globiesim"
    title: { absolute: title },
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "website",
      siteName: "Globiesim",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
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

  const name = guide?.name ?? slugToName(slug);

  // Fallback para el título si no hay guía escrita a mano
  const pageTitle = guide ? guide.heroTitle : `eSIM para ${name}`;
  const pageSubtitle = guide ? guide.heroSubtitle : "Conéctate al instante con precios locales.";

  // --- Datos estructurados (JSON-LD) para SEO + GEO (que la IA nos cite) ---
  const ld: Record<string, any>[] = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Inicio", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "Destinos", item: `${SITE_URL}/destinos` },
        { "@type": "ListItem", position: 3, name, item: `${SITE_URL}/destinos/${slug}` },
      ],
    },
  ];

  const prices = plans.map((p) => p.price).filter((p) => typeof p === "number");
  if (prices.length > 0) {
    ld.push({
      "@context": "https://schema.org",
      "@type": "Product",
      name: `eSIM para ${name}`,
      description: `Planes de datos eSIM para ${name}: internet sin roaming, activación instantánea por QR.`,
      brand: { "@type": "Brand", name: "Globiesim" },
      offers: {
        "@type": "AggregateOffer",
        priceCurrency: "USD",
        lowPrice: Math.min(...prices),
        highPrice: Math.max(...prices),
        offerCount: plans.length,
      },
    });
  }

  if (guide?.tips?.length) {
    ld.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: guide.tips.map((tip) => ({
        "@type": "Question",
        name: tip.title,
        acceptedAnswer: { "@type": "Answer", text: tip.description },
      })),
    });
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* JSON-LD: structured data para Google y motores de IA */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
      />

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
                <PlanCard key={plan.id} plan={plan} slug={slug} />
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
