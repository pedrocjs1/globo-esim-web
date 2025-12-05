// src/types/esim.ts

export type EsimDataUnit = "MB" | "GB" | "ILIMITADO";

export interface EsimPlan {
  id: string;
  countrySlug: string;     // turquia, francia, japon, etc.
  name: string;            // p.ej. "eSIM 10 GB - 15 días"
  dataAmount: number | null; // null si es ILIMITADO
  dataUnit: EsimDataUnit;
  validityDays: number;
  priceUSD: number;        // por ahora en USD, después conectamos a ARS/USDC
  isPopular?: boolean;
  description?: string;
  recommendedFor?: string; // p.ej. "viajeros que se quedan 1 semana"
}
