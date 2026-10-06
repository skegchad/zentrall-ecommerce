import { Link, NavLink } from 'react-router-dom'
import { House, Moon, Sun, InfoIcon, ListCheckIcon, HandPlatter } from 'lucide-react'
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

  return (
    <header className="header">
      <div className="header-contenido">
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
  )
}

export default Navbar