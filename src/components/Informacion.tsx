import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import './Informacion.css'

type Item = {
  id: number
  titulo: string
  texto: string
  imagen?: string   // opcional: importa la imagen y ponla aquí
}

// Para que se vean 5 distintas, necesitas 5 o más
const items: Item[] = [
  { id: 1, titulo: 'Soporte ilimitado', texto: 'Recibe soporte técnico y asesorías ilimitadas sin costo adicional a través de correo electrónico, teléfono y chat en vivo. Capacitaciones periódicas de las mejoras en el software.', imagen: 'https://cdn-icons-png.flaticon.com/512/9375/9375318.png'},
  { id: 2, titulo: 'Software que cumple con el SRI', texto: 'Estarás actualizado con las normativas del SRI, permitiendo que tu contabilidad y facturación esté alineada con las regulaciones fiscales más recientes.', imagen: 'https://taxstrategy.com.ec/wp-content/uploads/2021/01/unnamed.jpg' },
  { id: 3, titulo: 'Tu información siempre disponible y segura', texto: 'Los datos se almacenan automáticamente en línea, para que accedas cuando y donde quieras. Garantizamos la seguridad y confidencialidad de tus datos.', imagen: 'https://taxstrategy.com.ec/wp-content/uploads/2021/01/unnamed.jpg' },
  { id: 4, titulo: 'Intuitivo y rápido de usar', texto: 'Siigo Contífico te permite implementar rápidamente tu gestión administrativa y contable, trabajar desde una interfaz intuitiva y acceder a mejoras continuas sin afectar la operación de tu negocio.', imagen: 'https://taxstrategy.com.ec/wp-content/uploads/2021/01/unnamed.jpg' },
  { id: 5, titulo: 'Planes que se ajustan a tus necesidades', texto: 'El software en la nube de Siigo Contífico se adapta a tu presupuesto, eliminando la necesidad de gastar en licencias. Democratizamos la tecnología al emprendedor, mipymes y pymes.', imagen: 'https://taxstrategy.com.ec/wp-content/uploads/2021/01/unnamed.jpg' },
  { id: 6, titulo: 'Facturación electrónica', texto: 'Emite facturas electrónicas en Ecuador con solo unos clics desde cualquier lugar. Con Siigo Contífico, agilizas tus ventas, trabajas 100% en la nube y mantienes tu facturación alineada con los requisitos del SRI.', imagen: 'https://taxstrategy.com.ec/wp-content/uploads/2021/01/unnamed.jpg' },
]

function Informacion() {
  const [indice, setIndice] = useState(0)
  const n = items.length

  const siguiente = () => setIndice((i) => (i + 1) % n)
  const anterior = () => setIndice((i) => (i - 1 + n) % n)

  const distancia = (i: number) => {
    let d = (i - indice + n) % n
    if (d > n / 2) d -= n
    return d
  }

  return (
    <div className="informacion">
      <h2>Información</h2>

      <div className="carrusel">
        <button className="flecha-carrusel" onClick={anterior} aria-label="Anterior">
          <ChevronLeft size={22} />
        </button>

        <div className="escenario">
          {items.map((it, i) => {
            const d = distancia(i)
            const abs = Math.abs(d)

            return (
              <article
                key={it.id}
                className={`info-tarjeta abs-${abs} ${d === 0 ? 'centro' : ''}`}
                style={{ '--d': d, '--abs': abs, zIndex: 10 - abs } as React.CSSProperties}
                onClick={() => setIndice(i)}
              >
                {/* Espacio de la imagen */}
                <div className="info-imagen">
                  {it.imagen && <img src={it.imagen} alt={it.titulo} />}
                </div>

                {/* Espacio del texto */}
                <h3>{it.titulo}</h3>
                <svg className="info-ola" viewBox="0 0 160 14" aria-hidden="true">
                  <path
                    d="M2,7 C12,0 22,0 32,7 C42,14 52,14 62,7 C72,0 82,0 92,7 C102,14 112,14 122,7 C132,0 142,0 158,7"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
                <p>{it.texto}</p>
                <button className="info-boton">VER MÁS</button>
              </article>
            )
          })}
        </div>

        <button className="flecha-carrusel" onClick={siguiente} aria-label="Siguiente">
          <ChevronRight size={22} />
        </button>
      </div>
    </div>
  )
}

export default Informacion