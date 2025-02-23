import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from 'react-toastify'
import "react-toastify/dist/ReactToastify.css";


interface Course {
  id: number;
  course_number: string;
  name: string;
  student_count: number;
}

function EditCourse() {
  const [data, setData] = useState<Course[]>([]);
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

  const navigate = useNavigate();

  function handleSubmit(e: { preventDefault: () => void; }) {
    e.preventDefault();

    console.log("Data being sent to server:", data[0]);

    axios
      .post(`/api/courses/edit/${id}`, data[0])
      .then((res) => {
        navigate("/courses");
        console.log(res);
        toast.success("Course updated successfully", { position: "top-center", autoClose: 1000 });
      })
      .catch((err) => {
        console.log(err);
        toast.error("Failed to update course", { position: "top-center", autoClose: 1000 });
      });
  }

  return (
    <div className="container-fluid vw-100 vh-100 bg-primary d-flex justify-content-center align-items-center">
    <div className="card p-4 shadow-lg" style={{ width: "400px" }}>
      <h2 className="text-center mb-4">Edit Course</h2>
      <Link to="/courses" className="btn btn-outline-dark mb-3">
        ← Back
      </Link>
      
      {data.length > 0 && (
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="course_number" className="form-label">Course Number</label>
            <input
              value={data[0].course_number}
              type="text"
              name="course_number"
              className="form-control"
              disabled
              onChange={(e) => setData([{ ...data[0], course_number: e.target.value }])}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="name" className="form-label">Name</label>
            <input
              value={data[0].name}
              type="text"
              name="name"
              className="form-control"
              required
              onChange={(e) => setData([{ ...data[0], name: e.target.value }])}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="student_count" className="form-label">Student Count</label>
            <input
              value={data[0].student_count}
              type="number"
              name="student_count"
              className="form-control"
              required
              onChange={(e) => setData([{ ...data[0], student_count: Number(e.target.value) }])}
            />
          </div>
  
          <div className="d-flex justify-content-between">
            <button type="submit" className="btn btn-success">
              Save
            </button>
            <Link to="/home" className="btn btn-secondary">
              Cancel
            </Link>
          </div>
        </form>
      )}
    </div>
  </div>
  
  );
}

export default EditCourse;