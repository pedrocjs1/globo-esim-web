"use client";

import { motion } from "framer-motion";
import Image from "next/image";

// Generamos posiciones aleatorias para que se sienta orgánico
const balloons = [...Array(6)].map((_, i) => ({
  id: i,
  x: Math.random() * 100, // Posición horizontal %
  y: Math.random() * 100, // Posición vertical %
  scale: 0.5 + Math.random() * 0.5, // Tamaño variado
  duration: 15 + Math.random() * 20, // Velocidad variada
  delay: Math.random() * 5,
}));

export function FloatingBalloons() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {balloons.map((b) => (
        <motion.div
          key={b.id}
          className="absolute opacity-20"
          initial={{ x: `${b.x}vw`, y: "110vh" }}
          animate={{
            y: "-10vh", // Sube hasta desaparecer arriba
            x: [`${b.x}vw`, `${b.x + (Math.random() * 10 - 5)}vw`], // Leve movimiento lateral
          }}
          transition={{
            duration: b.duration,
            repeat: Infinity,
            delay: b.delay,
            ease: "linear",
          }}
          style={{
            scale: b.scale,
            left: 0,
            top: 0,
          }}
        >
          {/* Usamos tu logo como partícula flotante */}
          <div className="relative w-16 h-16 md:w-24 md:h-24">
             <Image 
               src="/globo-logo.png" 
               alt="Globo flotante" 
               fill 
               className="object-contain drop-shadow-xl"
             />
          </div>
        </motion.div>
      ))}
      
      {/* Capa de gradiente para que no tapen el texto */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/80" />
    </div>
  );
}