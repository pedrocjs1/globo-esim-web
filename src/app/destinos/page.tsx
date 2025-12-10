import Link from "next/link";
import Image from "next/image";
import { getCountries } from "@/lib/api";

export default async function DestinationsPage() {
  const countries = await getCountries();

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-6xl mx-auto py-16 px-4">
        <h1 className="text-4xl font-bold">Destinos para viajar con Globo eSIM</h1>
        <p className="text-slate-300 mt-2 mb-8">
          Elegí un país para ver los planes disponibles en tiempo real.
        </p>

        <div className="grid gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {countries.map((country) => (
            <Link
              key={country.slug}
              href={`/destinos/${country.slug}`}
              className="group border border-slate-700 rounded-xl overflow-hidden hover:border-emerald-400 transition bg-slate-900"
            >
              <div className="relative h-32 w-full bg-white/5">
                 <Image 
                    src={country.image} 
                    alt={country.name}
                    fill
                    className="object-contain p-4 group-hover:scale-110 transition-transform"
                 />
              </div>
              <div className="p-4">
                <p className="text-lg font-bold">{country.name}</p>
                <p className="text-xs text-slate-400 uppercase tracking-wider">{country.code}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}