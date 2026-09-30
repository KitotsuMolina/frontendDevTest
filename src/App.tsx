import { useEffect, useRef } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router'
import Header from './components/Header'
import ProductListPage from './pages/ProductListPage'
import ProductDetailPage from './pages/ProductDetailPage'

export default function App() {
  const { pathname } = useLocation()
  const mainRef = useRef<HTMLElement>(null)
  const previousPath = useRef(pathname)

  useEffect(() => {
    document.title = `${pathname === '/' ? 'Listado de productos' : 'Detalle del producto'} | Nunegal / ITX`
    if (previousPath.current !== pathname) {
      mainRef.current?.focus()
      previousPath.current = pathname
    }
  }, [pathname])

  return (
    <>
      <a className="skip-link" href="#main-content">Saltar al contenido</a>
      <Header />
      <main id="main-content" ref={mainRef} tabIndex={-1}>
        <Routes>
          <Route path="/" element={<ProductListPage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </>
  )
}
