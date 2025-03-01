import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Swal from 'sweetalert2';
import AdminNavbar from '../../components/AdminNavbar';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Student {
  id: number;
  student_id: string;
  first_name: string;
  email: string;
  age: number;
  gender: string;
  studentcourse_id: number;
}

interface Course {
    course_id: number; 
    course_name: string;
}

function Home() {
    const [data, setData] = useState<Student[]>([]);
    const [deleted, setDeleted] = useState(true)
    const [courses, setCourses] = useState<Course[]>([]);
    const [selectedCourseId, setSelectedCourseId] = useState('');

    useEffect(()=>{
        if(deleted){
            setDeleted(false)
        axios.get('/api/students')
        .then((res)=>{
            setData(res.data)
        })
        .catch((err)=>console.log(err))

        axios.get('/api/admin_courses') 
        .then((res) => {
            setCourses(res.data); 
        })
        .catch((err) => console.log(err));
    }
    }, [deleted])
    
    function handleDelete(id: any){
        axios.delete(`/api/delete/${id}`)
        .then((res)=>{
            setDeleted(true)
        })
        .catch((err)=> console.log(err))
    }

       // Create a mapping of course IDs to course names
    const courseMap = new Map<number, string>();
    courses.forEach(course => {
        return courseMap.set(course.course_id, course.course_name);
    });
  return (
    <div>
        <AdminNavbar/>
        <div className="container py-5">
                <div className="card shadow-lg p-4">
                    <h3 className="text-center text-primary mb-4">Students List</h3>

                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <Link to="/" className="btn btn-outline-success btn-sm">🏠 Log Out</Link>
                        <Link className="btn btn-success" to="/createstudent">
                            + Add Student
                        </Link>
                    </div>

                    <div className="table-responsive">
                        <table className="table table-striped table-hover">
                            <thead className="table-dark">
                                <tr>
                                    {/* <th>ID</th> */}
                                    <th>Student ID</th>
                                    <th>First Name</th>
                                    <th>Email</th>
                                    <th>Age</th>
                                    <th>Gender</th>
                                    <th>Course</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.map((student) => (
                                    <tr key={student.id}>
                                        {/* <td>{student.id}</td> */}
                                        <td>{student.student_id}</td>
                                        <td>{student.first_name}</td>
                                        <td>{student.email}</td>
                                        <td>{student.age}</td>
                                        <td>{student.gender}</td>
                                        <td>{courseMap.get(student.studentcourse_id) || 'N/A'}</td> 
                                        <td>
                                            <Link className="btn btn-info btn-sm me-2" to={`/read/${student.id}`}>
                                                View
                                            </Link>
                                            <Link className="btn btn-warning btn-sm me-2" to={`/edit/student/${student.id}`}>
                                                Edit
                                            </Link>
                                            <button 
                                                onClick={() => {
                                                    Swal.fire({
                                                    title: "Are you sure?",
                                                    text: "You won't be able to revert this!",
                                                    icon: "warning",
                                                    showCancelButton: true,
                                                    confirmButtonColor: "#d33",
                                                    cancelButtonColor: "#3085d6",
                                                    confirmButtonText: "Yes, delete it!"
                                                    }).then((result) => {
                                                    if (result.isConfirmed) {
                                                        handleDelete(student.id);
                                                        Swal.fire("Deleted!", "The student has been removed.", "success");
                                                    }
                                                    });
                                                }}
                                                className="btn btn-danger btn-sm">
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
        </div>
    </div>
  )
}

export default Home