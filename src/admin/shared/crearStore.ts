import { useSyncExternalStore } from 'react'

type ConId = { id: number }

/**
 * Almacén compartido en memoria. Todas las páginas que usan el mismo almacén
 * ven los mismos datos (listado, crear, editar), a diferencia de un useState
 * dentro de cada hook, que crea una copia por página.
 *
 * Al recargar el navegador se vuelve a los datos de ejemplo de src/data.
 * Cuando haya backend, cambia el cuerpo de estas funciones por llamadas a tu
 * archivo de services y el resto de la app no se entera.
 */
export function crearStore<T extends ConId>(inicial: T[]) {
  let datos: T[] = inicial
  const oyentes = new Set<() => void>()

  function emitir(nuevos: T[]) {
    datos = nuevos
    oyentes.forEach((avisar) => avisar())
  }

  const suscribir = (avisar: () => void) => {
    oyentes.add(avisar)
    return () => {
      oyentes.delete(avisar)
    }
  }
  const obtener = () => datos

  const crear = (valores: Omit<T, 'id'>): T => {
    const id = datos.reduce((max, d) => Math.max(max, d.id), 0) + 1
    const nuevo = { ...valores, id } as unknown as T
    emitir([...datos, nuevo])
    return nuevo
  }

  const actualizar = (id: number, cambios: Partial<Omit<T, 'id'>>) =>
    emitir(datos.map((d) => (d.id === id ? { ...d, ...cambios } : d)))

  const eliminar = (id: number) => emitir(datos.filter((d) => d.id !== id))

  /** Hook para leer la lista y reaccionar cuando cambia. */
  function useLista(): T[] {
    return useSyncExternalStore(suscribir, obtener)
  }

  return { useLista, crear, actualizar, eliminar }
}