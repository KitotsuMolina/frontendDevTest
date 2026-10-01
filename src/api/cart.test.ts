import { expect, it, vi } from 'vitest'
import { addToCart } from './cart'
import { jsonResponse } from '../test/products'

const selection = { id: 'ZmGrkLRPXOTpxsU4jjAcv', colorCode: 1000, storageCode: 2001 }
it('envía exactamente tres campos con códigos numéricos y JSON', async () => {
  vi.mocked(fetch).mockResolvedValue(jsonResponse({ count: 3 }))
  expect(await addToCart(selection)).toBe(3)
  expect(fetch).toHaveBeenCalledWith('/api/cart', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(selection) })
  expect(JSON.parse(vi.mocked(fetch).mock.calls[0][1]!.body as string)).toEqual(selection)
})
it.each([0, 1, 7])('acepta count entero no negativo %i sin acumular', async count => {
  vi.mocked(fetch).mockResolvedValue(jsonResponse({ count }))
  expect(await addToCart(selection)).toBe(count)
})
it.each([-1, 1.5, '2', null, undefined, true])('rechaza count inválido %s sin repetir el POST', async count => {
  vi.mocked(fetch).mockResolvedValue(jsonResponse({ count }))
  await expect(addToCart(selection)).rejects.toThrow('count inválido')
  expect(fetch).toHaveBeenCalledTimes(1)
})
it.each(['red', 'HTTP', 'JSON'])('propaga fallo de %s sin reintento automático', async failure => {
  if (failure === 'red') vi.mocked(fetch).mockRejectedValue(new Error('Offline'))
  else vi.mocked(fetch).mockResolvedValue(failure === 'HTTP' ? jsonResponse({}, 503) : new Response('invalid JSON'))
  await expect(addToCart(selection)).rejects.toThrow()
  expect(fetch).toHaveBeenCalledTimes(1)
})
