import type { Product } from './products'
import { PRODUCTS_URL } from './products'
import { productQueryKeys, queryCache } from './queryCache'

export interface ProductOption { code: number; name: string }
const textFields = ['networkTechnology', 'networkSpeed', 'gprs', 'edge', 'announced', 'status',
  'dimentions', 'weight', 'displayType', 'displayResolution', 'displaySize', 'os', 'cpu',
  'chipset', 'gpu', 'externalMemory', 'ram', 'speaker', 'audioJack', 'gps', 'nfc', 'radio', 'usb', 'battery'] as const
const arrayFields = ['internalMemory', 'primaryCamera', 'sensors', 'colors'] as const
const mixedFields = ['sim', 'secondaryCmera', 'wlan', 'bluetooth'] as const
export type ProductDetail = Product &
  Partial<Record<typeof textFields[number], string | null>> &
  Partial<Record<typeof arrayFields[number], string[] | null>> &
  Partial<Record<typeof mixedFields[number], string | string[] | null>> & {
    options: { colors: ProductOption[]; storages: ProductOption[] }
  }

export class ProductNotFoundError extends Error {
  constructor() { super('Producto no encontrado'); this.name = 'ProductNotFoundError' }
}
function isOption(value: unknown): value is ProductOption {
  return typeof value === 'object' && value !== null &&
    typeof Reflect.get(value, 'code') === 'number' && Number.isFinite(Reflect.get(value, 'code')) &&
    typeof Reflect.get(value, 'name') === 'string'
}
export function isProductDetail(value: unknown): value is ProductDetail {
  if (typeof value !== 'object' || value === null) return false
  const data = value as Record<string, unknown>
  if (!['id', 'brand', 'model', 'price', 'imgUrl'].every(field => typeof data[field] === 'string')) return false
  if (!textFields.every(field => data[field] == null || typeof data[field] === 'string')) return false
  if (!arrayFields.every(field => data[field] == null ||
    (Array.isArray(data[field]) && data[field].every(item => typeof item === 'string')))) return false
  if (!mixedFields.every(field => data[field] == null || typeof data[field] === 'string' ||
    (Array.isArray(data[field]) && data[field].every(item => typeof item === 'string')))) return false
  if (typeof data.options !== 'object' || data.options === null) return false
  return ['colors', 'storages'].every(field => {
    const options: unknown = Reflect.get(data.options as object, field)
    return Array.isArray(options) && options.every(isOption) && new Set(options.map(option => option.code)).size === options.length
  })
}
export function getProductDetail(id: string, signal?: AbortSignal): Promise<ProductDetail> {
  return queryCache.query(productQueryKeys.detail(id), async requestSignal => {
    const response = await fetch(`${PRODUCTS_URL}/${encodeURIComponent(id)}`, { method: 'GET', signal: requestSignal })
    if (response.status === 404) throw new ProductNotFoundError()
    if (!response.ok) throw new Error(`Error al consultar detalle: HTTP ${response.status}`)
    return response.json() as Promise<unknown>
  }, (value): value is ProductDetail => isProductDetail(value) && value.id === id, signal)
}
