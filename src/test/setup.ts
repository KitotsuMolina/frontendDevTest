import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach, beforeEach, vi } from 'vitest'

// Cada prueba debe configurar su respuesta; nunca se consulta la API pública.
beforeEach(() => {
  vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Fetch sin respuesta simulada')))
})

afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
})
