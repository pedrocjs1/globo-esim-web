import { getCountries, Country } from "@/lib/api";
import { DestinationsGrid } from "@/components/DestinationsGrid";
import { Suspense } from "react";

// ISR: regenera el listado cada 1h. Si el backend tiene un hipo, no rompe el build.
export const revalidate = 3600;

// Componente Wrapper para manejar Suspense (necesario para useSearchParams en Next.js)
export default async function DestinationsPage() {
  let countries: Country[] = [];
  try {
    countries = await getCountries();
  } catch (error) {
    console.error("Error backend (destinos):", error);
  }

  return (
    <div className="min-h-screen bg-[#050509] text-white">
      <div className="max-w-6xl mx-auto py-16 px-4">
        <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-400">
                Destinos Disponibles 🌎
            </h1>
            <p className="text-slate-400 mt-4 text-lg">
            Elegí tu próximo destino y conéctate al instante.
            </p>
        </div>

        {/* Envolvemos en Suspense porque DestinationsGrid usa query params */}
        <Suspense fallback={<p className="text-center text-slate-500">Cargando buscador...</p>}>
            <DestinationsGrid initialCountries={countries} />
        </Suspense>
      </div>
    </div>
  );
}