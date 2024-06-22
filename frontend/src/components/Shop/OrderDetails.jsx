import React, { useEffect, useState } from "react";
import styles from "../../styles/styles";
import { BsFillBagFill } from "react-icons/bs";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrdersOfShop } from "../../redux/actions/order";
import { server } from "../../server";
import axios from "axios";
import { toast } from "react-toastify";

const OrderDetails = () => {
  const { seller } = useSelector((state) => state.seller);
  const dispatch = useDispatch();
  const [status, setStatus] = useState("");
  const navigate = useNavigate();
  const [kuchvi, setkuchvi] = useState([]);
  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);


  
  const { id } = useParams();
  console.log("iiiiiidddddd",id)
  useEffect(() => {
    axios
      .get(`${server}/kuchvi/get-all-admin-kuchvi-request`, {
        withCredentials: true,
      })
      .then((res) => {
        // console.log("jklllllllllll",res.data)
      
        setkuchvi(res.data.allKuchviRequest);
        setLoading(false); 
      })
      .catch((error) => {
        console.log(error.response);
        setLoading(false); 
      });
  }, []);
  
  useEffect(() => {
    if (!loading) {
      const updateRows = () => {
        const newRows = kuchvi.filter(val => val.shopId === seller._id).map((val, ind) => ({
          id: ind, // Ensure the unique ID for DataGrid is unique
          orderid: val.orderId,
          productid: val.productId,
          size: val.size,
          image: val.img,
          itemsQty: 1,
          total: "US$ " + val.markedPrice,
          status: val.status,
          address: val.shippingAddress,
          userId: val.userId,
          shopId: val.shopId,
          delivered: val.delivered,
          cancel: val.cancel,
          refundStatus: val.refundStatus,
          user:val.user,
          paymentInfo:val.paymentInfo,
          productName:val.productName,
          product:val.product,
          markedPrice: val.markedPrice,
          discountPrice: val.discountPrice,
          shopPrice: val.shopPrice,
          kuchviId: val.kuchviId,
          return1: val.return1,
          refund:val.refund,
          reundStatus:val.refundStatus,
          deliveredAt:val.deliveredAt,
          returnedAt:val.returnedAt,
          createdAt:val.createdAt
        }));
        setRows(newRows);
      };

      updateRows();
    }
  }, [kuchvi, seller._id, loading]);

  const data = rows.find((item) => item.kuchviId === id);
  console.log("Data:", data);

  if (loading) {
    return <div>Loading...</div>; // Show a loading message while fetching data
  }


if (!data) {
  return <div>No data found for this order.</div>;
}

return (
  <div className={`py-4 min-h-screen ${styles.section}`}>
    <div className="w-full flex items-center justify-between">
      <div className="flex items-center">
        <BsFillBagFill size={30} color="crimson" />
        <h1 className="pl-2 text-[25px]">Order Details</h1>
      </div>
      <Link to="/dashboard-orders">
        <div
          className={`${styles.button} !bg-[#fce1e6] !rounded-[4px] text-[#e94560] font-[600] !h-[45px] text-[18px]`}
        >
          Order List
        </div>
      </Link>
    </div>

    <div className="w-full flex items-center justify-between pt-6">
      <h5 className="text-[#00000084]">
        Order ID: <span>#{data?.kuchviId?.slice(16, 24)}</span>
      </h5>
      <h5 className="text-[#00000084]">
        Placed on: <span>{data?.createdAt?.slice(0, 10)}</span>
      </h5>
    </div>

    <br />
    <br />
    {data ? (
      <div className="w-full flex items-start mb-5">
        <img
          src={`${data.image}`}
          alt=""
          className="w-[80px] h-[80px]"
        />
        <div className="w-full">
          <h5 className="pl-3 text-[20px]">Product ID: {data.productid}</h5>
          <h5 className="pl-3 text-[20px] text-[#00000091]">
            {data.size} x {data.itemsQty}
          </h5>
        </div>
      </div>
    ):(
      <p>hi</p>
    )}

    <div className="border-t w-full text-right">
      <h5 className="pt-3 text-[18px]">
        Total Price: <strong>{data?.total}</strong>
      </h5>
    </div>
    <br />
    <br />
    <div className="w-full 800px:flex items-center">
      <div className="w-full 800px:w-[60%]">
        <h4 className="pt-3 text-[20px] font-[600]">Shipping Address:</h4>
        <h4 className="pt-3 text-[20px]">
          {data?.address.address1 + " " + data?.address.address2}
        </h4>
        <h4 className="text-[20px]">{data?.address.country}</h4>
        <h4 className="text-[20px]">{data?.address.city}</h4>
        <h4 className="text-[20px]">{data?.address.phoneNumber}</h4>
      </div>
      <div className="w-full 800px:w-[40%]">
        <h4 className="pt-3 text-[20px]">Payment Info:</h4>
        <h4>
          Status:{" "}
          {data?.status ? data?.status : "Not Paid"}
        </h4>
      </div>
    </div>
    <br />
    <br />
    <br />

    {/* {data?.status !== "Processing" && data?.status !== "Refund Success" && (
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="w-[200px] mt-2 border h-[35px] rounded-[5px]"
      >
        {[
          "Processing",
          "Transferred to delivery partner",
          "Shipping",
          "Received",
          "On the way",
          "Delivered",
        ]
          .slice(
            [
              "Processing",
              "Transferred to delivery partner",
              "Shipping",
              "Received",
              "On the way",
              "Delivered",
            ].indexOf(data?.status)
          )
          .map((option, index) => (
            <option value={option} key={index}>
              {option}
            </option>
          ))}
      </select>
    )}
    {
      data?.status === "Processing refund" || data?.status === "Refund Success" ? (
        <select value={status} 
     onChange={(e) => setStatus(e.target.value)}
     className="w-[200px] mt-2 border h-[35px] rounded-[5px]"
    >
      {[
          "Processing refund",
          "Refund Success",
        ]
          .slice(
            [
              "Processing refund",
              "Refund Success",
            ].indexOf(data?.status)
          )
          .map((option, index) => (
            <option value={option} key={index}>
              {option}
            </option>
          ))}
    </select>
      ) : null
    } */}
{/* <p className="text-[20px]">{data?.status}</p> */}
    {/* <div
      className={`${styles.button} mt-5 !bg-[#FCE1E6] !rounded-[4px] text-[#E94560] font-[600] !h-[45px] text-[18px]`}
      onClick={data?.status !== "Processing refund" ? orderUpdateHandler : refundOrderUpdateHandler}
    >
      Update Status
    </div> */}
  </div>
);
};


export default OrderDetails;
