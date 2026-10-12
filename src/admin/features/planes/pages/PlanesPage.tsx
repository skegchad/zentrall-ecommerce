import { useMemo, useState } from 'react'
import PlanesTable from '../components/PlanesTable'
import { usePlanes } from '../components/hooks/usePlanes'
import './PlanesPage.css'

type Filtro = 'todos' | 'mensual' | 'anual'

function PlanesPage() {
  const { planes, eliminar } = usePlanes()
  const [filtro, setFiltro] = useState<Filtro>('todos')

  const visibles = useMemo(
    () => (filtro === 'todos' ? planes : planes.filter((p) => p.periodo === filtro)),
    [planes, filtro],
  )
  const mensuales = planes.filter((p) => p.periodo === 'mensual').length
  const anuales = planes.length - mensuales

  return (
    <div className="planes">
      <div className="planes__encabezado">
        <h1>Planes</h1>
        <div className="planes__acciones">
          <button className="btn btn--primario">Nuevo plan</button>
          <button className="btn">Importar planes</button>
          <button className="btn">Exportar planes (Excel)</button>
        </div>

        <div className="planes__lado">
          <p className="planes__totales">
            Total de planes: <strong>{planes.length}</strong>
            <br />
            Mensuales: <strong>{mensuales}</strong> &nbsp; Anuales: <strong>{anuales}</strong>
          </p>
          <select className="planes__filtro" value={filtro} aria-label="Filtrar por periodo"
            onChange={(e) => setFiltro(e.target.value as Filtro)}>
            <option value="todos">Todos</option>
            <option value="mensual">Mensuales</option>
            <option value="anual">Anuales</option>
          </select>
        </div>
      </div>

      <PlanesTable planes={visibles} onEliminar={(p) => eliminar(p.id)} />
    </div>
  )
}

export default PlanesPage