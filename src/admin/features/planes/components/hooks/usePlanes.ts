import { planes as planesData } from '../../../../../data/Planes'
import { crearStore } from '../../../../shared/crearStore'
import type { Plan } from '../types/plan.types'

// Un solo almacén para toda la app: el listado y CreatePage comparten los datos
const store = crearStore<Plan>(planesData)

export function usePlanes() {
  const planes = store.useLista()
  const { crear, actualizar, eliminar } = store

  return { planes, crear, actualizar, eliminar }
}