import { lazy, Suspense } from 'react'
import { Route } from 'react-router-dom'

import PlanesPage from './features/planes/pages/PlanesPage'
import ServiciosPage from './features/servicios/pages/ServiciosPage'
import CreatePlanesPage from './features/planes/pages/CreatePage'
import CreateServiciosPage from './features/servicios/pages/CreatePage'

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
        <Route path="planes/crear" element={<CreatePlanesPage />} />
        <Route path="servicios/crear" element={<CreateServiciosPage />} />
    </>
)

export default AdminRoutes
