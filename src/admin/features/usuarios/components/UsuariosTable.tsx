import { useNavigate } from "react-router-dom"
import type { Usuarios } from "./types/usuarios.types"

interface Props {
  usuarios: Usuarios[]
  onVer?: (usuario: Usuarios) => void
  onEditar?: (usuario: Usuarios) => void
  onEliminar?: (usuario: Usuarios) => void
}

const Icono = ({ d }: { d: string }) => (
  <svg
    viewBox="0 0 24 24"
    width="18"
    height="18"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d={d} />
  </svg>
)

const ICONOS = {
  ver: "M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12zm10 3a3 3 0 100-6 3 3 0 000 6z",
  editar: "M12 20h9M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4z",
  eliminar: "M3 6h18M8 6V4h8v2m-9 0l1 14h8l1-14",
}

function UsuariosTable({ usuarios }: Props) {
  const navigate = useNavigate()

  return (
    <div className="usuarios__tarjeta">
      <div className="usuarios__scroll">
        <table className="usuarios__tabla">
          <thead>
            <tr>
              <th>Usuario</th>
              <th>Plan</th>
              <th>Estado</th>
              <th className="centro">Operación</th>
            </tr>
          </thead>

          <tbody>
            {usuarios.map((u) => (
              <tr key={u.id}>
                <td>
                  <div className="usuario">
                    <span
                      className="usuario__inicial"
                      aria-hidden="true"
                    >
                      {u.nombre[0]}
                    </span>

                    <span>
                      <strong>{u.nombre}</strong>
                      <small>{u.plan}</small>
                    </span>
                  </div>
                </td>

                <td>
                  <span className="usuarios__plan">
                    {u.plan}
                  </span>
                </td>

                <td>
                  <span
                    className={`usuarios__estado ${
                      u.estado === "Activo"
                        ? "usuarios__estado--activo"
                        : "usuarios__estado--inactivo"
                    }`}
                  >
                    {u.estado}
                  </span>
                </td>

                <td>
                  <div className="operaciones">
                    <button
                      aria-label={`Editar ${u.nombre}`}
                      onClick={() =>
                        navigate(`/admin/usuarios/${u.id}/editar`)
                      }
                    >
                      <Icono d={ICONOS.editar} />
                    </button>

                    <button
                      aria-label={`Eliminar ${u.nombre}`}
                      className="peligro"
                      onClick={() =>
                        navigate(`/admin/usuarios/${u.id}/borrar`)
                      }
                    >
                      <Icono d={ICONOS.eliminar} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {usuarios.length === 0 && (
              <tr>
                <td colSpan={4} className="vacio">
                  No hay usuarios en esta categoría.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default UsuariosTable