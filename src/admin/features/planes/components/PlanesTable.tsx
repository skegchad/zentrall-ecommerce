import type { Plan } from './types/plan.types'

interface Props {
  planes: Plan[]
  onVer?: (plan: Plan) => void
  onEditar?: (plan: Plan) => void
  onEliminar?: (plan: Plan) => void
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

const formatoPrecio = (n: number) =>
  n === 0
    ? 'Gratis'
    : new Intl.NumberFormat('es-EC', { style: 'currency', currency: 'USD' }).format(n)

// "informacion" trae saltos de línea: la primera línea es la descripción corta
const resumen = (informacion: string) => informacion.split('\n')[0]

function PlanesTable({ planes, onVer, onEditar, onEliminar }: Props) {
  return (
    <div className="planes__tarjeta">
      <div className="planes__scroll">
        <table className="planes__tabla">
          <thead>
            <tr>
              <th>Plan</th>
              <th>Precio</th>
              <th>Periodo</th>
              <th className="centro">Operación</th>
            </tr>
          </thead>
          <tbody>
            {planes.map((p) => (
              <tr key={p.id}>
                <td>
                  <div className="plan">
                    <span className="plan__inicial" aria-hidden="true">{p.nombre[0]}</span>
                    <span>
                      <strong>{p.nombre}</strong>
                      <small>{resumen(p.informacion)}</small>
                    </span>
                  </div>
                </td>
                <td>{formatoPrecio(p.precio)}</td>
                <td className="periodo">{p.periodo}</td>
                <td>
                  <div className="operaciones">
                    <button aria-label={`Ver ${p.nombre} ${p.periodo}`} onClick={() => onVer?.(p)}>
                      <Icono d={ICONOS.ver} />
                    </button>
                    <button aria-label={`Editar ${p.nombre} ${p.periodo}`} onClick={() => onEditar?.(p)}>
                      <Icono d={ICONOS.editar} />
                    </button>
                    <button aria-label={`Eliminar ${p.nombre} ${p.periodo}`} className="peligro" onClick={() => onEliminar?.(p)}>
                      <Icono d={ICONOS.eliminar} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {planes.length === 0 && (
              <tr>
                <td colSpan={4} className="vacio">
                  No hay planes con ese filtro. Crea uno nuevo para empezar.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default PlanesTable