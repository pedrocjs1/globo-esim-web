// src/app/destinos/page.tsx
import Link from "next/link";
import { getAllCountryGuides } from "@/lib/countryGuides";

export default function DestinationsPage() {
  const guides = getAllCountryGuides();

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-4xl mx-auto py-10 px-4">
        <h1 className="text-3xl font-bold">Destinos para viajar con Globo eSIM</h1>
        <p className="text-slate-300 mt-2">
          Elegí un país para ver lugares imperdibles, tips de viaje y tu eSIM ideal.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {guides.map((guide) => (
            <Link
              key={guide.slug}
              href={`/destinos/${guide.slug}`}
              className="border border-slate-700 rounded-xl p-4 hover:border-emerald-400 transition"
            >
              <p className="text-lg font-semibold">{guide.name}</p>
              <p className="text-xs text-slate-400">{guide.region}</p>
              <p className="text-slate-300 mt-2 line-clamp-2">
                {guide.seoDescription}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
