"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { SearchBox } from "./SearchBox";
import { Country } from "@/lib/api";
import { Star, CheckCircle, Wifi } from "lucide-react";

// Datos del carrusel: distintos textos e imágenes
const slides = [
  {
    image: "/hero-traveler.png", // Tu imagen actual
    title: <>Internet en tus viajes, <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">simple y barato.</span></>,
    text: "Olvidate del roaming. Descargá tu eSIM, escaneá el QR y aterrizá conectado. Desde $4.50 USD."
  },
  {
    image: "/hero-girl-2.png", // Imagen nueva 1 (ej. selfie en Europa)
    title: <>Comparte cada momento <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-orange-400">en tiempo real.</span></>,
    text: "Sube historias, usa mapas y mantente en contacto. Datos ilimitados disponibles en Europa y USA."
  },
  {
    image: "/hero-girl-3.png", // Imagen nueva 2 (ej. aventura)
    title: <>Tu oficina nómada <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">en cualquier lugar.</span></>,
    text: "Velocidad 5G garantizada para trabajar remoto sin interrupciones desde la playa o la montaña."
  }
];

export function HeroCarousel({ countries }: { countries: Country[] }) {
  const [index, setIndex] = useState(0);

  // Rotación automática cada 6 segundos
  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const currentSlide = slides[index];

  return (
    <section className="relative pt-12 pb-12 lg:pt-20 lg:pb-20 overflow-hidden">
       {/* Fondos dinámicos */}
      <AnimatePresence mode="wait">
        <motion.div 
          key={index}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1 }}
          className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-emerald-900/10 to-transparent z-0 pointer-events-none"
          style={{ filter: `hue-rotate(${index * 60}deg)` }} // Cambia sutilmente el color de fondo
        />
      </AnimatePresence>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20 min-h-[600px]">
          
          {/* Columna Izquierda: Texto y Buscador (Estático, el contenido cambia animado) */}
          <div className="lg:w-1/2 text-center lg:text-left space-y-8">
            
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium">
              <Star className="w-4 h-4 fill-emerald-400" />
              <span>Elegida por +10,000 viajeros latinos</span>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={index}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
              >
                <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] h-[160px] lg:h-auto flex items-center lg:block justify-center">
                  {currentSlide.title}
                </h1>
                <p className="text-lg text-slate-400 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                  {currentSlide.text}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* El Buscador siempre visible */}
            <div className="w-full max-w-md mx-auto lg:mx-0 pt-4">
              <SearchBox countries={countries} />
              <p className="text-xs text-slate-500 mt-3 flex items-center justify-center lg:justify-start gap-4">
                <span className="flex items-center gap-1"><CheckCircle className="w-3 h-3 text-emerald-500"/> Activación inmediata</span>
                <span className="flex items-center gap-1"><CheckCircle className="w-3 h-3 text-emerald-500"/> Sin contratos</span>
              </p>
            </div>
          </div>

          {/* Columna Derecha: Imagen Cambiante */}
          <div className="lg:w-1/2 relative perspective-1000">
            <div className="relative w-full aspect-[4/5] lg:aspect-square max-w-md mx-auto">
              <AnimatePresence mode="wait">
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 50, rotateY: -10 }}
                  animate={{ opacity: 1, x: 0, rotateY: 0 }}
                  exit={{ opacity: 0, x: -50, rotateY: 10 }}
                  transition={{ duration: 0.7, ease: "easeInOut" }}
                  className="relative h-full w-full rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl bg-slate-800"
                >
                  <Image 
                    src={currentSlide.image} 
                    alt="Viajero conectado" 
                    fill 
                    className="object-cover"
                    priority
                  />
                  {/* Decoración flotante */}
                  <div className="absolute bottom-6 left-6 right-6 bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-xl flex items-center gap-4 shadow-xl animate-pulse-slow">
                    <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center">
                      <Wifi className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">Conectado 5G</p>
                      <p className="text-xs text-emerald-300">Datos Ilimitados activos</p>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}