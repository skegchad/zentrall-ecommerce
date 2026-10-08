import { servicios } from '../../data/Servicios'
import './Servicios.css'

function Servicios() {
  return (
    <section className="servicios">
      <header className="servicios-hero">
        <h2>Servicios</h2>
        <svg className="servicios-ola" viewBox="0 0 160 14" aria-hidden="true">
          <path
            d="M2,7 C12,0 22,0 32,7 C42,14 52,14 62,7 C72,0 82,0 92,7 C102,14 112,14 122,7 C132,0 142,0 158,7"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
      </header>

      <div className="lista-servicios">
        {servicios.map((s) => (
          <article className="servicio" key={s.id}>
            <div className="servicio-icono">{s.nombre.charAt(0)}</div>
            <h3>{s.nombre}</h3>
            <p>{s.descripcion}</p>
            <small>{s.categoria}</small>
          </article>
        ))}
      </div>
    </section>
  )
}

export default Servicios