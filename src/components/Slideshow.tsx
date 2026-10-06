import { useEffect, useState } from 'react'
import './Slideshow.css'

const archivos = import.meta.glob('../assets/img/slideshow/*.{jpg,jpeg,png,webp}', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>

const img = (nombre: string) => archivos[`../assets/img/slideshow/${nombre}`]

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

  const siguiente = () => {
    setIndice((i) => (i + 1) % slides.length)
  }

  const anterior = () => {
    setIndice((i) => (i - 1 + slides.length) % slides.length)
  }

  useEffect(() => {
    const timer = setInterval(siguiente, 5000)
    return () => clearInterval(timer)
  }, [indice])

  return (
  <div className="slideshow">

    {/* FONDO LÍQUIDO */}
    <div className="liquido liquido-1"></div>
    <div className="liquido liquido-2"></div>
    <div className="liquido liquido-3"></div>

    {slides.map((s, i) => (<div
      key={s.titulo}
      className={`slide ${i === indice ? 'activa' : ''}`}
    >
      <div
        className="slide-fondo"
        style={{
          backgroundImage: `url(${img(s.imagen)})`,
        }}
      />

      {/* MAREA */}
      <svg
        className="marea"
        viewBox="0 0 600 420"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          className="marea-path"
          d="
            M0,0
            L390,0
            C350,45 410,85 365,130
            C320,175 390,210 350,255
            C310,300 365,345 330,380
            C310,400 300,420 300,420
            L0,420
            Z
          "
        >
          <animate
            attributeName="d"
            dur="8s"
            repeatCount="indefinite"
            values="
              M0,0 L390,0 C350,45 410,85 365,130 C320,175 390,210 350,255 C310,300 365,345 330,380 C310,400 300,420 300,420 L0,420 Z;

              M0,0 L370,0 C420,50 345,90 395,135 C440,180 350,215 390,260 C425,300 345,350 360,385 C370,405 350,420 350,420 L0,420 Z;

              M0,0 L390,0 C350,45 410,85 365,130 C320,175 390,210 350,255 C310,300 365,345 330,380 C310,400 300,420 300,420 L0,420 Z
            "
          />
        </path>
      </svg>

      <div className="slide-overlay"></div>

      {/* IMPORTANTE: texto después de la marea */}
      <div className="slide-texto">
        <h1>{s.titulo}</h1>
        <p>{s.texto}</p>

        <button className="boton">
          {s.boton} →
        </button>
      </div>
    </div>))}

    <button
      className="flecha izquierda"
      onClick={anterior}
      aria-label="Anterior"
    >
      ‹
    </button>

    <button
      className="flecha derecha"
      onClick={siguiente}
      aria-label="Siguiente"
    >
      ›
    </button>

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