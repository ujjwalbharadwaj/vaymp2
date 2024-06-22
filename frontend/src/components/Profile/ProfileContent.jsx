import React, { useState } from "react";
import {
  AiOutlineArrowRight,
  AiOutlineCamera,
  AiOutlineDelete,
} from "react-icons/ai";
import OrderCard from "./OrderCard";

// import { useDispatch, useSelector } from "react-redux";
import { server } from "../../server";
import styles from "../../styles/styles";
import { DataGrid } from "@material-ui/data-grid";
import { Button } from "@material-ui/core";
import { Link } from "react-router-dom";
import { MdTrackChanges } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";

import { RxCross1 } from "react-icons/rx";
import {
  deleteUserAddress,
  loadUser,
  updatUserAddress,
  updateUserInformation,
} from "../../redux/actions/user";
import { Country, State } from "country-state-city";
import { useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { getAllOrdersOfUser } from "../../redux/actions/order";
import AllOrdersComponent from '../Shop/AllOrders';


const ProfileContent = ({ active }) => {
  const { user, error, successMessage } = useSelector((state) => state.user);
  const [name, setName] = useState(user && user.name);
  const [email, setEmail] = useState(user && user.email);
  const [phoneNumber, setPhoneNumber] = useState(user && user.phoneNumber);
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState(null);
  const dispatch = useDispatch();
  const getFirstLetter = (name) => {
    if (!name) return '';
    return name.charAt(0).toUpperCase();
}
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch({ type: "clearErrors" });
    }
    if (successMessage) {
      toast.success(successMessage);
      dispatch({ type: "clearMessages" });
    }
  }, [error, successMessage]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateUserInformation(name, email, phoneNumber, password));
  };

  // const handleImage = async (e) => {
  //   const reader = new FileReader();

  //   reader.onload = () => {
  //     if (reader.readyState === 2) {
  //       setAvatar(reader.result);
  //       axios
  //         .put(
  //           `${server}/user/update-avatar`,
  //           { avatar: reader.result },
  //           {
  //             withCredentials: true,
  //           }
  //         )
  //         .then((response) => {
  //           dispatch(loadUser());
  //           toast.success("avatar updated successfully!");
  //         })
  //         .catch((error) => {
  //           toast.error(error);
  //         });
  //     }
  //   };

  //   reader.readAsDataURL(e.target.files[0]);
  // };

  return (
    <div className="w-full ml-5">
      {/* profile */}
      {active === 1 && (
        <>
          <div className="flex justify-center w-full">
            <div className="relative">
            <div className="w-[150px] h-[150px] flex items-center justify-center rounded-full bg-slate-200 border-[3px] border-[#3ad132]">
            <div className="w-[50px] h-[50px] flex items-center justify-center text-blue-300 text-3xl font-bold">
              {getFirstLetter(user?.name)}
            </div>          
          </div>
              {/* <div className="w-[30px] h-[30px] bg-[#E3E9EE] rounded-full flex items-center justify-center cursor-pointer absolute bottom-[5px] right-[5px]">
                <input
                  type="file"
                  id="image"
                  className="hidden"
                  onChange={handleImage}
                />
                <label htmlFor="image">
                </label>
              </div> */}
            </div>
          </div>
          <br />
          <br />
          <div className="w-full px-5">
            <form onSubmit={handleSubmit} aria-required={true}>
              <div className="w-full 800px:flex block pb-3">
                <div className=" w-[100%] 800px:w-[50%]">
                  <label className="block pb-2">Full Name</label>
                  <input
                    type="text"
                    className={`${styles.input} !w-[95%] mb-4 800px:mb-0`}
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className=" w-[100%] 800px:w-[50%]">
                  <label className="block pb-2">Email Address</label>
                  <input
                    type="text"
                    className={`${styles.input} !w-[95%] mb-1 800px:mb-0`}
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="w-full 800px:flex block pb-3">
                <div className=" w-[100%] 800px:w-[50%]">
                  <label className="block pb-2">Phone Number</label>
                  <input
                    type="number"
                    className={`${styles.input} !w-[95%] mb-4 800px:mb-0`}
                    required
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                </div>

                <div className=" w-[100%] 800px:w-[50%]">
                  <label className="block pb-2">Enter your password</label>
                  <input
                    type="password"
                    className={`${styles.input} !w-[95%] mb-4 800px:mb-0`}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
              <input
                className={`w-[250px] h-[40px] border border-[#3a24db] text-center text-[#3a24db] rounded-[3px] mt-8 cursor-pointer`}
                required
                value="Update"
                type="submit"
              />
            </form>
          </div>
        </>
      )}

      {/* order */}
      {active === 2 && (
        <div>
          <AllOrders />
        </div>
      )}

      {/* Refund */}
      {active === 3 && (
        <div>
          <AllRefundOrders />
        </div>
      )}

      {/* Track order */}
      {active === 5 && (
        <div>
          <TrackOrder />
        </div>
      )}

      {/* Change Password */}
      {active === 6 && (
        <div>
          <ChangePassword />
        </div>
      )}

      {/*  user Address */}
      {active === 7 && (
        <div>
          <Address />
        </div>
      )}
    </div>
  );
};

