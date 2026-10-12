import { useState } from 'react'
import { planes as planesData } from '../../../../../data/Planes'
import type { Plan } from '../types/plan.types'

export function usePlanes() {
  const [planes, setPlanes] = useState<Plan[]>(planesData)

  // Solo quita el plan de la lista en pantalla; no modifica src/data/Planes.tsx
  const eliminar = (id: number) => setPlanes((prev) => prev.filter((p) => p.id !== id))

  return { planes, eliminar }
}