export type Usuarios = {
  id: number
  nombre: string
  plan: string
  estado: "Activo" | "Inactivo"
}

export const usuarios: Usuarios[] = [
  { id: 1, nombre: 'Juan', plan: 'Gratis', estado: 'Activo' },
  { id: 2, nombre: 'Jose', plan: 'Starter', estado: 'Activo' },
  { id: 3, nombre: 'Maria', plan: 'Negocio', estado: 'Inactivo' },
  { id: 4, nombre: 'Pedro', plan: 'Empresa', estado: 'Activo' },
]