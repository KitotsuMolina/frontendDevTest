import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router'
import Breadcrumbs from './Breadcrumbs'
import logoBackground from '../assets/kitotsu-logo-background.png'

export default function Header({ productName, count }: { productName?: string; count: number }) {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const isDetail = pathname.startsWith('/product/')
  const goBack = () => {
    if (typeof window.history.state?.idx === 'number' && window.history.state.idx > 0) {
      void navigate(-1)
    } else {
      void navigate('/')
    }
  }
  const headerRef = useRef<HTMLElement>(null)
  useEffect(() => {
    const header = headerRef.current
    if (!header) return
    const measure = () => document.documentElement.style.setProperty(
      '--header-height', `${header.getBoundingClientRect().height}px`,
    )
    measure()
    if (typeof ResizeObserver === 'undefined') return
    const observer = new ResizeObserver(measure)
    observer.observe(header)
    return () => observer.disconnect()
  }, [])
  const [isPeeled, setIsPeeled] = useState(false)

  return (
    <header ref={headerRef} className="site-header" data-peeled={isPeeled}>
      <div className="peel-art" aria-hidden="true">
        <img src={logoBackground} alt="" />
      </div>
      <div className="header-paper" aria-hidden="true" />
      <div className="paper-curl" aria-hidden="true" />
      <button
        className="peel-trigger"
        type="button"
        aria-label="Descubrir el logo oculto"
        aria-pressed={isPeeled}
        onClick={() => setIsPeeled(!isPeeled)}
      />
      <div className="header-inner">
        <Link className="brand" to="/">Nunegal / ITX</Link>
        <p className="cart-count" aria-label={`Cesta: ${count} productos`}>Cesta <span>{count}</span></p>
      </div>
      <div className="detail-back-tab" data-detail={isDetail}>
        <div className="tab-back-slot">
          {isDetail && (
          <button type="button" onClick={goBack} aria-label="Volver a la página anterior">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" aria-hidden="true">
              <path d="m10 5-7 7 7 7M3 12h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span>Volver</span>
          </button>
          )}
        </div>
        <Breadcrumbs detail={isDetail} productName={productName} />
      </div>
    </header>
  )
}
