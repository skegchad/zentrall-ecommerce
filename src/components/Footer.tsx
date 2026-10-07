import { Link } from 'react-router-dom'
import { FaYoutube, FaLinkedin, FaFacebook, FaInstagram } from 'react-icons/fa'
import logo from '../assets/zentrall-isotipo.svg'
import './Footer.css'

const columnas = [
  {
    titulo: 'Zentrall',
    enlaces: [
      { nombre: 'Inicio', ruta: '/' },
      { nombre: 'Servicios', ruta: '/servicios' },
      { nombre: 'Planes', ruta: '/planes' },
      { nombre: 'Conócenos', ruta: '/conocenos' },
    ],
  },
  {
    titulo: 'Para clientes',
    enlaces: [
      { nombre: 'Tiendas', ruta: '/tiendas' },
      { nombre: 'Explorar', ruta: '/explorar' },
    ],
  },
  {
    titulo: 'Para empresas',
    enlaces: [
      { nombre: 'Registrarse', ruta: '/login' },
      { nombre: 'Planes y precios', ruta: '/planes' },
    ],
  },
  {
    titulo: 'Protegemos tus datos',
    enlaces: [
      { nombre: 'Protección de datos', ruta: '/' },
      { nombre: 'Política de cookies', ruta: '/' },
      { nombre: 'Términos y condiciones', ruta: '/' },
    ],
  },
]

function Footer() {
  return (
    <footer className="footer">
      {/* Olas decorativas */}
      <div className="footer-olas" aria-hidden="true">
        <svg viewBox="0 0 1440 120" preserveAspectRatio="none">
          <path
            className="ola ola-3"
            d="M0,0 L0,70 C120,100 240,100 360,75 C480,50 600,35 720,60 C840,85 960,105 1080,85 C1200,65 1320,50 1440,70 L1440,0 Z"
          />
          <path
            className="ola ola-2"
            d="M0,0 L0,55 C150,85 300,90 450,65 C600,40 720,30 860,55 C1000,80 1140,90 1290,65 C1350,55 1400,50 1440,55 L1440,0 Z"
          />
          <path
            className="ola ola-1"
            d="M0,0 L0,40 C140,70 280,75 420,55 C560,35 700,25 840,45 C980,65 1120,75 1260,55 C1340,44 1400,38 1440,42 L1440,0 Z"
          />
        </svg>
      </div>

      <div className="footer-contenido">
        <div className="footer-grid">
          <div className="footer-marca">
            <Link to="/" className="footer-logo">
              <img src={logo} alt="Zentrall" />
              <span>Zentrall</span>
            </Link>
            <p>
              Soluciones tecnológicas para mejorar la eficiencia y productividad
              de nuestros clientes.
            </p>
          </div>

          {columnas.map((c) => (
            <div className="footer-columna" key={c.titulo}>
              <h3>{c.titulo}</h3>
              <ul>
                {c.enlaces.map((e) => (
                  <li key={e.nombre}>
                    <Link to={e.ruta}>{e.nombre}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <hr />

        <div className="footer-inferior">
          <p>
            Guayaquil: Escribe aquí tu dirección.
            <br />© {new Date().getFullYear()} Zentrall. Todos los derechos reservados.
          </p>

          <div className="footer-redes">
            <a href="#" aria-label="YouTube"><FaYoutube size={20} /></a>
            <a href="#" aria-label="LinkedIn"><FaLinkedin size={20} /></a>
            <a href="#" aria-label="Facebook"><FaFacebook size={20} /></a>
            <a href="#" aria-label="Instagram"><FaInstagram size={20} /></a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer