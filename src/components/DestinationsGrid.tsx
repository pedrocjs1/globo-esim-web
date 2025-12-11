"use client";

import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Search, MapPin, Globe, Zap, ArrowRight } from "lucide-react";
import { Country } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";

// --- CONFIGURACIÓN DE REGIONES Y FOTOS HD ---
// Mapeamos manualmente algunos países a sus regiones y fotos lindas
const REGIONS: Record<string, string[]> = {
  'Europa': ['france', 'spain', 'italy', 'germany', 'united-kingdom', 'turkey', 'netherlands', 'portugal'],
  'Asia': ['japan', 'thailand', 'china', 'south-korea', 'indonesia', 'vietnam'],
  'América': ['united-states', 'canada', 'mexico', 'brazil', 'argentina', 'colombia'],
};

// Fotos HD para los destacados (Reutilizamos las que generaste)
const HD_IMAGES: Record<string, string> = {
  'united-states': '/dest-usa.jpg',
  'japan': '/dest-japan.jpg',
  'europe': '/dest-europe.jpg', // Usamos esta para varios de Europa si quieres
  'turkey': '/dest-turkey.jpg',
  'france': '/dest-france.jpg',
};

export function DestinationsGrid({ initialCountries }: { initialCountries: Country[] }) {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  
  const [searchTerm, setSearchTerm] = useState(initialQuery);
  const [activeTab, setActiveTab] = useState("Todos");

  // --- LÓGICA DE FILTRADO ---
  const filteredCountries = useMemo(() => {
    return initialCountries.filter((country) => {
      // 1. Filtro por Buscador
      const matchesSearch = 
        country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        country.code.toLowerCase().includes(searchTerm.toLowerCase());

      // 2. Filtro por Región (Tab)
      let matchesRegion = true;
      if (activeTab !== "Todos") {
        // Buscamos si el slug está en la lista de la región seleccionada
        const regionSlugs = REGIONS[activeTab] || [];
        matchesRegion = regionSlugs.includes(country.slug);
      }

      return matchesSearch && matchesRegion;
    });
  }, [searchTerm, activeTab, initialCountries]);

  // Sepamos los "Destacados" para mostrarlos diferente
  const topSlugs = ['united-states', 'japan', 'turkey', 'france'];
  const featuredCountries = initialCountries.filter(c => topSlugs.includes(c.slug));

  return (
    <div className="space-y-12">
      
      {/* --- 1. BUSCADOR Y FILTROS --- */}
      <div className="flex flex-col md:flex-row gap-6 items-center justify-between sticky top-4 z-30 bg-[#050509]/80 backdrop-blur-xl p-4 rounded-2xl border border-white/5 shadow-2xl">
        
        {/* Input Buscador */}
        <div className="relative w-full md:w-96 group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
          </div>
          <input
            type="text"
            className="block w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:bg-white/10 transition-all"
            placeholder="Buscar país..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Tabs de Regiones */}
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto no-scrollbar">
          {["Todos", "Europa", "Asia", "América"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all whitespace-nowrap ${
                activeTab === tab
                  ? "bg-emerald-500 text-black shadow-lg shadow-emerald-500/20"
                  : "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* --- 2. SECCIÓN DESTACADOS (Solo si no estamos filtrando mucho) --- */}
      {searchTerm === "" && activeTab === "Todos" && (
        <section>
          <div className="flex items-center gap-2 mb-6">
            <Zap className="w-6 h-6 text-yellow-400 fill-yellow-400" />
            <h2 className="text-2xl font-bold text-white">Más Populares</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredCountries.map((country) => {
               const hdImage = HD_IMAGES[country.slug] || country.image;
               return (
                <Link
                  key={country.slug}
                  href={`/destinos/${country.slug}`}
                  className="group relative h-80 rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl hover:shadow-emerald-500/20 transition-all duration-500 hover:-translate-y-2"
                >
                  <Image 
                    src={hdImage} 
                    alt={country.name} 
                    fill 
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                  
                  {/* Badge "Unlimited" Simulado */}
                  <div className="absolute top-4 left-4">
                    <span className="bg-emerald-500/90 backdrop-blur text-black text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg">
                      Datos Ilimitados
                    </span>
                  </div>

                  <div className="absolute bottom-0 p-6 w-full">
                    <h3 className="text-2xl font-bold text-white mb-1">{country.name}</h3>
                    <div className="flex items-center gap-2 text-emerald-300 text-sm font-medium group-hover:gap-4 transition-all">
                      <span>Ver planes</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </Link>
               )
            })}
          </div>
        </section>
      )}

      {/* --- 3. GRID PRINCIPAL (Todos los países) --- */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-emerald-400" />
            <h2 className="text-xl font-bold text-slate-200">
              {activeTab === "Todos" ? "Todos los Destinos" : `Destinos en ${activeTab}`}
            </h2>
            <span className="text-xs bg-white/10 px-2 py-1 rounded-full text-slate-400">
              {filteredCountries.length}
            </span>
          </div>
        </div>

        <motion.div 
          layout 
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4"
        >
          <AnimatePresence>
            {filteredCountries.map((country) => (
              <motion.div
                layout
                key={country.slug}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
              >
                <Link
                  href={`/destinos/${country.slug}`}
                  className="block group bg-[#0a0f1c] border border-white/5 rounded-2xl p-4 hover:border-emerald-500/50 hover:bg-white/[0.03] transition-all duration-300 relative overflow-hidden"
                >
                  {/* Efecto Glow al Hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/0 via-emerald-500/0 to-emerald-500/0 group-hover:to-emerald-500/10 transition-all duration-500" />

                  <div className="flex flex-col items-center text-center gap-4 relative z-10">
                    {/* Bandera Circular con Sombra */}
                    <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-white/10 shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <Image
                        src={country.image}
                        alt={country.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    
                    <div>
                      <h3 className="text-white font-semibold text-sm group-hover:text-emerald-400 transition-colors line-clamp-1">
                        {country.name}
                      </h3>
                      <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mt-1">
                        eSIM Prepaga
                      </p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredCountries.length === 0 && (
          <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/10 border-dashed">
            <p className="text-xl text-slate-400">No encontramos "{searchTerm}" en {activeTab} 😢</p>
            <button 
                onClick={() => { setSearchTerm(''); setActiveTab('Todos'); }}
                className="mt-4 text-emerald-400 hover:underline font-medium"
            >
                Limpiar filtros
            </button>
          </div>
        )}
      </section>
    </div>
  );
}