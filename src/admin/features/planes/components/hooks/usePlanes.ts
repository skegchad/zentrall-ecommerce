import { planes as planesData } from '../../../../../data/Planes'
import { crearStore } from '../../../../shared/crearStore'
import type { Plan } from '../types/plan.types'

const store = crearStore<Plan>(planesData)

export function usePlanes() {
  const planes = store.useLista()
  const { crear, actualizar, eliminar } = store

  /** Busca un plan por id. Es async para que useRegistro funcione igual cuando pases a un backend. */
  async function obtener(id: number): Promise<Plan | undefined> {
    return planes.find((p) => p.id === id)
  }

  return { planes, crear, actualizar, eliminar, obtener }
}