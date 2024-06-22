import React, { useState } from "react";
import {
  AiOutlineArrowRight,
  AiOutlineCamera,
  AiOutlineDelete,
} from "react-icons/ai";
import OrderCard from "../components/Profile/OrderCard";

import { useDispatch, useSelector } from "react-redux";
import { server } from "../server";
import styles from "../styles/styles";
import { DataGrid } from "@material-ui/data-grid";
import { Button } from "@material-ui/core";
import { Link } from "react-router-dom";
import { MdTrackChanges } from "react-icons/md";
import { RxCross1 } from "react-icons/rx";
import {
  deleteUserAddress,
  loadUser,
  updatUserAddress,
  updateUserInformation,
} from "../redux/actions/user";
import { Country, State } from "country-state-city";
import { useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { getAllOrdersOfUser } from "../redux/actions/order";
import Header from "../components/Layout/Header";
import Footer from "../components/Layout/Footer";
// import AllOrdersComponent from '../Shop/AllOrders';

const Address = () => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(""); // New state for name
  const [phoneNumber, setPhoneNumber] = useState("");
  const [city, setCity] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [addressType, setAddressType] = useState("");
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const addressTypeData = [
    { name: "Default" },
    { name: "Home" },
    { name: "Office" },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (name===""||addressType === "" || phoneNumber === "" || city === "") {
      toast.error("Please fill all the fields!");
    } else {
      dispatch(
        updatUserAddress(
          {
            userName: name,
            phoneNumber,
            city,
            address1,
            address2,
            zipCode,
            addressType: "Home",
            isLastUsed: true
          }
        )
      );
      
      setOpen(false);
      setName(""); // Reset name state
      setPhoneNumber("");
      setCity("");
      setAddress1("");
      setAddress2("");
      setZipCode("");
      setAddressType("");
    }
  };

  const handleDelete = (item) => {
    const id = item._id;
    dispatch(deleteUserAddress(id));
  };

  return (
<>
<Header/>    
<div className="w-full px-5">
      {open && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-25 z-50">
          <div className="bg-white w-full max-w-xl p-4 md:p-8 rounded-lg shadow-lg relative overflow-y-scroll">
            <div className="flex justify-end">
              <button
                className="text-red-500 hover:text-red-600 font-bold text-xl focus:outline-none"
                onClick={() => setOpen(false)}
              >
                &#x2716;
              </button>
            </div>
            <h1 className="text-center text-2xl font-bold my-4">Add New Address</h1>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block pb-2">Name</label>
                <input
                  type="text"
                  className="border h-[40px] rounded-[5px] w-full"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div>
                <label className="block pb-2">Address 1</label>
                <input
                  type="text"
                  className="border h-[40px] rounded-[5px] w-full"
                  required
                  value={address1}
                  onChange={(e) => setAddress1(e.target.value)}
                />
              </div>
              <div>
                <label className="block pb-2">Landmark</label>
                <input
                  type="text"
                  className="border h-[40px] rounded-[5px] w-full"
                  value={address2}
                  onChange={(e) => setAddress2(e.target.value)}
                />
              </div>
              <div>
                <label className="block pb-2">City</label>
                <input
                  type="text"
                  className="border h-[40px] rounded-[5px] w-full"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </div>
              <div>
                <label className="block pb-2">Phone Number</label>
                <input
                  type="text"
                  className="border h-[40px] rounded-[5px] w-full"
                  required
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </div>
              <div>
                <label className="block pb-2">Zip Code</label>
                <input
                  type="text"
                  className="border h-[40px] rounded-[5px] w-full"
                  required
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                />
              </div>
              <div>
                <label className="block pb-2">Address Type</label>
                <select
                  value={addressType}
                  onChange={(e) => setAddressType(e.target.value)}
                  className="border h-[40px] rounded-[5px] w-full"
                >
                  <option value="">Choose Address Type</option>
                  {addressTypeData.map((item, index) => (
                    <option key={index} value={item.name}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-center">
                <input
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer"
                  required
                  value="Submit"
                />
              </div>
            </form>
          </div>
        </div>
      )}
      <div className="flex w-full items-center justify-between">
        <h1 className="text-2xl font-bold text-[#000000ba] pb-2">My Addresses</h1>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer"
          onClick={() => setOpen(true)}
        >
          Add New
        </button>
      </div>
      <br />
      {user && user.addresses.map((item, index) => (
        <div className="w-full bg-white rounded-lg shadow mb-5 p-3 relative" key={index}>
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <h5 className="font-semibold">{item.addressType}</h5>
              <AiOutlineDelete
                size={25}
                className="cursor-pointer"
                onClick={() => handleDelete(item)}
              />
            </div>
            <div className="flex flex-col">
              <p>{item.address1}</p>
              <p>{item.address2}</p>
              <p>{item.phoneNumber}</p>
              <p>{item.city}</p>
              <p>{item.zipCode}</p>
              <p>{item.name}</p> {/* Display the name */}
            </div>
          </div>
        </div>
      ))}
      {user && user.addresses.length === 0 && (
        <h5 className="text-center pt-8 text-[18px]">
          You do not have any saved addresses!
        </h5>
      )}
    </div>
{/* <Footer/> */}
</>  );
};

export default Address;
