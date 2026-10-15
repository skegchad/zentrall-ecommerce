import { usuarios as usuariosData } from '../../../../../data/Usuarios'
import { crearStore } from '../../../../shared/crearStore'
import type { Usuarios } from '../types/usuarios.types'

// Un solo almacén para toda la app: el listado y CreatePage comparten los datos
const store = crearStore<Usuarios>(usuariosData)

export function useUsuarios() {
  const usuarios = store.useLista()
  const { crear, actualizar, eliminar } = store

  /** Busca un usuario por id. Es async para que useRegistro funcione igual cuando pases a un backend. */
  async function obtener(id: number): Promise<Usuarios | undefined> {
    return usuarios.find((u) => u.id === id)
  }

  return { usuarios, crear, actualizar, eliminar, obtener }
}