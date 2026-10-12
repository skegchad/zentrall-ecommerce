import { useMemo, useState } from 'react'
import ServiciosTable from '../components/ServiciosTable'
import { useServicios } from '../components/hooks/useServicios'
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
      <div className="servicios__encabezado">
        <h1>Servicios</h1>
        <div className="servicios__acciones">
          <button className="btn btn--primario">Nuevo servicio</button>
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