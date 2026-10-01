import type { Page } from '@playwright/test'
import { realProductDetail, secondProductDetail, thirdProductDetail } from '../src/test/productDetail'

export const details = [realProductDetail, secondProductDetail, thirdProductDetail]
export const products = [
  ...details.map(({ id, brand, model, price, imgUrl }) => ({ id, brand, model, price, imgUrl })),
  ...Array.from({ length: 9 }, (_, index) => ({
    id: `fixture-${index}`, brand: 'Marca de prueba', model: `Dispositivo ${index}`,
    price: index === 0 ? '' : '99', imgUrl: `https://itx-frontend-test.onrender.com/images/fixture-${index}.jpg`,
  })),
]

// Todas las peticiones al origen remoto se interceptan, incluidas imágenes y OPTIONS.
// Los códigos de opciones proceden de fixtures de respuestas reales; no son códigos inventados.
export async function mockApi(page: Page, options: { cartError?: boolean; listError?: boolean; delayedList?: Promise<void>; proxyCart?: boolean } = {}) {
  const calls = { list: 0, detail: 0, cart: [] as unknown[] }
  await page.route(url => url.origin === 'https://itx-frontend-test.onrender.com' || url.pathname === '/api/cart', async route => {
    const request = route.request()
    const path = new URL(request.url()).pathname
    const headers = { 'access-control-allow-origin': '*', 'access-control-allow-headers': 'content-type', 'access-control-allow-methods': 'GET, POST, OPTIONS' }
    if (request.method() === 'OPTIONS') return route.fulfill({ status: 204, headers })
    if (path.startsWith('/images/')) return route.fulfill({ headers, contentType: 'image/svg+xml', body: '<svg xmlns="http://www.w3.org/2000/svg" width="160" height="280"><rect x="20" y="10" width="120" height="260" rx="12" fill="#172033"/><rect x="30" y="30" width="100" height="210" rx="4" fill="#edf2fa"/></svg>' })
    if (path === '/api/product') {
      calls.list++
      if (options.delayedList) await options.delayedList
      return route.fulfill({ headers, status: options.listError && calls.list === 1 ? 503 : 200, json: products })
    }
    if (path.startsWith('/api/product/')) {
      calls.detail++
      const product = details.find(item => item.id === decodeURIComponent(path.slice('/api/product/'.length)))
      return route.fulfill({ headers, status: product ? 200 : 404, json: product ?? {} })
    }
    if (path === '/api/cart' && options.proxyCart) return route.continue()
    if (path === '/api/cart' && request.method() === 'POST') {
      calls.cart.push(request.postDataJSON())
      return route.fulfill({ headers, status: options.cartError && calls.cart.length === 1 ? 503 : 200, json: { count: 3 } })
    }
    throw new Error(`Petición remota inesperada: ${request.method()} ${path}`)
  })
  return calls
}
