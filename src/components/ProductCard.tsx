import { forwardRef, useState } from 'react'
import { motion, useIsPresent, useReducedMotion } from 'motion/react'
import { Link } from 'react-router'
import type { Product } from '../api/products'

const ProductCard = forwardRef<HTMLLIElement, { product: Product }>(function ProductCard({ product }, ref) {
  const [imageFailed, setImageFailed] = useState(false)
  const isPresent = useIsPresent()
  const reducedMotion = useReducedMotion()
  const name = `${product.brand} ${product.model}`

  return (
    <motion.li
      ref={ref}
      className="product-card"
      layout={reducedMotion ? false : 'position'}
      initial={reducedMotion ? false : { opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: reducedMotion ? 1 : 0.97 }}
      transition={reducedMotion ? { duration: 0 } : {
        opacity: { duration: 0.18 },
        scale: { duration: 0.18 },
        layout: { type: 'spring', stiffness: 430, damping: 38 },
      }}
      inert={!isPresent}
      aria-hidden={!isPresent || undefined}
    >
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
    </motion.li>
  )
})

export default ProductCard
