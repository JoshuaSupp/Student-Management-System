import React from 'react'
import { BrowserRouter,Routes,Route } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import HomeStudent from './components/HomeStudent'
import CreateStudent from './components/CreateStudent'
import EditStudent from './components/EditStudent'
import ReadStudent from './components/ReadStudent'
import Login from './components/Login'

const App = () => {
  return (
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Login/>} />
      <Route path='/home' element={<HomeStudent/>} />
      <Route path='/createstudent' element={<CreateStudent/>} />
      <Route path='/edit/:id' element={<EditStudent/>} />
      <Route path='/read/:id' element={<ReadStudent/>} />
    </Routes>
    </BrowserRouter>
  )
}

export default App