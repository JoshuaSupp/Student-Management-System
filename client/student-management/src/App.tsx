import React from 'react'
import { BrowserRouter,Routes,Route } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import 'bootstrap/dist/css/bootstrap.min.css'
import HomeStudent from './pages/HomeStudent'
import CreateStudent from './pages/CreateStudent'
import EditStudent from './pages/EditStudent'
import ReadStudent from './pages/ReadStudent'
import Login from './pages/Login'
import Courses from './pages/HomeCourses'
import ReadCourse from './pages/ReadCourse'
import CreateCourse from './pages/CreateCourse'
import EditCourse from './pages/EditCourse'
import Dashboard from './pages/Dashboard'

const App = () => {
  return (
    <BrowserRouter>
      {/* <AuthProvider> */}
        <Routes>
          <Route path='/' element={<Login />} />
          <Route path='/login' element={<Login />} />
          <Route path='/home' element={<ProtectedRoute><HomeStudent /></ProtectedRoute>} />
          <Route path='/students' element={<ProtectedRoute><HomeStudent /></ProtectedRoute>} />
          <Route path='/createstudent' element={<ProtectedRoute><CreateStudent /></ProtectedRoute>} />
          <Route path='/students/edit/:id' element={<ProtectedRoute><EditStudent /></ProtectedRoute>} />
          <Route path='/students/read/:id' element={<ProtectedRoute><ReadStudent /></ProtectedRoute>} />
          <Route path='/courses' element={<ProtectedRoute><Courses /></ProtectedRoute>} />
          <Route path='/courses/read/:id' element={<ProtectedRoute><ReadCourse /></ProtectedRoute>} />
          <Route path='/createcourse' element={<ProtectedRoute><CreateCourse /></ProtectedRoute>} />
          <Route path='/courses/edit/:id' element={<ProtectedRoute><EditCourse /></ProtectedRoute>} />
          <Route path='/dashboard' element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        </Routes>
      {/* </AuthProvider> */}
    </BrowserRouter>
  )
}

export default App