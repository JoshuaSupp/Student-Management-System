import React, { useEffect, useState } from 'react'
import StudentNavbar from '../../components/StudentNavbar'
import axios from 'axios';



interface Attendance {
  id: number;
  student_id: string;
  course_id: string;
  joineddate_time: string;
  class_date: string;
  present_absent: string;
  lecture_title: string;
}

const StudentAttendance = () => {
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  
  const fetchAttendance = async () =>{
    try {
      const response = await axios.get("/api/student_attendance"); 
      setAttendance(response.data); 
      console.log(response.data)
    } catch (error) {
      console.error("Error fetching meetings:", error);
    }
  }

  const studentId = sessionStorage.getItem("student_id");

  useEffect(() => {
   fetchAttendance();
  }, []);

  return (
    <div>
    <StudentNavbar/>
        <div>         
        <div className="container mt-4">
  <div className="mx-auto" style={{ maxWidth: "900px" }}>
    <h1 className="text-center fw-bold mb-4">Lecture Attendance</h1>

    {/* Attendance Table */}
    {attendance.length > 0 ? (
      <div className="table-responsive">
        <table className="table table-bordered table-striped table-hover shadow-sm">
          <thead className="table-dark text-light">
            <tr className="text-center">
              <th className="p-3">Lecture</th>
              <th className="p-3">Lecture Date & Time</th>
              <th className="p-3">Lecture Joined Date & Time</th>
              <th className="p-3">Present/Absent</th>
            </tr>
          </thead>
          <tbody>
            {attendance
              .filter((attendance) => attendance.student_id === studentId)
              .map((attendance) => (
                <tr key={attendance.id} className="text-center">
                  <td className="fw-bold text-primary">{attendance.lecture_title}</td>
                  <td>{new Date(attendance.class_date).toLocaleString()}</td>
                  <td>
                    {attendance.joineddate_time
                      ? new Date(attendance.joineddate_time).toLocaleString()
                      : "Didn't join the class"}
                  </td>
                  <td
                    className={
                      attendance.present_absent === "Present"
                        ? "text-success fw-bold"
                        : "text-danger fw-bold"
                    }
                  >
                    {attendance.present_absent}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    ) : (
      <p className="text-center text-muted">No attendance records found.</p>
    )}
  </div>
</div>

        </div>
    </div>
  )
}

export default StudentAttendance