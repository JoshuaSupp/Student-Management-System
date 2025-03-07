import React, { useEffect, useState } from 'react'
import axios from 'axios'
import {Link, useNavigate} from 'react-router-dom'
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Course {
    course_id: number; 
    course_name: string;
}

const CreateStudent = () => {
  const [values, setValues] = useState({
    student_id: '',
    first_name: '',
    email: '',
    age: '',
    gender: '',
    studentcourse_id: ''
})
const [courses, setCourses] = useState<Course[]>([]);
const [selectedCourseId, setSelectedCourseId] = useState('');

const navigate = useNavigate()

useEffect(() => {
  console.log(values);  // This will log the state whenever it changes
}, [values]);

useEffect(() => {
    console.log("Selected Course ID:", selectedCourseId); // Log selected course ID

  }, [selectedCourseId]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get('/api/admin_courses'); 
        setCourses(response.data);
        console.log("Admin Courses",response.data)
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };

    fetchCourses();
  }, []);


const handleCourseChange = (e: { target: { value: any; }; }) => {
    const courseId = e.target.value;
    setSelectedCourseId(courseId); // Update the dedicated state for course ID

    setValues({
        ...values,
        studentcourse_id: courseId, // Make sure the existing "values" state knows about it too
    });
};

const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();

    try {
      const response = await axios.post('/api/add_student', {
        ...values,  // All the existing values
        studentcourse_id: selectedCourseId, // Explicitly override with selectedCourseId in case of issues
      });

      console.log('Student added successfully:', response.data);
      navigate('/students'); // Or wherever you want to navigate

    } catch (error) {
      console.error('Error adding student:', error);
      // Handle error - display a message to the user, etc.
    }
  };


  return (
    <div className="container vh-100 d-flex align-items-center justify-content-center">
    <div className="card shadow-lg p-4 w-50 bg-light">
        <h3 className="text-center text-primary mb-4">Add Student</h3>
        
        <div className="d-flex justify-content-end">
            <Link to="/students" className="btn btn-outline-success btn-sm">🏠 Students</Link>
        </div>
        
        <form onSubmit={handleSubmit}>
        <div className="form-group my-3">
                <label htmlFor="student_id" className="fw-bold">Student ID</label>
                <input 
                    type="text" 
                    name="student_id" 
                    className="form-control" 
                    placeholder="Enter student id" 
                    required 
                    onChange={(e) => setValues({ ...values, student_id: e.target.value })} 
                />
            </div>
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

            <div className="form-group my-3">
              <label htmlFor="studentcourse_id" className="fw-bold">Course Name</label>
              <select
                name="studentcourse_id"
                className="form-control"
                required
                value={selectedCourseId}
                onChange={handleCourseChange}
              >
                <option value="" disabled>Select a Course</option>
                {courses.map((course) => (
                  <option key={course.course_id} value={course.course_id}>
                    {course.course_name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group text-center mt-4">
                <button type="submit" className="btn btn-primary w-100">💾 Save</button>
            </div>
        </form>
        <ToastContainer/>
    </div>
</div>
  )
}

export default CreateStudent