export default function ProductListSkeleton() {
  return (
    <div className="catalog-loading" role="status" aria-label="Cargando productos" aria-busy="true">
      <span className="sr-only">Cargando productos…</span>
      <div className="skeleton skeleton-count" aria-hidden="true" />
      <div className="product-grid" aria-hidden="true">
        {Array.from({ length: 8 }, (_, index) => (
          <div className="product-skeleton" key={index}>
            <div className="skeleton skeleton-image" />
            <div className="skeleton skeleton-brand" />
            <div className="skeleton skeleton-model" />
            <div className="skeleton skeleton-price" />
          </div>
        ))}
      </div>
    </div>
  )
}
