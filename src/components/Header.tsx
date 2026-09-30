import { Link, useMatch } from 'react-router'

export default function Header() {
  const isDetail = useMatch('/product/:id') !== null

  return (
    <header className="site-header">
      <div className="header-inner">
        <Link className="brand" to="/">Nunegal / ITX</Link>
        <nav className="breadcrumbs" aria-label="Ruta de navegación">
          <ol>
            <li>{isDetail ? <Link to="/">Listado</Link> : <span aria-current="page">Listado</span>}</li>
            {isDetail && <li><span aria-hidden="true">/ </span><span aria-current="page">Detalle del producto</span></li>}
          </ol>
        </nav>
        <p className="cart-count" aria-label="Cesta: 0 productos">Cesta <span>0</span></p>
      </div>
    </header>
  )
}
