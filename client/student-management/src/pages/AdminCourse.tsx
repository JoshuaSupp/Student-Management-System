import React, { useEffect, useState } from 'react'
import AdminNavbar from '../components/AdminNavbar';
import { Link } from 'react-router-dom'
import axios from 'axios'
import Swal from 'sweetalert2';

interface Courses{
    id: '',
    course_id: '',
    course_name: '',
}

const Courses = () => {
    const [data, setData] = useState<Courses[]>([]);
    const [deleted, setDeleted] = useState(true)

    useEffect(()=>{
        if(deleted){
            setDeleted(false)
        axios.get('/api/admin_courses')
        .then((res)=>{
            setData(res.data)
            console.log("Courses",res.data)
        })
        .catch((err)=>console.log(err))
    }
    }, [deleted])

    function handleDelete(id: any){
        axios.delete(`/api/course_delete/${id}`)
        .then((res)=>{
            setDeleted(true)
        })
        .catch((err)=> console.log(err))
    }
  return (
    <div>
    <AdminNavbar/>
    <div className="container py-5">
                <div className="card shadow-lg p-4">
                    <h3 className="text-center text-primary mb-4">Courses Available</h3>

                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <Link to="/" className="btn btn-outline-success btn-sm">🏠 Log Out</Link>
                        <Link className="btn btn-success" to="/create_course">
                            + Add Course
                        </Link>
                    </div>

                    <div className="table-responsive">
                        <table className="table table-striped table-hover">
                            <thead className="table-dark">
                                <tr>
                                    <th>Course ID</th>
                                    <th>Course Name</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.map((course) => (
                                    <tr key={course.id}>
                                        {/* <td>{student.id}</td> */}
                                        <td>{course.course_id}</td>
                                        <td>{course.course_name}</td>
                                        <td>
                                            <Link className="btn btn-warning btn-sm me-2" to={`/edit/course/${course.id}`}>
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
                                                        handleDelete(course.id);
                                                        Swal.fire("Deleted!", "The course has been removed.", "success");
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

export default Courses