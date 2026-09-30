import { Link } from 'react-router'

type Props = { detail?: boolean }

export default function Breadcrumbs({ detail = false }: Props) {
  return (
    <nav className="breadcrumbs" aria-label="Ruta de navegación">
      <ol>
        <li>{detail ? <Link to="/">Listado</Link> : <span aria-current="page">Listado</span>}</li>
        {detail && <li><span aria-current="page">Detalle del producto</span></li>}
      </ol>
    </nav>
  )
}
