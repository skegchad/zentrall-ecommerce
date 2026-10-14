import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import PlanForm, { type PlanFormValores } from '../components/PlanForm'
import { usePlanes } from '../components/hooks/usePlanes'

const RUTA_PLANES = '/admin/planes' // ajusta si tu listado está en otra ruta

function PlanesCreatePage() {
  const navigate = useNavigate()
  const { crear } = usePlanes()

  async function guardar(valores: PlanFormValores) {
    await crear(valores)
    navigate(RUTA_PLANES)
  }

  return (
    <div className="adm-form-pagina">
      <div className="adm-form-pagina__cuerpo">
        <div className="adm-form-pagina__principal">
          <div className="adm-form-pagina__cabecera">
            <Link to={RUTA_PLANES} className="adm-form-pagina__volver">
              <ArrowLeft size={16} aria-hidden="true" /> Volver a planes
            </Link>
            <h1 className="adm-form-pagina__titulo">Nuevo plan</h1>
            <p className="adm-form-pagina__sub">Completa los datos para crear un plan.</p>
          </div>

          <PlanForm
            textoEnviar="Crear plan"
            onEnviar={guardar}
            onCancelar={() => navigate(RUTA_PLANES)}
          />
        </div>

        {/* Banda decorativa: no es interactiva ni la leen los lectores de pantalla */}
        <div className="adm-banda" aria-hidden="true">
          <div className="adm-banda__ventana">
            <div className="adm-banda__pista">
              {/* El mismo bloque dos veces para que el bucle no se corte */}
              {[0, 1].map((i) => (
                <span key={i} className="adm-banda__texto">
                  PLANES • PLANES • PLANES • PLANES • PLANES • PLANES • PLANES • PLANES • PLANES • PLANES •
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PlanesCreatePage