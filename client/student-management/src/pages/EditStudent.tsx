import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import AdminNavbar from "../components/AdminNavbar";

interface Student {
  student_id: string,
  id: number;
  first_name: string;
  email: string;
  age: number;
  gender: string;
}

function Edit() {
  const [data, setData] = useState<Student[]>([]);
  const { id } = useParams();
  useEffect(() => {
    axios
      .get(`/api/get_student/${id}`)
      .then((res) => {
        setData(res.data);
        console.log("Students Data",res.data)
      })
      .catch((err) => console.log(err));
  }, [id]);

  const navigate = useNavigate();

  function handleSubmit(e: { preventDefault: () => void; }) {
    e.preventDefault();

    axios
      .post(`/api/edit_user/${id}`, data[0])
      .then((res) => {
        navigate("/home");
        console.log(res);
      })
      .catch((err) => console.log(err));
  }

  return (
    <div>
      <AdminNavbar/>
    <div className="container-fluid vw-100 vh-100 bg-primary d-flex justify-content-center align-items-center">
    <div className="card p-4 shadow-lg" style={{ width: "400px" }}>
      <h2 className="text-center mb-4">Edit User</h2>
      <Link to="/home" className="btn btn-outline-dark mb-3">
        ← Back
      </Link>
      
      {data.length > 0 && (
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="student_id" className="form-label">Student ID</label>
            <input
              value={data[0].student_id}
              type="text"
              name="student_id"
              className="form-control"
              required
              onChange={(e) => setData([{ ...data[0], student_id: e.target.value }])}
              readOnly
              style={{ cursor: "not-allowed" }}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="first_name" className="form-label">First Name</label>
            <input
              value={data[0].first_name}
              type="text"
              name="first_name"
              className="form-control"
              required
              onChange={(e) => setData([{ ...data[0], first_name: e.target.value }])}
            />
          </div>
  
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              value={data[0].email}
              type="email"
              name="email"
              className="form-control"
              required
              onChange={(e) => setData([{ ...data[0], email: e.target.value }])}
            />
          </div>
  
          <div className="mb-3">
            <label htmlFor="gender" className="form-label">Gender</label>
            <input
              value={data[0].gender}
              type="text"
              name="gender"
              className="form-control"
              required
              onChange={(e) => setData([{ ...data[0], gender: e.target.value }])}
            />
          </div>
  
          <div className="mb-3">
            <label htmlFor="age" className="form-label">Age</label>
            <input
              value={data[0].age}
              type="number"
              name="age"
              className="form-control"
              required
              onChange={(e) => setData([{ ...data[0], age: Number(e.target.value) }])}
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
  </div>
  );
}

export default Edit;