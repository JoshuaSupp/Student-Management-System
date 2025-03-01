import React from 'react'
import { Link } from "react-router-dom";

const StudentNavbar = () => {
  return (
    <div>
        <div>
         <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link className="navbar-brand" to="/student_dashboard">Student Portal</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
          <li className="nav-item">
              <Link className="nav-link" to="/student_dashboard">Dashboard</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/student_attendance">Attendance</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/student_dashboard">Lectures</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/student_dashboard">Profile</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/">Log Out</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
    </div>
    </div>
  )
}

export default StudentNavbar