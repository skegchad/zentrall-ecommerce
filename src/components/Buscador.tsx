import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search } from 'lucide-react'
import './Buscador.css'

function Buscador() {
  const [texto, setTexto] = useState('')
  const navigate = useNavigate()

  const buscar = (e: React.FormEvent) => {
    e.preventDefault()
    const q = texto.trim()
    navigate(q ? `/explorar?q=${encodeURIComponent(q)}` : '/explorar')
  }

  return (
    <form className="buscador" onSubmit={buscar}>
      <input
        type="text"
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        placeholder="Busca productos, tiendas o servicios locales..."
      />
      <button type="submit" aria-label="Buscar">
        <Search size={18} />
      </button>
    </form>
  )
}

export default Buscador