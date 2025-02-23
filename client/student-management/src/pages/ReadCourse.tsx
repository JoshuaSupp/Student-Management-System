import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from 'react-toastify'
import "react-toastify/dist/ReactToastify.css";


function ReadCourse() {
  const [data, setData] = useState([]);
  const { id } = useParams();
 
  useEffect(() => {
    axios
      .get(`/api/courses/get/${id}`)
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => {
        console.log(err);
        toast.error("Course not found", { position: "top-center", autoClose: 1000 });
      });
      
  }, [id]);
  

  return (
    <div className="container-fluid vw-100 vh-100 bg-primary d-flex justify-content-center align-items-center">
    <div className="card p-4 shadow-lg" style={{ width: "400px" }}>
    <h2 className="text-center mb-3">Course Details</h2>
    <Link to="/courses" className="btn btn-outline-primary mb-3">
      ← Back
    </Link>

    {data.map((course) => (
      <ul className="list-group">
        <li className="list-group-item"><b>ID:</b> {course["course_number"]}</li>
        <li className="list-group-item"><b>Name:</b> {course["name"]}</li>
        <li className="list-group-item"><b>Student Count:</b> {course["student_count"]}</li>
      </ul>
    ))}
  </div>
</div>

  );
}

export default ReadCourse;