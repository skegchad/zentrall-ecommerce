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

function PlanesEditPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { obtener, actualizar } = usePlanes()
  const registro = useRegistro<Plan>(id, (rid) => obtener(Number(rid)))
  const [error, setError] = useState<string | null>(null)

  async function guardar(valores: PlanFormValores) {
    if (registro.estado !== 'listo') return
    setError(null)
    try {
      await actualizar(registro.dato.id, valores)
      navigate(RUTA_PLANES)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo guardar los cambios.')
    }
  }

  return (
    <FormPagina
      volverA={RUTA_PLANES}
      textoVolver="Volver a planes"
      titulo="Editar plan"
      subtitulo="Edita los datos de este plan."
      textoBanda="EDITAR • PLAN"
      variante="editar"
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
            textoEnviar="Guardar cambios"
            variante="editar"
            onEnviar={guardar}
            onCancelar={() => navigate(RUTA_PLANES)}
          />
        </>
      )}
    </FormPagina>
  )
}

export default PlanesEditPage