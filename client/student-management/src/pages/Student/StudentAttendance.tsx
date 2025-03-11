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
}

const StudentAttendance = () => {
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  
  const fetchAttendance = async () =>{
    try {
      const response = await axios.get("/api/student_attendance"); // Call API
      setAttendance(response.data); // Update state with API data
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
            <h1>Lecture Attendance </h1>

            <div  className="container mx-auto p-6">
            <div className="w-full max-w-4xl ">
             {/* Attendance  Table */}
             {attendance.length > 0 && (
                 <div className="overflow-x-auto">
                 <table className="w-full border-collapse border border-gray-200 shadow-md rounded-lg">
                   <thead>
                     <tr className="bg-gray-200 text-gray-700">
                       <th className="border p-3">Lecture Date & Time</th>
                       <th className="border p-3">Lecture Joined Date & Time</th>
                       <th className="border p-3">Present/Absent</th>
                     </tr>
                   </thead>
                   <tbody>
            {attendance
              .filter((attendance) => attendance.student_id === studentId)
              .map((attendance) => (
                <tr key={attendance.id} className="text-center bg-white">
                  <td className="border p-3">{new Date(attendance.class_date).toLocaleString()}</td>
                  <td className="border p-3">{new Date(attendance.joineddate_time).toLocaleString()}</td>
                  <td className="border p-3">{attendance.present_absent}</td>
                </tr>
              ))}
          </tbody>
                 </table>
               </div>
             )}
            </div>
            </div>
        </div>
    </div>
  )
}

export default StudentAttendance