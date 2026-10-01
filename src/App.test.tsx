import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import App from './App'
import { demoDetail } from './test/productDetail'
import { jsonResponse } from './test/products'

function renderAt(path = '/') {
  window.history.replaceState(null, '', path)
  return render(<BrowserRouter><App /></BrowserRouter>)
}

beforeEach(() => vi.mocked(fetch).mockImplementation(async input => String(input).includes('/api/product/')
  ? jsonResponse({ ...demoDetail, id: decodeURIComponent(String(input).split('/').pop()!) }) : jsonResponse()))

afterEach(() => window.history.replaceState(null, '', '/'))

describe('navegación de la SPA', () => {
  it('muestra el catálogo y cesta en cero con breadcrumbs en la solapa de la cabecera y sin título visible', async () => {
    renderAt()
    expect(screen.getByRole('region', { name: 'Catálogo de productos' })).toBeVisible()
    expect(await screen.findByRole('link', { name: 'Acer Iconia Talk S' })).toBeVisible()
    expect(screen.getByLabelText('Cesta: 0 productos')).toBeVisible()
    expect(screen.getByRole('navigation', { name: 'Ruta de navegación' })).toBeVisible()
    expect(screen.getByRole('banner')).toContainElement(screen.getByRole('navigation'))
    expect(screen.queryByRole('heading', { name: 'Listado de productos' })).not.toBeInTheDocument()
  })

  it('monta una URL de detalle directamente y actualiza el breadcrumb con el producto', async () => {
    renderAt('/product/telefono-123')
    expect(await screen.findByRole('heading', { name: 'Iconia Talk S', level: 1 })).toBeVisible()
    const breadcrumbs = screen.getByRole('navigation', { name: 'Ruta de navegación' })
    expect(within(breadcrumbs).getByRole('link', { name: 'Listado' })).toHaveAttribute('href', '/')
    expect(within(breadcrumbs).getByText('Acer Iconia Talk S')).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('banner')).toContainElement(breadcrumbs)
    expect(screen.getByLabelText('Cesta: 0 productos')).toBeVisible()
    expect(screen.getByRole('button', { name: 'Añadir' })).toBeDisabled()
  })

  it('muestra la solapa solo en detalle y vuelve al listado desde acceso directo', async () => {
    const user = userEvent.setup()
    renderAt('/product/demo')
    await user.click(screen.getByRole('button', { name: 'Volver a la página anterior' }))
    expect(window.location.pathname).toBe('/')
    expect(screen.queryByRole('button', { name: 'Volver a la página anterior' })).not.toBeInTheDocument()
  })

  it('la solapa vuelve por el historial tras abrir una tarjeta', async () => {
    const user = userEvent.setup()
    renderAt()
    const tab = screen.getByRole('navigation').closest('.detail-back-tab')
    expect(tab).toHaveAttribute('data-detail', 'false')
    await user.click(await screen.findByRole('link', { name: 'Acer Iconia Talk S' }))
    expect(screen.getByRole('navigation').closest('.detail-back-tab')).toBe(tab)
    expect(tab).toHaveAttribute('data-detail', 'true')
    await user.click(screen.getByRole('button', { name: 'Volver a la página anterior' }))
    await waitFor(() => expect(window.location.pathname).toBe('/'))
    expect(screen.getByRole('region', { name: 'Catálogo de productos' })).toBeVisible()
  })

  it.each(['Nunegal / ITX', 'Listado'])('vuelve al inicio mediante el enlace %s conservando la cabecera', async (name) => {
    const user = userEvent.setup()
    renderAt('/product/demo')
    const header = screen.getByRole('banner')
    await user.click(screen.getByRole('link', { name }))
    expect(window.location.pathname).toBe('/')
    expect(screen.getByRole('region', { name: 'Catálogo de productos' })).toBeVisible()
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
    const easterEgg = screen.getByRole('link', { name: 'Visitar el GitHub de KitotsuMolina (se abre en otra pestaña)' })
    expect(easterEgg).toHaveFocus()
    expect(easterEgg).toHaveAttribute('href', 'https://github.com/KitotsuMolina')
    expect(easterEgg).toHaveAttribute('target', '_blank')
    expect(easterEgg).toHaveAttribute('rel', 'noopener noreferrer')
    await user.tab()
    expect(screen.getByRole('link', { name: 'Nunegal / ITX' })).toHaveFocus()
    await user.tab()
    expect(screen.getByRole('searchbox', { name: 'Buscar por marca o modelo' })).toHaveFocus()
    await user.tab()
    expect(screen.getByRole('link', { name: 'Acer Iconia Talk S' })).toHaveFocus()
    await user.keyboard('{Enter}')
    expect(await screen.findByRole('heading', { name: 'Iconia Talk S', level: 1 })).toBeVisible()
    expect(screen.getByRole('main')).toHaveFocus()
    screen.getByRole('button', { name: 'Volver a la página anterior' }).focus()
    expect(screen.getByRole('button', { name: 'Volver a la página anterior' })).toHaveFocus()
    await user.keyboard('{Enter}')
    expect(screen.getByRole('region', { name: 'Catálogo de productos' })).toBeVisible()
  })

  it('respeta atrás y adelante del historial tras navegar por un enlace', async () => {
    const user = userEvent.setup()
    renderAt()
    await user.click(await screen.findByRole('link', { name: 'Acer Iconia Talk S' }))
    expect(window.location.pathname).toBe('/product/demo')
    window.history.back()
    await waitFor(() => expect(screen.getByRole('region', { name: 'Catálogo de productos' })).toBeVisible())
    window.history.forward()
    expect(await screen.findByRole('heading', { name: 'Iconia Talk S', level: 1 })).toBeVisible()
    expect(screen.getByLabelText('Cesta: 0 productos')).toBeVisible()
  })
})
