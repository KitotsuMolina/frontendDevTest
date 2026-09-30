export const QUERY_TTL_MS = 3_600_000
export const productQueryKeys = {
  list: 'nunegal:query:v1:products',
  detail: (id: string) => `nunegal:query:v1:product:${encodeURIComponent(id)}`,
}

type Pending = { controller: AbortController; promise: Promise<unknown>; users: number }
type Validator<T> = (value: unknown) => value is T

export function createQueryCache() {
  const pending = new Map<string, Pending>()

  function read<T>(key: string, validate: Validator<T>): T | undefined {
    try {
      const raw = localStorage.getItem(key)
      if (raw === null) return undefined
      const entry: unknown = JSON.parse(raw)
      if (typeof entry !== 'object' || entry === null) return undefined
      const { obtainedAt, expiresAt, data } = entry as Record<string, unknown>
      const now = Date.now()
      if (typeof obtainedAt !== 'number' || !Number.isFinite(obtainedAt) ||
          typeof expiresAt !== 'number' || !Number.isFinite(expiresAt) ||
          expiresAt !== obtainedAt + QUERY_TTL_MS || obtainedAt > now || now >= expiresAt ||
          !validate(data)) return undefined
      return data
    } catch { return undefined }
  }

  async function query<T>(key: string, load: (signal: AbortSignal) => Promise<unknown>,
    validate: Validator<T>, signal?: AbortSignal): Promise<T> {
    if (signal?.aborted) throw new DOMException('Consulta cancelada', 'AbortError')
    const cached = read(key, validate)
    if (cached !== undefined) return cached
    let request = pending.get(key)
    if (!request) {
      const controller = new AbortController()
      request = { controller, users: 0, promise: Promise.resolve() }
      const current = request
      // Registrar primero permite compartir incluso el primer montaje de StrictMode.
      pending.set(key, current)
      current.promise = Promise.resolve().then(() => load(controller.signal)).then(data => {
        if (controller.signal.aborted) throw new DOMException('Consulta cancelada', 'AbortError')
        if (!validate(data)) throw new Error('La respuesta no cumple el contrato esperado')
        const obtainedAt = Date.now()
        try {
          localStorage.setItem(key, JSON.stringify({ obtainedAt, expiresAt: obtainedAt + QUERY_TTL_MS, data }))
        } catch { /* El almacenamiento es opcional; el resultado HTTP sigue siendo válido. */ }
        return data
      }).finally(() => {
        if (pending.get(key) === current) pending.delete(key)
      })
    }
    const current = request
    current.users++
    return new Promise<T>((resolve, reject) => {
      let finished = false
      const finish = () => {
        if (finished) return false
        finished = true
        signal?.removeEventListener('abort', abort)
        current.users--
        return true
      }
      const abort = () => {
        if (!finish()) return
        reject(new DOMException('Consulta cancelada', 'AbortError'))
        queueMicrotask(() => {
          if (current.users === 0 && pending.get(key) === current) {
            pending.delete(key)
            current.controller.abort()
          }
        })
      }
      signal?.addEventListener('abort', abort, { once: true })
      current.promise.then(data => { if (finish()) resolve(data as T) },
        error => { if (finish()) reject(error) })
    })
  }
  return { query }
}

export const queryCache = createQueryCache()
