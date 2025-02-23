import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify'
import "react-toastify/dist/ReactToastify.css";
import Swal from 'sweetalert2';
import Navbar from '../components/Navbar';

interface Courses {
  id: number;
  course_number: number;
  name: string;
  student_count: number;
}

function Courses() {
    const [data, setData] = useState<Courses[]>([]);
    const [deleted, setDeleted] = useState(true)
    useEffect(()=>{
        if(deleted){
            setDeleted(false)
        axios.get('/api/courses') //TODO
        .then((res)=>{
            setData(res.data)
        })
        .catch((err) => {
            console.log(err);
            toast.error("Failed to fetch course details");
        });
    }
    }, [deleted])

    function handleDelete(id: any){
        Swal.fire({
            title: 'Are you sure?',
            text: 'You won\'t be able to revert this!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
          }).then((result) => {
            if (result.isConfirmed) {
                axios.delete(`/api/courses/delete/${id}`)
                .then((res)=>{
                    setDeleted(true)
                    Swal.fire(
                        'Deleted!',
                        'Your course has been deleted.',
                        'success'
                    );
                })
                .catch((err) => {
                    console.log(err);
                    Swal.fire({
                        title: 'Error!',
                        text: 'Could not delete course',
                        icon: 'error',
                        confirmButtonText: 'OK'
                      });
                });
            }
          });
    }
  return (
    <>
    <Navbar />
    <div className="container py-5">
            <div className="card shadow-lg p-4">
                <h3 className="text-center text-primary mb-4">Course List</h3>

                <div className="d-flex justify-content-between align-items-center mb-3">
                    <Link to="/" className="btn btn-outline-success btn-sm">🏠 Log Out</Link>
                    <Link className="btn btn-success" to="/createcourse">
                        + Add Course
                    </Link>
                </div>

                <div className="table-responsive">
                    <table className="table table-striped table-hover">
                        <thead className="table-dark">
                            <tr>
                                <th>Course ID</th>
                                <th>Name</th>
                                <th>Student Count</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((course) => (
                                <tr key={course.id}>
                                    <td>{course.course_number}</td>
                                    <td>{course.name}</td>
                                    <td>{course.student_count}</td>
                                    <td>
                                        <Link className="btn btn-info btn-sm me-2" to={`/courses/read/${course.id}`}>
                                            View
                                        </Link>
                                        <Link className="btn btn-warning btn-sm me-2" to={`/courses/edit/${course.id}`}>
                                            Edit
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(course.id)}
                                            className="btn btn-danger btn-sm"
                                        >
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
        </>
  )
}

export default Courses