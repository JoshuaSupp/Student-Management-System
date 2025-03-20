import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import moment from "moment-timezone"; 
import AdminNavbar from "../../components/AdminNavbar";

interface Course {
  course_id: string; 
  course_name: string;
}

interface Meeting {
  meeting?: {
    course_id: string; 
    title: string;
    start: string;
    end: string;
  };
}

const AdminEditMeeting = () => {

  const [data, setData] = useState<Course[]>([{
    course_id: '',
    course_name: '',
  }]);

  const { id } = useParams<{ id: string }>(); // Get meeting ID from URL
  const navigate = useNavigate();
  const { register, handleSubmit, setValue } = useForm();
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState('');

  useEffect(() => {
    const fetchMeeting = async () => {
      try {
        const response = await axios.get(`/api/each_meeting/${id}`);
        const fetchedmeeting = response.data;
        console.log("response", response);
        console.log("fetchedmeeting", fetchedmeeting);
        // Set form values
        setValue("title", fetchedmeeting.title);
        setValue("start", moment(fetchedmeeting.start).format("YYYY-MM-DDTHH:mm"));
        setValue("end", moment(fetchedmeeting.end).format("YYYY-MM-DDTHH:mm"));

        if (fetchedmeeting.course_id) {
          console.log("Course_id",fetchedmeeting.course_id)
          setSelectedCourseId(fetchedmeeting.course_id.toString());
        }
        //console.log("fetchedmeeting",fetchedmeeting)
      } catch (error) {
        console.error("Error fetching meeting:", error);
      }
    };

    fetchMeeting();
  }, [id, setValue]);

  useEffect(() => {
      //fetch courses
   const fetchCourses = async () => {
    try {
      const response = await axios.get("/api/admin_courses"); 
      setCourses(response.data);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };
   fetchCourses();
  }, [])

  const onSubmit = async (data: any) => {
    setLoading(true);

    try {
      const startTime = moment(data.start).tz("Asia/Kuala_Lumpur").format();
      const endTime = moment(data.end).tz("Asia/Kuala_Lumpur").format();

      await axios.put(`/api/edit_meetings/${id}`, {
        title: data.title,
        start: startTime,
        end: endTime,
        course_id: selectedCourseId,
      });

      navigate("/admin_create_meeting"); // Redirect after updating
    } catch (error) {
      console.error("Error updating meeting:", error);
    }

    setLoading(false);
  };

  const handleCourseChange = (e: { target: { value: any; }; }) => {
    const courseId = e.target.value;
    setSelectedCourseId(courseId); // Update selected course ID
    setData([{ ...data[0], course_id: courseId }]); // Update studentcourse_id in data
};

  const backButton = () => {
    navigate("/admin_create_meeting");
  }

  return (
    <div>
      <AdminNavbar />
      <div>
      <button
        type="button"
        onClick={backButton} 
        className="bg-gray-500 text-black px-4 py-2 rounded-md shadow-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-colors"
        >
        &larr; Back
        </button>
      </div>
      <div style={{marginTop: "4%"}} className="container mx-auto p-6">
      <div className="min-h-screen bg-gray-100 flex justify-center items-center">
        <div className="w-full max-w-lg bg-white p-8 shadow-lg rounded-xl border border-gray-200">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Edit Meeting</h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-3">
              <label className="fw-bold form-label">Title</label>
              <input
                type="text"
                {...register("title", { required: true })}
                className="form-control shadow-sm border-0 bg-light"
              />
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="fw-bold form-label">Start Time</label>
                <input
                  type="datetime-local"
                  {...register("start", { required: true })}
                  className="form-control shadow-sm border-0 bg-light"
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="fw-bold form-label">End Time</label>
                <input
                  type="datetime-local"
                  {...register("end", { required: true })}
                  className="form-control shadow-sm border-0 bg-light"
                />
              </div>
              {/* Course Selection Dropdown */}
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
            </div>

            <div className="text-center mt-4">
              <button
                type="submit"
                className="btn btn-primary w-100 fw-bold shadow-sm"
                disabled={loading}
              >
                {loading ? "Updating..." : "✅ Update Meeting"}
              </button>
            </div>
          </form>
        </div>
      </div>
      </div>
    </div>
  );
};

export default AdminEditMeeting;
