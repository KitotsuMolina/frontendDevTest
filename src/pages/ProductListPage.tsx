import { useState } from 'react'
import { AnimatePresence } from 'motion/react'
import CatalogSearch from '../components/CatalogSearch'
import ProductCard from '../components/ProductCard'
import ProductListSkeleton from '../components/ProductListSkeleton'
import { useProducts } from '../hooks/useProducts'

export default function ProductListPage() {
  const { state, retry } = useProducts()
  const [search, setSearch] = useState('')
  const query = search.trim().toLowerCase()
  const products = state.status === 'success' ? state.products : []
  const matches = products.filter((product) =>
    product.brand.toLowerCase().includes(query) || product.model.toLowerCase().includes(query),
  )

  return (
    <section className="catalog-page" aria-label="Catálogo de productos">
      <CatalogSearch value={search} onChange={setSearch} />
      {state.status === 'loading' && <ProductListSkeleton />}
      {state.status === 'error' && (
        <div className="catalog-message">
          <p role="alert">No se pudieron cargar los productos. Inténtalo de nuevo.</p>
          <button className="retry-button" type="button" onClick={retry}>Reintentar</button>
        </div>
      )}
      {state.status === 'success' && (
        <div className="catalog-results">
          <p className="result-count" role="status">{matches.length} de {products.length} productos</p>
          {products.length === 0 ? (
            <p className="catalog-message">No hay productos disponibles.</p>
          ) : (
            <>
              <ul className="product-grid" aria-label="Productos">
                <AnimatePresence initial={false} mode="popLayout">
                  {matches.map((product) => <ProductCard key={product.id} product={product} />)}
                </AnimatePresence>
              </ul>
              {matches.length === 0 && (
                <p className="catalog-message">No se encontraron productos. Prueba con otra marca o modelo.</p>
              )}
            </>
          )}
        </div>
      )}
    </section>
  )
}
