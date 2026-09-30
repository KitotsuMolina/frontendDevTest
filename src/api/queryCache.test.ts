import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createQueryCache, productQueryKeys, QUERY_TTL_MS } from './queryCache'

const valid = (data: unknown): data is string[] => Array.isArray(data) && data.every(x => typeof x === 'string')
const key = productQueryKeys.list
let cache = createQueryCache()
let load = vi.fn(async () => ['original'])

beforeEach(() => {
  vi.useFakeTimers()
  vi.setSystemTime(new Date('2026-09-30T12:00:00Z'))
  cache = createQueryCache()
  load = vi.fn(async () => ['original'])
})
afterEach(() => { vi.useRealTimers(); vi.restoreAllMocks() })

describe('caché de consultas', () => {
  it('reutiliza y conserva la caducidad original incluso tras recrear la capa', async () => {
    await cache.query(key, load, valid)
    const stored = localStorage.getItem(key)
    vi.setSystemTime(Date.now() + QUERY_TTL_MS - 1)
    expect(await cache.query(key, load, valid)).toEqual(['original'])
    expect(await createQueryCache().query(key, load, valid)).toEqual(['original'])
    expect(load).toHaveBeenCalledTimes(1)
    expect(localStorage.getItem(key)).toBe(stored)
  })

  it.each([QUERY_TTL_MS, QUERY_TTL_MS + 1])('vence justo al cumplir o superar una hora: %i', async offset => {
    const obtainedAt = Date.now()
    await cache.query(key, load, valid)
    vi.setSystemTime(obtainedAt + offset)
    load.mockResolvedValue(['nuevo'])
    expect(await cache.query(key, load, valid)).toEqual(['nuevo'])
    expect(load).toHaveBeenCalledTimes(2)
    expect(JSON.parse(localStorage.getItem(key)!)).toMatchObject({ obtainedAt: Date.now(), expiresAt: Date.now() + QUERY_TTL_MS })
  })

  it('empieza la hora al obtener la respuesta, no al iniciar la solicitud', async () => {
    let resolve!: (data: string[]) => void
    const promise = cache.query(key, () => new Promise<string[]>(r => { resolve = r }), valid)
    await Promise.resolve()
    vi.setSystemTime(Date.now() + 5000)
    resolve(['respuesta'])
    await promise
    expect(JSON.parse(localStorage.getItem(key)!)).toMatchObject({ obtainedAt: Date.now(), expiresAt: Date.now() + QUERY_TTL_MS })
  })

  it('mantiene independientes listado y futuros detalles por ID', async () => {
    const a = productQueryKeys.detail('a/b')
    const b = productQueryKeys.detail('b')
    await cache.query(key, load, valid)
    await cache.query(a, async () => ['detalle A'], valid)
    await cache.query(b, async () => ['detalle B'], valid)
    expect(await cache.query(a, load, valid)).toEqual(['detalle A'])
    expect(await cache.query(b, load, valid)).toEqual(['detalle B'])
    expect(load).toHaveBeenCalledTimes(1)
    expect(a).not.toBe(b)
  })

  it.each(['{roto', '{}', JSON.stringify({ obtainedAt: 0, expiresAt: Infinity, data: [] }), JSON.stringify({ obtainedAt: Date.parse('2026-09-30T12:00:00Z'), expiresAt: Date.parse('2026-09-30T13:00:00Z'), data: [42] })])('ignora datos corruptos: %s', async raw => {
    localStorage.setItem(key, raw)
    expect(await cache.query(key, load, valid)).toEqual(['original'])
    expect(load).toHaveBeenCalledTimes(1)
  })

  it('almacena un listado vacío válido', async () => {
    load.mockResolvedValue([])
    expect(await cache.query(key, load, valid)).toEqual([])
    expect(await createQueryCache().query(key, load, valid)).toEqual([])
    expect(load).toHaveBeenCalledTimes(1)
  })

  it.each(['getItem', 'setItem'] as const)('sigue consultando si falla %s', async method => {
    vi.spyOn(Storage.prototype, method).mockImplementation(() => { throw new DOMException('Bloqueado', 'QuotaExceededError') })
    expect(await cache.query(key, load, valid)).toEqual(['original'])
    expect(await cache.query(key, load, valid)).toEqual(['original'])
    expect(load).toHaveBeenCalledTimes(2)
  })

  it('comparte consultas simultáneas y permite reintentar tras un fallo', async () => {
    load.mockRejectedValueOnce(new Error('red'))
    const first = cache.query(key, load, valid)
    const second = cache.query(key, load, valid)
    await expect(first).rejects.toThrow('red')
    await expect(second).rejects.toThrow('red')
    expect(load).toHaveBeenCalledTimes(1)
    expect(localStorage.getItem(key)).toBeNull()
    expect(await cache.query(key, load, valid)).toEqual(['original'])
    expect(load).toHaveBeenCalledTimes(2)
  })

  it('no reemplaza una entrada vencida con errores ni devuelve datos viejos', async () => {
    await cache.query(key, load, valid)
    const stored = localStorage.getItem(key)
    vi.setSystemTime(Date.now() + QUERY_TTL_MS)
    load.mockRejectedValueOnce(new Error('red'))
    await expect(cache.query(key, load, valid)).rejects.toThrow('red')
    expect(localStorage.getItem(key)).toBe(stored)
    load.mockResolvedValueOnce(['nuevo'])
    expect(await cache.query(key, load, valid)).toEqual(['nuevo'])
  })

  it('no almacena respuestas inválidas', async () => {
    await expect(cache.query(key, async () => [42], valid)).rejects.toThrow('contrato')
    expect(localStorage.getItem(key)).toBeNull()
    await expect(cache.query(key, load, valid)).resolves.toEqual(['original'])
  })

  it('cancelar un consumidor no cancela la consulta de otro', async () => {
    let resolve!: (data: string[]) => void
    let transport!: AbortSignal
    const shared = (signal: AbortSignal) => { transport = signal; return new Promise<string[]>(r => { resolve = r }) }
    const controller = new AbortController()
    const first = cache.query(key, shared, valid, controller.signal)
    const second = cache.query(key, shared, valid)
    await Promise.resolve()
    controller.abort()
    await expect(first).rejects.toThrow('cancelada')
    expect(transport.aborted).toBe(false)
    resolve(['compartido'])
    expect(await second).toEqual(['compartido'])
  })
})
