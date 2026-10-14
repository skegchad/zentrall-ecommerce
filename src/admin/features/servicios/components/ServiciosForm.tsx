import { useId, useRef, useState, type FormEvent } from 'react'
import { Store, Layers } from 'lucide-react'
import '../../../shared/AdminForm.css'

/* Misma forma que tu tipo Servicio, sin el id */
export interface ServicioFormValores {
  nombre: string
  categoria: string
  descripcion: string
}

interface Props {
  /** Para editar: pasa los valores actuales del servicio. Para crear, no pases nada. */
  valoresIniciales?: Partial<ServicioFormValores>
  /** Categorías ya existentes, se ofrecen como sugerencia al escribir. */
  categorias?: string[]
  textoEnviar?: string
  onEnviar: (valores: ServicioFormValores) => void | Promise<void>
  onCancelar: () => void
}

const MAX_DESCRIPCION = 120

export default function ServiciosForm({
  valoresIniciales,
  categorias = [],
  textoEnviar = 'Guardar servicio',
  onEnviar,
  onCancelar,
}: Props) {
  const id = useId()

  const [nombre, setNombre] = useState(valoresIniciales?.nombre ?? '')
  const [categoria, setCategoria] = useState(valoresIniciales?.categoria ?? '')
  const [descripcion, setDescripcion] = useState(valoresIniciales?.descripcion ?? '')

  const [tocados, setTocados] = useState<{ nombre?: boolean; categoria?: boolean }>({})
  const [intentado, setIntentado] = useState(false)
  const [enviando, setEnviando] = useState(false)
  const [errorEnvio, setErrorEnvio] = useState('')

  const nombreRef = useRef<HTMLInputElement>(null)
  const categoriaRef = useRef<HTMLInputElement>(null)

  /* ---------- Validación ---------- */
  const errores = {
    nombre: nombre.trim().length < 2 ? 'Escribe un nombre de al menos 2 caracteres.' : '',
    categoria: categoria.trim().length < 2 ? 'Indica una categoría (mínimo 2 caracteres).' : '',
  }
  const ver = (campo: 'nombre' | 'categoria') =>
    intentado || tocados[campo] ? errores[campo] : ''

  /* ---------- Envío ---------- */
  async function manejarEnvio(e: FormEvent) {
    e.preventDefault()
    setIntentado(true)

    if (errores.nombre) return nombreRef.current?.focus()
    if (errores.categoria) return categoriaRef.current?.focus()

    setEnviando(true)
    setErrorEnvio('')
    try {
      await onEnviar({
        nombre: nombre.trim(),
        categoria: categoria.trim(),
        descripcion: descripcion.trim(),
      })
    } catch {
      setErrorEnvio('No se pudo guardar el servicio. Inténtalo de nuevo.')
    } finally {
      setEnviando(false)
    }
  }

  const errNombre = ver('nombre')
  const errCategoria = ver('categoria')

  return (
    <form className="adm-form" onSubmit={manejarEnvio} noValidate>
      <div className="adm-form__rejilla">
        {/* ---- General ---- */}
        <section className="adm-form__bloque">
          <h2 className="adm-form__titulo">General</h2>
          <label className="adm-form__etiqueta" htmlFor={`${id}-nombre`}>
            Nombre del servicio <span aria-hidden="true">*</span>
          </label>
          <div className={'adm-form__control' + (errNombre ? ' adm-form__control--error' : '')}>
            <Store size={18} aria-hidden="true" />
            <input
              ref={nombreRef}
              id={`${id}-nombre`}
              type="text"
              value={nombre}
              placeholder="p. ej. TechGye"
              maxLength={50}
              autoComplete="off"
              aria-required="true"
              aria-invalid={!!errNombre}
              aria-describedby={errNombre ? `${id}-nombre-error` : undefined}
              onChange={(e) => setNombre(e.target.value)}
              onBlur={() => setTocados((t) => ({ ...t, nombre: true }))}
            />
          </div>
          {errNombre && (
            <p className="adm-form__error" id={`${id}-nombre-error`} role="alert">
              {errNombre}
            </p>
          )}
        </section>

        {/* ---- Categoría ---- */}
        <section className="adm-form__bloque">
          <h2 className="adm-form__titulo">Categoría</h2>
          <label className="adm-form__etiqueta" htmlFor={`${id}-categoria`}>
            Categoría <span aria-hidden="true">*</span>
          </label>
          <div className={'adm-form__control' + (errCategoria ? ' adm-form__control--error' : '')}>
            <Layers size={18} aria-hidden="true" />
            <input
              ref={categoriaRef}
              id={`${id}-categoria`}
              type="text"
              list={`${id}-categorias`}
              value={categoria}
              placeholder="p. ej. Tech"
              maxLength={30}
              autoComplete="off"
              aria-required="true"
              aria-invalid={!!errCategoria}
              aria-describedby={errCategoria ? `${id}-categoria-error` : undefined}
              onChange={(e) => setCategoria(e.target.value)}
              onBlur={() => setTocados((t) => ({ ...t, categoria: true }))}
            />
            <datalist id={`${id}-categorias`}>
              {categorias.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
          </div>
          {errCategoria && (
            <p className="adm-form__error" id={`${id}-categoria-error`} role="alert">
              {errCategoria}
            </p>
          )}
        </section>

        {/* ---- Descripción ---- */}
        <section className="adm-form__bloque adm-form__bloque--ancho">
          <h2 className="adm-form__titulo">Descripción</h2>
          <label className="adm-form__etiqueta" htmlFor={`${id}-descripcion`}>
            Descripción corta
          </label>
          <textarea
            id={`${id}-descripcion`}
            className="adm-form__area"
            value={descripcion}
            maxLength={MAX_DESCRIPCION}
            placeholder="Accesorios y gadgets."
            onChange={(e) => setDescripcion(e.target.value)}
          />
          <p className="adm-form__ayuda adm-form__ayuda--derecha">
            {descripcion.length}/{MAX_DESCRIPCION}
          </p>
        </section>
      </div>

      {errorEnvio && (
        <p className="adm-form__error adm-form__error--general" role="alert">
          {errorEnvio}
        </p>
      )}

      <div className="adm-form__acciones">
        <button type="button" className="btn" onClick={onCancelar} disabled={enviando}>
          Cancelar
        </button>
        <button type="submit" className="btn btn--primario" disabled={enviando}>
          {enviando ? 'Guardando…' : textoEnviar}
        </button>
      </div>
    </form>
  )
}