import { useState } from 'react'
import { Link } from 'react-router'
import logoBackground from '../assets/kitotsu-logo-background.png'

export default function Header() {
  const [isPeeled, setIsPeeled] = useState(false)

  return (
    <header className="site-header" data-peeled={isPeeled}>
      <div className="peel-art" aria-hidden="true">
        <img src={logoBackground} alt="" />
      </div>
      <div className="header-paper" aria-hidden="true" />
      <div className="paper-curl" aria-hidden="true" />
      <button
        className="peel-trigger"
        type="button"
        aria-label="Descubrir el logo oculto"
        aria-pressed={isPeeled}
        onClick={() => setIsPeeled(!isPeeled)}
      />
      <div className="header-inner">
        <Link className="brand" to="/">Nunegal / ITX</Link>
        <p className="cart-count" aria-label="Cesta: 0 productos">Cesta <span>0</span></p>
      </div>
    </header>
  )
}
