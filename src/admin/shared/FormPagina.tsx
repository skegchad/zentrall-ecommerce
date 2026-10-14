import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

type Props = {
  volverA: string
  textoVolver: string
  titulo: string
  subtitulo?: string
  textoBanda: string
  variante?: 'crear' | 'editar' | 'borrar'
  children: ReactNode
}

export default function FormPagina({
  volverA,
  textoVolver,
  titulo,
  subtitulo,
  textoBanda,
  variante = 'crear',
  children,
}: Props) {
  const texto = `${Array.from({ length: 10 }, () => textoBanda).join(' • ')} •`

  return (
    <div className="adm-form-pagina">
      <div className="adm-form-pagina__cuerpo">
        <div className="adm-form-pagina__principal">
          <div className="adm-form-pagina__cabecera">
            <Link to={volverA} className="adm-form-pagina__volver">
              <ArrowLeft size={16} aria-hidden="true" /> {textoVolver}
            </Link>

            <h1 className="adm-form-pagina__titulo">{titulo}</h1>

            {subtitulo && (
              <p className="adm-form-pagina__sub">{subtitulo}</p>
            )}
          </div>

          {children}
        </div>

        <div
          className={`adm-banda adm-banda--${variante}`}
          aria-hidden="true"
        >
          <div className="adm-banda__ventana">
            <div className="adm-banda__pista">
              {[0, 1].map((i) => (
                <span key={i} className="adm-banda__texto">
                  {texto}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}