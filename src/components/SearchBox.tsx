"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, ChevronRight, MapPin } from "lucide-react";
import { Country } from "@/lib/api";
import Link from "next/link";
import Image from "next/image";

const ALIAS_MAP: Record<string, string> = {
  'japon': 'Japan',
  'japón': 'Japan',
  'usa': 'United States',
  'eeuu': 'United States',
  'estados unidos': 'United States',
  'españa': 'Spain',
  'francia': 'France',
  'turquia': 'Turkey',
  'turquía': 'Turkey',
  'italia': 'Italy',
  'alemania': 'Germany',
  'reino unido': 'United Kingdom',
  'inglaterra': 'United Kingdom',
};

export function SearchBox({ countries }: { countries: Country[] }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Country[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setQuery(term);

    if (term.length > 0) {
      setIsOpen(true);
      const lowerTerm = term.toLowerCase();
      const aliasMatch = Object.keys(ALIAS_MAP).find(key => key.includes(lowerTerm));
      const targetName = aliasMatch ? ALIAS_MAP[aliasMatch].toLowerCase() : lowerTerm;

      // Filtramos
      const filtered = countries.filter(c => {
        const name = c.name.toLowerCase();
        const code = c.code.toLowerCase();
        return name.includes(targetName) || code.includes(lowerTerm) || name.includes(lowerTerm);
      }).slice(0, 5); // Limitamos a 5

      setResults(filtered);
    } else {
      setIsOpen(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (results.length > 0) {
      router.push(`/destinos/${results[0].slug}`);
    } else if (query.trim()) {
      router.push(`/destinos?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <div ref={wrapperRef} className="relative w-full max-w-lg mx-auto mt-8 z-50">
      
      {/* Estilos para el Scrollbar personalizado */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #0f172a;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #334155;
          border-radius: 20px;
        }
      `}</style>

      {/* Barra Principal */}
      <form 
        onSubmit={handleSubmit}
        className="relative flex items-center bg-white/10 border border-white/20 backdrop-blur-xl rounded-full shadow-2xl hover:border-emerald-500/50 transition-all group focus-within:ring-2 focus-within:ring-emerald-500/50 focus-within:bg-black/40"
      >
        <div className="pl-5 text-slate-400">
          <Search className="w-5 h-5 group-hover:text-emerald-400 transition" />
        </div>
        <input 
          type="text" 
          value={query}
          onChange={handleSearch}
          onFocus={() => query.length > 0 && setIsOpen(true)}
          placeholder="¿A dónde viajas? (ej: Japón, USA...)" 
          className="w-full bg-transparent border-none outline-none text-white px-4 py-4 placeholder:text-slate-400 text-lg"
          autoComplete="off"
        />
        <div className="pr-2">
            <button 
                type="submit"
                className="bg-emerald-500 hover:bg-emerald-400 text-black font-bold py-2 px-6 rounded-full transition-all"
            >
                Buscar
            </button>
        </div>
      </form>

      {/* Menú Desplegable */}
      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-3 w-full bg-[#0f172a] border border-slate-700 rounded-2xl overflow-hidden shadow-2xl z-[100] animate-in fade-in slide-in-from-top-2 ring-1 ring-white/10">
            <div className="px-4 py-2 text-xs font-bold text-slate-500 uppercase tracking-wider bg-slate-900/50">
                Destinos Sugeridos
            </div>
            {/* Agregamos la clase custom-scrollbar aquí */}
            <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
              {results.map((country) => (
                  <Link 
                      href={`/destinos/${country.slug}`} 
                      key={country.slug}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-4 p-4 hover:bg-white/10 transition-colors border-b border-white/5 last:border-0 group cursor-pointer"
                  >
                      <div className="relative w-10 h-7 rounded overflow-hidden shadow-sm border border-white/10 shrink-0">
                          <Image 
                              src={country.image} 
                              alt={country.name} 
                              fill 
                              className="object-cover"
                          />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                          <p className="text-white font-semibold group-hover:text-emerald-400 transition-colors truncate">
                              {country.name}
                          </p>
                          <p className="text-xs text-slate-400 flex items-center gap-1">
                              <MapPin className="w-3 h-3" /> eSIM Prepaga
                          </p>
                      </div>

                      <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-emerald-400 shrink-0" />
                  </Link>
              ))}
            </div>
        </div>
      )}

      {isOpen && query.length > 0 && results.length === 0 && (
         <div className="absolute top-full left-0 right-0 mt-3 w-full bg-[#0f172a] border border-slate-700 rounded-2xl p-4 text-center shadow-2xl z-[100]">
            <p className="text-slate-400 text-sm">No encontramos destinos para "{query}" 😢</p>
         </div>
      )}
    </div>
  );
}