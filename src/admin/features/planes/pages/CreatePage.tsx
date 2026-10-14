import { useNavigate } from 'react-router-dom'
import PlanForm, { type PlanFormValores } from '../components/PlanForm'
import { usePlanes } from '../components/hooks/usePlanes'
import FormPagina from '../../../shared/FormPagina'

const RUTA_PLANES = '/admin/planes'

function PlanesCreatePage() {
  const navigate = useNavigate()
  const { crear } = usePlanes()

  async function guardar(valores: PlanFormValores) {
    await crear(valores)
    navigate(RUTA_PLANES)
  }

  return (
    <FormPagina
      volverA={RUTA_PLANES}
      textoVolver="Volver a planes"
      titulo="Nuevo plan"
      subtitulo="Completa los datos para crear un plan."
      textoBanda="CREAR • PLAN"
      variante="crear"
    >
      <PlanForm
        textoEnviar="Crear plan"
        variante="crear"
        onEnviar={guardar}
        onCancelar={() => navigate(RUTA_PLANES)}
      />
    </FormPagina>
  )
}

export default PlanesCreatePage