const AllOrders = () => {
  const { user } = useSelector((state) => state.user);
  console.log("vvvvvvvvvvvvvvvvvvvv",user)
  const { orders } = useSelector((state) => state.order);
  // const {allProducts,isLoading} = useSelector((state) => state.products);
  // const [orderProduct, setorderProduct] = useState([]);

  const dispatch = useDispatch();
  const [kuchvi, setkuchvi] = useState([]);
  const [rows, setRows] = useState([]);
  console.log("order 97", orders);
  
  useEffect(() => {
    if (user && user._id) {
      dispatch(getAllOrdersOfUser(user._id));
    }
  }, [dispatch,user]);


  useEffect(() => {
    axios
      .get(`${server}/kuchvi/get-all-admin-kuchvi-request`, {
        withCredentials: true,
      })
      .then((res) => {
        console.log("jklllllllllll",res.data)
      
        setkuchvi(res.data.allKuchviRequest);
      })
      .catch((error) => {
        console.log(error.response);
      });
  }, []);

  const columns = [
    { 
      field: "image", 
      headerName: "Product Image", 
      minWidth: 180, 
      flex: 0.7,
      renderCell: (params) => {
        return (
          <Link to={`/product/${params.id}`}>
            <img src={params.value} alt="Product" style={{ width: 50, height: 50 }} />
          </Link>
        );
      }
    },
    {
      field: "orderid",
      headerName: "order id",
      type: "number",
      minWidth: 260,
      flex: 0.7,
    },
    {
      field: "status",
      headerName: "Status9999",
      minWidth: 180,
      flex: 0.7,
      cellClassName: (params) => {
        return params.getValue(params.id, "status") === "Delivered"
          ? "greenColor"
          : "redColor";
      },
    },
    {
      field: "itemsQty",
      headerName: "Items Qty",
      type: "number",
      minWidth: 130,
      flex: 0.7,
    },

    {
      field: "total",
      headerName: "Price",
      type: "number",
      minWidth: 130,
      flex: 0.8,
    },

    {
      field: " ",
      flex: 1,
      minWidth: 150,
      headerName: "",
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <Link to={`/user/order/${params.row?.productid}`}>
              <Button>
                <AiOutlineArrowRight size={20} />
              </Button>
            </Link>
          </>
        );
      }
    },

  ]
  useEffect(() => {

    const updateRows = () => {
      const newRows = [];
      
      kuchvi.forEach((val,ind) => {
        if (val.userId === user._id) {
          newRows.push({
            id: ind, // Ensure the unique ID for DataGrid is unique
            orderid: val.orderId,
            productid: val.productId,
            size: val.size,
            image: val.img, // Replace with actual image URL if available
            itemsQty: 1,
            total: "Rs " + val.markedPrice,
            status: val.status,
            address: val.shippingAddress,
            userId:val.userId,
            shopId:val.shopId,
            delivered:val.delivered,
            cancel:val.cancel,
            refundStatus:val.refundStatus,
            user:val.user,
            paymentInfo:val.paymentInfo,
            productName:val.productName,
            product:val.product,
            markedPrice:val.markedPrice,
            discountPrice:val.discountPrice,
            shopPrice:val.shopPrice,
            kuchviId:val.kuchviId,
            return1:val.return1
          });
        }
      });
      setRows(newRows);
    };

    updateRows();
  }, [kuchvi, user._id]);
  // const row = [];
  


  console.log("klklklkllk????????",kuchvi );
  console.log("hhhhhhhhhhhhhhhrows555",rows );


return (
  <div className="pl-8 pt-1">
    <DataGrid
      rows={rows}
      columns={columns}
      pageSize={50}
      disableSelectionOnClick
      autoHeight
    /> 
  </div>
);
};

