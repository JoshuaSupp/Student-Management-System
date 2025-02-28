import React from 'react'
import AdminNavbar from '../../components/AdminNavbar'
import PieChart from '../../components/AdminDashboardPieChart'
import BarChart from '../../components/AdminDashboardBarChart'

const AdminDashboard: React.FC = () => {
  return (
    <div>
      <AdminNavbar/>
      <div>
      <PieChart/>
      </div>
      <div>
        <BarChart/>
      </div>
    </div>
  )
}

export default AdminDashboard