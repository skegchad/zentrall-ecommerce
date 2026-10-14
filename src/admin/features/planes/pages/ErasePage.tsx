import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import PlanForm, { type PlanFormValores } from '../components/PlanForm'
import { usePlanes } from '../components/hooks/usePlanes'
import type { Plan } from '../components/types/plan.types'
import FormPagina from '../../../shared/FormPagina'
import { useRegistro } from '../../../shared/useRegistro'

const RUTA_PLANES = '/admin/planes'

function aValores({ nombre, informacion, precio, periodo }: Plan): PlanFormValores {
  return { nombre, informacion, precio, periodo }
}

function PlanesErasePage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { obtener, eliminar } = usePlanes()
  const registro = useRegistro<Plan>(id, (rid) => obtener(Number(rid)))
  const [error, setError] = useState<string | null>(null)

  async function borrar() {
    if (registro.estado !== 'listo') return
    setError(null)
    try {
      await eliminar(registro.dato.id)
      navigate(RUTA_PLANES)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo borrar este plan.')
    }
  }

  return (
    <FormPagina
      volverA={RUTA_PLANES}
      textoVolver="Volver a planes"
      titulo="Borrar plan"
      subtitulo="Procede con cuidado."
      textoBanda="BORRAR • PLAN"
      variante="borrar"
    >
      {registro.estado === 'cargando' && (
        <p className="adm-form-pagina__estado">Cargando plan…</p>
      )}

      {registro.estado === 'noExiste' && (
        <p className="adm-form-pagina__estado adm-form-pagina__estado--error">
          No encontramos este plan. <Link to={RUTA_PLANES}>Volver al listado</Link>
        </p>
      )}

      {registro.estado === 'error' && (
        <p role="alert" className="adm-form-pagina__estado adm-form-pagina__estado--error">
          {registro.mensaje}
        </p>
      )}

      {registro.estado === 'listo' && (
        <>
          {error && (
            <p role="alert" className="adm-form-pagina__estado adm-form-pagina__estado--error">
              {error}
            </p>
          )}
          <PlanForm
            key={registro.dato.id}
            valoresIniciales={aValores(registro.dato)}
            deshabilitado
            textoEnviar="Borrar plan"
            variante="borrar"
            onEnviar={borrar}
            onCancelar={() => navigate(RUTA_PLANES)}
          />
        </>
      )}
    </FormPagina>
  )
}

export default PlanesErasePage