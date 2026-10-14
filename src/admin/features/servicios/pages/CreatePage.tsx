import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import ServiciosForm, { type ServicioFormValores } from '../components/ServiciosForm'
import { useServicios } from '../components/hooks/useServicios'
import FormPagina from '../../../shared/FormPagina'

const RUTA_SERVICIOS = '/admin/servicios'

function ServiciosCreatePage() {
  const navigate = useNavigate()
  const { servicios, crear } = useServicios()

  const categorias = useMemo(
    () => Array.from(new Set(servicios.map((s) => s.categoria))),
    [servicios],
  )

  async function guardar(valores: ServicioFormValores) {
    await crear(valores)
    navigate(RUTA_SERVICIOS)
  }

  return (
    <FormPagina
      volverA={RUTA_SERVICIOS}
      textoVolver="Volver a servicios"
      titulo="Nuevo servicio"
      subtitulo="Completa los datos para crear un servicio."
      textoBanda="CREAR • SERVICIOS"
      variante="crear"
    >
      <ServiciosForm
        categorias={categorias}
        textoEnviar="Crear servicio"
        variante="crear"
        onEnviar={guardar}
        onCancelar={() => navigate(RUTA_SERVICIOS)}
      />
    </FormPagina>
  )
}

export default ServiciosCreatePage