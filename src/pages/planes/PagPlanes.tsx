import { useSearchParams } from 'react-router-dom'
import Tarjetas from '../../components/Tarjetas'
import { planes } from '../../data/Planes'
import './PagPlanes.css'

function Planes() {
  const [params] = useSearchParams()
  const q = params.get('q')?.toLowerCase() ?? ''
  const categoria = params.get('categoria') ?? ''

  const resultados = planes.filter(
    (p) =>
      p.nombre.toLowerCase().includes(q) &&
      (categoria === '') // cámbialo por: categoria === '' || p.categoria === categoria
  )

  return (
    <section className="planes">
      <header className="planes-hero">
        <h2>{q ? `Resultados para "${q}"` : categoria || 'Nuestros planes'}</h2>
        <svg className="planes-ola" viewBox="0 0 160 14" aria-hidden="true">
          <path
            d="M2,7 C12,0 22,0 32,7 C42,14 52,14 62,7 C72,0 82,0 92,7 C102,14 112,14 122,7 C132,0 142,0 158,7"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
        <p>Elige el plan que mejor se adapte a tu negocio.</p>
      </header>

      {resultados.length > 0 ? (
        <Tarjetas items={resultados} cuadricula />
      ) : (
        <p className="planes-vacio">No encontramos planes con esa búsqueda.</p>
      )}
    </section>
  )
}

export default Planes