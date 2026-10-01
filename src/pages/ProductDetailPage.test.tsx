import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes, Link } from 'react-router'
import { describe, expect, it, vi } from 'vitest'
import App from '../App'
import { realProductDetail, secondProductDetail } from '../test/productDetail'
import { jsonResponse, products } from '../test/products'
import { productQueryKeys } from '../api/queryCache'

const id = realProductDetail.id
function renderDetail(path = `/product/${id}`) {
  return render(<MemoryRouter initialEntries={[path]}><App /></MemoryRouter>)
}
function mockProduct(data = realProductDetail) { vi.mocked(fetch).mockResolvedValue(jsonResponse(data)) }
async function loaded() { await screen.findByRole('heading', { name: realProductDetail.model }) }

describe('detalle de producto', () => {
  it('muestra características reales, imagen, precio y breadcrumb', async () => {
    mockProduct(); renderDetail(); await loaded()
    const region = screen.getByRole('region', { name: 'Detalle del producto' })
    expect(within(region).getByText('Acer')).toBeVisible()
    expect(within(region).getByText('170')).toBeVisible()
    for (const value of [realProductDetail.cpu, realProductDetail.ram, realProductDetail.os,
      realProductDetail.displaySize, realProductDetail.displayResolution, realProductDetail.battery,
      realProductDetail.dimentions, realProductDetail.weight]) {
      expect(within(region).getByText(value!)).toBeVisible()
    }
    expect(screen.getByText('13 MP, autofocus')).toBeVisible()
    expect(screen.getByText('2 MP, 720p')).toBeVisible()
    expect(screen.getByRole('img', { name: 'Acer Iconia Talk S' })).toHaveAttribute('src', realProductDetail.imgUrl)
    expect(within(screen.getByRole('navigation')).getByText('Acer Iconia Talk S')).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('button', { name: 'Añadir' })).toBeDisabled()
    expect(screen.getByText(/pendiente de integración/)).toBeVisible()
    expect(fetch).toHaveBeenCalledTimes(1)
  })
  it('selecciona color único y pide selección explícita para varios almacenamientos', async () => {
    const user = userEvent.setup()
    mockProduct(); renderDetail(); await loaded()
    expect(screen.getByRole('combobox', { name: 'Color' })).toHaveValue('1000')
    const storage = screen.getByRole('combobox', { name: 'Almacenamiento' })
    expect(storage).toHaveValue('')
    await user.selectOptions(storage, '2001')
    expect(storage).toHaveValue('2001')
    expect(screen.getByRole('button', { name: 'Añadir' })).toBeDisabled()
    expect(fetch).toHaveBeenCalledTimes(1)
  })
  it('mantiene ambos selectores visibles con opciones únicas', async () => {
    mockProduct({ ...realProductDetail, options: { colors: realProductDetail.options.colors, storages: realProductDetail.options.storages.slice(0, 1) } })
    renderDetail(); await loaded()
    expect(screen.getByRole('combobox', { name: 'Color' })).toHaveValue('1000')
    expect(screen.getByRole('combobox', { name: 'Almacenamiento' })).toHaveValue('2000')
  })
  it('no selecciona automáticamente entre varios colores y reinicia al cambiar de producto', async () => {
    const user = userEvent.setup()
    const other = secondProductDetail
    vi.mocked(fetch).mockImplementation(async input => jsonResponse(String(input).endsWith('/' + other.id) ? other : realProductDetail))
    render(<MemoryRouter initialEntries={[`/product/${id}`]}>
      <Link to={`/product/${other.id}`}>Otro</Link><Link to={`/product/${id}`}>Primero</Link>
      <Routes><Route path="*" element={<App />} /></Routes>
    </MemoryRouter>)
    await loaded()
    await user.selectOptions(screen.getByLabelText('Almacenamiento'), '2001')
    await user.click(screen.getByRole('link', { name: 'Otro' }))
    await screen.findByRole('heading', { name: other.model })
    expect(screen.getByLabelText('Color')).toHaveValue('')
    expect(screen.getByLabelText('Almacenamiento')).toHaveValue('2000')
    await user.selectOptions(screen.getByLabelText('Color'), '1001')
    await user.click(screen.getByRole('link', { name: 'Primero' }))
    await loaded()
    expect(screen.getByLabelText('Color')).toHaveValue('1000')
    expect(screen.getByLabelText('Almacenamiento')).toHaveValue('')
    expect(fetch).toHaveBeenCalledTimes(2)
  })
  it('muestra alternativas para precio, características, opciones e imagen ausentes', async () => {
    mockProduct({ ...realProductDetail, price: ' ', imgUrl: '', cpu: null, dimentions: '-', ram: '', battery: undefined,
      primaryCamera: [], options: { colors: [], storages: [] } })
    renderDetail(); await loaded()
    expect(screen.getByText('Precio no disponible')).toBeVisible()
    expect(screen.getAllByText('No disponible').length).toBeGreaterThanOrEqual(4)
    expect(screen.getByRole('img', { name: /Imagen no disponible/ })).toBeVisible()
    expect(screen.getByLabelText('Color')).toBeDisabled()
  })
  it('sustituye la imagen fallida', async () => {
    mockProduct(); renderDetail(); await loaded()
    fireEvent.error(screen.getByRole('img', { name: 'Acer Iconia Talk S' }))
    expect(screen.getByRole('img', { name: 'Imagen no disponible para Acer Iconia Talk S' })).toBeVisible()
  })
  it('muestra esqueletos de carga y conserva el regreso', () => {
    vi.mocked(fetch).mockReturnValue(new Promise(() => {}))
    renderDetail()
    expect(screen.getByRole('status', { name: 'Cargando producto' })).toHaveAttribute('aria-busy', 'true')
    expect(screen.getByRole('link', { name: 'Listado' })).toHaveAttribute('href', '/')
  })
  it('distingue producto inexistente de error recuperable', async () => {
    vi.mocked(fetch).mockResolvedValue(jsonResponse({}, 404))
    renderDetail()
    expect(await screen.findByRole('heading', { name: 'Producto no encontrado' })).toBeVisible()
    expect(screen.queryByRole('button', { name: 'Reintentar' })).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Listado' })).toBeVisible()
    expect(localStorage.getItem(productQueryKeys.detail(id))).toBeNull()
  })
  it.each(['HTTP', 'red', 'contrato'])('permite reintentar tras fallo de %s', async failure => {
    const user = userEvent.setup()
    if (failure === 'red') vi.mocked(fetch).mockRejectedValueOnce(new Error('Offline'))
    else vi.mocked(fetch).mockResolvedValueOnce(jsonResponse(failure === 'HTTP' ? {} : { id }, failure === 'HTTP' ? 503 : 200))
    vi.mocked(fetch).mockResolvedValueOnce(jsonResponse(realProductDetail))
    renderDetail()
    expect(await screen.findByRole('alert')).toHaveTextContent('No se pudo cargar')
    await user.click(screen.getByRole('button', { name: 'Reintentar' }))
    await loaded()
    expect(fetch).toHaveBeenCalledTimes(2)
  })
  it('reutiliza el detalle al remontar la aplicación', async () => {
    mockProduct()
    const view = renderDetail(); await loaded(); view.unmount()
    renderDetail(); await loaded()
    expect(fetch).toHaveBeenCalledTimes(1)
  })
  it('no muestra un detalle caducado al regresar si falla su renovación', async () => {
    const user = userEvent.setup()
    mockProduct()
    render(<MemoryRouter initialEntries={[`/product/${id}`]}>
      <Link to="/">Salir</Link><Link to={`/product/${id}`}>Regresar</Link><App />
    </MemoryRouter>)
    await loaded()
    const originalNow = Date.now()
    const clock = vi.spyOn(Date, 'now')
    try {
      await user.click(screen.getByRole('link', { name: 'Salir' }))
      clock.mockReturnValue(originalNow + 3600001)
      vi.mocked(fetch).mockResolvedValue(jsonResponse({}, 503))
      await user.click(screen.getByRole('link', { name: 'Regresar' }))
      expect(await screen.findByRole('alert')).toHaveTextContent('No se pudo cargar el producto')
      expect(screen.queryByRole('heading', { name: realProductDetail.model })).not.toBeInTheDocument()
      expect(within(screen.getByRole('navigation')).queryByText('Acer Iconia Talk S')).not.toBeInTheDocument()
    } finally { clock.mockRestore() }
  })
  it('no reutiliza como detalle la entrada de listado', async () => {
    localStorage.setItem(productQueryKeys.list, JSON.stringify({ obtainedAt: Date.now(), expiresAt: Date.now() + 3600000, data: products }))
    mockProduct(); renderDetail(); await loaded()
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1))
  })
})
