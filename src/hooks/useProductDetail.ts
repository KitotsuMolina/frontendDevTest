import { useEffect, useState } from 'react'
import { getProductDetail, ProductNotFoundError } from '../api/productDetail'
import type { ProductDetail } from '../api/productDetail'

export type DetailState = { status: 'loading' } | { status: 'success'; product: ProductDetail } |
  { status: 'not-found' } | { status: 'error' }

export function useProductDetail(id?: string) {
  const [result, setResult] = useState<{ id?: string; attempt: number; signal?: AbortSignal; state: DetailState }>({ attempt: 0, state: { status: 'loading' } })
  const [attempt, setAttempt] = useState(0)
  useEffect(() => {
    if (id === undefined) return
    const controller = new AbortController()
    getProductDetail(id, controller.signal).then(product => {
      if (!controller.signal.aborted) setResult({ id, attempt, signal: controller.signal, state: { status: 'success', product } })
    }).catch(error => {
      if (!controller.signal.aborted) setResult({ id, attempt, signal: controller.signal,
        state: { status: error instanceof ProductNotFoundError ? 'not-found' : 'error' } })
    })
    return () => controller.abort()
  }, [id, attempt])
  const state: DetailState = result.id === id && result.attempt === attempt && !result.signal?.aborted ? result.state : { status: 'loading' }
  return { state, retry: () => setAttempt(value => value + 1) }
}
