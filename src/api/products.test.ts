import { describe, expect, it, vi } from 'vitest'
import { getProducts, PRODUCTS_URL } from './products'
import { jsonResponse, products } from '../test/products'

describe('cliente HTTP de productos', () => {
  it('consulta el endpoint y conserva los campos de texto y precios vacíos', async () => {
    vi.mocked(fetch).mockResolvedValue(jsonResponse())
    const controller = new AbortController()
    expect(await getProducts(controller.signal)).toEqual(products)
    expect(fetch).toHaveBeenCalledWith(PRODUCTS_URL, { method: 'GET', signal: controller.signal })
  })

  it('acepta un catálogo vacío', async () => {
    vi.mocked(fetch).mockResolvedValue(jsonResponse([]))
    expect(await getProducts()).toEqual([])
  })

  it('rechaza fallos HTTP sin convertirlos en listado vacío', async () => {
    vi.mocked(fetch).mockResolvedValue(jsonResponse({ error: 'Unavailable' }, 503))
    await expect(getProducts()).rejects.toThrow('HTTP 503')
  })

  it('propaga errores de red para ofrecer reintento', async () => {
    vi.mocked(fetch).mockRejectedValue(new TypeError('Failed to fetch'))
    await expect(getProducts()).rejects.toThrow('Failed to fetch')
  })

  it.each([
    { products },
    [{ ...products[0], price: 170 }],
    [{ id: 'incomplete' }],
  ])('rechaza un contrato inválido sin coerciones', async (data) => {
    vi.mocked(fetch).mockResolvedValue(jsonResponse(data))
    await expect(getProducts()).rejects.toThrow('contrato esperado')
  })
})
