import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import ServiciosForm, { type ServicioFormValores } from '../components/ServiciosForm'
import { useServicios } from '../components/hooks/useServicios'
import type { Servicio } from '../components/types/servicios.types'
import FormPagina from '../../../shared/FormPagina'
import { useRegistro } from '../../../shared/useRegistro'

const RUTA_SERVICIOS = '/admin/servicios'

function aValores({ nombre, categoria, descripcion }: Servicio): ServicioFormValores {
  return { nombre, categoria, descripcion }
}

function ServiciosErasePage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { obtener, eliminar } = useServicios()
  const registro = useRegistro<Servicio>(id, (rid) => obtener(Number(rid)))
  const [error, setError] = useState<string | null>(null)

  async function borrar() {
    if (registro.estado !== 'listo') return
    setError(null)
    try {
      await eliminar(registro.dato.id)
      navigate(RUTA_SERVICIOS)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo borrar este servicio.')
    }
  }

  return (
    <FormPagina
      volverA={RUTA_SERVICIOS}
      textoVolver="Volver a servicios"
      titulo="Borrar servicio"
      subtitulo="Procede con cuidado."
      textoBanda="BORRAR • SERVICIOS"
      variante="borrar"
    >
      {registro.estado === 'cargando' && (
        <p className="adm-form-pagina__estado">Cargando servicio…</p>
      )}

      {registro.estado === 'noExiste' && (
        <p className="adm-form-pagina__estado adm-form-pagina__estado--error">
          No encontramos este servicio. <Link to={RUTA_SERVICIOS}>Volver al listado</Link>
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
          <ServiciosForm
            key={registro.dato.id}
            valoresIniciales={aValores(registro.dato)}
            deshabilitado
            textoEnviar="Borrar servicio"
            variante="borrar"
            onEnviar={borrar}
            onCancelar={() => navigate(RUTA_SERVICIOS)}
          />
        </>
      )}
    </FormPagina>
  )
}

export default ServiciosErasePage