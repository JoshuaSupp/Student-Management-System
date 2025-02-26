import React, { useEffect, useState } from 'react'
import axios from 'axios'
import {Link, useNavigate} from 'react-router-dom'
import AdminNavbar from '../components/AdminNavbar'

const CreateCourse = () => {
    const [values, setValues] = useState({
      course_id: '',
      course_name: '',
  })
  
  const navigate = useNavigate()
  
  useEffect(() => {
    console.log(values);  // This will log the state whenever it changes
  }, [values]);
  
  
  function handleSubmit(e: { preventDefault: () => void }) {
    e.preventDefault();  // Prevent the default form submission
    console.log('Form submitted with values:', values);
  
    axios.post('/api/add_course', values)
        .then((res) => {
            navigate('/admin_course');
            console.log(res);
        })
        .catch((err) => console.log(err));
  }
  
  
    return (
      <div>
        <AdminNavbar/>
      <div className="container vh-100 d-flex align-items-center justify-content-center">
      <div className="card shadow-lg p-4 w-50 bg-light">
          <h3 className="text-center text-primary mb-4">Add Student</h3>
          
          <div className="d-flex justify-content-end">
              <Link to="/admin_course" className="btn btn-outline-success btn-sm">🏠 Courses</Link>
          </div>
          
          <form onSubmit={handleSubmit}>
          <div className="form-group my-3">
                  <label htmlFor="course_id" className="fw-bold">Course ID</label>
                  <input 
                      type="text" 
                      name="course_id" 
                      className="form-control" 
                      placeholder="Enter course id" 
                      required 
                      onChange={(e) => setValues({ ...values, course_id: e.target.value })} 
                  />
              </div>
              <div className="form-group my-3">
                  <label htmlFor="course_name" className="fw-bold">Course Name</label>
                  <input 
                      type="text" 
                      name="course_name" 
                      className="form-control" 
                      placeholder="Enter course name" 
                      required 
                      onChange={(e) => setValues({ ...values, course_name: e.target.value })} 
                  />
              </div>
  
              <div className="form-group text-center mt-4">
                  <button type="submit" className="btn btn-primary w-100">💾 Save</button>
              </div>
          </form>
      </div>
      </div>
      </div>
    )
  }

export default CreateCourse