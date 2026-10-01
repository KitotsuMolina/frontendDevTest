import { Link } from 'react-router'

type Props = { detail?: boolean; productName?: string }

export default function Breadcrumbs({ detail = false, productName }: Props) {
  return (
    <nav className="breadcrumbs" aria-label="Ruta de navegación">
      <ol>
        <li>{detail ? <Link to="/">Listado</Link> : <span aria-current="page">Listado</span>}</li>
        {detail && <li><span aria-current="page">{productName || 'Detalle del producto'}</span></li>}
      </ol>
    </nav>
  )
}
