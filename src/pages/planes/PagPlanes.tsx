import { useSearchParams } from 'react-router-dom'
import Tarjetas from '../../components/Tarjetas'
import { planes } from '../../data/Planes'

function Explorar() {
  const [params] = useSearchParams()
  const q = params.get('q')?.toLowerCase() ?? ''
  const categoria = params.get('categoria') ?? ''

  const resultados = planes.filter(
    (p) =>
      p.nombre.toLowerCase().includes(q) &&
      (categoria === '')
  )

  return (
    <section className="seccion">
      <h2>
        {q ? `Resultados para "${q}"` : categoria ? categoria : 'Explorar productos'}
      </h2>
      {resultados.length > 0 ? (
        <Tarjetas items={resultados} cuadricula />
      ) : (
        <p>No encontramos productos con esa búsqueda.</p>
      )}
    </section>
  )
}

export default Explorar