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

// ✅ INTERFAZ ACTUALIZADA PARA LA ORDEN
// Ahora incluye todos los campos que usa tu PlanCard (QR, LPA, etc.)
export interface OrderResponse {
  id: number;
  code: string;
  currency: string;        
  price: number;
  qrcode_url: string | null;
  qrcode: string | null;   // El código manual (LPA)
  iccid: string | null;    
  installation_guides: any;
  // Campos opcionales para evitar errores si la API no los manda
  data?: string;           
  validityDays?: any;
}

const API_URL = 'http://localhost:4000/api/countries';

export async function getCountries(): Promise<Country[]> {
  const res = await fetch(API_URL, { cache: 'no-store' });
  if (!res.ok) throw new Error('Error backend');
  const json = await res.json();
  return json.data;
}

// Pedir planes de un país
export async function getCountryPlans(slug: string): Promise<Plan[]> {
  const res = await fetch(`${API_URL}/${slug}`, { cache: 'no-store' });
  
  if (!res.ok) {
    console.error(`Error al buscar planes para ${slug}`);
    return [];
  }
  
  const json = await res.json();
  return json.data;
}

// Función para comprar la eSIM
export async function buyEsim(packageId: string): Promise<OrderResponse> {
  // Por ahora hardcodeamos un email de prueba para el Sandbox
  const body = { 
    packageId, 
    email: 'cliente_prueba@globoesim.com' 
  };

  const res = await fetch('http://localhost:4000/api/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const json = await res.json();

  if (!json.success) {
    throw new Error(json.message || 'Error al comprar la eSIM');
  }

  return json.data;
}