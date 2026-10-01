import { useRef, useState } from 'react'
import { addToCart, isCartCount } from '../api/cart'
import type { CartSelection } from '../api/cart'

export const CART_COUNT_KEY = 'nunegal:cart:v1:count'
function readCount() {
  try {
    const raw = localStorage.getItem(CART_COUNT_KEY)
    const value: unknown = raw === null ? 0 : JSON.parse(raw)
    return isCartCount(value) ? value : 0
  } catch { return 0 }
}
export function useCart() {
  const [count, setCount] = useState(readCount)
  const [status, setStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle')
  const pending = useRef(false)
  async function add(selection: CartSelection) {
    if (pending.current) return
    pending.current = true
    setStatus('pending')
    try {
      const newCount = await addToCart(selection)
      setCount(newCount)
      try { localStorage.setItem(CART_COUNT_KEY, JSON.stringify(newCount)) } catch { /* Sigue en memoria. */ }
      setStatus('success')
    } catch { setStatus('error') }
    finally { pending.current = false }
  }
  return { count, status, add }
}
