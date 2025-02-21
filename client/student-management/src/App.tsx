import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import HomeStudent from './pages/HomeStudent';
import CreateStudent from './pages/CreateStudent';
import EditStudent from './pages/EditStudent';
import ReadStudent from './pages/ReadStudent';
import Login from './pages/Login';
import PrivateRoute from './components/PrivateRoute';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdminCourses from './pages/AdminCourse';
import CreateCourse from './pages/CreateCourse';
import AdminDashboard from './pages/AdminDashboard';

// Create a wrapper component to handle navigation
const AppContent = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkTokenExpiration = () => {
      const token = localStorage.getItem("token");
      const expiry = localStorage.getItem("token_expiry");

      const isTokenInvalid = !token || (expiry && Date.now() > parseInt(expiry));

      if (isTokenInvalid && location.pathname !== '/') {
        localStorage.removeItem("token");
        localStorage.removeItem("token_expiry");
        navigate("/", { replace: true });
        toast.error("Session expired!", { position: "top-right", autoClose: 800 });
      }
    };

     checkTokenExpiration();


    const interval = setInterval(checkTokenExpiration, 60 * 1000);
    return () => clearInterval(interval);
  }, [navigate,location.pathname]);

  return (
    <Routes>
      <Route path='/' element={<Login/>} />
      <Route path='/dashboard' element={<AdminDashboard/>} />
      <Route path='/students' element={
        <PrivateRoute>
          <HomeStudent /> 
        </PrivateRoute>
      }/>   {/* admin */}
      <Route path='/createstudent' element={
        <PrivateRoute>
          <CreateStudent />
        </PrivateRoute>
      }/>  {/* admin */}
      <Route path='/edit/:id' element={
        <PrivateRoute>
          <EditStudent />
        </PrivateRoute>
      }/>  {/* admin */}
      <Route path='/read/:id' element={
        <PrivateRoute>
          <ReadStudent />
        </PrivateRoute>
      }/>  {/* admin */}
      <Route path='/admin_course' element={
        <PrivateRoute>
          <AdminCourses/>
        </PrivateRoute>
      }/> {/* admin */}
      <Route path='/create_course' element={
        <PrivateRoute>
          <CreateCourse/>
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