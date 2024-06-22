import React from 'react'
import AdminHeader from '../components/Layout/AdminHeader'
import AdminSideBar from '../components/Admin/Layout/AdminSideBar'
import AllRefundRequest from "../components/Admin/AllRefundRequest";

const AdminDashboardRefund = () => {
  return (
    <div>
    <AdminHeader />
    <div className="w-full flex">
      <div className="flex items-start justify-between w-full">
        <div className="w-[80px] 800px:w-[330px]">
          <AdminSideBar active={10} />
        </div>
         <AllRefundRequest />
      </div>
    </div>
  </div>
  )
}

export default AdminDashboardRefund;