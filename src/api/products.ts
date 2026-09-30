export interface Product {
  id: string
  brand: string
  model: string
  price: string
  imgUrl: string
}

export const PRODUCTS_URL = 'https://itx-frontend-test.onrender.com/api/product'

function isProduct(value: unknown): value is Product {
  if (typeof value !== 'object' || value === null) return false
  return ['id', 'brand', 'model', 'price', 'imgUrl'].every(
    (field) => typeof Reflect.get(value, field) === 'string',
  )
}

export async function getProducts(signal?: AbortSignal): Promise<Product[]> {
  const response = await fetch(PRODUCTS_URL, { method: 'GET', signal })
  if (!response.ok) throw new Error(`Error al consultar productos: HTTP ${response.status}`)
  const data: unknown = await response.json()
  if (!Array.isArray(data) || !data.every(isProduct)) {
    throw new Error('La respuesta del catálogo no cumple el contrato esperado')
  }
  return data
}
