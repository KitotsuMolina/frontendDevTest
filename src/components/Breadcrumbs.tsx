import { Link, useMatch } from 'react-router'

export default function Breadcrumbs() {
  const isDetail = useMatch('/product/:id') !== null

  return (
    <nav className="breadcrumbs" aria-label="Ruta de navegación">
      <ol>
        <li>{isDetail ? <Link to="/">Listado</Link> : <span aria-current="page">Listado</span>}</li>
        {isDetail && <li><span aria-hidden="true">/ </span><span aria-current="page">Detalle del producto</span></li>}
      </ol>
    </nav>
  )
}
