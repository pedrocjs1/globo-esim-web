// src/lib/countryGuides.ts
import type { CountryGuide } from "@/types/travel";

export const countryGuides: CountryGuide[] = [
  {
    slug: "turquia",
    name: "Turquía",
    region: "Asia / Europa",
    heroTitle: "Todo para tu viaje a Turquía",
    heroSubtitle:
      "Lugares imperdibles, tips, recomendaciones y tu eSIM lista apenas aterrices.",
    seoTitle: "Qué ver en Turquía + eSIM para viajar | Globo eSIM",
    seoDescription:
      "Descubrí los mejores lugares de Turquía, tips para viajeros y comprá tu eSIM sin roaming.",
    popularPlaces: [
      {
        id: "santa-sofia",
        name: "Santa Sofía (Ayasofya)",
        city: "Estambul",
        shortDescription: "Uno de los templos más importantes del mundo.",
        highlight:
          "Un viaje por la historia bizantina y otomana en un solo lugar."
      },
      {
        id: "capadocia",
        name: "Capadocia",
        shortDescription:
          "Paisajes lunares y vuelos en globo aerostático al amanecer.",
        highlight: "Ideal para fotos y experiencias únicas."
      }
    ],
    tips: [
      {
        id: "vestimenta",
        category: "cultura",
        title: "Llevá ropa adecuada para mezquitas",
        description:
          "En muchos templos te pedirán cubrir hombros y piernas. Las mujeres a veces deben cubrirse la cabeza."
      },
      {
        id: "transporte",
        category: "transporte",
        title: "Usá la Istanbulkart",
        description:
          "Tarjeta recargable para moverte en metro, tranvía y ferry dentro de Estambul."
      }
    ]
  },
  {
    slug: "francia",
    name: "Francia",
    region: "Europa",
    heroTitle: "Organizá tu viaje a Francia",
    heroSubtitle:
      "París, la Costa Azul, castillos, vino y tu eSIM lista para compartir cada momento.",
    seoTitle: "Qué ver en Francia + eSIM para viajar | Globo eSIM",
    seoDescription:
      "Guía rápida de Francia: lugares imperdibles, tips para viajeros y eSIM sin roaming.",
    popularPlaces: [
      {
        id: "torre-eiffel",
        name: "Torre Eiffel",
        city: "París",
        shortDescription:
          "El ícono más famoso de Francia, ideal para visitarla de día y de noche."
      },
      {
        id: "mont-saint-michel",
        name: "Mont Saint-Michel",
        shortDescription:
          "Una abadía medieval en una pequeña isla, uno de los lugares más fotogénicos del país."
      }
    ],
    tips: [
      {
        id: "idioma",
        category: "cultura",
        title: "Aprendé algunas frases básicas en francés",
        description:
          "Un simple 'bonjour' o 'merci' ayuda mucho en el trato con la gente local."
      },
      {
        id: "transporte-paris",
        category: "transporte",
        title: "Aprovechá el metro de París",
        description:
          "Es la forma más rápida de moverse por la ciudad; considerá sacar un pase por varios días."
      }
    ]
  },
  {
    slug: "japon",
    name: "Japón",
    region: "Asia",
    heroTitle: "Tu viaje a Japón, conectado",
    heroSubtitle:
      "Templos, tecnología, anime y gastronomía, con internet estable en todo momento.",
    seoTitle: "Qué ver en Japón + eSIM para viajar | Globo eSIM",
    seoDescription:
      "Lugares esenciales en Japón, consejos para moverte y eSIM para viajeros.",
    popularPlaces: [
      {
        id: "shibuya",
        name: "Cruce de Shibuya",
        city: "Tokio",
        shortDescription:
          "Uno de los cruces peatonales más famosos del mundo, rodeado de luces y pantallas gigantes."
      },
      {
        id: "kioto-templos",
        name: "Templos de Kioto",
        shortDescription:
          "Santuarios y templos tradicionales, ideales para conocer el lado más histórico de Japón."
      }
    ],
    tips: [
      {
        id: "japan-rail-pass",
        category: "transporte",
        title: "Evaluá si te conviene el Japan Rail Pass",
        description:
          "Si vas a moverte mucho en tren bala, puede ahorrarte bastante dinero."
      },
      {
        id: "modales",
        category: "cultura",
        title: "Respetá las normas de convivencia",
        description:
          "Evitar hablar fuerte en el transporte y seguir las filas marcadas es muy valorado."
      }
    ]
  }
];

export function getCountryGuide(slug: string): CountryGuide | undefined {
  return countryGuides.find((c) => c.slug === slug);
}

export function getAllCountrySlugs(): string[] {
  return countryGuides.map((c) => c.slug);
}

export function getAllCountryGuides(): CountryGuide[] {
  return countryGuides;
}
