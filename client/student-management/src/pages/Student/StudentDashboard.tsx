import React from 'react'
import StudentNavbar from '../../components/StudentNavbar'
import StudentAttendancePieChart from '../../components/StudentAttendancePieChart'
import StudentLectureNotification from '../../components/StudentLectureNotification'

const StudentDashboard = () => {
  return (
    <div>
  <StudentNavbar />

  {/* Bootstrap Grid Layout */}
  <div className="d-flex position-relative">
    <StudentAttendancePieChart />

    {/* Notification Bar - Positioned to the right */}
    <div className="position-absolute top-0 end-0 w-25 mt-3 me-3">
      <StudentLectureNotification />
    </div>
  </div>
</div>

  )
}

export default StudentDashboard