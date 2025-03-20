import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import AdminNavbar from "../../components/AdminNavbar";

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
  const [deleted, setDeleted] = useState(true);
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);

  useEffect(() => {
    if (deleted) {
      setDeleted(false);
      axios
        .get("/api/students")
        .then((res) => {
          setData(res.data);
        })
        .catch((err) => console.log(err));

      axios
        .get("/api/admin_courses")
        .then((res) => {
          setCourses(res.data);
        })
        .catch((err) => console.log(err));
    }
  }, [deleted]);

  function handleDelete(student_id: string) {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`/api/delete/${student_id}`)
          .then(() => {
            setDeleted(true);
            Swal.fire("Deleted!", "The student has been removed.", "success");
          })
          .catch((err) => console.log(err));
      }
    });
  }

  return (
    <div>
      <AdminNavbar />
      <div className="container py-5">
        <div className="card shadow-lg p-4">
          <h3 className="text-center text-primary mb-4">Students List</h3>

          {/* Navbar for Selecting Courses */}
          <ul className="nav nav-pills mb-3 justify-content-center">
            <li className="nav-item">
              <button
                className={`nav-link ${selectedCourseId === null ? "active" : ""}`}
                onClick={() => setSelectedCourseId(null)}
              >
                All Courses
              </button>
            </li>
            {courses.map((course) => (
              <li key={course.course_id} className="nav-item">
                <button
                  className={`nav-link ${selectedCourseId === course.course_id ? "active" : ""}`}
                  onClick={() => setSelectedCourseId(course.course_id)}
                >
                  {course.course_name}
                </button>
              </li>
            ))}
          </ul>

          <div className="d-flex justify-content-between align-items-center mb-3">
            <Link to="/" className="btn btn-outline-success btn-sm">
              🏠 Log Out
            </Link>
            <Link className="btn btn-success" to="/createstudent" id="addStudent">
              + Add Student
            </Link>
          </div>

          {/* Table */}
          <div className="table-responsive">
            <table className="table table-striped table-hover">
              <thead className="table-dark">
                <tr>
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
                {data
                  .filter((student) =>
                    selectedCourseId ? student.studentcourse_id === selectedCourseId : true
                  )
                  .map((student) => (
                    <tr key={student.id}>
                      <td>{student.student_id}</td>
                      <td>{student.first_name}</td>
                      <td>{student.email}</td>
                      <td>{student.age}</td>
                      <td>{student.gender}</td>
                      <td>
                        {courses.find((course) => course.course_id === student.studentcourse_id)
                          ?.course_name || "N/A"}
                      </td>
                      <td>
                        <Link className="btn btn-info btn-sm me-2" to={`/read/${student.id}`}>
                          View
                        </Link>
                        <Link className="btn btn-warning btn-sm me-2" to={`/edit/student/${student.id}`}>
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(student.student_id)}
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

          {data.filter((student) => selectedCourseId ? student.studentcourse_id === selectedCourseId : true).length === 0 && (
            <p className="text-center text-muted mt-3">No students found for this course.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
