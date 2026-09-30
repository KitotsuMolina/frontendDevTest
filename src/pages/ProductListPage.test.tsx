import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import { describe, expect, it, vi } from 'vitest'
import ProductListPage from './ProductListPage'
import { jsonResponse, products } from '../test/products'

function renderList() {
  return render(<MemoryRouter><ProductListPage /></MemoryRouter>)
}

async function renderLoaded() {
  vi.mocked(fetch).mockResolvedValue(jsonResponse())
  renderList()
  await screen.findByRole('list', { name: 'Productos' })
}

describe('listado de productos', () => {
  it('muestra todos los productos, sus atributos y precios textuales sin moneda', async () => {
    await renderLoaded()
    const cards = within(screen.getByRole('list', { name: 'Productos' })).getAllByRole('listitem')
    expect(cards).toHaveLength(products.length)
    products.forEach((product, index) => {
      const card = within(cards[index])
      expect(card.getByText(product.brand)).toBeVisible()
      expect(card.getByRole('heading', { name: product.model })).toBeVisible()
      expect(card.getByRole('link')).toHaveAttribute('href', `/product/${product.id}`)
      expect(card.getByText(product.price.trim() ? product.price : 'Precio no disponible')).toBeVisible()
    })
    expect(screen.getByRole('img', { name: 'Acer Iconia Talk S' })).toHaveAttribute('src', products[0].imgUrl)
    expect(screen.getAllByText('Precio no disponible')).toHaveLength(2)
    expect(screen.queryByText('0')).not.toBeInTheDocument()
  })

  it.each([
    ['  aCeR  ', ['Iconia Talk S', 'Liquid Z6']],
    ['  gALaXy  ', ['Galaxy A10']],
  ])('filtra por marca o modelo normalizando %s sin peticiones nuevas', async (query, models) => {
    const user = userEvent.setup()
    await renderLoaded()
    await user.type(screen.getByRole('searchbox'), query)
    const headings = within(screen.getByRole('list', { name: 'Productos' })).getAllByRole('heading')
    expect(headings.map((heading) => heading.textContent)).toEqual(models)
    expect(fetch).toHaveBeenCalledTimes(1)
    await user.clear(screen.getByRole('searchbox'))
    expect(within(screen.getByRole('list', { name: 'Productos' })).getAllByRole('listitem')).toHaveLength(products.length)
    expect(fetch).toHaveBeenCalledTimes(1)
  })

  it('muestra búsqueda sin coincidencias y permite recuperar el catálogo', async () => {
    const user = userEvent.setup()
    await renderLoaded()
    await user.type(screen.getByRole('searchbox'), 'no-existe')
    expect(screen.getByText(/No se encontraron productos/)).toBeVisible()
    expect(screen.queryByText(/No hay productos disponibles/)).not.toBeInTheDocument()
    await user.clear(screen.getByRole('searchbox'))
    expect(within(screen.getByRole('list', { name: 'Productos' })).getAllByRole('listitem')).toHaveLength(products.length)
    expect(fetch).toHaveBeenCalledTimes(1)
  })

  it('mantiene resultados correctos al cambiar y limpiar rápidamente el filtro', async () => {
    await renderLoaded()
    const search = screen.getByRole('searchbox')
    fireEvent.change(search, { target: { value: 'Acer' } })
    expect(screen.queryByRole('link', { name: 'Samsung Galaxy A10' })).not.toBeInTheDocument()
    fireEvent.change(search, { target: { value: 'Galaxy' } })
    expect(screen.getByRole('link', { name: 'Samsung Galaxy A10' })).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'Acer Iconia Talk S' })).not.toBeInTheDocument()
    fireEvent.change(search, { target: { value: '' } })
    await waitFor(() => expect(screen.getAllByRole('link')).toHaveLength(products.length))
    expect(fetch).toHaveBeenCalledTimes(1)
  })

  it('distingue catálogo vacío de búsqueda sin coincidencias', async () => {
    vi.mocked(fetch).mockResolvedValue(jsonResponse([]))
    renderList()
    expect(await screen.findByText('No hay productos disponibles.')).toBeVisible()
    expect(screen.queryByText(/No se encontraron productos/)).not.toBeInTheDocument()
  })

  it('muestra esqueletos accesibles y sin enlaces hasta que responde el servicio', async () => {
    let resolve!: (response: Response) => void
    vi.mocked(fetch).mockReturnValue(new Promise((done) => { resolve = done }))
    renderList()
    expect(screen.getByRole('status', { name: 'Cargando productos' })).toHaveAttribute('aria-busy', 'true')
    expect(screen.getByRole('status')).toHaveTextContent('Cargando productos')
    expect(screen.queryByRole('link')).not.toBeInTheDocument()
    expect(screen.queryByRole('list', { name: 'Productos' })).not.toBeInTheDocument()
    expect(screen.queryByText(/No hay productos/)).not.toBeInTheDocument()
    resolve(jsonResponse())
    await screen.findByRole('list', { name: 'Productos' })
    expect(screen.queryByRole('status', { name: 'Cargando productos' })).not.toBeInTheDocument()
    expect(screen.getAllByRole('link')).toHaveLength(products.length)
  })

  it.each(['http', 'red', 'contrato'])('permite reintentar un fallo de %s y recuperar el catálogo', async (failure) => {
    const user = userEvent.setup()
    const mock = vi.mocked(fetch)
    if (failure === 'red') mock.mockRejectedValueOnce(new TypeError('Offline'))
    else mock.mockResolvedValueOnce(failure === 'http' ? jsonResponse({}, 500) : jsonResponse([{ id: 'invalid' }]))
    mock.mockResolvedValueOnce(jsonResponse())
    renderList()
    expect(await screen.findByRole('alert')).toHaveTextContent('No se pudieron cargar los productos')
    await user.click(screen.getByRole('button', { name: 'Reintentar' }))
    await screen.findByRole('list', { name: 'Productos' })
    expect(mock).toHaveBeenCalledTimes(2)
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('sustituye una imagen fallida manteniendo identidad y enlace', async () => {
    await renderLoaded()
    fireEvent.error(screen.getByRole('img', { name: 'Acer Iconia Talk S' }))
    expect(screen.getByRole('img', { name: 'Imagen no disponible para Acer Iconia Talk S' })).toBeVisible()
    expect(screen.getByRole('link', { name: 'Acer Iconia Talk S' })).toHaveAttribute('href', '/product/demo')
    expect(screen.getByRole('img', { name: 'Imagen no disponible para Nokia 3310' })).toBeVisible()
  })

  it('aborta la consulta pendiente al abandonar la vista', async () => {
    vi.mocked(fetch).mockReturnValue(new Promise(() => {}))
    const { unmount } = renderList()
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1))
    const signal = vi.mocked(fetch).mock.calls[0][1]?.signal
    unmount()
    await waitFor(() => expect(signal?.aborted).toBe(true))
  })
})
