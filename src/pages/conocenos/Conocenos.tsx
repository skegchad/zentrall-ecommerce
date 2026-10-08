import './Conocenos.css'

// Pon aquí las URLs o imports de tus imágenes
const IMG_1 = ''
const IMG_2 = ''

function Ola() {
  return (
    <svg className="conocenos-ola" viewBox="0 0 160 14" aria-hidden="true">
      <path
        d="M2,7 C12,0 22,0 32,7 C42,14 52,14 62,7 C72,0 82,0 92,7 C102,14 112,14 122,7 C132,0 142,0 158,7"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  )
}

function Imagen({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="conocenos-imagen">
      {src ? <img src={src} alt={alt} /> : <span>Imagen</span>}
    </div>
  )
}

function Conocenos() {
  return (
    <div className="conocenos">
      {/* Cabecera centrada */}
      <header className="conocenos-hero">
        <h1>
          Conoce <span className="resaltado">Zentrall.</span>
        </h1>
        <p>
          Bienvenido a Zentrall, tu plataforma de comercio electrónico de confianza.
          Nos dedicamos a ofrecer soluciones innovadoras para que las empresas puedan
          vender sus productos y servicios en línea de manera eficiente y segura.
        </p>
      </header>

      {/* Fila 1: imagen izquierda, texto derecha */}
      <section className="conocenos-fila">
        <Imagen src={IMG_1} alt="Equipo de Zentrall" />
        <div className="conocenos-texto">
          <h2>Nuestro equipo</h2>
          <Ola />
          <p>
            Nuestro equipo está compuesto por profesionales apasionados por la tecnología
            y el comercio electrónico, comprometidos en brindar un servicio excepcional a
            nuestros clientes. Nos esforzamos por mantenernos a la vanguardia de las
            tendencias del mercado y ofrecer herramientas que faciliten el crecimiento de
            tu negocio.
          </p>
        </div>
      </section>

      {/* Fila 2: texto izquierda, imagen derecha */}
      <section className="conocenos-fila">
        <div className="conocenos-texto">
          <h2>Colaboración y transparencia</h2>
          <Ola />
          <p>
            En Zentrall, creemos en la importancia de la colaboración y la transparencia.
            Trabajamos estrechamente con nuestros clientes para entender sus necesidades
            y ofrecer soluciones personalizadas que impulsen su éxito.
          </p>
        </div>
        <Imagen src={IMG_2} alt="Colaboración con clientes" />
      </section>
    </div>
  )
}

export default Conocenos