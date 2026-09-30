import { useState } from 'react'
import { Link } from 'react-router'
import type { Product } from '../api/products'

export default function ProductCard({ product }: { product: Product }) {
  const [imageFailed, setImageFailed] = useState(false)
  const name = `${product.brand} ${product.model}`

  return (
    <li className="product-card">
      <Link to={`/product/${encodeURIComponent(product.id)}`} aria-label={name}>
        <div className="product-image">
          {imageFailed || !product.imgUrl.trim() ? (
            <div className="image-fallback" role="img" aria-label={`Imagen no disponible para ${name}`}>
              <svg viewBox="0 0 48 64" width="40" height="54" aria-hidden="true">
                <rect x="4" y="2" width="40" height="60" rx="5" fill="none" stroke="currentColor" strokeWidth="2" />
                <path d="M18 8h12M20 55h8" stroke="currentColor" strokeWidth="2" />
              </svg>
              <span>Imagen no disponible</span>
            </div>
          ) : (
            <img src={product.imgUrl} alt={name} loading="lazy" onError={() => setImageFailed(true)} />
          )}
        </div>
        <p className="product-brand">{product.brand}</p>
        <h2>{product.model}</h2>
        <p className="product-price">{product.price.trim() ? product.price : 'Precio no disponible'}</p>
      </Link>
    </li>
  )
}
