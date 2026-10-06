import { useNavigate } from 'react-router-dom'
import { Utensils, Shirt, Laptop, Sparkles, Wrench, Gift, House, Tag } from 'lucide-react'
import './Categorias.css'

const categorias = [
  { nombre: 'Gastronomía', icono: Utensils },
  { nombre: 'Moda', icono: Shirt },
  { nombre: 'Tech', icono: Laptop },
  { nombre: 'Belleza', icono: Sparkles },
  { nombre: 'Servicios', icono: Wrench },
  { nombre: 'Regalos', icono: Gift },
  { nombre: 'Hogar', icono: House },
  { nombre: 'Ofertas', icono: Tag },
]

function Categorias() {
  const navigate = useNavigate()

  return (
    <div className="categorias">
      {categorias.map(({ nombre, icono: Icono }) => (
        <button
          className="categoria"
          key={nombre}
          onClick={() => navigate(`/explorar?categoria=${nombre}`)}
        >
          <span className="categoria-circulo">
            <Icono size={22} />
          </span>
          <span className="categoria-nombre">{nombre}</span>
        </button>
      ))}
    </div>
  )
}

export default Categorias