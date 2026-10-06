import './Tarjetas.css'

import type { Planes } from '../data/Planes'


function Tarjetas({ items, cuadricula = false }: { items: Planes[]; cuadricula?: boolean }) {
  return (
    <div className={cuadricula ? 'tarjetas cuadricula' : 'tarjetas'}>
      {items.map((p) => (
        <article className="tarjeta" key={p.id}>

          <h3 className="nombre-plan">{p.nombre}</h3>

          <div className="rating">
            <ul>
              {p.informacion.split('\n').map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="tarjeta-pie">
              <span className="precio">${p.precio.toFixed(2)}</span>
            <button className="carrito" aria-label="Ver más">Ver más</button>
          </div>
        </article>
      ))}
    </div>
  )
}

export default Tarjetas