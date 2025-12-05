// src/lib/esimPlans.ts
import type { EsimPlan } from "@/types/esim";

const esimPlans: EsimPlan[] = [
  // Turquía
  {
    id: "tr-basic-5gb-7d",
    countrySlug: "turquia",
    name: "eSIM Turquía 5 GB - 7 días",
    dataAmount: 5,
    dataUnit: "GB",
    validityDays: 7,
    priceUSD: 12,
    isPopular: true,
    description: "Ideal para escapadas cortas, usar maps y redes sociales.",
    recommendedFor: "Viajes de menos de una semana."
  },
  {
    id: "tr-standard-10gb-15d",
    countrySlug: "turquia",
    name: "eSIM Turquía 10 GB - 15 días",
    dataAmount: 10,
    dataUnit: "GB",
    validityDays: 15,
    priceUSD: 20,
    description: "Buen equilibrio entre datos y duración.",
    recommendedFor: "Viajes clásicos de 10 a 15 días."
  },
  {
    id: "tr-unlimited-10d",
    countrySlug: "turquia",
    name: "eSIM Turquía Datos ilimitados - 10 días",
    dataAmount: null,
    dataUnit: "ILIMITADO",
    validityDays: 10,
    priceUSD: 32,
    description: "Para quienes trabajan en remoto o suben mucho contenido.",
    recommendedFor: "Creadores de contenido o trabajo remoto."
  },

  // Francia
  {
    id: "fr-basic-3gb-5d",
    countrySlug: "francia",
    name: "eSIM Francia 3 GB - 5 días",
    dataAmount: 3,
    dataUnit: "GB",
    validityDays: 5,
    priceUSD: 10,
    isPopular: true,
    description: "Para escapadas a París o fines de semana largos.",
    recommendedFor: "City break en París o ciudades cercanas."
  },
  {
    id: "fr-standard-8gb-10d",
    countrySlug: "francia",
    name: "eSIM Francia 8 GB - 10 días",
    dataAmount: 8,
    dataUnit: "GB",
    validityDays: 10,
    priceUSD: 18,
    description: "Para combinar varias ciudades sin preocuparte por datos.",
    recommendedFor: "Recorridos París + costa o interior."
  },

  // Japón
  {
    id: "jp-basic-5gb-8d",
    countrySlug: "japon",
    name: "eSIM Japón 5 GB - 8 días",
    dataAmount: 5,
    dataUnit: "GB",
    validityDays: 8,
    priceUSD: 16,
    isPopular: true,
    description: "Para primeros viajes a Japón, usando mucho Google Maps.",
    recommendedFor: "Viajes de 1 semana entre Tokio y Kioto."
  },
  {
    id: "jp-unlimited-15d",
    countrySlug: "japon",
    name: "eSIM Japón Datos ilimitados - 15 días",
    dataAmount: null,
    dataUnit: "ILIMITADO",
    validityDays: 15,
    priceUSD: 45,
    description:
      "Pensado para personas que viajan, trabajan y se mueven mucho en tren.",
    recommendedFor: "Nómades digitales o viajes largos."
  }
];

export function getEsimPlansForCountry(slug: string): EsimPlan[] {
  return esimPlans.filter((plan) => plan.countrySlug === slug);
}
