import { lazy, Suspense } from 'react'
import { Route } from 'react-router-dom'

import PlanesPage from './features/planes/pages/PlanesPage'
import ServiciosPage from './features/servicios/pages/ServiciosPage'
import UsuariosPage from './features/usuarios/pages/UsuariosPage'
import CreatePlanesPage from './features/planes/pages/CreatePage'
import CreateServiciosPage from './features/servicios/pages/CreatePage'
import EditServiciosPage from './features/servicios/pages/EditPage'
import PlanesErasePage from './features/planes/pages/ErasePage'
import EraseServiciosPage from './features/servicios/pages/ErasePage'
import PlanesEditPage from './features/planes/pages/EditPage'



const Dashboard = lazy(
    () => import('./features/dashboard/DashboardPage')
)

const AdminRoutes = (
    <>
        <Route
            index
            element={
                <Suspense fallback={<p>Cargando dashboard...</p>}>
                    <Dashboard />
                </Suspense>
            }
        />

        <Route path="planes" element={<PlanesPage />} />
        <Route path="servicios" element={<ServiciosPage />} />
        <Route path="usuarios" element={<UsuariosPage />} />
        <Route path="planes/crear" element={<CreatePlanesPage />} />
        <Route path="servicios/crear" element={<CreateServiciosPage />} />
        <Route path="/admin/planes/:id/editar" element={<PlanesEditPage />} />
        <Route path="/admin/planes/:id/borrar" element={<PlanesErasePage />} />
        <Route path="/admin/servicios/:id/editar" element={<EditServiciosPage />} />
        <Route path="/admin/servicios/:id/borrar" element={<EraseServiciosPage />} />
        
    </>
)

export default AdminRoutes
