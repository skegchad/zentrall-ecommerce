import { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { House, Moon, Sun, InfoIcon, ListCheckIcon, HandPlatter, Menu, X } from 'lucide-react'
import logo from '../assets/zentrall-isotipo.svg'
import { useTema } from '../hooks/useTema'
import './Navbar.css'

const enlaces = [
  { nombre: 'Inicio', ruta: '/', icono: House },
  { nombre: 'Servicios', ruta: '/servicios', icono: HandPlatter },
  { nombre: 'Planes', ruta: '/planes', icono: ListCheckIcon },
  { nombre: 'Conocenos', ruta: '/conocenos', icono: InfoIcon },
]

function Navbar() {
  const { tema, alternar } = useTema()
  const [abierto, setAbierto] = useState(false)

  const cerrar = () => setAbierto(false)

  useEffect(() => {
    document.body.style.overflow = abierto ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [abierto])

  return (
    <>
      <header className="header">
        <div className="header-contenido">
          <button
            className="boton-menu"
            onClick={() => setAbierto(true)}
            aria-label="Abrir menú"
          >
            <Menu size={22} />
          </button>

          <Link to="/" className="logo">
            <img src={logo} alt="Logo" />
            <span>Zentrall</span>
          </Link>

          <nav className="menu">
            <ul>
              {enlaces.map(({ nombre, ruta, icono: Icono }) => (
                <li key={ruta}>
                  <NavLink to={ruta} end={ruta === '/'}>
                    <Icono size={16} />
                    {nombre}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="acciones">
            <button
              className="boton-tema"
              onClick={alternar}
              aria-label="Cambiar entre modo claro y oscuro"
            >
              {tema === 'dark' ? <Moon size={18} /> : <Sun size={18} />}
            </button>
            <Link to="/login" className="boton-entrar">Registrarse</Link>
          </div>
        </div>
      </header>

      <div className={`overlay ${abierto ? 'visible' : ''}`} onClick={cerrar} />

      <aside className={`sidebar ${abierto ? 'abierta' : ''}`}>
        <div className="sidebar-cabecera">
          <Link to="/" className="logo" onClick={cerrar}>
            <img src={logo} alt="Logo" />
            <span>Zentrall</span>
          </Link>
          <button className="boton-cerrar" onClick={cerrar} aria-label="Cerrar menú">
            <X size={22} />
          </button>
        </div>

        <ul>
          {enlaces.map(({ nombre, ruta, icono: Icono }) => (
            <li key={ruta}>
              <NavLink to={ruta} end={ruta === '/'} onClick={cerrar}>
                <Icono size={18} />
                {nombre}
              </NavLink>
            </li>
          ))}
        </ul>

        <Link to="/login" className="boton-entrar sidebar-entrar" onClick={cerrar}>
          Registrarse
        </Link>
      </aside>
    </>
  )
}

export default Navbar