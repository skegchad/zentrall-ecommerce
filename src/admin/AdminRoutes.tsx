import { lazy, Suspense } from 'react'
import { Route } from 'react-router-dom'

import PlanesPage from './features/planes/pages/PlanesPage'
import ServiciosPage from './features/servicios/pages/ServiciosPage'

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
    </>
)

export default AdminRoutes
