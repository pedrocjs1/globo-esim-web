# globo-esim-web — sitio público (canal SEO/ventas)

Next.js 16 (App Router, Turbopack) + React 19 + Tailwind 4. Es la pieza para **SEO + GEO orgánico**.

## Arrancar

```powershell
npm run dev        # http://localhost:3000  (requiere el backend en :4000)
```

## Mapa del código

```
src/app/layout.tsx              → metadata raíz (lang es)
src/app/page.tsx                → home (server component, fetch países al backend)
src/app/destinos/page.tsx       → grilla de destinos
src/app/destinos/[slug]/page.tsx→ página por país: planes Airalo (vivo) + guía estática
src/components/                 → HeroCarousel, DestinationsGrid, PlanCard (compra), SearchBox, etc.
src/lib/api.ts                  → fetch al backend (http://localhost:4000, hardcodeado)
src/lib/countryGuides.ts        → contenido SEO estático por país (slugs Airalo en inglés)
src/lib/esimPlans.ts            → planes demo estáticos (no se usan en prod)
next.config.ts                  → images.remotePatterns = **.airalo.com
```

## Marca y entorno

- Marca/wordmark: **Globiesim** (dominio `globiesim.com`). 🎈
- Env (`.env.local`, ver `.env.example`):
  - `NEXT_PUBLIC_SITE_URL` → sitemap/robots/canonical/OG.
  - `NEXT_PUBLIC_API_URL` → base del backend (dev: `http://localhost:4000/api`).

## Datos: cómo fluyen

- `getCountries()` / `getCountryPlans(slug)` pegan al backend → datos REALES de Airalo.
- Fetch con `next: { revalidate: 3600 }` → **ISR** (páginas estáticas que se refrescan cada 1h).
- `/destinos/[slug]` combina planes vivos (Airalo) + `getCountryGuide(slug)` (texto estático).
- Home, `/destinos` y sitemap son **resilientes** a backend caído (try/catch → no rompen el build).

## Estado SEO (✅ fundación hecha)

- [x] Slugs unificados a Airalo en inglés: `turkey/france/japan`.
- [x] `app/sitemap.ts` (214 URLs) + `app/robots.ts`.
- [x] `generateMetadata` por país (title/description/canonical/OG/Twitter).
- [x] `generateStaticParams` + `revalidate` (ISR): pre-render de países con guía, resto on-demand.
- [x] JSON-LD: BreadcrumbList + Product/AggregateOffer + FAQPage en `destinos/[slug]`.
- [x] Build de producción pasa limpio.

## ⚠️ BLOQUEANTE antes de vender en producción

- **No hay pasarela de pago.** `PlanCard.handleBuy` → `buyEsim` crea una orden REAL en Airalo
  (gasta saldo) sin cobrar al cliente. Integrar **Stripe / MercadoPago** ANTES de exponer ventas.
  El email del cliente se captura por `prompt` (provisorio — reemplazar por checkout real).

## Próxima fase (visión)

Blog multilingüe (es/en/pt) + i18n/hreflang, diseño profesional, y conversión blog→eSIM
(modal contextual por país). Ver memoria `globo-blog-vision`.

## Skills útiles para esta carpeta

keyword-research · seo-content-writer · geo-content-optimizer · schema-markup-generator ·
technical-seo-checker · on-page-seo-auditor · meta-tags-optimizer · internal-linking-optimizer
