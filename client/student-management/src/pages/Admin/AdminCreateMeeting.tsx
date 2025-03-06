import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import AdminNavbar from "../../components/AdminNavbar";
import moment from "moment-timezone"; 
import { useNavigate } from "react-router-dom";

interface Meeting {
  id: number;
  title: string;
  start: string;
  end: string;
  url: string;
}

const AdminCreateMeeting: React.FC = () => {
  const { register, handleSubmit, reset } = useForm();
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const convertToTimezone = (dateTime: string, timezone: string) => {
    return moment(dateTime).tz(timezone).format();
  };

  const onSubmit = async (data: any) => {
    setLoading(true);

    try {
      // Convert start and end to the correct time zone before sending to Google Calendar
      const startTime = convertToTimezone(data.start, "Asia/Kuala_Lumpur");
      const endTime = convertToTimezone(data.end, "Asia/Kuala_Lumpur");

      const response = await axios.post("/api/create_meet", {
        title: data.title,
        start: startTime,
        end: endTime,
      });

      //console.log("RESPONSE",response)

      setMeetings([
        ...meetings,
        {
          id: Date.now(),
          title: data.title,
          start: startTime,
          end: endTime,
          url: response.data.meetLink,
        },
      ]);
    await fetchMeetings();
      reset();
    } catch (error) {
      console.error("Error creating meeting:", error);
    }


    setLoading(false);
  };

  //fetch meetings
  const fetchMeetings = async () => {
      try {
        const response = await axios.get("/api/meetings"); // Call API
        setMeetings(response.data); // Update state with API data
      } catch (error) {
        console.error("Error fetching meetings:", error);
      }
  };
  
  useEffect(() => {
  fetchMeetings();  
  }, []);


  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`/api/delete_meeting/${id}`); // API call to delete
      setMeetings(meetings.filter((meeting) => meeting.id !== id)); // Update state
    } catch (error) {
      console.error("Error deleting meeting:", error);
    }
  };

  const handleEdit = (id: number) => {
    navigate(`/admin_edit_meeting/${id}`);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminNavbar />
      <div style={{marginTop: "1%"}} className="container mx-auto p-6">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Create New Class Link
        </h2>

        <div style={{marginTop: "1%"}}  className="max-w-lg mx-auto bg-white p-8 shadow-2xl rounded-xl border border-gray-200">
        <form onSubmit={handleSubmit(onSubmit)} className="p-4">
         {/* Meeting Title */}
        <div className="mb-3">
            <label className="fw-bold form-label">Title</label>
            <input
            type="text"
            {...register("title", { required: true })}
            className="form-control shadow-sm border-0 bg-light"
            placeholder="Enter Meeting Title"
            />
        </div>

        {/* Start & End Time (Side by Side) */}
        <div className="row">
            {/* Start Time */}
            <div className="col-md-6 mb-3">
            <label className="fw-bold form-label">Start Time</label>
            <input
                type="datetime-local"
                {...register("start", { required: true })}
                className="form-control shadow-sm border-0 bg-light"
            />
            </div>

            {/* End Time */}
            <div className="col-md-6 mb-3">
            <label className="fw-bold form-label">End Time</label>
            <input
                type="datetime-local"
                {...register("end", { required: true })}
                className="form-control shadow-sm border-0 bg-light"
            />
            </div>
        </div>

        {/* Submit Button */}
        <div className="text-center mt-4">
            <button
            type="submit"
            className="btn btn-primary w-100 fw-bold shadow-sm"
            disabled={loading}
            >
            {loading ? "Creating..." : "📅 Generate Google Meet Link"}
            </button>
        </div>
        </form>
        </div>

        {/* Meeting List Table */}
          {meetings.length > 0 && (
          <div className="mt-8 max-w-4xl mx-auto" style={{marginTop: "3%"}} >
            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              Created Class Links
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-200 shadow-md rounded-lg">
                <thead>
                  <tr className="bg-gray-200 text-gray-700">
                    <th className="border p-3">Title</th>
                    <th className="border p-3">Start Time</th>
                    <th className="border p-3">End Time</th>
                    <th className="border p-3">Google Meet Link</th>
                    <th className="border p-3">Edit Meeting</th>
                    <th className="border p-3">Delete Meeting</th>
                  </tr>
                </thead>
                <tbody>
                  {meetings.map((meeting) => (
                    <tr key={meeting.id} className="text-center bg-white">
                      <td className="border p-3">{meeting.title}</td>
                      <td className="border p-3">
                        {new Date(meeting.start).toLocaleString()}
                      </td>
                      <td className="border p-3">
                        {new Date(meeting.end).toLocaleString()}
                      </td>
                      <td className="border p-3">
                        <a
                          href={meeting.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:text-blue-700 underline"
                        >
                          Join Meeting
                        </a>
                      </td>
                      <td className="border p-3">
                      <button style={{background: "yellow"}}  onClick={() => handleEdit(meeting.id)} className="bg-yellow-500 text-black px-4 py-2 rounded hover:bg-yellow-600">
                        ✏️ Edit
                      </button>
                    </td>
                    <td className="border p-3">
                      <button style={{background: "red"}} onClick={() => handleDelete(meeting.id)} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
                        🗑 Delete
                      </button>
                    </td>
                  </tr>
                  ))}
                </tbody>
              </table>
        </div>
        </div>
        )}
      </div>
    </div>
  );
};

export default AdminCreateMeeting;