const AllRefundOrders = () => {
  const { user } = useSelector((state) => state.user);
  const { orders } = useSelector((state) => state.order);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllOrdersOfUser(user._id));
  }, []);
  console.log("ordeers", orders);

  const eligibleOrders =
    orders && orders.filter((item) => item.status === "Processing refund");
    console.log("eligibleOrders", eligibleOrders);

  const columns = [
    { field: "id", headerName: "Order ID", minWidth: 150, flex: 0.7 },

    {
      field: "status",
      headerName: "Status10",
      minWidth: 130,
      flex: 0.7,
      cellClassName: (params) => {
        return params.getValue(params.id, "status") === "Delivered"
          ? "greenColor"
          : "redColor";
      },
    },
    {
      field: "itemsQty",
      headerName: "Items Qty",
      type: "number",
      minWidth: 130,
      flex: 0.7,
    },

    {
      field: "total",
      headerName: "Total",
      type: "number",
      minWidth: 130,
      flex: 0.8,
    },

    {
      field: " ",
      flex: 1,
      minWidth: 150,
      headerName: "",
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <Link to={`/user/order/${params.id}`}>
              <Button>
                <AiOutlineArrowRight size={20} />
              </Button>
            </Link>
          </>
        );
      },
    },
  ];

  const row = [];

  eligibleOrders &&
    eligibleOrders.forEach((item) => {
      row.push({
        id: item._id,
        itemsQty: item.cart.length,
        total: "US$ " + item.totalPrice,
        status: item.status,
      });
    });

  return (
    <div className="pl-8 pt-1">
      <DataGrid
        rows={row}
        columns={columns}
        pageSize={50}
        autoHeight
        disableSelectionOnClick
      />
    </div>
  );
};

const TrackOrder = () => {
  const { user } = useSelector((state) => state.user);
  const { orders } = useSelector((state) => state.order);
  const dispatch = useDispatch();
  console.log("orders54", orders);

  useEffect(() => {
    dispatch(getAllOrdersOfUser(user._id));
  }, []);

  const columns = [
    { field: "id", headerName: "Order ID", minWidth: 150, flex: 0.7 },

    {
      field: "status",
      headerName: "Status",
      minWidth: 130,
      flex: 0.7,
      cellClassName: (params) => {
        return params.getValue(params.id, "status") === "Delivered"
          ? "greenColor"
          : "redColor";
      },
    },
    {
      field: "itemsQty",
      headerName: "Items Qty55",
      type: "number",
      minWidth: 130,
      flex: 0.7,
    },

    {
      field: "total",
      headerName: "Total",
      type: "number",
      minWidth: 130,
      flex: 0.8,
    },

    {
      field: " ",
      flex: 1,
      minWidth: 150,
      headerName: "",
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <Link to={`/user/track/order/${params.id}`}>
              <Button>
                <MdTrackChanges size={20} />
              </Button>
            </Link>
          </>
        );
      },
    },
  ];

  const row = [];

  orders &&
    orders.forEach((item) => {
      row.push({
        id: item._id,
        itemsQty: item.cart.length,
        total: "Rs " + item.totalPrice,
        status: item.status,
      });
    });

  return (
    <div className="pl-8 pt-1">
      <DataGrid
        rows={row}
        columns={columns}
        pageSize={50}
        disableSelectionOnClick
        autoHeight
      />
    </div>
  );
};

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const passwordChangeHandler = async (e) => {
    e.preventDefault();

    await axios
      .put(
        `${server}/user/update-user-password`,
        { oldPassword, newPassword, confirmPassword },
        { withCredentials: true }
      )
      .then((res) => {
        toast.success(res.data.message);
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });
  };
  return (
    <div className="w-full px-5">
      <h1 className="block text-[25px] text-center font-[600] text-[#000000ba] pb-2">
        Change Password
      </h1>
      <div className="w-full">
        <form
          aria-required
          onSubmit={passwordChangeHandler}
          className="flex flex-col items-center"
        >
          <div className=" w-[100%] 800px:w-[50%] mt-5">
            <label className="block pb-2">Enter your old password</label>
            <input
              type="password"
              className={`${styles.input} !w-[95%] mb-4 800px:mb-0`}
              required
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />
          </div>
          <div className=" w-[100%] 800px:w-[50%] mt-2">
            <label className="block pb-2">Enter your new password</label>
            <input
              type="password"
              className={`${styles.input} !w-[95%] mb-4 800px:mb-0`}
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <div className=" w-[100%] 800px:w-[50%] mt-2">
            <label className="block pb-2">Enter your confirm password</label>
            <input
              type="password"
              className={`${styles.input} !w-[95%] mb-4 800px:mb-0`}
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <input
              className={`w-[95%] h-[40px] border border-[#3a24db] text-center text-[#3a24db] rounded-[3px] mt-8 cursor-pointer`}
              required
              value="Update"
              type="submit"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

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
{/* <Header/>     */}
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



export default ProfileContent;