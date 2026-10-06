import { useEffect, useState } from 'react'

type Tema = 'dark' | 'light'

export function useTema() {
  const [tema, setTema] = useState<Tema>(
    () => (localStorage.getItem('tema') as Tema) ?? 'dark'
  )

  useEffect(() => {
    document.documentElement.dataset.tema = tema
    localStorage.setItem('tema', tema)
  }, [tema])

  const alternar = () => setTema((t) => (t === 'dark' ? 'light' : 'dark'))

  return { tema, alternar }
}