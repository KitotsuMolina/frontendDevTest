import { act, fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import { afterEach, expect, it, vi } from 'vitest'
import App from './App'
import { useCart, CART_COUNT_KEY } from './hooks/useCart'
import { realProductDetail, secondProductDetail } from './test/productDetail'
import { jsonResponse, products } from './test/products'

const id = realProductDetail.id
function mockGet(post: () => Promise<Response> = async () => jsonResponse({ count: 4 })) {
  vi.mocked(fetch).mockImplementation(async (url, options) => {
    if (options?.method === 'POST') return post()
    if (String(url).endsWith('/api/product')) return jsonResponse(products)
    return jsonResponse(String(url).endsWith(secondProductDetail.id) ? secondProductDetail : realProductDetail)
  })
}
function mount(path = `/product/${id}`) { return render(<MemoryRouter initialEntries={[path]}><App /></MemoryRouter>) }
async function ready() { await screen.findByRole('heading', { name: realProductDetail.model, level: 1 }) }
const postCalls = () => vi.mocked(fetch).mock.calls.filter(([, init]) => init?.method === 'POST')
afterEach(() => vi.restoreAllMocks())

it('bloquea selección incompleta, resuelve códigos reales y bloquea envíos pendientes', async () => {
  let resolve!: (response: Response) => void
  mockGet(() => new Promise(done => { resolve = done }))
  mount(); await ready()
  expect(screen.getByRole('button', { name: 'Añadir' })).toBeDisabled()
  fireEvent.click(screen.getByRole('button', { name: 'Añadir' }))
  expect(postCalls()).toHaveLength(0)
  fireEvent.change(screen.getByLabelText('Almacenamiento'), { target: { value: '2001' } })
  const button = screen.getByRole('button', { name: 'Añadir' })
  expect(button).toBeEnabled()
  fireEvent.click(button); fireEvent.click(button)
  expect(screen.getByRole('button', { name: 'Añadiendo…' })).toBeDisabled()
  expect(postCalls()).toHaveLength(1)
  expect(JSON.parse(postCalls()[0][1]!.body as string)).toEqual({ id, colorCode: 1000, storageCode: 2001 })
  await act(async () => resolve(jsonResponse({ count: 4 })))
  expect(screen.getByLabelText('Cesta: 4 productos')).toBeVisible()
  expect(screen.getByRole('status')).toHaveTextContent('Producto añadido a la cesta')
  expect(localStorage.getItem(CART_COUNT_KEY)).toBe('4')
})

it('permite añadir cuando ambas opciones únicas están seleccionadas', async () => {
  const user = userEvent.setup()
  const unique = { ...realProductDetail, options: { colors: realProductDetail.options.colors, storages: realProductDetail.options.storages.slice(0, 1) } }
  vi.mocked(fetch).mockImplementation(async (_url, init) => jsonResponse(init?.method === 'POST' ? { count: 1 } : unique))
  mount(); await ready()
  expect(screen.getByRole('button', { name: 'Añadir' })).toBeEnabled()
  await user.click(screen.getByRole('button', { name: 'Añadir' }))
  expect(screen.getByLabelText('Cesta: 1 productos')).toBeVisible()
})

it('actualiza el valor exacto, incluso inferior, persiste y recupera tras remonte', async () => {
  const user = userEvent.setup()
  localStorage.setItem(CART_COUNT_KEY, '9')
  mockGet(async () => jsonResponse({ count: 2 }))
  const view = mount(); await ready()
  expect(screen.getByLabelText('Cesta: 9 productos')).toBeVisible()
  await user.selectOptions(screen.getByLabelText('Almacenamiento'), '2000')
  await user.click(screen.getByRole('button', { name: 'Añadir' }))
  expect(screen.getByLabelText('Cesta: 2 productos')).toBeVisible()
  view.unmount(); mount('/');
  expect(screen.getByLabelText('Cesta: 2 productos')).toBeVisible()
})

it('mantiene la petición y el bloqueo al navegar y actualiza ambas vistas al terminar', async () => {
  const user = userEvent.setup()
  let resolve!: (response: Response) => void
  mockGet(() => new Promise(done => { resolve = done }))
  mount(); await ready()
  await user.selectOptions(screen.getByLabelText('Almacenamiento'), '2000')
  await user.click(screen.getByRole('button', { name: 'Añadir' }))
  await user.click(screen.getByRole('link', { name: 'Listado' }))
  expect(screen.getByRole('region', { name: 'Catálogo de productos' })).toBeVisible()
  await act(async () => resolve(jsonResponse({ count: 6 })))
  expect(screen.getByLabelText('Cesta: 6 productos')).toBeVisible()
  expect(screen.getByText('Producto añadido a la cesta.')).toBeVisible()
  // El producto simulado demo conserva los campos del real, con el id solicitado.
  vi.mocked(fetch).mockImplementation(async url => jsonResponse({ ...realProductDetail, id: String(url).split('/').pop() }))
  await user.click(await screen.findByRole('link', { name: 'Acer Iconia Talk S' }))
  await ready()
  expect(screen.getByLabelText('Cesta: 6 productos')).toBeVisible()
  expect(localStorage.getItem(CART_COUNT_KEY)).toBe('6')
})

it('mantiene el bloqueo al abrir otro detalle durante el envío', async () => {
  const user = userEvent.setup()
  let resolve!: (response: Response) => void
  mockGet(() => new Promise(done => { resolve = done }))
  render(<MemoryRouter initialEntries={[`/product/${id}`]}>
    <App />
  </MemoryRouter>)
  await ready()
  await user.selectOptions(screen.getByLabelText('Almacenamiento'), '2000')
  await user.click(screen.getByRole('button', { name: 'Añadir' }))
  await user.click(screen.getByRole('link', { name: 'Listado' }))
  // El catálogo ya usa la respuesta simulada inicial: demo. Su detalle recibe el id pedido.
  vi.mocked(fetch).mockImplementation(async url => jsonResponse({ ...secondProductDetail, id: String(url).split('/').pop() }))
  await user.click(await screen.findByRole('link', { name: 'Acer Iconia Talk S' }))
  await screen.findByRole('heading', { name: secondProductDetail.model, level: 1 })
  expect(screen.getByRole('button', { name: 'Añadiendo…' })).toBeDisabled()
  expect(postCalls()).toHaveLength(1)
  await act(async () => resolve(jsonResponse({ count: 5 })))
  expect(screen.getByLabelText('Cesta: 5 productos')).toBeVisible()
  expect(screen.getByRole('button', { name: 'Añadir' })).toBeDisabled()
})

it.each(['HTTP', 'red', 'count'])('conserva contador tras %s y permite reintento manual', async failure => {
  const user = userEvent.setup()
  localStorage.setItem(CART_COUNT_KEY, '8')
  let attempts = 0
  mockGet(async () => {
    attempts++
    if (attempts > 1) return jsonResponse({ count: 0 })
    if (failure === 'red') throw new Error('Offline')
    return failure === 'HTTP' ? jsonResponse({}, 500) : jsonResponse({ count: '10' })
  })
  mount(); await ready()
  await user.selectOptions(screen.getByLabelText('Almacenamiento'), '2000')
  await user.click(screen.getByRole('button', { name: 'Añadir' }))
  expect(await screen.findByRole('alert')).toHaveTextContent('No se pudo añadir')
  expect(screen.getByLabelText('Cesta: 8 productos')).toBeVisible()
  expect(localStorage.getItem(CART_COUNT_KEY)).toBe('8')
  expect(attempts).toBe(1)
  expect(screen.getByRole('button', { name: 'Añadir' })).toBeEnabled()
  await user.click(screen.getByRole('button', { name: 'Añadir' }))
  expect(screen.getByLabelText('Cesta: 0 productos')).toBeVisible()
  expect(attempts).toBe(2)
})

it.each(['{roto', '-1', '1.5', '"3"', 'null', 'true', '{}'])('recupera cero con almacenamiento corrupto %s', raw => {
  localStorage.setItem(CART_COUNT_KEY, raw)
  mockGet(); mount('/')
  expect(screen.getByLabelText('Cesta: 0 productos')).toBeVisible()
})

it.each(['getItem', 'setItem'] as const)('continúa en memoria si falla %s', async method => {
  const user = userEvent.setup()
  vi.spyOn(Storage.prototype, method).mockImplementation(() => { throw new DOMException('Storage bloqueado') })
  mockGet(); mount(); await ready()
  await user.selectOptions(screen.getByLabelText('Almacenamiento'), '2000')
  await user.click(screen.getByRole('button', { name: 'Añadir' }))
  expect(screen.getByLabelText('Cesta: 4 productos')).toBeVisible()
  await user.click(screen.getByRole('link', { name: 'Listado' }))
  expect(screen.getByLabelText('Cesta: 4 productos')).toBeVisible()
})

function LockHarness() {
  const cart = useCart()
  return <button onClick={() => { void cart.add({ id, colorCode: 1000, storageCode: 2000 }); void cart.add({ id, colorCode: 1000, storageCode: 2000 }) }}>Enviar dos veces</button>
}
it('el bloqueo síncrono evita dos envíos antes del siguiente render', () => {
  vi.mocked(fetch).mockReturnValue(new Promise(() => {}))
  render(<LockHarness />)
  fireEvent.click(screen.getByRole('button'))
  expect(postCalls()).toHaveLength(1)
})
