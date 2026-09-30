import { productQueryKeys, queryCache } from './queryCache'

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

export function isProductList(value: unknown): value is Product[] {
  return Array.isArray(value) && value.every(isProduct)
}

export function getProducts(signal?: AbortSignal): Promise<Product[]> {
  return queryCache.query(productQueryKeys.list, async requestSignal => {
    const response = await fetch(PRODUCTS_URL, { method: 'GET', signal: requestSignal })
    if (!response.ok) throw new Error(`Error al consultar productos: HTTP ${response.status}`)
    return response.json() as Promise<unknown>
  }, isProductList, signal)
}
