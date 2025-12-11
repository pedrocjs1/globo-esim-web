import Link from "next/link";
import Image from "next/image";
import { getCountries, Country } from "@/lib/api";
// ✅ CORRECCIÓN AQUÍ: Agregué 'Wifi' a los imports
import { Globe, CheckCircle, Smartphone, Tag, ShieldCheck, Zap, Wifi } from "lucide-react";
import { AnnouncementBar } from "@/components/AnnouncementBar";
import { HeroCarousel } from "@/components/HeroCarousel";

// Mapeo de imágenes de alta calidad
const DestinationImages: Record<string, string> = {
  'united-states': '/dest-usa.jpg',
  'japan': '/dest-japan.jpg',
  'europe': '/dest-europe.jpg',
  'turkey': '/dest-turkey.jpg',
  'france': '/dest-europe.jpg', 
  'italy': '/dest-europe.jpg', 
};

export default async function HomePage() {
  let countries: Country[] = [];
  try {
    countries = await getCountries();
  } catch (error) {
    console.error("Error backend:", error);
  }

  const topSlugs = ['united-states', 'europe', 'japan', 'turkey'];
  
  const popularList = countries
    .filter(c => topSlugs.includes(c.slug))
    .sort((a, b) => topSlugs.indexOf(a.slug) - topSlugs.indexOf(b.slug));

  return (
    <>
      <AnnouncementBar />

      <main className="min-h-screen bg-[#020617] text-white selection:bg-emerald-500 selection:text-white overflow-x-hidden font-sans">
        
        <HeroCarousel countries={countries} />

        {/* --- TRUST STRIP --- */}
        <div className="border-y border-white/5 bg-white/[0.02] py-8 relative z-20">
          <div className="container mx-auto px-4 text-center">
            <p className="text-sm text-slate-500 mb-6 uppercase tracking-widest font-semibold">Tecnología compatible con</p>
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-20 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
              <h3 className="text-2xl font-bold text-slate-300">Apple</h3>
              <h3 className="text-2xl font-bold text-slate-300">Samsung</h3>
              <h3 className="text-2xl font-bold text-slate-300">Google</h3>
              <h3 className="text-2xl font-bold text-slate-300">Xiaomi</h3>
            </div>
          </div>
        </div>

        {/* --- DESTINOS POPULARES --- */}
        <section className="py-24 px-4 relative z-10">
          <div className="container mx-auto">
            <div className="text-center mb-16 space-y-4">
              <h2 className="text-4xl md:text-5xl font-bold">Destinos Tendencia <span className="text-emerald-400">🔥</span></h2>
              <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                Olvídate de las banderas borrosas. Mira dónde están viajando todos ahora.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {popularList.map((country) => {
                const hdImage = DestinationImages[country.slug] || country.image;
                
                return (
                  <Link 
                    key={country.slug} 
                    href={`/destinos/${country.slug}`}
                    className="group relative h-[400px] rounded-[2rem] overflow-hidden border border-white/10 shadow-xl hover:shadow-emerald-500/30 transition-all duration-500 hover:-translate-y-3"
                  >
                    <Image 
                      src={hdImage} 
                      alt={country.name} 
                      fill
                      className="object-cover transition-transform duration-1000 group-hover:scale-110 group-hover:rotate-1"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-black/40 to-transparent opacity-80" />
                    
                    <div className="absolute bottom-0 left-0 right-0 p-8 flex flex-col items-start">
                      <div className="flex items-center gap-3 mb-3 bg-black/50 backdrop-blur-md p-2 pr-4 rounded-full border border-white/10">
                         <div className="relative w-8 h-6 rounded overflow-hidden shadow-sm">
                             <Image src={country.image} alt={country.code} fill className="object-cover" />
                         </div>
                        <span className="text-emerald-400 text-sm font-bold tracking-wider">
                          {country.code}
                        </span>
                      </div>

                      <h3 className="text-3xl font-extrabold text-white mb-4">{country.name}</h3>
                      
                      <div className="w-full py-3 px-6 bg-emerald-600 hover:bg-emerald-500 rounded-xl text-center font-bold flex items-center justify-center gap-2 transition-colors group-hover:shadow-[0_0_20px_rgba(16,185,129,0.4)]">
                        Ver planes <Tag className="w-4 h-4"/>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
            
            <div className="mt-16 text-center">
              <Link 
                href="/destinos" 
                className="inline-flex items-center gap-2 text-slate-300 border-b border-slate-700 pb-1 hover:text-emerald-400 hover:border-emerald-400 transition-all"
              >
                Explorar los 190+ destinos disponibles <Globe className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* --- CÓMO FUNCIONA --- */}
        <section className="py-24 bg-[#030814] relative overflow-hidden border-y border-white/5">
          <div className="container mx-auto px-4 relative z-10">
             <div className="text-center mb-16">
               <h2 className="text-3xl md:text-5xl font-bold mb-4">¿Cómo funciona? ⚡️</h2>
               <p className="text-slate-400 text-lg">Tan fácil que parece magia. 100% digital.</p>
             </div>
            <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
              <FeatureCard 
                icon={<Smartphone className="w-8 h-8 text-emerald-400" />}
                title="1. Elegí tu destino"
                desc="Buscá el país y seleccioná el plan de datos que necesites. Pago seguro online."
                step={1}
              />
               <FeatureCard 
                icon={<CheckCircle className="w-8 h-8 text-blue-400" />}
                title="2. Escaneá el QR"
                desc="Recibís un código QR por email al instante. Escanealo desde los ajustes de tu celular."
                step={2}
              />
               {/* AQUÍ ESTABA EL ERROR - Ahora Wifi ya está importado */}
               <FeatureCard 
                icon={<Wifi className="w-8 h-8 text-purple-400" />}
                title="3. Aterrizá conectado"
                desc="Al llegar a destino, activá la línea y listo. ¡Hola internet sin roaming!"
                step={3}
              />
            </div>
          </div>
        </section>

        {/* --- FOOTER --- */}
        <footer className="bg-black pt-16 pb-8 px-4">
           <div className="container mx-auto grid md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-6">
                <Image src="/globo-logo.png" width={40} height={40} alt="Logo" />
                <span className="font-bold text-2xl">Globo eSIM</span>
              </div>
              <p className="text-slate-500 max-w-sm">
                Tu compañero de viaje digital. Conectividad global instantánea sin complicaciones ni costos ocultos.
              </p>
            </div>
            
            <div>
              <h4 className="font-bold text-white mb-6">Destinos</h4>
              <ul className="space-y-3 text-slate-400 text-sm">
                <li><Link href="/destinos/united-states" className="hover:text-emerald-400">eSIM Estados Unidos</Link></li>
                <li><Link href="/destinos/europe" className="hover:text-emerald-400">eSIM Europa</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white mb-6">Ayuda</h4>
              <ul className="space-y-3 text-slate-400 text-sm">
                <li><Link href="#" className="hover:text-emerald-400">Centro de Soporte</Link></li>
                <li><span className="text-slate-500">Whatsapp: +54 9...</span></li>
              </ul>
            </div>
          </div>
          <div className="container mx-auto pt-8 border-t border-white/10 text-center text-slate-600 text-sm">
            <p>© 2025 Globo eSIM.</p>
          </div>
        </footer>

      </main>
    </>
  );
}

function FeatureCard({ icon, title, desc, step }: any) {
  return (
    <div className="bg-white/5 border border-white/10 p-8 rounded-3xl relative hover:bg-white/[0.07] transition-colors group">
      <div className="absolute -top-4 -left-4 w-12 h-12 bg-slate-800 border border-white/20 rounded-full flex items-center justify-center font-bold text-lg text-slate-300 group-hover:text-emerald-400 group-hover:border-emerald-500/50 transition-all">
        {step}
      </div>
      <div className="mb-6 bg-slate-900/50 w-16 h-16 rounded-2xl flex items-center justify-center">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
      <p className="text-slate-400 leading-relaxed">{desc}</p>
    </div>
  )
}