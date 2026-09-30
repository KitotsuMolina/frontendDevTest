import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach, beforeEach, vi } from 'vitest'

// Cada prueba debe configurar su respuesta; nunca se consulta la API pública.
beforeEach(() => {
  localStorage.clear()
  vi.stubGlobal('matchMedia', vi.fn((query: string) => ({
    matches: false, media: query, onchange: null,
    addListener: vi.fn(), removeListener: vi.fn(),
    addEventListener: vi.fn(), removeEventListener: vi.fn(), dispatchEvent: vi.fn(),
  })))
  vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Fetch sin respuesta simulada')))
})

afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
})
