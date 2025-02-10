import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import HomeStudent from './components/HomeStudent';
import CreateStudent from './components/CreateStudent';
import EditStudent from './components/EditStudent';
import ReadStudent from './components/ReadStudent';
import Login from './components/Login';
import PrivateRoute from './components/PrivateRoute';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Create a wrapper component to handle navigation
const AppContent = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkTokenExpiration = () => {
      if (location.pathname === '/') return;
      const token = localStorage.getItem("token");
      const expiry = localStorage.getItem("token_expiry");

      const isTokenInvalid = !token || (expiry && Date.now() > parseInt(expiry));

      if (isTokenInvalid) {
        localStorage.removeItem("token");
        localStorage.removeItem("token_expiry");
        navigate("/", { replace: true });
        toast.error("Session expired!", { position: "top-right", autoClose: 800 });
      }
    };

      // Only check if not on login page
     if (location.pathname !== '/') {
      checkTokenExpiration();
     }

    const interval = setInterval(checkTokenExpiration, 60 * 1000);
    return () => clearInterval(interval);
  }, [navigate,location.pathname]);

  return (
    <Routes>
      <Route path='/' element={<Login/>} />
      <Route path='/home' element={
        <PrivateRoute>
          <HomeStudent />
        </PrivateRoute>
      }/>
      <Route path='/createstudent' element={
        <PrivateRoute>
          <CreateStudent />
        </PrivateRoute>
      }/>
      <Route path='/edit/:id' element={
        <PrivateRoute>
          <EditStudent />
        </PrivateRoute>
      }/>
      <Route path='/read/:id' element={
        <PrivateRoute>
          <ReadStudent />
        </PrivateRoute>
      }/>
    </Routes>
  );
};

// Main app component with BrowserRouter
const App = () => {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
};

export default App;