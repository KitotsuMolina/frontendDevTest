import { useState } from 'react'
import ProductCard from '../components/ProductCard'
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
    <section aria-labelledby="list-title">
      <div className="catalog-heading">
        <h1 id="list-title">Listado de productos</h1>
        <div className="catalog-search">
          <label htmlFor="product-search">Buscar por marca o modelo</label>
          <input id="product-search" type="search" value={search}
            onChange={(event) => setSearch(event.target.value)} placeholder="Marca o modelo" />
        </div>
      </div>
      {state.status === 'loading' && <p className="catalog-message" role="status">Cargando productos…</p>}
      {state.status === 'error' && (
        <div className="catalog-message">
          <p role="alert">No se pudieron cargar los productos. Inténtalo de nuevo.</p>
          <button className="retry-button" type="button" onClick={retry}>Reintentar</button>
        </div>
      )}
      {state.status === 'success' && (
        <>
          <p className="result-count" role="status">{matches.length} de {products.length} productos</p>
          {products.length === 0 ? (
            <p className="catalog-message">No hay productos disponibles.</p>
          ) : matches.length === 0 ? (
            <p className="catalog-message">No se encontraron productos. Prueba con otra marca o modelo.</p>
          ) : (
            <ul className="product-grid" aria-label="Productos">
              {matches.map((product) => <ProductCard key={product.id} product={product} />)}
            </ul>
          )}
        </>
      )}
    </section>
  )
}
