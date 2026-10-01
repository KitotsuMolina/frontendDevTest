import { expect, test } from '@playwright/test'
import { details, mockApi } from './api'

test('proxy conserva sesión, códigos por producto y recarga, sin mezclar navegadores', async ({ page, browser }) => {
  await mockApi(page, { proxyCart: true })
  // Cookie ajena al carrito: no debe llegar al upstream.
  await page.context().addCookies([{ name: 'other_app', value: 'unrelated', url: 'http://127.0.0.1:4173' }])
  await page.goto(`/product/${details[0].id}`)
  await page.getByLabel('Almacenamiento', { exact: true }).selectOption('2001')
  const firstPost = page.waitForRequest(request => new URL(request.url()).pathname === '/api/cart' && request.method() === 'POST')
  await page.getByRole('button', { name: 'Añadir', exact: true }).click()
  expect((await firstPost).postDataJSON()).toEqual({ id: details[0].id, colorCode: 1000, storageCode: 2001 })
  await expect(page.getByLabel('Cesta: 1 productos')).toBeVisible()
  const session = (await page.context().cookies()).find(cookie => cookie.name === 'session_id')
  expect(session).toMatchObject({ path: '/api/cart', httpOnly: true })
  await page.getByRole('navigation').getByRole('link', { name: 'Listado' }).click()
  await page.getByRole('link', { name: 'Acer Liquid Z6 Plus', exact: true }).click()
  await page.getByLabel('Color', { exact: true }).selectOption('1001')
  const secondPost = page.waitForRequest(request => new URL(request.url()).pathname === '/api/cart' && request.method() === 'POST')
  await page.getByRole('button', { name: 'Añadir', exact: true }).click()
  expect((await secondPost).postDataJSON()).toEqual({ id: details[1].id, colorCode: 1001, storageCode: 2000 })
  await expect(page.getByLabel('Cesta: 2 productos')).toBeVisible()
  await page.reload()
  await expect(page.getByLabel('Cesta: 2 productos')).toBeVisible()
  await page.getByLabel('Color', { exact: true }).selectOption('1000')
  await page.getByRole('button', { name: 'Añadir', exact: true }).click()
  await expect(page.getByLabel('Cesta: 3 productos')).toBeVisible()
  expect((await page.context().cookies()).find(cookie => cookie.name === 'session_id')?.value).toBe(session?.value)

  const otherContext = await browser.newContext()
  try {
    const otherPage = await otherContext.newPage()
    await mockApi(otherPage, { proxyCart: true })
    await otherPage.goto(`${new URL(page.url()).origin}/product/${details[1].id}`)
    await otherPage.getByLabel('Color', { exact: true }).selectOption('1000')
    await otherPage.getByRole('button', { name: 'Añadir', exact: true }).click()
    await expect(otherPage.getByLabel('Cesta: 1 productos')).toBeVisible()
    expect((await otherContext.cookies()).find(cookie => cookie.name === 'session_id')?.value).not.toBe(session?.value)
    await expect(page.getByLabel('Cesta: 3 productos')).toBeVisible()
  } finally { await otherContext.close() }
})
