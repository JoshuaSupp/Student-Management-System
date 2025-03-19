import React from 'react'
import StudentNavbar from '../../components/StudentNavbar'
import StudentAttendancePieChart from '../../components/StudentAttendancePieChart'

const StudentDashboard = () => {
  return (
    <div>
      <StudentNavbar/>
      <div>
        <StudentAttendancePieChart/>
      </div>
    </div>
  )
}

export default StudentDashboard