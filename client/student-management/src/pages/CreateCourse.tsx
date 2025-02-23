import React, { useEffect, useState } from 'react'
import axios from 'axios'
import {Link, useNavigate} from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify'
import "react-toastify/dist/ReactToastify.css";



const CreateCourse = () => {
  const [values, setValues] = useState({
    course_number: '',
    name: '',
    student_count: '',
})

const navigate = useNavigate()

useEffect(() => {
  console.log(values);  // This will log the state whenever it changes
}, [values]);


function handleSubmit(e: { preventDefault: () => void }) {
  e.preventDefault();  // Prevent the default form submission
  console.log('Form submitted with values:', values);

  axios.post('/api/courses/add', values)
      .then((res) => {
          toast.success('Course added', { position: "top-center", autoClose: 1000 });
          navigate('/courses');
          console.log(res);
      })
      .catch((err) => {
        console.log(err);
        toast.error('Failed to add course', { position: "top-center", autoClose: 1000 });
      });
}


  return (
    <div className="container vh-100 d-flex align-items-center justify-content-center">
    <div className="card shadow-lg p-4 w-50 bg-light">
        <h3 className="text-center text-primary mb-4">Add Course</h3>
        
        <div className="d-flex justify-content-end">
            <Link to="/courses" className="btn btn-outline-success btn-sm">🏠 Home</Link>
        </div>
        
        <form onSubmit={handleSubmit}>
        <div className="form-group my-3">
                <label htmlFor="course_number" className="fw-bold">Course ID</label>
                <input 
                    type="text" 
                    name="course_number" 
                    className="form-control" 
                    placeholder="Enter Course number" 
                    required 
                    onChange={(e) => setValues({ ...values, course_number: e.target.value })} 
                />
            </div>

            <div className="form-group my-3">
                <label htmlFor="name" className="fw-bold">Course Name</label>
                <input 
                    type="text" 
                    name="name" 
                    className="form-control" 
                    placeholder="Enter course name" 
                    required 
                    onChange={(e) => setValues({ ...values, name: e.target.value })} 
                />
            </div>

            <div className="form-group my-3">
                <label htmlFor="student_count" className="fw-bold">Student Count</label>
                <input 
                    type="number" 
                    name="student_count" 
                    className="form-control" 
                    placeholder="Enter student count" 
                    required 
                    onChange={(e) => setValues({ ...values, student_count: e.target.value })} 
                />
            </div>

            <div className="form-group text-center mt-4">
                <button type="submit" className="btn btn-primary w-100">💾 Save</button>
            </div>
        </form>
    </div>
</div>
  )
}

export default CreateCourse