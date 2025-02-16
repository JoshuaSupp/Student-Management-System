import React, { useEffect, useState } from 'react'
import axios from 'axios'
import {Link, useNavigate} from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify'
import "react-toastify/dist/ReactToastify.css";



const CreateStudent = () => {
  const [values, setValues] = useState({
    first_name: '',
    email: '',
    age: '',
    gender: ''
})

const navigate = useNavigate()

useEffect(() => {
  console.log(values);  // This will log the state whenever it changes
}, [values]);


function handleSubmit(e: { preventDefault: () => void }) {
  e.preventDefault();  // Prevent the default form submission
  console.log('Form submitted with values:', values);

  axios.post('/api/add_user', values)
      .then((res) => {
          toast.success('Student added', { position: "top-center", autoClose: 1000 });
          navigate('/home');
          console.log(res);
      })
      .catch((err) => {
        console.log(err);
        toast.error('Failed to add student', { position: "top-center", autoClose: 1000 });
      });
}


  return (
    <div className="container vh-100 d-flex align-items-center justify-content-center">
    <div className="card shadow-lg p-4 w-50 bg-light">
        <h3 className="text-center text-primary mb-4">Add Student</h3>
        
        <div className="d-flex justify-content-end">
            <Link to="/home" className="btn btn-outline-success btn-sm">🏠 Home</Link>
        </div>
        
        <form onSubmit={handleSubmit}>
            <div className="form-group my-3">
                <label htmlFor="first_name" className="fw-bold">First Name</label>
                <input 
                    type="text" 
                    name="first_name" 
                    className="form-control" 
                    placeholder="Enter student name" 
                    required 
                    onChange={(e) => setValues({ ...values, first_name: e.target.value })} 
                />
            </div>

            <div className="form-group my-3">
                <label htmlFor="email" className="fw-bold">Email</label>
                <input 
                    type="email" 
                    name="email" 
                    className="form-control" 
                    placeholder="Enter student email" 
                    required 
                    onChange={(e) => setValues({ ...values, email: e.target.value })} 
                />
            </div>

            <div className="form-group my-3">
                <label htmlFor="gender" className="fw-bold">Gender</label>
                <select 
                    name="gender" 
                    className="form-select" 
                    required 
                    onChange={(e) => setValues({ ...values, gender: e.target.value })}
                >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                </select>
            </div>

            <div className="form-group my-3">
                <label htmlFor="age" className="fw-bold">Age</label>
                <input 
                    type="number" 
                    name="age" 
                    className="form-control" 
                    placeholder="Enter student age" 
                    required 
                    onChange={(e) => setValues({ ...values, age: e.target.value })} 
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

export default CreateStudent