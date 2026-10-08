export type Servicio = {
  id: number
  nombre: string
  categoria: string
  descripcion: string
}

export const servicios: Servicio[] = [
  { id: 1, nombre: 'TechGye', categoria: 'Tech', descripcion: 'Accesorios y gadgets.'},
  { id: 2, nombre: 'Moda Norte', categoria: 'Moda', descripcion: 'Ropa casual y básicos.'},
  { id: 3, nombre: 'Bella Piel', categoria: 'Belleza', descripcion: 'Cuidado de la piel.'},
  { id: 4, nombre: 'Casa Viva', categoria: 'Hogar', descripcion: 'Cosas útiles para tu casa.'},
]