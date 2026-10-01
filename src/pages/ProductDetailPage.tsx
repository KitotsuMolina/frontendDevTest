import { useState } from 'react'
import type { ProductDetail, ProductOption } from '../api/productDetail'
import type { DetailState } from '../hooks/useProductDetail'

function display(value: string | string[] | null | undefined) {
  if (Array.isArray(value)) return value.filter(item => item.trim()).join(', ') || 'No disponible'
  return value?.trim() && value.trim() !== '-' ? value : 'No disponible'
}
function OptionSelector({ label, options, value, onChange }: {
  label: string; options: ProductOption[]; value: string; onChange: (value: string) => void
}) {
  const id = label === 'Color' ? 'product-color' : 'product-storage'
  return (
    <div className="detail-option">
      <label htmlFor={id}>{label}</label>
      <select id={id} value={value} onChange={event => onChange(event.target.value)} disabled={options.length === 0}>
        {options.length !== 1 && <option value="">{options.length ? `Selecciona ${label.toLowerCase()}` : 'No disponible'}</option>}
        {options.map(option => <option key={option.code} value={String(option.code)}>{option.name}</option>)}
      </select>
    </div>
  )
}
function DetailContent({ product }: { product: ProductDetail }) {
  const [imageFailed, setImageFailed] = useState(false)
  const [color, setColor] = useState(() => product.options.colors.length === 1 ? String(product.options.colors[0].code) : '')
  const [storage, setStorage] = useState(() => product.options.storages.length === 1 ? String(product.options.storages[0].code) : '')
  const name = `${product.brand} ${product.model}`
  const attributes = [
    ['CPU', product.cpu], ['RAM', product.ram], ['Sistema operativo', product.os],
    ['Resolución de pantalla', product.displaySize], ['Pantalla', product.displayResolution],
    ['Batería', product.battery], ['Cámara principal', product.primaryCamera],
    ['Cámara frontal', product.secondaryCmera], ['Dimensiones', product.dimentions], ['Peso', product.weight],
  ] as const
  return (
    <div className="detail-layout detail-enter">
      <div className="detail-image">
        {imageFailed || !product.imgUrl.trim() ? <div className="image-fallback" role="img" aria-label={`Imagen no disponible para ${name}`}>Imagen no disponible</div> :
          <img src={product.imgUrl} alt={name} onError={() => setImageFailed(true)} />}
      </div>
      <div className="detail-description">
        <p className="eyebrow">{product.brand}</p>
        <h1 id="detail-title">{product.model}</h1>
        <p className="detail-price">{product.price.trim() ? product.price : 'Precio no disponible'}</p>
        <dl className="detail-attributes">
          {attributes.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{display(value)}</dd></div>)}
        </dl>
        <fieldset className="detail-options">
          <legend>Opciones del producto</legend>
          <OptionSelector label="Color" options={product.options.colors} value={color} onChange={setColor} />
          <OptionSelector label="Almacenamiento" options={product.options.storages} value={storage} onChange={setStorage} />
        </fieldset>
        <button className="add-button" type="button" disabled aria-describedby="cart-pending">Añadir</button>
        <p id="cart-pending" className="integration-note">Añadir a la cesta: pendiente de integración.</p>
      </div>
    </div>
  )
}
export default function ProductDetailPage({ state, retry }: { state: DetailState; retry: () => void }) {
  return (
    <section aria-label="Detalle del producto">
      {state.status === 'loading' && <div className="detail-layout" role="status" aria-label="Cargando producto" aria-busy="true">
        <span className="sr-only">Cargando producto…</span>
        <div className="skeleton detail-image-skeleton" aria-hidden="true" />
        <div className="detail-skeleton-text" aria-hidden="true">{Array.from({ length: 9 }, (_, index) => <div className="skeleton" key={index} />)}</div>
      </div>}
      {state.status === 'not-found' && <div className="catalog-message"><h1>Producto no encontrado</h1><p>Este producto no existe. Puedes volver al listado desde la cabecera.</p></div>}
      {state.status === 'error' && <div className="catalog-message"><p role="alert">No se pudo cargar el producto. Inténtalo de nuevo.</p><button className="retry-button" type="button" onClick={retry}>Reintentar</button></div>}
      {state.status === 'success' && <DetailContent key={state.product.id} product={state.product} />}
    </section>
  )
}
