import React from 'react'
import AdminNavbar from '../components/AdminNavbar'
import PieChart from '../components/PieChart'

const AdminDashboard: React.FC = () => {
  return (
    <div>
      <AdminNavbar/>
      <div>
      <PieChart/>
      </div>
    </div>
  )
}

export default AdminDashboard