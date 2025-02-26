import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import AdminNavbar from "../components/AdminNavbar";

interface Course {
  course_id: string,
  course_name: string;
}

function EditCourse() {
  const [data, setData] = useState<Course[]>([]);
  const { id } = useParams();
  useEffect(() => {
    axios
      .get(`/api/get_course/${id}`)
      .then((res) => {
        setData(res.data);
        console.log("Course Data",res.data)
      })
      .catch((err) => console.log(err));
  }, [id]);

  const navigate = useNavigate();

  function handleSubmit(e: { preventDefault: () => void; }) {
    e.preventDefault();

    axios
      .post(`/api/edit_course/${id}`, data[0])
      .then((res) => {
        navigate("/admin_course");
        console.log(res);
      })
      .catch((err) => console.log(err));
  }

  return (
    <div>
      <AdminNavbar/>
    <div className="container-fluid vw-100 vh-100 bg-primary d-flex justify-content-center align-items-center">
    <div className="card p-4 shadow-lg" style={{ width: "400px" }}>
      <h2 className="text-center mb-4">Edit Course</h2>
      <Link to="/admin_course" className="btn btn-outline-dark mb-3">
        ← Back
      </Link>
      
      {data.length > 0 && (
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="course_id" className="form-label">Course ID</label>
            <input
              value={data[0].course_id}
              type="text"
              name="course_id"
              className="form-control"
              required
              onChange={(e) => setData([{ ...data[0], course_id: e.target.value }])}
              readOnly
              style={{ cursor: "not-allowed" }}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="course_name" className="form-label">Course Name</label>
            <input
              value={data[0].course_name}
              type="text"
              name="course_name"
              className="form-control"
              required
              onChange={(e) => setData([{ ...data[0], course_name: e.target.value }])}
            />
          </div>
  
          {/* <div className="mb-3">
            <label htmlFor="student_count" className="form-label">Student Count</label>
            <input
              value={data[0].student_count}
              type="student_count"
              name="text"
              className="form-control"
              required
              onChange={(e) => setData([{ ...data[0], student_count: Number(e.target.value) }])}
            />
          </div> */}
  
  
          <div className="d-flex justify-content-between">
            <button type="submit" className="btn btn-success">
              Save
            </button>
            <Link to="/students" className="btn btn-secondary">
              Cancel
            </Link>
          </div>
        </form>
      )}
    </div>
    </div>
  </div>
  );
}

export default EditCourse;