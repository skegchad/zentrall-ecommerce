import { useState } from 'react'
import './Tarjetas.css'

import type { Planes } from '../data/Planes'

type Periodo = 'mensual' | 'anual'

function Tarjetas({ items, cuadricula = false }: { items: Planes[]; cuadricula?: boolean }) {
  const [periodo, setPeriodo] = useState<Periodo>('mensual')

  const visibles = items.filter((p) => p.periodo === periodo)

  return (
    <>
      <div className="selector-periodo">
        <button
          className={periodo === 'mensual' ? 'activo' : ''}
          onClick={() => setPeriodo('mensual')}
        >
          Mensual
        </button>
        <button
          className={periodo === 'anual' ? 'activo' : ''}
          onClick={() => setPeriodo('anual')}
        >
          Anual
        </button>
      </div>

      <div className={cuadricula ? 'tarjetas cuadricula' : 'tarjetas'}>
        {visibles.map((p) => (
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
              <span className="precio">
                ${p.precio.toFixed(2)}
                <small className="periodo">/{p.periodo === 'anual' ? 'año' : 'mes'}</small>
              </span>
              <button className="carrito" aria-label="Ver más">Ver más</button>
            </div>
          </article>
        ))}
      </div>
    </>
  )
}

export default Tarjetas