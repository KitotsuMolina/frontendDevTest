import { useEffect, useRef } from 'react'
import { Navigate, Route, Routes, useLocation, useMatch } from 'react-router'
import { useProductDetail } from './hooks/useProductDetail'
import Header from './components/Header'
import ProductListPage from './pages/ProductListPage'
import ProductDetailPage from './pages/ProductDetailPage'

export default function App() {
  const { pathname } = useLocation()
  const detailMatch = useMatch('/product/:id')
  const detail = useProductDetail(detailMatch?.params.id)
  const productName = detailMatch && detail.state.status === 'success' ? `${detail.state.product.brand} ${detail.state.product.model}` : undefined
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
      <Header productName={productName} />
      <main id="main-content" ref={mainRef} tabIndex={-1}>
        <Routes>
          <Route path="/" element={<ProductListPage />} />
          <Route path="/product/:id" element={<ProductDetailPage state={detail.state} retry={detail.retry} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </>
  )
}
