import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import App from './App'
import { jsonResponse } from './test/products'

function renderAt(path = '/') {
  window.history.replaceState(null, '', path)
  return render(<BrowserRouter><App /></BrowserRouter>)
}

beforeEach(() => vi.mocked(fetch).mockResolvedValue(jsonResponse()))

afterEach(() => window.history.replaceState(null, '', '/'))

describe('navegación de la SPA', () => {
  it('muestra el catálogo, breadcrumb actual y cesta en cero', async () => {
    renderAt()
    expect(screen.getByRole('heading', { name: 'Listado de productos' })).toBeVisible()
    expect(await screen.findByRole('link', { name: 'Acer Iconia Talk S' })).toBeVisible()
    expect(screen.getByLabelText('Cesta: 0 productos')).toBeVisible()
    expect(within(screen.getByRole('navigation')).getByText('Listado')).toHaveAttribute('aria-current', 'page')
  })

  it('monta una URL de detalle directamente con su id y regreso explícito', () => {
    renderAt('/product/telefono-123')
    expect(screen.getByRole('heading', { name: 'Detalle del producto' })).toBeVisible()
    expect(screen.getByText('telefono-123')).toBeVisible()
    expect(screen.getByText('Vista provisional')).toBeVisible()
    expect(screen.getByLabelText('Cesta: 0 productos')).toBeVisible()
    expect(screen.getByRole('link', { name: 'Volver al listado' })).toHaveAttribute('href', '/')
    expect(within(screen.getByRole('navigation')).getByText('Detalle del producto')).toHaveAttribute('aria-current', 'page')
  })

  it.each(['Nunegal / ITX', 'Listado', 'Volver al listado'])('vuelve al inicio mediante el enlace %s conservando la cabecera', async (name) => {
    const user = userEvent.setup()
    renderAt('/product/demo')
    const header = screen.getByRole('banner')
    await user.click(screen.getByRole('link', { name }))
    expect(window.location.pathname).toBe('/')
    expect(screen.getByRole('heading', { name: 'Listado de productos' })).toBeVisible()
    expect(screen.getByRole('banner')).toBe(header)
    expect(document.title).toBe('Listado de productos | Nunegal / ITX')
  })

  it('permite usar Tab y Enter y lleva el foco al contenido al cambiar de vista', async () => {
    const user = userEvent.setup()
    renderAt()
    await screen.findByRole('link', { name: 'Acer Iconia Talk S' })
    await user.tab()
    expect(screen.getByRole('link', { name: 'Saltar al contenido' })).toHaveFocus()
    await user.tab()
    expect(screen.getByRole('button', { name: 'Descubrir el logo oculto' })).toHaveFocus()
    await user.tab()
    expect(screen.getByRole('link', { name: 'Nunegal / ITX' })).toHaveFocus()
    await user.tab()
    expect(screen.getByRole('searchbox', { name: 'Buscar por marca o modelo' })).toHaveFocus()
    await user.tab()
    expect(screen.getByRole('link', { name: 'Acer Iconia Talk S' })).toHaveFocus()
    await user.keyboard('{Enter}')
    expect(screen.getByRole('heading', { name: 'Detalle del producto' })).toBeVisible()
    expect(screen.getByRole('main')).toHaveFocus()
    await user.tab()
    expect(screen.getByRole('link', { name: 'Volver al listado' })).toHaveFocus()
    await user.keyboard('{Enter}')
    expect(screen.getByRole('heading', { name: 'Listado de productos' })).toBeVisible()
  })

  it('respeta atrás y adelante del historial tras navegar por un enlace', async () => {
    const user = userEvent.setup()
    renderAt()
    await user.click(await screen.findByRole('link', { name: 'Acer Iconia Talk S' }))
    expect(window.location.pathname).toBe('/product/demo')
    window.history.back()
    await waitFor(() => expect(screen.getByRole('heading', { name: 'Listado de productos' })).toBeVisible())
    window.history.forward()
    await waitFor(() => expect(screen.getByRole('heading', { name: 'Detalle del producto' })).toBeVisible())
    expect(screen.getByLabelText('Cesta: 0 productos')).toBeVisible()
  })
})
