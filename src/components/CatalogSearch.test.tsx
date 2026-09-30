import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, expect, it, vi } from 'vitest'
import CatalogSearch from './CatalogSearch'

afterEach(() => vi.restoreAllMocks())

it('integra el mismo buscador al subir y conserva su valor y foco', async () => {
  let scroll = 0
  vi.spyOn(window, 'scrollY', 'get').mockImplementation(() => scroll)
  vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (this: HTMLElement) {
    return { top: this.classList.contains('search-slot') ? 120 - scroll : 0, height: 76 } as DOMRect
  })
  const change = vi.fn()
  const { container } = render(<CatalogSearch value="Acer" onChange={change} />)
  const input = screen.getByRole('searchbox')
  const panel = container.querySelector('.search-panel')!
  scroll = 500
  fireEvent.scroll(window)
  await waitFor(() => expect(panel).toHaveAttribute('data-docked', 'true'))
  expect(panel).toHaveAttribute('data-visible', 'false')
  scroll = 400
  fireEvent.scroll(window)
  await waitFor(() => expect(panel).toHaveAttribute('data-visible', 'true'))
  expect(screen.getByRole('searchbox')).toBe(input)
  expect(input).toHaveValue('Acer')
  input.focus()
  scroll = 450
  fireEvent.scroll(window)
  await waitFor(() => expect(panel).toHaveAttribute('data-visible', 'true'))
  expect(input).toHaveFocus()
  fireEvent.change(input, { target: { value: 'Galaxy' } })
  expect(change).toHaveBeenCalledWith('Galaxy')
  scroll = 0
  fireEvent.scroll(window)
  await waitFor(() => expect(panel).toHaveAttribute('data-docked', 'false'))
})
