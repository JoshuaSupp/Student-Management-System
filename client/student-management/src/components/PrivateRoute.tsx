// Updated PrivateRoute.jsx
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
    const token = localStorage.getItem("token");
    const expiry = localStorage.getItem("token_expiry");
    
    // Check if token exists and isn't expired
    const isTokenValid = token && expiry && Date.now() < parseInt(expiry);

    if (!isTokenValid) {
        // Clear invalid token
        localStorage.removeItem("token");
        localStorage.removeItem("token_expiry");
        return <Navigate to="/" replace />;
    }

    return children;
};

export default PrivateRoute;