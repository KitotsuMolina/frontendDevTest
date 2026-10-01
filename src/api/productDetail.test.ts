import { describe, expect, it, vi } from 'vitest'
import { getProductDetail, ProductNotFoundError } from './productDetail'
import { productQueryKeys, QUERY_TTL_MS } from './queryCache'
import { realProductDetail, secondProductDetail, thirdProductDetail } from '../test/productDetail'
import { jsonResponse } from '../test/products'

describe('cliente HTTP de detalle', () => {
  it('valida la respuesta real y conserva los códigos numéricos', async () => {
    vi.mocked(fetch).mockResolvedValue(jsonResponse(realProductDetail))
    expect(await getProductDetail(realProductDetail.id)).toEqual(realProductDetail)
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining(`/api/product/${realProductDetail.id}`), { method: 'GET', signal: expect.any(AbortSignal) })
    expect(realProductDetail.options.colors).toEqual([{ code: 1000, name: 'Black' }])
  })
  it.each([secondProductDetail, thirdProductDetail])('acepta los tipos variables observados en otros productos reales', async product => {
    vi.mocked(fetch).mockResolvedValue(jsonResponse(product))
    expect(await getProductDetail(product.id)).toEqual(product)
  })
  it('distingue 404 y no almacena el error', async () => {
    vi.mocked(fetch).mockResolvedValue(jsonResponse({}, 404))
    await expect(getProductDetail('missing')).rejects.toBeInstanceOf(ProductNotFoundError)
    expect(localStorage.getItem(productQueryKeys.detail('missing'))).toBeNull()
  })
  it.each([
    { ...realProductDetail, options: { colors: [{ code: '1000', name: 'Black' }], storages: [] } },
    { ...realProductDetail, options: null },
    { ...realProductDetail, cpu: 3 },
    { ...realProductDetail, id: 'otro' },
  ])('rechaza contratos inválidos o un ID incorrecto', async data => {
    vi.mocked(fetch).mockResolvedValue(jsonResponse(data))
    await expect(getProductDetail(realProductDetail.id)).rejects.toThrow('contrato')
    expect(localStorage.getItem(productQueryKeys.detail(realProductDetail.id))).toBeNull()
  })
  it('reutiliza la entrada independiente y renueva justo al vencer una hora', async () => {
    vi.useFakeTimers()
    try {
      vi.setSystemTime(new Date('2026-09-30T12:00:00Z'))
      vi.mocked(fetch).mockImplementation(async input => jsonResponse({ ...realProductDetail, id: String(input).split('/').pop() }))
      await getProductDetail('a')
      await getProductDetail('b')
      await getProductDetail('a')
      expect(fetch).toHaveBeenCalledTimes(2)
      const stored = localStorage.getItem(productQueryKeys.detail('a'))
      vi.setSystemTime(Date.now() + QUERY_TTL_MS - 1)
      await getProductDetail('a')
      expect(localStorage.getItem(productQueryKeys.detail('a'))).toBe(stored)
      vi.setSystemTime(Date.now() + 1)
      await getProductDetail('a')
      expect(fetch).toHaveBeenCalledTimes(3)
    } finally { vi.useRealTimers() }
  })
})
