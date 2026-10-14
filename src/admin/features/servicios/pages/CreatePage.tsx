import { useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import ServiciosForm, { type ServicioFormValores } from '../components/ServiciosForm'
import { useServicios } from '../components/hooks/useServicios'

const RUTA_SERVICIOS = '/admin/servicios' // ajusta si tu listado está en otra ruta

function ServiciosCreatePage() {
  const navigate = useNavigate()
  const { servicios, crear } = useServicios()

  // Las categorías existentes se ofrecen como sugerencia en el formulario
  const categorias = useMemo(
    () => Array.from(new Set(servicios.map((s) => s.categoria))),
    [servicios],
  )

  async function guardar(valores: ServicioFormValores) {
    await crear(valores)
    navigate(RUTA_SERVICIOS)
  }

  return (
    <div className="adm-form-pagina">
      <div className="adm-form-pagina__cuerpo">
        <div className="adm-form-pagina__principal">
          <div className="adm-form-pagina__cabecera">
            <Link to={RUTA_SERVICIOS} className="adm-form-pagina__volver">
              <ArrowLeft size={16} aria-hidden="true" /> Volver a servicios
            </Link>
            <h1 className="adm-form-pagina__titulo">Nuevo servicio</h1>
            <p className="adm-form-pagina__sub">Completa los datos para crear un servicio.</p>
          </div>

          <ServiciosForm
            categorias={categorias}
            textoEnviar="Crear servicio"
            onEnviar={guardar}
            onCancelar={() => navigate(RUTA_SERVICIOS)}
          />
        </div>

        {/* Banda decorativa: no es interactiva ni la leen los lectores de pantalla */}
        <div className="adm-banda" aria-hidden="true">
          <div className="adm-banda__ventana">
            <div className="adm-banda__pista">
              {/* El mismo bloque dos veces para que el bucle no se corte */}
              {[0, 1].map((i) => (
                <span key={i} className="adm-banda__texto">
                  SERVICIOS • SERVICIOS • SERVICIOS • SERVICIOS • SERVICIOS • SERVICIOS • SERVICIOS • SERVICIOS • SERVICIOS • SERVICIOS •
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ServiciosCreatePage