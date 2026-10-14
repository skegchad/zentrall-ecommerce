import { servicios as serviciosData } from '../../../../../data/Servicios'
import { crearStore } from '../../../../shared/crearStore'
import type { Servicio } from '../types/servicios.types'

// Un solo almacén para toda la app: el listado y CreatePage comparten los datos
const store = crearStore<Servicio>(serviciosData)

export function useServicios() {
  const servicios = store.useLista()
  const { crear, actualizar, eliminar } = store

  /** Busca un servicio por id. Es async para que useRegistro funcione igual cuando pases a un backend. */
  async function obtener(id: number): Promise<Servicio | undefined> {
    return servicios.find((s) => s.id === id)
  }

  return { servicios, crear, actualizar, eliminar, obtener }
}