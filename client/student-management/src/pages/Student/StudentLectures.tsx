import React, { useEffect, useState } from 'react'
import StudentNavbar from '../../components/StudentNavbar'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface Meeting {
  id: number;
  title: string;
  start: string;
  end: string;
  course_name: string;
  url: string;
  course_id: string;
}

interface Course {
  course_id: number; 
  course_name: string;
}

interface Student{
  student_id: string;
  studentcourse_id: string;
}

const StudentLectures = () => {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [student, setStudent] = useState<Student[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  
  //fetch meetings
  const fetchMeetings = async () => {
    try {
      const response = await axios.get("/api/meetings"); // Call API
      setMeetings(response.data); // Update state with API data
    } catch (error) {
      console.error("Error fetching meetings:", error);
    }
  };
 
  //fetch courses
  const fetchCourses = async () => {
    try {
      const response = await axios.get("/api/admin_courses"); 
      setCourses(response.data);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  const studentCourseId = sessionStorage.getItem("studentcourse_id");

  const markAttendance = async ( meeting: any) => {
    const studentId = sessionStorage.getItem("student_id");
    const studentCourseId = sessionStorage.getItem("studentcourse_id");
    const now = new Date();
    const startTime = new Date(meeting.start)
    const endTime = new Date(meeting.end)

    console.log(studentId)
  
    if (!studentId || !studentCourseId) {
      console.error("Student ID or Course ID not found in sessionStorage");
      return;
    }
 
  if(now >= startTime && now <= endTime){
  const attendanceData = {
    student_id: studentId,
    course_id: studentCourseId,
    joineddate_time: new Date().toISOString(), // Current Date & Time
    class_date: new Date(meeting.classDate).toISOString(), 
    present_absent: "Present",
  };

  //console.log("Sending attendance data:", attendanceData);

  try {
    const response = await fetch("/api/mark_attendance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(attendanceData),
    });
    
    if (response.ok) {
      console.log("Attendance marked successfully!");
    } else {
      console.error("Failed to mark attendance");
    }
  } catch (error) {
    console.error("Error marking attendance:", error);
  }
}
  };

  const fetchTimeInterval = async () => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    console.log("Time Interval",interval )
    return () => clearInterval(interval);
  }

  useEffect(() => {
    fetchMeetings();  
    fetchCourses();
    fetchTimeInterval();
  }, []);
  
  return (
  <div>
    <StudentNavbar />
    <div  className="container mx-auto p-6">
    <div className="w-full max-w-4xl ">
    <h1 className="text-2xl font-bold mb-4">Lectures</h1>
    {/* Meeting List Table */}
    {meetings.length > 0 && (
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-200 shadow-md rounded-lg">
          <thead>
            <tr className="bg-gray-200 text-gray-700">
              <th className="border p-3">Title</th>
              <th className="border p-3">Start Time</th>
              <th className="border p-3">End Time</th>
              <th className="border p-3">Course</th>
              <th className="border p-3">Google Meet Link</th>
            </tr>
          </thead>
          <tbody>
            {meetings
              .filter((meeting) => meeting.course_id === studentCourseId)
              .map((meeting) => (
                <tr key={meeting.id} className="text-center bg-white">
                  <td className="border p-3">{meeting.title}</td>
                  <td className="border p-3">{new Date(meeting.start).toLocaleString()}</td>
                  <td className="border p-3">{new Date(meeting.end).toLocaleString()}</td>
                  <td className="border p-3">{meeting.course_name || "N/A"}</td>
                  <td className="border p-3">
                    <a
                      href={meeting.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:text-blue-700 underline"
                      onClick={() => markAttendance( meeting)}
                    >
                      Join Meeting
                    </a>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    )}
    </div>
    </div>

  </div>
  )
}

export default StudentLectures