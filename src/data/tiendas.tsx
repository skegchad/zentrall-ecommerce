export type Tienda = {
  id: number
  nombre: string
  categoria: string
  descripcion: string
  sector: string
  verificada: boolean
}

export const tiendas: Tienda[] = [
  { id: 1, nombre: 'TechGye', categoria: 'Tech', descripcion: 'Accesorios y gadgets.', sector: 'Urdesa', verificada: true },
  { id: 2, nombre: 'Moda Norte', categoria: 'Moda', descripcion: 'Ropa casual y básicos.', sector: 'Alborada', verificada: true },
  { id: 3, nombre: 'Bella Piel', categoria: 'Belleza', descripcion: 'Cuidado de la piel.', sector: 'Kennedy', verificada: false },
  { id: 4, nombre: 'Casa Viva', categoria: 'Hogar', descripcion: 'Cosas útiles para tu casa.', sector: 'Samborondón', verificada: true },
]