import { tiendas } from '../../data/tiendas'
import './Tiendas.css'

function Tiendas() {
  return (
    <section className="seccion">
      <h2>Tiendas registradas</h2>
      <div className="lista-tiendas">
        {tiendas.map((t) => (
          <article className="tienda" key={t.id}>
            <div className="tienda-avatar">{t.nombre[0]}</div>
            <div>
              <h3>
                {t.nombre} {t.verificada && <span title="Verificada">✅</span>}
              </h3>
              <p>{t.descripcion}</p>
              <small>{t.categoria} · {t.sector}</small>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default Tiendas