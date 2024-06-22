import React, { useEffect } from "react";
import { AiOutlineGift } from "react-icons/ai";
import { MdOutlineLocalOffer } from "react-icons/md";
import { FiPackage, FiShoppingBag } from "react-icons/fi";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { BsShop } from "react-icons/bs";
import { getAllSellers } from "../../../redux/actions/sellers";
 // Adjust the path as needed

const DashboardHeader = () => {
  const dispatch = useDispatch();
  const { seller, loading } = useSelector((state) => state.seller);

  useEffect(() => {
    if (!seller) {
      dispatch(getAllSellers());
    }
  }, [dispatch, seller]);

  if (loading) {
    return <div>Loading...</div>; 
  }

  if (!seller || !seller._id) {
    return (
      <div>
      </div>
    );
  }

  return (
    <div className="w-full h-[80px] bg-white shadow sticky top-0 left-0 z-30 flex items-center justify-between px-4">
      <div>
        <Link to="/dashboard">
          <h1 style={{ color: '#142337', fontSize: '44px', fontWeight: 'bold' }}>vaymp</h1>
        </Link>
      </div>
      <div className="flex items-center">
        <div className="flex items-center mr-4">
          <Link to="/dashboard-coupouns" className="800px:block hidden">
            <AiOutlineGift
              color="#555"
              size={30}
              className="mx-5 cursor-pointer"
            />
          </Link>
          <Link to="/dashboard-events" className="800px:block hidden">
            <MdOutlineLocalOffer
              color="#555"
              size={30}
              className="mx-5 cursor-pointer"
            />
          </Link>
          <Link to="/dashboard-products" className="800px:block hidden">
            <FiShoppingBag
              color="#555"
              size={30}
              className="mx-5 cursor-pointer"
            />
          </Link>
          <Link to="/dashboard-orders" className="800px:block hidden">
            <FiPackage color="#555" size={30} className="mx-5 cursor-pointer" />
          </Link>
          <Link to={`/shop/detail/${seller._id}`}>
            <div className="w-[50px] h-[50px] flex items-center justify-center rounded-full bg-slate-200">
              <BsShop className="w-[35px] h-[35px] text-black-500 object-contain" />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
