import { useMemo, useState } from 'react'
import ServiciosTable from '../components/ServiciosTable'
import { useServicios } from '../components/hooks/useServicios'
import { NavLink } from "react-router-dom";
import './ServiciosPage.css'

function ServiciosPage() {
  const { servicios, eliminar } = useServicios()
  const [categoria, setCategoria] = useState('todas')

  // Las categorías salen de los propios datos
  const categorias = useMemo(
    () => Array.from(new Set(servicios.map((s) => s.categoria))),
    [servicios],
  )

  const visibles = useMemo(
    () => (categoria === 'todas' ? servicios : servicios.filter((s) => s.categoria === categoria)),
    [servicios, categoria],
  )

  return (
    <div className="servicios">
      {/* Decoración de fondo: no es interactiva ni la leen los lectores de pantalla */}
      <div className="servicios__fondo" aria-hidden="true">
        <div className="servicios__luces" />
        <div className="servicios__orbe">
          <div className="servicios__disco" />

          <svg className="servicios__aro servicios__aro--texto" viewBox="0 0 400 400">
            <defs>
              <path
                id="servicios-aro-texto"
                d="M200,200 m-150,0 a150,150 0 1,1 300,0 a150,150 0 1,1 -300,0"
              />
            </defs>
            <text>
              <textPath href="#servicios-aro-texto" textLength="936" lengthAdjust="spacing">
                SERVICIOS • SERVICIOS • SERVICIOS • SERVICIOS •
              </textPath>
            </text>
          </svg>
        </div>
      </div>

      <div className="servicios__encabezado">
        <h1 style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontSize: "30px", fontWeight: "1000", fontStyle: "italic" }}>Servicios</h1>
        <div className="servicios__acciones">
          <NavLink to="/admin/servicios/crear" className="btn btn--primario">
            Nuevo servicio
          </NavLink>
          <button className="btn">Importar servicios</button>
          <button className="btn">Exportar servicios (Excel)</button>
        </div>

        <div className="servicios__lado">
          <p className="servicios__totales">
            Total de servicios: <strong>{servicios.length}</strong>
            <br />
            Categorías: <strong>{categorias.length}</strong>
          </p>
          <select className="servicios__filtro" value={categoria} aria-label="Filtrar por categoría"
            onChange={(e) => setCategoria(e.target.value)}>
            <option value="todas">Todas</option>
            {categorias.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      <ServiciosTable servicios={visibles} onEliminar={(s) => eliminar(s.id)} />
    </div>
  )
}

export default ServiciosPage