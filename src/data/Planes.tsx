export type Planes = {
  id: number
  nombre: string
  informacion: string
  precio: number
  periodo: 'mensual' | 'anual'
}

export const planes: Planes[] = [
  { id: 1, nombre: 'Gratis', informacion:"Ideal para comenzar y conocer la plataforma.\nAcceso a las funciones básicas\nUso limitado de las herramientas\nSoporte estándar\n1 usuario\nSin compromiso ni tarjeta de crédito\n$0 / mes", precio: 0, periodo: 'mensual'},
  { id: 2, nombre: 'Starter', informacion:"hola", precio: 79.99, periodo: 'mensual'},
  { id: 3, nombre: 'Negocio', informacion:"hola", precio: 79.99, periodo: 'mensual'},
  { id: 4, nombre: 'Empresa', informacion:"hola", precio: 79.99, periodo: 'mensual'},
  { id: 5, nombre: 'Starter', informacion:"Ideal para comenzar y conocer la plataforma.\nAcceso a las funciones básicas\nUso limitado de las herramientas\nSoporte estándar\n1 usuario\nSin compromiso ni tarjeta de crédito\n$0 / mes", precio: 79.99, periodo: 'anual'},
  { id: 6, nombre: 'Negocio', informacion:"hola", precio: 79.99, periodo: 'anual'},
  { id: 7, nombre: 'Empresa', informacion:"hola", precio: 79.99, periodo: 'anual'},
]