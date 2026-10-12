import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Inicio from './pages/Inicio'
import Servicios from './pages/servicios/Servicios'
import Planes from './pages/planes/PagPlanes'
import Login from './pages/login/Login'
import Conocenos from './pages/conocenos/Conocenos'

import AdminLayout from './admin/layout/AdminLayout'
import RequireAdmin from './admin/guards/RequireAdmin'
import AdminRoutes from './admin/AdminRoutes'

import './App.css'

function SitioPublico() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/servicios" element={<Servicios />} />
        <Route path="/planes" element={<Planes />} />
        <Route path="/login" element={<Login />} />
        <Route path="/conocenos" element={<Conocenos />} />

        <Route
          path="*"
          element={
            <section className="seccion">
              <h2>Página no encontrada</h2>
            </section>
          }
        />
      </Routes>
    </Layout>
  )
}
function App() {
    return (
        <Routes>
            <Route element={<RequireAdmin />}>
                <Route path="/admin" element={<AdminLayout />}>
                    {AdminRoutes}
                </Route>
            </Route>

            <Route path="/*" element={<SitioPublico />} />
        </Routes>
    )
}

export default App
