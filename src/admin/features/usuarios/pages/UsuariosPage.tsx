import { useMemo, useState } from "react"
import UsuariosTable from "../components/UsuariosTable"
import { useUsuarios } from "../components/hooks/useUsuarios"
import { NavLink } from "react-router-dom"
import "./UsuariosPage.css"

function UsuariosPage() {
  const { usuarios, eliminar } = useUsuarios()
  const [estado, setEstado] = useState("todos")

  const estados = useMemo(
    () => Array.from(new Set(usuarios.map((u) => u.estado))),
    [usuarios],
  )

  const visibles = useMemo(
    () =>
      estado === "todos"
        ? usuarios
        : usuarios.filter((u) => u.estado === estado),
    [usuarios, estado],
  )

  const activos = usuarios.filter(
    (u) => u.estado === "Activo",
  ).length

  return (
    <div className="usuarios">
      {/* Fondo decorativo */}
      <div className="usuarios__fondo" aria-hidden="true">
        <div className="usuarios__luces" />

        <div className="usuarios__orbe">
          <div className="usuarios__disco" />

          <svg
            className="usuarios__aro usuarios__aro--texto"
            viewBox="0 0 400 400"
          >
            <defs>
              <path
                id="usuarios-aro-texto"
                d="M200,200 m-150,0 a150,150 0 1,1 300,0 a150,150 0 1,1 -300,0"
              />
            </defs>

            <text>
              <textPath
                href="#usuarios-aro-texto"
                textLength="936"
                lengthAdjust="spacing"
              >
                USUARIOS • USUARIOS • USUARIOS • USUARIOS •
              </textPath>
            </text>
          </svg>
        </div>
      </div>

      <div className="usuarios__encabezado">
        <h1
          style={{
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontSize: "30px",
            fontWeight: 1000,
            fontStyle: "italic",
          }}
        >
          Usuarios
        </h1>

        <div className="usuarios__acciones">
          <NavLink
            to="/admin/usuarios/crear"
            className="btn btn--primario"
          >
            Nuevo usuario
          </NavLink>

          <button className="btn">
            Importar usuarios
          </button>

          <button className="btn">
            Exportar usuarios (Excel)
          </button>
        </div>

        <div className="usuarios__lado">
          <p className="usuarios__totales">
            Total de usuarios: <strong>{usuarios.length}</strong>
            <br />
            Usuarios activos: <strong>{activos}</strong>
          </p>

          <select
            className="usuarios__filtro"
            value={estado}
            aria-label="Filtrar por estado"
            onChange={(e) => setEstado(e.target.value)}
          >
            <option value="todos">Todos los estados</option>

            {estados.map((e) => (
              <option key={e} value={e}>
                {e}
              </option>
            ))}
          </select>
        </div>
      </div>

      <UsuariosTable
        usuarios={visibles}
        onEliminar={(u) => eliminar(u.id)}
      />
    </div>
  )
}

export default UsuariosPage