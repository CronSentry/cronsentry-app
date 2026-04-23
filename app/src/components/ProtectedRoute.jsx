import { Navigate } from "react-router-dom";
import { useAuth } from "../store/authStore.jsx";

function ProtectedRoute({ children }) {
    const { auth } = useAuth()

    if (!auth) 
        return <Navigate to="/login" replace />

    return children
}

export default ProtectedRoute;