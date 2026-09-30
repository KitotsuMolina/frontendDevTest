import { useEffect, useRef, useState } from 'react'

type Props = { value: string; onChange: (value: string) => void }

export default function CatalogSearch({ value, onChange }: Props) {
  const slotRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [position, setPosition] = useState({ docked: false, visible: false })

  useEffect(() => {
    let previousY = window.scrollY
    let frame = 0
    const update = () => {
      frame = 0
      const headerHeight = document.querySelector('header')?.getBoundingClientRect().height ?? 0
      const docked = (slotRef.current?.getBoundingClientRect().top ?? Infinity) < headerHeight
      const currentY = window.scrollY
      const difference = currentY - previousY
      setPosition(previous => ({
        docked,
        visible: docked && (document.activeElement === inputRef.current ||
          (difference < -3 ? true : difference > 3 ? false : previous.visible)),
      }))
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
