import { servicios } from '../../data/Servicios'
import './Servicios.css'

function Servicios() {
  return (
    <section className="seccion">
      <h2>Servicios</h2>
      <div className="lista-servicios">
        {servicios.map((s) => (
          <article className="servicio" key={s.id}>
            <div className="servicio-avatar">{s.nombre[0]}</div>
            <div>
              <h3>
                {s.nombre} {s.verificada && <span title="Verificada">✅</span>}
              </h3>
              <p>{s.descripcion}</p>
              <small>{s.categoria} · {s.sector}</small>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default Servicios