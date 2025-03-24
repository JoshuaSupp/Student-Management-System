import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import HomeStudent from './pages/Admin/HomeStudent';
import CreateStudent from './pages/Admin/CreateStudent';
import EditStudent from './pages/Admin/EditStudent';
import ReadStudent from './pages/Admin/ReadStudent';
import Login from './pages/Login';
import PrivateRoute from './components/PrivateRoute';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdminCourses from './pages/Admin/AdminCourse';
import CreateCourse from './pages/Admin/CreateCourse';
import AdminDashboard from './pages/Admin/AdminDashboard';
import EditCourse from './pages/Admin/EditCourse';
import StudentDashboard from './pages/Student/StudentDashboard';
import Unauthorized from './pages/Unauthorized';
import StudentAttendence from './pages/Student/StudentAttendance';
import AdminCreateMeeting from './pages/Admin/AdminCreateMeeting';
import AdminEditMeeting from './pages/Admin/AdminEditMeeting';
import StudentLectures from './pages/Student/StudentLectures';
import StudentProfile from './pages/Student/StudentProfile';

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
      <Route path='/dashboard' element={
        <PrivateRoute allowedRoles={["001"]}>
          <AdminDashboard /> 
        </PrivateRoute>
      }/>   {/* admin */}
      <Route path='/students' element={
        <PrivateRoute allowedRoles={["001"]}>
          <HomeStudent /> 
        </PrivateRoute>
      }/>   {/* admin */}
      <Route path='/createstudent' element={
        <PrivateRoute allowedRoles={["001"]}>
          <CreateStudent />
        </PrivateRoute>
      }/>  {/* admin */}
      <Route path='/edit/student/:id' element={
         <PrivateRoute allowedRoles={["001"]}>
          <EditStudent />
        </PrivateRoute>
      }/>  {/* admin */}
      <Route path='/read/:id' element={
        <PrivateRoute allowedRoles={["001"]}>
          <ReadStudent />
        </PrivateRoute>
      }/>  {/* admin */}
      <Route path='/admin_course' element={
        <PrivateRoute allowedRoles={["001"]}>
          <AdminCourses/>
        </PrivateRoute>
      }/> {/* admin */}
      <Route path='/create_course' element={
        <PrivateRoute allowedRoles={["001"]}>
          <CreateCourse/>
        </PrivateRoute> 
      }/>  {/* admin */}
      <Route path='/edit/course/:id' element={
        <PrivateRoute allowedRoles={["001"]}>
          <EditCourse/>
        </PrivateRoute>
      }/> {/* admin */}
      <Route path='/admin_create_meeting' element={
        <PrivateRoute allowedRoles={["001"]}>
          <AdminCreateMeeting/>
        </PrivateRoute>
      }/> {/* admin */}
      <Route path='/admin_edit_meeting/:id' element={
        <PrivateRoute allowedRoles={["001"]}>
          <AdminEditMeeting/>
        </PrivateRoute>
      }/> {/* admin */}
      <Route path='/student_dashboard' element={
       <PrivateRoute allowedRoles={["002"]}>
        <StudentDashboard/>
       </PrivateRoute>
      }/>  {/* student */}
      <Route path='/student_attendance' element={
       <PrivateRoute allowedRoles={["002"]}>
        <StudentAttendence/>
       </PrivateRoute>
      }/>  {/* student */}
      <Route path='/student_lectures' element={
       <PrivateRoute allowedRoles={["002"]}>
        <StudentLectures/>
       </PrivateRoute>
      }/>  {/* student */}
      <Route path='/student_profile' element={
       <PrivateRoute allowedRoles={["002"]}>
        <StudentProfile/>
       </PrivateRoute>
      }/>  {/* student */}
      <Route path='/unauthorized' element={
        <Unauthorized/>
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