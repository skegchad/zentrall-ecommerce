import { useNavigate } from 'react-router-dom'
import type { Servicio } from './types/servicios.types'

interface Props {
  servicios: Servicio[]
  onVer?: (servicio: Servicio) => void
  onEditar?: (servicio: Servicio) => void
  onEliminar?: (servicio: Servicio) => void
}

const Icono = ({ d }: { d: string }) => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor"
    strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d={d} />
  </svg>
)

const ICONOS = {
  ver: 'M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12zm10 3a3 3 0 100-6 3 3 0 000 6z',
  editar: 'M12 20h9M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4z',
  eliminar: 'M3 6h18M8 6V4h8v2m-9 0l1 14h8l1-14',
}

function ServiciosTable({ servicios}: Props) {
  const navigate = useNavigate() // <-- aquí, dentro del componente
  return (
    <div className="servicios__tarjeta">
      <div className="servicios__scroll">
        <table className="servicios__tabla">
          <thead>
            <tr>
              <th>Servicio</th>
              <th>Categoría</th>
              <th className="centro">Operación</th>
            </tr>
          </thead>
          <tbody>
            {servicios.map((s) => (
              <tr key={s.id}>
                <td>
                  <div className="servicio">
                    <span className="servicio__inicial" aria-hidden="true">{s.nombre[0]}</span>
                    <span>
                      <strong>{s.nombre}</strong>
                      <small>{s.descripcion}</small>
                    </span>
                  </div>
                </td>
                <td>
                  <span className="servicios__categoria">{s.categoria}</span>
                </td>
                <td>
                  <div className="operaciones">
                    <button aria-label={`Editar ${s.nombre}`} onClick={() => navigate(`/admin/servicios/${s.id}/editar`)}>
                      <Icono d={ICONOS.editar} />
                    </button>
                    <button aria-label={`Eliminar ${s.nombre}`} className="peligro" onClick={() => navigate(`/admin/servicios/${s.id}/borrar`)}>
                      <Icono d={ICONOS.eliminar} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {servicios.length === 0 && (
              <tr>
                <td colSpan={3} className="vacio">
                  No hay servicios en esa categoría. Crea uno nuevo para empezar.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ServiciosTable