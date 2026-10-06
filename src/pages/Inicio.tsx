import Slideshow from '../components/Slideshow'
import Categorias from '../components/Categorias'
import Tarjetas from '../components/Tarjetas'
import Buscador from '../components/Buscador'
import { productos } from '../data/Planes'
  
function Inicio() {
  return (
    <>
      <Buscador />
      <Slideshow />
      <Categorias />

      <section className="seccion">
        <div style={{ justifyContent: 'center', fontSize: '200px' , marginBottom: '1rem'}} className="seccion-cabecera">
          <h2>Planes</h2>
        </div>
        <Tarjetas items={productos} />
      </section>
    </>
  )
}

export default Inicio