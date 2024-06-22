import React from 'react'
import DashboardHeader from '../../components/Shop/Layout/DashboardHeader'
import DashboardSideBar from '../../components/Shop/Layout/DashboardSideBar'
import DashboardMessages from "../../components/Shop/DashboardMessages";
import AdminSideBar from '../../components/Admin/Layout/AdminSideBar';

const ShopInboxPage = () => {
  return (
    <div>
    <DashboardHeader />
    <div className="flex items-start justify-between w-full">
      <div className="w-[80px] 800px:w-[330px]">
        <AdminSideBar active={20} />
      </div>
       <DashboardMessages />
    </div>
  </div>
  )
}

export default ShopInboxPage