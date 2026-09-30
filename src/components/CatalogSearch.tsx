import { useEffect, useRef, useState } from 'react'

type Props = { value: string; onChange: (value: string) => void }

export default function CatalogSearch({ value, onChange }: Props) {
  const slotRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [position, setPosition] = useState({ docked: false, visible: false })

  useEffect(() => {
    let previousY = window.scrollY
    let frame = 0
    let wasDocked = false
    let hideTimer: ReturnType<typeof window.setTimeout> | undefined
    const cancelHide = () => {
      window.clearTimeout(hideTimer)
      hideTimer = undefined
    }
    const update = () => {
      frame = 0
      const headerHeight = document.querySelector('header')?.getBoundingClientRect().height ?? 0
      const docked = (slotRef.current?.getBoundingClientRect().top ?? Infinity) < headerHeight
      const currentY = window.scrollY
      const difference = currentY - previousY
      const focused = document.activeElement === inputRef.current
      const entering = docked && !wasDocked
      if (!docked || focused || difference < -3) cancelHide()
      else if ((entering || difference > 3) && hideTimer === undefined) {
        hideTimer = window.setTimeout(() => {
          hideTimer = undefined
          if (document.activeElement !== inputRef.current) {
            setPosition(previous => ({ ...previous, visible: false }))
          }
        }, entering ? 1000 : 600)
      }
      setPosition(previous => ({
        docked,
        visible: docked && (entering || focused || difference < -3 || previous.visible),
      }))
      wasDocked = docked
      if (Math.abs(difference) > 3) previousY = currentY
    }
    const schedule = () => { if (!frame) frame = window.requestAnimationFrame(update) }
    update()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    return () => {
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      window.cancelAnimationFrame(frame)
      cancelHide()
    }
  }, [])

  return (
    <div ref={slotRef} className="catalog-heading search-slot">
      <div className="search-panel" data-docked={position.docked} data-visible={position.visible}
        onFocus={() => setPosition(previous => ({ ...previous, visible: previous.docked }))}>
        <div className="catalog-search">
          <label htmlFor="product-search">Buscar por marca o modelo</label>
          <input ref={inputRef} id="product-search" type="search" value={value}
            onChange={event => onChange(event.target.value)} placeholder="Marca o modelo" />
        </div>
      </div>
    </div>
  )
}
