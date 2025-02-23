import React from 'react'
import { BrowserRouter,Routes,Route } from 'react-router-dom'
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

const App = () => {
  return (
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Login/>} />
      <Route path='/home' element={<HomeStudent/>} />
      <Route path='/createstudent' element={<CreateStudent/>} />
      <Route path='/students/edit/:id' element={<EditStudent/>} />
      <Route path='/students/read/:id' element={<ReadStudent/>} />
      <Route path='/courses' element={<Courses/>} />
      <Route path='/courses/read/:id' element={<ReadCourse/>} />
      <Route path='/createcourse' element={<CreateCourse/>} />
      <Route path='/courses/edit/:id' element={<EditCourse/>} />
    </Routes>
    </BrowserRouter>
  )
}

export default App