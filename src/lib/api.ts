// src/lib/api.ts

export interface Country {
  slug: string;
  name: string;
  code: string;
  image: string;
}

export interface Plan {
  id: string;
  title: string;
  data: string;
  validity: string;
  price: number;
  image: string;
  operator: string;
}

export interface OrderResponse {
  id: number;
  code: string;
  currency: string;
  price: number;
  qrcode_url: string | null;
  qrcode: string | null;   // El código manual (LPA)
  iccid: string | null;
  installation_guides: any;
  data?: string;
  validityDays?: any;
}

// Base del backend. Configurable por entorno para poder deployar.
// Dev: http://localhost:4000/api. Producción: setear NEXT_PUBLIC_API_URL.
const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

// El catálogo de Airalo cambia poco → cacheamos 1h (habilita ISR / páginas estáticas).
// 1h (en vez de 24h) hace que cualquier página construida con datos vacíos por un
// hipo del backend se auto-cure rápido.
const CATALOG_REVALIDATE = 3600;

export async function getCountries(): Promise<Country[]> {
  const res = await fetch(`${API_URL}/countries`, {
    next: { revalidate: CATALOG_REVALIDATE },
  });
  if (!res.ok) throw new Error("Error backend");
  const json = await res.json();
  return json.data;
}

// Pedir planes de un país
export async function getCountryPlans(slug: string): Promise<Plan[]> {
  const res = await fetch(`${API_URL}/countries/${slug}`, {
    next: { revalidate: CATALOG_REVALIDATE },
  });

  if (!res.ok) {
    console.error(`Error al buscar planes para ${slug}`);
    return [];
  }

  const json = await res.json();
  return json.data;
}

// Estado de una orden mientras se procesa el pago/fulfillment.
export interface OrderStatus extends OrderResponse {
  status: "pending_payment" | "paid" | "completed" | "failed";
  paymentStatus?: string | null;
}

// Iniciar el checkout: crea la orden pendiente y un pago en dLocal Go.
// Devuelve la URL a la que hay que redirigir al cliente para que pague.
// El email es obligatorio: ahí llega el QR cuando el pago se confirma.
export async function startCheckout(
  packageId: string,
  slug: string,
  email: string
): Promise<{ orderId: number; redirectUrl: string }> {
  const res = await fetch(`${API_URL}/checkout`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ packageId, slug, email }),
  });

  const json = await res.json();

  if (!json.success) {
    throw new Error(json.message || "No pudimos iniciar el pago");
  }

  return json.data;
}

// Consultar el estado de una orden tras volver del pago (la página /orden/[id] hace polling).
// El backend, al consultarse, verifica el pago en dLocal y completa la orden si corresponde.
export async function getOrderStatus(orderId: number | string): Promise<OrderStatus> {
  const res = await fetch(`${API_URL}/checkout/${orderId}/status`, {
    cache: "no-store",
  });

  const json = await res.json();

  if (!json.success) {
    throw new Error(json.message || "No pudimos consultar tu orden");
  }

  return json.data;
}
