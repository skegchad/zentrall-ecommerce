
import { Navigate, Outlet } from 'react-router-dom'

function RequireAdmin() {
    const isAdmin: boolean = true

    if (!isAdmin) {
        return <Navigate to="/login" replace />
    }

    return <Outlet />
}

export default RequireAdmin