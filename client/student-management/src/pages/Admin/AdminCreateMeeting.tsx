import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import axios from "axios";
import AdminNavbar from "../../components/AdminNavbar";
import { EventApi } from '@fullcalendar/core';


interface Meeting {
  id: string;  
  title: string;
  start: string;
  end: string;
  url: string;
}

const AdminCreateMeeting = () => {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingMeeting, setEditingMeeting] = useState<Meeting | null>(null);

  // ✅ Fetch all meetings from backend
  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const response = await axios.get("/api/meetings");
        const formattedMeetings = response.data.map((meeting: any) => ({
          ...meeting,
          id: meeting.id.toString(),  // ✅ Convert ID to string
        }));
        setMeetings(formattedMeetings);
      } catch (error) {
        console.error("Error fetching meetings:", error);
      }
    };
    fetchMeetings();
  }, []);

  // ✅ Handle date selection & create meeting
  const handleDateSelect = async (selectInfo: { startStr: string; endStr: string }) => {
    const title = prompt("Enter Meeting Title:");
    if (!title) return;

    const start = selectInfo.startStr;
    const end = selectInfo.endStr;

    setLoading(true);

    try {
      const response = await axios.post("/api/create_meet", {
        title,
        start,
        end,
      });

      if (response.data.meetLink) {
        const newEvent: Meeting = {
          id: response.data.id,  // ✅ Convert ID to string
          title: `${title} (Google Meet)`,
          start,
          end,
          url: response.data.meetLink,
        };

        setMeetings((prevMeetings) => [...prevMeetings, newEvent]); // Update state
      } else {
        throw new Error("Failed to create meeting");
      }
    } catch (error) {
      console.error("Error creating meeting:", error);
      alert("Failed to create Google Meet. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Handle meeting deletion
  const handleDeleteMeeting = async (meetingId: number) => {
    if (!window.confirm("Are you sure you want to delete this meeting?")) return;

    try {
      await axios.delete(`/api/delete_meeting/${meetingId}`);
      setMeetings(meetings.filter((meeting) => meeting.id.toString() !== meetingId.toString())); // Remove from state
    } catch (error) {
      console.error("Error deleting meeting:", error);
      alert("Failed to delete meeting. Try again.");
    }
  };

    // Handle edit meeting
  const handleEditMeeting = (meeting: Meeting) => {
    console.log("Editing meeting:", meeting); 
    setEditingMeeting(meeting);
  };
  
  const saveEditedMeeting = async () => {
    if (!editingMeeting) return;
  
    try {
      const response = await axios.put(`/api/edit_meetings/${editingMeeting.id}`, {
        title: editingMeeting.title,
        start: editingMeeting.start,
        end: editingMeeting.end,
      });
  
      if (response.status === 200) {
        // ✅ Update state with the new meeting data
        setMeetings((prevMeetings) =>
          prevMeetings.map((m) => (m.id === editingMeeting.id ? response.data : m))
        );
  
        setEditingMeeting(null); // Close the form
      } else {
        throw new Error("Failed to update meeting");
      }
    } catch (error) {
      console.error("Error updating meeting:", error);
      alert("Failed to update meeting. Try again.");
    }
  };
  
  

  return (
    <div>
      <AdminNavbar />
      <div style={{ maxWidth: "900px", margin: "auto", marginTop: "50px" }}>
        <h2 style={{ textAlign: "center" }}>Schedule a Meeting</h2>
        {loading && <p>Creating meeting...</p>}

        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="timeGridWeek"
          selectable={true}
          select={handleDateSelect} // User selects a date/time
          events={meetings} 
          eventClick={(info) => window.open(info.event.url, "_blank")} // Open Google Meet link
        />
         <h3>Upcoming Meetings</h3>
        <ul>
          {meetings.map((meeting) => (
            <li key={meeting.id}>
              {meeting.title} - {new Date(meeting.start).toLocaleString()} {" "}
              <button onClick={() => handleEditMeeting(meeting)} style={{ marginLeft: "10px", color: "blue" }}>
                Edit
              </button>
              <button onClick={() => handleDeleteMeeting(Number(meeting.id))} style={{ marginLeft: "10px", color: "red" }}>
                Delete
              </button>
            </li>
          ))}
        </ul>
    
      {editingMeeting && (
      <div style={{ padding: "10px", border: "1px solid black", marginTop: "10px" }}>
        <h3>Edit Meeting</h3>
        <label>Title:</label>
        <input
          type="text"
          value={editingMeeting.title}
          onChange={(e) => setEditingMeeting({ ...editingMeeting, title: e.target.value })}
        />
        <br />
        <label>Start Time:</label>
        <input
          type="datetime-local"
          value={editingMeeting.start}
          onChange={(e) => setEditingMeeting({ ...editingMeeting, start: e.target.value })}
        />
        <br />
        <label>End Time:</label>
        <input
          type="datetime-local"
          value={editingMeeting.end}
          onChange={(e) => setEditingMeeting({ ...editingMeeting, end: e.target.value })}
        />
        <br />
        <button onClick={() => saveEditedMeeting()}>Save</button>
        <button onClick={() => setEditingMeeting(null)}>Cancel</button>
      </div>
      )}

      </div>



    </div>
  );
};

export default AdminCreateMeeting;
