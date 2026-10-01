export const CART_URL = 'https://itx-frontend-test.onrender.com/api/cart'
export interface CartSelection { id: string; colorCode: number; storageCode: number }
export function isCartCount(value: unknown): value is number {
  return typeof value === 'number' && Number.isInteger(value) && value >= 0
}
export async function addToCart(selection: CartSelection): Promise<number> {
  const response = await fetch(CART_URL, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: selection.id, colorCode: selection.colorCode, storageCode: selection.storageCode }),
  })
  if (!response.ok) throw new Error(`Error al añadir: HTTP ${response.status}`)
  const data: unknown = await response.json()
  if (typeof data !== 'object' || data === null || !isCartCount(Reflect.get(data, 'count'))) {
    throw new Error('La respuesta de cesta contiene un count inválido')
  }
  return Reflect.get(data, 'count') as number
}
