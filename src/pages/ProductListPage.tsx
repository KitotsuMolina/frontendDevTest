import { Link } from 'react-router'

export default function ProductListPage() {
  return (
    <section aria-labelledby="list-title">
      <p className="eyebrow">Vista provisional</p>
      <h1 id="list-title">Listado de productos</h1>
      <p>El catálogo y la búsqueda estarán disponibles en el siguiente hito.</p>
      <Link className="page-link" to="/product/demo">Abrir detalle provisional</Link>
    </section>
  )
}
