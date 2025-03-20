import React, { useState, useEffect } from "react";
import axios from "axios"; // Import axios to fetch data

interface Meeting {
  id: number;
  title: string;
  start: string;
  end: string;
  course_name: string;
  url: string;
  course_id: string;
}

const StudentLectureNotification = () => {
  const [upcomingMeetings, setUpcomingMeetings] = useState<Meeting[]>([]);
  
  const studentCourseId = sessionStorage.getItem("studentcourse_id")
  //console.log("student Course id",studentCourseId)

  // Fetch meetings from the API
  const fetchMeetings = async () => {
    try {
      const response = await axios.get("/api/meetings"); // Fetch all meetings
      const meetings: Meeting[] = response.data;
      
      // Filter upcoming meetings (next 24 hours)
      const now = new Date();
      const next24Hours = new Date();
      next24Hours.setHours(now.getHours() + 24);

      const filteredMeetings = meetings.filter((meeting) => {
        const startTime = new Date(meeting.start);
        return startTime > now && startTime <= next24Hours &&
        meeting.course_id === studentCourseId;
      });

      setUpcomingMeetings(filteredMeetings);
    } catch (error) {
      console.error("Error fetching meetings:", error);
    }
  };

  
  useEffect(() => {
    fetchMeetings();
    const interval = setInterval(fetchMeetings, 60000); // Refresh every 60 seconds
    return () => clearInterval(interval); // Cleanup interval on unmount
  }, []);

  return (
    <div className="alert alert-warning text-dark text-center fw-semibold">
    {upcomingMeetings.length > 0 ? (
        upcomingMeetings.map((meeting) => (
        <p key={meeting.id} className="mb-1">
            📢 <strong>Upcoming Lecture:</strong> {meeting.title} at {new Date(meeting.start).toLocaleString()}
        </p>
        ))
    ) : (
        <p>✅ No upcoming classes in the next 24 hours.</p>
    )}
    </div>

  );
};

export default StudentLectureNotification;
