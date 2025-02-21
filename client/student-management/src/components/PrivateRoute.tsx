// components/PrivateRoute.jsx
import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const token = localStorage.getItem("token");
  const expiry = localStorage.getItem("token_expiry");
  
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

  if (!isTokenValid) {
    // Clear any residual tokens
    localStorage.removeItem("token");
    localStorage.removeItem("token_expiry");
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PrivateRoute;