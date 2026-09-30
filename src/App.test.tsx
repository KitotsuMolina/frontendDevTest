import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import App from './App'

describe('base de la SPA', () => {
  it('monta la pantalla inicial con un punto de entrada accesible', () => {
    render(<App />)
    expect(screen.getByRole('main')).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 1, name: 'Nunegal / ITX' })).toBeVisible()
  })
})
