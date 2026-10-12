import { useState } from 'react'
import { servicios as serviciosData } from '../../../../../data/Servicios'
import type { Servicio } from '../types/servicios.types'

export function useServicios() {
  const [servicios, setServicios] = useState<Servicio[]>(serviciosData)

  // Solo quita el servicio de la lista en pantalla; no modifica src/data/Servicios.tsx
  const eliminar = (id: number) => setServicios((prev) => prev.filter((s) => s.id !== id))

  return { servicios, eliminar }
}