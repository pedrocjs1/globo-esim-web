// src/types/travel.ts

export interface TravelPlace {
  id: string;
  name: string;
  city?: string;
  shortDescription: string;
  highlight?: string;
}

export interface TravelTip {
  id: string;
  category: "seguridad" | "transporte" | "costo" | "cultura" | "conectividad";
  title: string;
  description: string;
}

export interface CountryGuide {
  slug: string;          // "turquia"
  name: string;          // "Turquía"
  region: string;        // "Asia / Europa"
  heroTitle: string;
  heroSubtitle: string;
  seoTitle: string;
  seoDescription: string;
  popularPlaces: TravelPlace[];
  tips: TravelTip[];
}
