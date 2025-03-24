import axios from "axios";
import React, { useEffect, useState } from "react";
import StudentNavbar from "../../components/StudentNavbar";
import { toast } from 'react-toastify';

interface Student {
  student_id: string;
  first_name?: string;
  email?: string;
  studentcourse_id?: string;
  profile_pic?: string;
}

interface Course {
    course_id: string;
    course_name: string;
}

const StudentProfile = () => {
  const [student, setStudent] = useState<Student | null>(null);
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [preview, setPreview] = useState<string>('');;
  const student_id = sessionStorage.getItem("student_id");

  const fetchStudent = async () => {
    if (!student_id) {
      console.error("No student ID found in session.");
      return;
    }

    try {
      const res = await axios.get(`/api/getstudent_studentid/${student_id}`);
      console.log("Student Data:", res.data);


      // If API returns an array, select the first object
      const studentData = Array.isArray(res.data) ? res.data[0] : res.data;
      setStudent({ ...studentData });

      if (studentData.profile_pic) {
        setPreview(`/api/uploadProfilePic/${studentData.profile_pic}`);
      }
    } catch (error) {
      console.error("Error fetching student:", error);
    }
  };

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      setSelectedFile(file);
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
    }
  };

  // Handle file upload to backend
  const handleFileUpload = async () => {
    if (!selectedFile) {
      alert('Please select an image first!');
      return;
    }

    const formData = new FormData();
    formData.append('profile_pic', selectedFile);

    try {
      const res = await axios.post(`/api/uploadProfilePic/${student?.student_id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log(res.data);
      alert('Profile picture uploaded successfully');
      fetchStudent();  // Refresh the student data to show updated picture
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      alert('Error uploading profile picture');
    }
  };


  useEffect(() => {
    fetchStudent();
  }, [student_id]);

  const profilePicName = `/api${student?.profile_pic} `
  //console.log("profilePicName " +profilePicName)
  

  return (
    <div>
      <StudentNavbar />
      <div className="container mt-5">
  {/* Profile Header with Background */}
  <div className="bg-primary text-white rounded-top shadow-lg p-4 text-center">
    <h2 className="fw-bold">Student Profile</h2>
  </div>

  {/* Profile Card */}
  <div className="card shadow-lg border-0 rounded-bottom overflow-hidden">
    <div className="card-body text-center">
      {/* Profile Image */}
      <div className="position-relative mt-n5">
      <img
        src={profilePicName}
        alt="Profile"
        className="rounded-circle border border-3 border-white shadow-sm"
        width="200"
        height="200"
        onError={(e) => (e.currentTarget.src = "https://cdn-icons-png.flaticon.com/512/847/847969.png")}
        />
      </div>

      {/* Student Info */}
      {student ? (
        <>
          <h3 className="fw-bold mt-3">{student.first_name || "No Name Available"}</h3>
          <p className="text-muted">{student.email || "No Email Available"}</p>
          {/* <p className="badge bg-primary fs-6">{student.studentcourse_id || "No Course Assigned"}</p> */}

          {/* Upload Profile Picture */}
          <div className="mt-4">
           <input type="file" className="form-control" onChange={handleFileChange} />
            <button className="btn btn-success mt-2" onClick={handleFileUpload}>
              Upload Profile Picture</button>
          </div>
        </>
      ) : (
        <p className="text-muted mt-3">Loading student details...</p>
      )}
    </div>
  </div>
</div>

    </div>
  );
};

export default StudentProfile;
