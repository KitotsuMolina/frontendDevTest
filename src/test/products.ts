import type { Product } from '../api/products'

export const products: Product[] = [
  { id: 'demo', brand: 'Acer', model: 'Iconia Talk S', price: '170', imgUrl: 'https://images.test/acer.jpg' },
  { id: 'galaxy', brand: 'Samsung', model: 'Galaxy A10', price: '250', imgUrl: 'https://images.test/samsung.jpg' },
  { id: 'liquid', brand: 'Acer', model: 'Liquid Z6', price: '', imgUrl: 'https://images.test/liquid.jpg' },
  { id: 'classic', brand: 'Nokia', model: '3310', price: '   ', imgUrl: '' },
]

export function jsonResponse(data: unknown = products, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } })
}
