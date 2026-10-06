import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Inicio from './pages/Inicio'
import Servicios from './pages/servicios/Servicios'
import Planes from './pages/planes/PagPlanes'
import Login from './pages/login/Login'
import Conocenos from './pages/conocenos/Conocenos'
import './App.css'

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/servicios" element={<Servicios />} />
        <Route path="/planes" element={<Planes />} />
        <Route path="/login" element={<Login />} />
        <Route path="/conocenos" element={<Conocenos />} />
        <Route path="*" element={<section className="seccion"><h2>Página no encontrada</h2></section>} />
      </Routes>
    </Layout>
  )
}

export default App