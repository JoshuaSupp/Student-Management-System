import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import AdminNavbar from "../../components/AdminNavbar";


interface Course {
  course_id: number; 
  course_name: string;
}

interface Student {
  student_id: string,
  id: number | null;
  first_name: string;
  email: string;
  age: number | null;
  gender: string;
  studentcourse_id: string;
}


function Edit() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [data, setData] = useState<Student[]>([{
    student_id: '',
    id: null,
    first_name: '',
    email: '',
    age: null,
    gender: '',
    studentcourse_id: '',
  }]);

  const { id } = useParams();

  useEffect(() => {
    axios
      .get(`/api/get_student/${id}`)
      .then((res) => {
        setData(res.data);
        console.log("Students Data",res.data)
        setSelectedCourseId(res.data[0].studentcourse_id);
      })
      .catch((err) => console.log(err));
  }, [id]);

  const navigate = useNavigate();

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

  const [selectedCourseId, setSelectedCourseId] = useState('');


  const handleCourseChange = (e: { target: { value: any; }; }) => {
    const courseId = e.target.value;
    setSelectedCourseId(courseId); // Update selected course ID
    setData([{ ...data[0], studentcourse_id: courseId }]); // Update studentcourse_id in data
};


  function handleSubmit(e: { preventDefault: () => void; }) {
    e.preventDefault();

    axios
      .post(`/api/edit_user/${id}`, data[0])
      .then((res) => {
        navigate("/students");
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
      <Link to="/students" className="btn btn-outline-dark mb-3">
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
  
          <div className="form-group my-3">
                <label htmlFor="gender" className="fw-bold">Gender</label>
                <select 
                    name="gender" 
                    className="form-select"  
                    value={data[0].gender}
                    required 
                    onChange={(e) => setData([{ ...data[0], gender: e.target.value }])}
                >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                </select>
          </div>
  
          <div className="mb-3">
            <label htmlFor="age" className="form-label">Age</label>
            <input
              value={data[0].age ?? ''}
              type="number"
              name="age"
              className="form-control"
              required
              onChange={(e) => setData([{ ...data[0], age: Number(e.target.value) }])}
            />
          </div>
          
          <div className="form-group my-3">
                <label htmlFor="studentcourse_id" className="fw-bold">Course Name</label>
                <select 
                  name="studentcourse_id" 
                  className="form-select"  
                  value={selectedCourseId} 
                  onChange={handleCourseChange}
                  required 
              >
                <option value="" disabled>Select a Course</option>
                  {courses.map((course) => (
                      <option key={course.course_id} value={course.course_id}>
                          {course.course_name}
                      </option>
                  ))}
              </select>
            </div>

  
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

export default Edit;