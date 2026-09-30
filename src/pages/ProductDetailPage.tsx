import { useParams } from 'react-router'

export default function ProductDetailPage() {
  const { id } = useParams()

  return (
    <section aria-labelledby="detail-title">
      <p className="eyebrow">Vista provisional</p>
      <h1 id="detail-title">Detalle del producto</h1>
      <p>Referencia de la ruta: <strong>{id}</strong></p>
      <p>La información y las opciones del producto estarán disponibles en un hito posterior.</p>
    </section>
  )
}
