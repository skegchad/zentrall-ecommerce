import { useEffect, useState } from 'react'
import './Slideshow.css'

const archivos = import.meta.glob('../assets/img/slideshow/*.{jpg,jpeg,png,webp}', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>

const img = (nombre: string) => archivos[`../assets/img/slideshow/${nombre}`]

// Edita aquí los textos. "imagen" es el nombre del archivo en la carpeta.
const slides = [
  {
    titulo: 'Eleva tu día a día',
    texto: 'Productos de calidad en todas las categorías, pensados para tu forma de vivir.',
    boton: 'Comprar ahora',
    imagen: 'image.jpg',
  },
  {
    titulo: 'Nuevas llegadas',
    texto: 'Descubre lo último de nuestra colección.',
    boton: 'Ver novedades',
    imagen: 'image2.jpg',
  },
  {
    titulo: 'Ofertas de temporada',
    texto: 'Hasta 40% de descuento en productos seleccionados.',
    boton: 'Ver ofertas',
    imagen: 'image3.jpg',
  },
]

function Slideshow() {
  const [indice, setIndice] = useState(0)

  const siguiente = () => setIndice((i) => (i + 1) % slides.length)
  const anterior = () => setIndice((i) => (i - 1 + slides.length) % slides.length)

  useEffect(() => {
    const timer = setInterval(siguiente, 5000)
    return () => clearInterval(timer)
  }, [indice])

  return (
    <div className="slideshow">
      {slides.map((s, i) => (
        <div
          key={s.titulo}
          className={`slide ${i === indice ? 'activa' : ''}`}
          style={{ backgroundImage: `url(${img(s.imagen)})` }}
        >
          <div className="slide-texto">
            <h1>{s.titulo}</h1>
            <p>{s.texto}</p>
            <button className="boton">{s.boton} →</button>
          </div>
        </div>
      ))}

      <button className="flecha izquierda" onClick={anterior} aria-label="Anterior">‹</button>
      <button className="flecha derecha" onClick={siguiente} aria-label="Siguiente">›</button>

      <div className="puntos">
        {slides.map((s, i) => (
          <button
            key={s.titulo}
            className={`punto ${i === indice ? 'activo' : ''}`}
            onClick={() => setIndice(i)}
            aria-label={`Ir a la imagen ${i + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

export default Slideshow