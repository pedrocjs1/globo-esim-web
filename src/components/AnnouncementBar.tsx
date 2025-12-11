"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Tag, Clock, Shield } from "lucide-react";

const messages = [
  { text: "¡Oferta Flash! 10% OFF extra en tu primera compra.", icon: Tag },
  { text: "Soporte 24/7 en español vía WhatsApp.", icon: Clock },
  { text: "Garantía de conexión o te devolvemos el dinero.", icon: Shield },
];

export function AnnouncementBar() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    // Cambia el mensaje cada 4 segundos
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % messages.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const current = messages[index];
  const Icon = current.icon;

  return (
    <div className="bg-gradient-to-r from-orange-500 to-pink-600 text-white py-2 px-4 overflow-hidden relative h-10 flex items-center justify-center">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-center gap-2 text-sm font-bold tracking-wide absolute w-full"
        >
          <Icon className="w-4 h-4" />
          <span>{current.text}</span>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}