import type { MetadataRoute } from "next";
import { getCountries } from "@/lib/api";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

// Revalida el sitemap cada 24h (los países de Airalo cambian poco)
export const revalidate = 86400;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/destinos`, changeFrequency: "weekly", priority: 0.9 },
  ];

  let countryRoutes: MetadataRoute.Sitemap = [];
  try {
    const countries = await getCountries();
    countryRoutes = countries.map((c) => ({
      url: `${SITE_URL}/destinos/${c.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));
  } catch {
    // Si el backend está caído, el sitemap igual sirve las rutas estáticas
  }

  return [...staticRoutes, ...countryRoutes];
}
