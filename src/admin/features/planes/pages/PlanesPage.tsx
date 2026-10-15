import { useMemo, useState } from 'react'
import PlanesTable from '../components/PlanesTable'
import { usePlanes } from '../components/hooks/usePlanes'
import './PlanesPage.css'
import { NavLink } from "react-router-dom";

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
      {/* Decoración de fondo: no es interactiva ni la leen los lectores de pantalla */}
      <div className="planes__fondo" aria-hidden="true">
        <div className="planes__luces" />
        <div className="planes__orbe">
          <div className="planes__disco" />

          <svg className="planes__aro planes__aro--texto" viewBox="0 0 400 400">
            <defs>
              <path
                id="planes-aro-texto"
                d="M200,200 m-150,0 a150,150 0 1,1 300,0 a150,150 0 1,1 -300,0"
              />
            </defs>
            <text>
              <textPath href="#planes-aro-texto" textLength="936" lengthAdjust="spacing">
                PLANES • PLANES • PLANES • PLANES • PLANES • PLANES •
              </textPath>
            </text>
          </svg>
        </div>
      </div>

      <div className="planes__encabezado">
        <h1 style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontSize: "30px", fontWeight: "1000", fontStyle: "italic" }}>Planes</h1>
        <div className="planes__acciones">
          <NavLink to="/admin/planes/crear" className="btn btn--primario">
            Nuevo plan
          </NavLink>
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