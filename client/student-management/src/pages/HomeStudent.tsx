import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify'
import "react-toastify/dist/ReactToastify.css";
import Swal from 'sweetalert2';
import Navbar from '../components/Navbar';

interface Student {
  id: number;
  first_name: string;
  email: string;
  age: number;
  gender: string;
}

function Home() {
    const [data, setData] = useState<Student[]>([]);
    const [deleted, setDeleted] = useState(true)
    useEffect(()=>{
        if(deleted){
            setDeleted(false)
        axios.get('/api/students')
        .then((res)=>{
            setData(res.data)
        })
        .catch((err) => {
            console.log(err);
            toast.error("Failed to fetch students");
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
                axios.delete(`/api/delete/${id}`)
                .then((res)=>{
                    setDeleted(true)
                    Swal.fire(
                        'Deleted!',
                        'Your file has been deleted.',
                        'success'
                    );
                })
                .catch((err) => {
                    console.log(err);
                    Swal.fire({
                        title: 'Error!',
                        text: 'Could not delete student',
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
                                <th>Student ID</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Age</th>
                                <th>Gender</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((student) => (
                                <tr key={student.id}>
                                    <td>{student.student_number}</td>
                                    <td>{student.first_name}</td>
                                    <td>{student.email}</td>
                                    <td>{student.age}</td>
                                    <td>{student.gender}</td>
                                    <td>
                                        <Link className="btn btn-info btn-sm me-2" to={`/read/${student.id}`}>
                                            View
                                        </Link>
                                        <Link className="btn btn-warning btn-sm me-2" to={`/edit/${student.id}`}>
                                            Edit
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(student.id)}
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

export default Home