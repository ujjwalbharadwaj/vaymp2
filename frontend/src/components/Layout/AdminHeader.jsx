import React from 'react'
import { AiOutlineGift } from 'react-icons/ai'
import { BiMessageSquareDetail } from 'react-icons/bi'
import { FiPackage, FiShoppingBag } from 'react-icons/fi'
import { MdOutlineLocalOffer } from 'react-icons/md'
import { useSelector } from 'react-redux'
import { HiOutlineUserGroup } from "react-icons/hi";
import {GrWorkshop} from "react-icons/gr";
import { Link } from 'react-router-dom'

const AdminHeader = () => {
    const {user} = useSelector((state) => state.user);
    const getFirstLetter = (name) => {
      if (!name) return '';
      return name.charAt(0).toUpperCase();
  }
  return (
         <div className="w-full h-[80px] bg-white shadow sticky top-0 left-0 z-30 flex items-center justify-between px-4">
      <div>
        <Link to="/">
          {/* <img
            src="https://shopo.quomodothemes.website/assets/images/logo.svg"
            alt=""
          /> */}
          <h1 style={{ color: '#142337', fontSize: '44px', fontWeight: 'bold' }}>vaymp</h1>
        </Link>
      </div>
      <div className="flex items-center">
        <div className="flex items-center mr-4">
        <Link to="/admin-dashboard-coupouns" className="800px:block hidden">
        <AiOutlineGift
              color="#555"
              size={30}
              className="mx-4 cursor-pointer"
            />
          </Link>
          <Link to="/admin-users" className="800px:block hidden">
            <HiOutlineUserGroup
              color="#555"
              size={30}
              className="mx-4 cursor-pointer"
            />
          </Link>
          <Link to="/admin-events" className="800px:block hidden">
          <MdOutlineLocalOffer
              color="#555"
              size={30}
              className="mx-5 cursor-pointer"
            />
          </Link>
          <Link to="/admin-sellers" className="800px:block hidden">
            <GrWorkshop
              color="#555"
              size={30}
              className="mx-4 cursor-pointer"
            />
          </Link>
          <Link to="/admin-orders" className="800px:block hidden">            
          <FiShoppingBag
              color="#555"
              size={30}
              className="mx-4 cursor-pointer"
            />
          </Link>
          <Link to="/admin-products" className="800px:block hidden">
            <FiPackage color="#555" size={30} className="mx-4 cursor-pointer" />
          </Link>
          <Link to="/dashboard-messages" className="800px:block hidden">
            <BiMessageSquareDetail
              color="#555"
              size={30}
              className="mx-4 cursor-pointer"
            />

          </Link>
          <div className="w-[50px] h-[50px] flex items-center justify-center rounded-full bg-slate-200">
            <div className="w-[50px] h-[50px] flex items-center justify-center text-blue-300 text-3xl font-bold">
              {getFirstLetter(user?.name)}
            </div>          
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminHeader