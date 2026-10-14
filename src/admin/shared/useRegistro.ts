import { useEffect, useRef, useState } from 'react'

export type EstadoRegistro<T> =
  | { estado: 'cargando' }
  | { estado: 'noExiste' }
  | { estado: 'error'; mensaje: string }
  | { estado: 'listo'; dato: T }

/**
 * Carga UN registro por id (para las páginas de editar / borrar).
 *
 * `buscar` siempre devuelve una promesa. Hoy puede leer del store local
 * (usePlanes / useServicios) y mañana hacer un fetch al backend: esta página
 * y las pantallas que la usan no cambian.
 */
export function useRegistro<T>(
  id: string | undefined,
  buscar: (id: string) => Promise<T | undefined>,
): EstadoRegistro<T> {
  const [res, setRes] = useState<{ id: string; estado: EstadoRegistro<T> }>()

  // Guardamos la última versión de `buscar` para no volver a cargar si el hook
  // que la entrega crea una función nueva en cada render.
  const buscarRef = useRef(buscar)
  useEffect(() => {
    buscarRef.current = buscar
  })

  useEffect(() => {
    if (!id) return undefined
    let vigente = true
    buscarRef
      .current(id)
      .then((dato) => {
        if (!vigente) return
        setRes({
          id,
          estado: dato === undefined ? { estado: 'noExiste' } : { estado: 'listo', dato },
        })
      })
      .catch((e: unknown) => {
        if (!vigente) return
        setRes({
          id,
          estado: { estado: 'error', mensaje: e instanceof Error ? e.message : 'No se pudo cargar.' },
        })
      })
    return () => {
      vigente = false
    }
  }, [id])

  if (!id) return { estado: 'noExiste' }
  if (!res || res.id !== id) return { estado: 'cargando' }
  return res.estado
}