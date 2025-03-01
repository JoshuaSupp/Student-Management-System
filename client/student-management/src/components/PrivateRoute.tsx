// components/PrivateRoute.jsx
import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const PrivateRoute = ({ children, allowedRoles }: { children: JSX.Element, allowedRoles: string[] }) => {
  const token = localStorage.getItem("token");
  const expiry = localStorage.getItem("token_expiry");
  const role_id = localStorage.getItem("role_id");
  
  // Check token validity
  const isTokenValid = token && expiry && Date.now() < parseInt(expiry);

  useEffect(() => {
    if (!isTokenValid) {
      toast.error("Session expired! Please log in again.", {
        position: "top-right",
        autoClose: 800
      });
    }
  }, [isTokenValid]);

  if (!isTokenValid || !role_id) {
    // Clear any residual tokens
    localStorage.removeItem("token");
    localStorage.removeItem("token_expiry");
    localStorage.removeItem("role_id");
    return <Navigate to="/" replace />;
  }

  if (!allowedRoles.includes(role_id)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default PrivateRoute;