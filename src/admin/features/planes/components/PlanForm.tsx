import { useId, useRef, useState, type FormEvent, type KeyboardEvent } from 'react'
import { Tag, DollarSign, Plus, X } from 'lucide-react'
import '../../../shared/AdminForm.css'

export type PeriodoPlan = 'mensual' | 'anual'

/* Misma forma que tu tipo Planes, sin el id */
export interface PlanFormValores {
  nombre: string
  informacion: string
  precio: number
  periodo: PeriodoPlan
}

interface Props {
  /** Para editar: pasa los valores actuales del plan. Para crear, no pases nada. */
  valoresIniciales?: Partial<PlanFormValores>
  textoEnviar?: string
  onEnviar: (valores: PlanFormValores) => void | Promise<void>
  onCancelar: () => void
}

const MAX_DESCRIPCION = 160
const MAX_CARACTERISTICAS = 12

/* "informacion" se guarda como texto de varias líneas:
   la primera línea es la descripción y cada línea siguiente es una característica. */
function separarInformacion(informacion = '') {
  const [primera = '', ...resto] = informacion.split('\n')
  return {
    descripcion: primera.trim(),
    caracteristicas: resto.map((l) => l.trim()).filter(Boolean),
  }
}

export default function PlanForm({
  valoresIniciales,
  textoEnviar = 'Guardar plan',
  onEnviar,
  onCancelar,
}: Props) {
  const id = useId()

  const [nombre, setNombre] = useState(valoresIniciales?.nombre ?? '')
  const [precio, setPrecio] = useState(
    valoresIniciales?.precio !== undefined ? String(valoresIniciales.precio) : '',
  )
  const [periodo, setPeriodo] = useState<PeriodoPlan>(valoresIniciales?.periodo ?? 'mensual')
  const [descripcion, setDescripcion] = useState(
    () => separarInformacion(valoresIniciales?.informacion).descripcion,
  )
  const [caracteristicas, setCaracteristicas] = useState<string[]>(
    () => separarInformacion(valoresIniciales?.informacion).caracteristicas,
  )
  const [borrador, setBorrador] = useState('')

  const [tocados, setTocados] = useState<{ nombre?: boolean; precio?: boolean }>({})
  const [intentado, setIntentado] = useState(false)
  const [enviando, setEnviando] = useState(false)
  const [errorEnvio, setErrorEnvio] = useState('')

  const nombreRef = useRef<HTMLInputElement>(null)
  const precioRef = useRef<HTMLInputElement>(null)

  /* ---------- Validación ---------- */
  const precioNumero = Number(precio)
  const errores = {
    nombre: nombre.trim().length < 3 ? 'Escribe un nombre de al menos 3 caracteres.' : '',
    precio:
      precio.trim() === '' || Number.isNaN(precioNumero) || precioNumero < 0
        ? 'Ingresa un precio válido (0 o mayor).'
        : '',
  }
  const ver = (campo: 'nombre' | 'precio') => (intentado || tocados[campo] ? errores[campo] : '')

  /* ---------- Características (chips) ---------- */
  function agregarCaracteristica(texto: string) {
    const limpio = texto.trim()
    if (!limpio) return
    setCaracteristicas((prev) => {
      const repetida = prev.some((c) => c.toLowerCase() === limpio.toLowerCase())
      return repetida || prev.length >= MAX_CARACTERISTICAS ? prev : [...prev, limpio]
    })
    setBorrador('')
  }

  function teclaCaracteristica(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      agregarCaracteristica(borrador)
    } else if (e.key === 'Backspace' && borrador === '' && caracteristicas.length > 0) {
      setCaracteristicas((prev) => prev.slice(0, -1))
    }
  }

  /* ---------- Envío ---------- */
  async function manejarEnvio(e: FormEvent) {
    e.preventDefault()
    setIntentado(true)

    if (errores.nombre) return nombreRef.current?.focus()
    if (errores.precio) return precioRef.current?.focus()

    setEnviando(true)
    setErrorEnvio('')
    try {
      await onEnviar({
        nombre: nombre.trim(),
        informacion: [descripcion.trim(), ...caracteristicas].join('\n'),
        precio: precioNumero,
        periodo,
      })
    } catch {
      setErrorEnvio('No se pudo guardar el plan. Inténtalo de nuevo.')
    } finally {
      setEnviando(false)
    }
  }

  const errNombre = ver('nombre')
  const errPrecio = ver('precio')

  return (
    <form className="adm-form" onSubmit={manejarEnvio} noValidate>
      <div className="adm-form__rejilla">
        {/* ---- General ---- */}
        <section className="adm-form__bloque adm-form__bloque--ancho">
          <h2 className="adm-form__titulo">General</h2>
          <label className="adm-form__etiqueta" htmlFor={`${id}-nombre`}>
            Nombre del plan <span aria-hidden="true">*</span>
          </label>
          <div className={'adm-form__control' + (errNombre ? ' adm-form__control--error' : '')}>
            <Tag size={18} aria-hidden="true" />
            <input
              ref={nombreRef}
              id={`${id}-nombre`}
              type="text"
              value={nombre}
              placeholder="p. ej. Starter"
              maxLength={40}
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

        {/* ---- Facturación ---- */}
        <section className="adm-form__bloque">
          <h2 className="adm-form__titulo">Precio</h2>
          <label className="adm-form__etiqueta" htmlFor={`${id}-precio`}>
            Monto <span aria-hidden="true">*</span>
          </label>
          <div className={'adm-form__control' + (errPrecio ? ' adm-form__control--error' : '')}>
            <DollarSign size={18} aria-hidden="true" />
            <input
              ref={precioRef}
              id={`${id}-precio`}
              type="number"
              inputMode="decimal"
              min="0"
              step="0.01"
              value={precio}
              placeholder="0.00"
              aria-required="true"
              aria-invalid={!!errPrecio}
              aria-describedby={errPrecio ? `${id}-precio-error` : undefined}
              onChange={(e) => setPrecio(e.target.value)}
              onBlur={() => setTocados((t) => ({ ...t, precio: true }))}
            />
          </div>
          {errPrecio && (
            <p className="adm-form__error" id={`${id}-precio-error`} role="alert">
              {errPrecio}
            </p>
          )}
        </section>

        {/* ---- Periodo ---- */}
        <section className="adm-form__bloque">
          <h2 className="adm-form__titulo">Periodo</h2>
          <span className="adm-form__etiqueta" id={`${id}-periodo`}>
            Periodo de cobro
          </span>
          <div className="adm-form__segmentado" role="radiogroup" aria-labelledby={`${id}-periodo`}>
            {(['mensual', 'anual'] as const).map((op) => (
              <label key={op}>
                <input
                  type="radio"
                  name={`${id}-periodo`}
                  value={op}
                  checked={periodo === op}
                  onChange={() => setPeriodo(op)}
                />
                <span>{op === 'mensual' ? 'Mensual' : 'Anual'}</span>
              </label>
            ))}
          </div>
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
            placeholder="Ideal para comenzar y conocer la plataforma."
            onChange={(e) => setDescripcion(e.target.value.replace(/\n/g, ' '))}
          />
          <p className="adm-form__ayuda adm-form__ayuda--derecha">
            {descripcion.length}/{MAX_DESCRIPCION}
          </p>
        </section>

        {/* ---- Características ---- */}
        <section className="adm-form__bloque adm-form__bloque--ancho">
          <h2 className="adm-form__titulo">Características</h2>
          <label className="adm-form__etiqueta" htmlFor={`${id}-caracteristica`}>
            Qué incluye el plan
          </label>
          <div className="adm-form__control adm-form__control--chips">
            {caracteristicas.map((c) => (
              <span key={c} className="adm-form__chip">
                {c}
                <button
                  type="button"
                  aria-label={`Quitar ${c}`}
                  onClick={() => setCaracteristicas((prev) => prev.filter((x) => x !== c))}
                >
                  <X size={13} aria-hidden="true" />
                </button>
              </span>
            ))}
            <input
              id={`${id}-caracteristica`}
              type="text"
              value={borrador}
              maxLength={60}
              placeholder={caracteristicas.length ? 'Agregar otra…' : 'Ej. Soporte estándar'}
              disabled={caracteristicas.length >= MAX_CARACTERISTICAS}
              onChange={(e) => setBorrador(e.target.value)}
              onKeyDown={teclaCaracteristica}
              onBlur={() => agregarCaracteristica(borrador)}
            />
            <button
              type="button"
              className="adm-form__agregar"
              aria-label="Agregar característica"
              disabled={!borrador.trim()}
              onClick={() => agregarCaracteristica(borrador)}
            >
              <Plus size={16} aria-hidden="true" />
            </button>
          </div>
          <p className="adm-form__ayuda">
            Escribe una y presiona Enter. Máximo {MAX_CARACTERISTICAS}.
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