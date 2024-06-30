import React, { useEffect, useState } from "react";
import { BsFillBagFill } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import styles from "../styles/styles";
import { getAllOrdersOfUser } from "../redux/actions/order";
import { server } from "../server";
import { Button } from "@material-ui/core";
import { RxCross1 } from "react-icons/rx";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import axios from "axios";
import { toast } from "react-toastify";
import { Navigate } from "react-router-dom";

const UserOrderDetails = () => {
  const dispatch = useDispatch();
  const [comment, setComment] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [rating, setRating] = useState(1);
  const { user, isAuthenticated } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [kuchvi, setkuchvi] = useState([]);
  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isReturnable, setIsReturnable] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [timerInterval, setTimerInterval] = useState(null);

  const { id } = useParams();
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
        const newRows = kuchvi
          .filter((val) => val.userId === user._id)
          .map((val, ind) => ({
            id: ind, // Ensure the unique ID for DataGrid is unique
            orderid: val.orderId,
            productid: val.productId,
            size: val.size,
            image: val.img,
            itemsQty: 1,
            total: "₹" + val.markedPrice,
            status: val.status,
            user: val.user,
            paymentInfo: val.paymentInfo,
            address: val.shippingAddress,
            userId: val.userId,
            shopId: val.shopId,
            delivered: val.delivered,
            cancel: val.cancel,

            markedPrice: val.markedPrice,
            productName: val.productName,
            product: val.product,
            discountPrice: val.discountPrice,
            shopPrice: val.shopPrice,
            kuchviId: val.kuchviId,
            return1: val.return1,
            refund: val.refund,
            reundStatus: val.refundStatus,
            deliveredAt: val.deliveredAt,
            returnedAt: val.returnedAt,
            createdAt: val.createdAt,
          }));
        setRows(newRows);
      };

      updateRows();
    }
  }, [kuchvi, user._id, loading]);

  const data = rows.find((item) => item.kuchviId === id);
  console.log("Data:", data);

  useEffect(() => {
    if (data?.delivered) {
      const deliveredAt = new Date(data.deliveredAt).getTime();
      const currentTime = Date.now();
      const returnPeriod = 2 * 24 * 60 * 60 * 1000; // 2 days in milliseconds

      if (currentTime - deliveredAt < returnPeriod) {
        setIsReturnable(true);
        const remainingTime = returnPeriod - (currentTime - deliveredAt);
        startTimer(remainingTime);
      }
    }
  }, [data]);

  const startTimer = (remainingTime) => {
    setCountdown(remainingTime);
    const interval = setInterval(() => {
      setCountdown((prevTime) => {
        if (prevTime <= 1000) {
          clearInterval(interval);
          setIsReturnable(false);
          return 0;
        }
        return prevTime - 1000;
      });
    }, 1000);
    setTimerInterval(interval);
  };

  let active;
  if (data?.status === "processing") active = 1;
  if (data?.transferredToDeliveryPartner) active = 2;
  if (data?.delivered) active = 3;
  if (data?.return1) active = 4;
  if (data?.status === "Returned") active = 5;
  if (data?.status === "cancel Request") active = 6;
  if (loading) {
    return <div>Loading...</div>; // Show a loading message while fetching data
  }
  if (!data) {
    return <div>No data found for this order.</div>;
  }

  console.log("selectedItem,,,,,,,,,,,,,,,,,,", data.orderid);
  const reviewHandler = async (e) => {
    await axios
      .put(
        `${server}/product/create-new-review`,
        {
          user,
          rating,
          comment,
          productId: data?.productid,
          kuchviId: data?.kuchviId,
          orderId: data?.orderId,
        },
        { withCredentials: true }
      )
      .then((res) => {
        toast.success(res.data.message);
        dispatch(getAllOrdersOfUser(user._id));
        setComment("");
        setRating(null);
        setOpen(false);
      })
      .catch((error) => {
        toast.error(error);
      });
  };

  const handleMessageSubmit = async () => {
    if (isAuthenticated) {
      console.log("selectedItem,,,,,,,,,,,,,,,,,,", data);
      const groupTitle = data?.kuchviId + " " + data?.productName;
      const userId = data.userId;
      const sellerId = data?.product.adminCreated;
      await axios
        .post(`${server}/conversation/create-new-conversation`, {
          groupTitle,
          userId,
          sellerId,
        })
        .then((res) => {
          navigate(`/inbox?${res.data.conversation._id}`);
        })
        .catch((error) => {
          toast.error(error.response.data.message);
        });
    } else {
      toast.error("Please login to create a conversation");
    }
  };
  const handleProductClick = () => {
    navigate(`/product/${data.productid}`);
    window.location.reload();
  };

  return (
    <div className={`py-4 min-h-screen ${styles.section}`}>
      <div className="w-full flex items-center justify-between">
        <div className="flex items-center">
          <BsFillBagFill size={30} color="crimson" />
          <h1 className="pl-2 text-[25px]">Order Details</h1>
        </div>
      </div>

      <div className="w-full flex items-center justify-between py-3">
        <h5 className="text-[#00000084]">
          Order ID- <span>{data?.kuchviId?.slice(11, 24)}</span>
        </h5>
        <h5 className="text-[#00000084]">
          Placed on <span>{data?.createdAt?.slice(0, 10)}</span>
        </h5>
      </div>

      {data ? (
        <div className="w-full flex flex-col sm:flex-row items-start mb-5 bg-white shadow rounded-lg p-4">
          <div style={{display:'flex',flexDirection:'row'}}>
          <img src={`${data.image}`} alt="" 
          className="w-[80px] h-[80px] sm:w-[130px] sm:h-[190px] cursor-pointer mb-3 sm:mb-0" 
          onClick={handleProductClick}
          />
          <div>
          <h5 className="pl-3 text-[18px] ">{data.productName}</h5>
            <h5 className="pl-3 text-[15px] text-[#00000091]">Size:{data.size}</h5>
            <h5 className="pl-3 text-[15px] text-[#00000091]">Qty:{data.itemsQty}</h5>
            <h5 className="pl-3 text-[15px] text-[#00000091]">₹{data.discountPrice}</h5>
          </div>
          </div>
            {/* Progress Feature */}
            <div className="w-full cursor-pointer"
            onClick={handleProductClick}>
<div className="w-full flex flex-col items-center pt-5">
  <h2 className="text-[20px]">Order Progress</h2>
  <div className="w-full max-w-[600px] flex flex-col mt-4 items-center sm:flex-row sm:justify-between relative"
  style={{}}>
    {data.return1 ? (
      <>
      {data.status === "Return Request" ? (
        <div className="absolute top-2 left-[10%] right-[1%] flex items-center justify-between" style={{ width: '70%' }}>
          {[1, 2, 3, 4].map((_, index) => (
            <div
              key={index}
              className={`flex-1 h-0.5 ${active ? 'bg-green-500' : 'bg-transparent'}`}
            ></div>
          ))}
        </div>
      ) : (
        <div className="absolute top-2 left-[10%] right-[1%] flex items-center justify-between" style={{ width: '80%' }}>
          {[1, 2, 3, 4].map((_, index) => (
            <div
              key={index}
              className={`flex-1 h-0.5 ${active ? 'bg-green-500' : 'bg-transparent'}`}
            ></div>
          ))}
        </div>
      )}
      
      {['Processing', 'Shipped', 'Delivered', 'Return', 'Refund'].map((step, index) => (
        <div className="flex flex-col items-center relative z-10" key={index} style={{ flex: 1 }}>
          <div
            className={`w-5 h-5 rounded-full border-2 ${
              active > index ? 'bg-green-500 border-green-600' : 'border-gray-400'
            } flex items-center justify-center text-white`}
          >
          </div>
          <p className={`mt-2 ${active > index ? 'text-green-500' : 'text-gray-400'}`}>{step}</p>
        </div>
      ))}
    </>
          // <div className="absolute top-2 left-[15%] right-[50%] flex items-center justify-between" style={{ width: '15%' }}>

    ) :active === 1 ? (
      <>
      <div className="absolute top-2 left-[15%] right-[50%] flex items-center justify-between" style={{ width: '15%' }}>
      {/* {[1, 2, 3, 4].map((_, index) => ( */}
        <div
          className={`flex-1 h-0.5 ${active ===1 ? 'bg-green-500' : 'bg-transparent'}`}
        ></div>
      {/* ))} */}
    </div>
        {['Processing','Shipped','Delivered'].map((step, index) => (
          <div className="flex flex-col items-center relative z-10" key={index} style={{ flex: 1 }}>
            <div
            className={`w-5 h-5 rounded-full border-2 ${
              active > index ? 'bg-green-500 border-green-600' : 'border-gray-400'
            } flex items-center justify-center text-white`}
          >
          </div>
          <p className={`mt-2 ${active > index ? 'text-green-500' : 'text-gray-400'}`}>{step}</p>
        </div>
        ))}
      </>
    ):
    active === 6 ? (
      <>
      <div className="absolute top-2 left-[25%] right-[50%] flex items-center justify-between" style={{ width: '50%' }}>
      {/* {[1, 2, 3, 4].map((_, index) => ( */}
        <div
          className={`flex-1 h-0.5 ${active ===6 ? 'bg-red-500' : 'bg-transparent'}`}
        ></div>
      {/* ))} */}
    </div>
        {['Processing', 'Cancelled'].map((step, index) => (
          <div className="flex flex-col items-center relative z-10" key={index} style={{ flex: 1 }}>
            <div
              className={`w-5 h-5 rounded-full border-2 ${
                active === 6  ? 'bg-red-500 border-red-600' : 'border-gray-400'
              } flex items-center justify-center text-white`}
            >
            </div>
            <p className={`mt-2 ${active === 6 ? 'text-red-500' : 'text-gray-400'}`}>{step}</p>
          </div>
        ))}
      </>
    ) : (
      <>
       <div className="absolute top-2 left-[15%] right-[50%] flex items-center justify-between" style={{ width: '70%' }}>
      {[1].map((_, index) => (
        <div
          className={`flex-1 h-0.5 ${active ? 'bg-green-500' : 'bg-transparent'}`}
        ></div>
       ))}
    </div>
        {['Processing', 'Shipped', 'Delivered'].map((step, index) => (
          <div className="flex flex-col items-center relative z-10" key={index} style={{ flex: 1 }}>
            <div
              className={`w-5 h-5 rounded-full border-2 ${
                active > index ? 'bg-green-500 border-green-600' : 'border-gray-400'
              } flex items-center justify-center text-white`}
            >
            </div>
            <p className={`mt-2 ${active > index ? 'text-green-500' : 'text-gray-400'}`}>{step}</p>
          </div>
        ))}
      </>
    )}
    
  </div>
  <br />
  <div className="border-t w-full text-center">
    <h5 className="pt-3 text-[18px]">
      {data.status === "Returned"
        ? "Your order is returned!"
        : data.status === "Transferred to delivery partner"
        ? "Your order is on the way!"
        : data.status === "Delivered"
        ? "Your order is delivered!"
        : data.status === "Return Request"
        ? "Your return request is in process!"
        : data.status === "cancel Request"
        ? "Your order has been Cancelled!"
        : "Your order is processing in shop."}
    </h5>
  </div>
  {!data.isReviewed && data.status === "Delivered" || data.status === "Transferred to delivery partner" || data.status === "Returned" || data.status === "Return requested"|| data.status === "cancel Request"|| data.status === "Processing"? (
    <div
      className={`${styles.button} text-[#fff]`}
      onClick={() => {
        setOpen(true);
        setSelectedItem(data); // Ensure selectedItem is set correctly
      }}
    >
      Write a review
    </div>
  ) : null}
</div>
</div>
</div>

      ) : (
        <p>No data found for this order.</p>
      )}

      {open && (
        <div className="w-full fixed top-0 left-0 h-screen bg-[#0005] z-50 flex items-center justify-center">
          <div className="w-[50%] h-min bg-[#fff] shadow rounded-md p-3">
            <div className="w-full flex justify-end p-3">
              <RxCross1
                size={30}
                onClick={() => setOpen(false)}
                className="cursor-pointer"
              />
            </div>
            <h2 className="text-[30px] font-[500] font-Poppins text-center">
              Give a Review
            </h2>
            <br />
            <div className="w-full flex">
              <img
                src={`${data?.image}`}
                alt=""
                className="w-[80px] h-[80px]"
              />
              <div>
                <div className="pl-3 text-[20px]">{data?.name}</div>
                <h4 className="pl-3 text-[20px]">
                  ₹{data?.discountPrice} x {data?.qty}
                </h4>
              </div>
            </div>

            <h5 className="pl-3 text-[20px] font-[500]">
              Give a Rating <span className="text-red-500">*</span>
            </h5>
            <div className="flex w-full ml-2 pt-1">
              {[1, 2, 3, 4, 5].map((i) =>
                rating >= i ? (
                  <AiFillStar
                    key={i}
                    className="mr-1 cursor-pointer"
                    color="rgb(246,186,0)"
                    size={25}
                    onClick={() => setRating(i)}
                  />
                ) : (
                  <AiOutlineStar
                    key={i}
                    className="mr-1 cursor-pointer"
                    color="rgb(246,186,0)"
                    size={25}
                    onClick={() => setRating(i)}
                  />
                )
              )}
            </div>
            <br />
            <div className="w-full ml-3">
              <label className="block text-[20px] font-[500]">
                Write a comment
                <span className="ml-1 font-[400] text-[16px] text-[#00000052]">
                  (optional)
                </span>
              </label>
              <textarea
                name="comment"
                id=""
                cols="20"
                rows="5"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="How was your product? write your expresion about it!"
                className="mt-2 w-[95%] border p-2 outline-none"
              ></textarea>
            </div>
            <div
              className={`${styles.button} text-white text-[20px] ml-3`}
              onClick={reviewHandler}
            >
              Submit
            </div>
          </div>
        </div>
      )}

      <div className="w-full 800px:flex items-center bg-white shadow rounded-lg p-4">
        <div className="w-full 800px:w-[60%]">
          <h4 className="pt-1 text-[18px] font-semibold">Shipping Address</h4>
          <h4 className="pt-1 text-[18px]">
            {data?.address.userName}
          </h4>  
          <h4 className="pt-1 text-[16px]">
            {data?.address.address1 + " " + data?.address.address2}
          </h4>
          <h4 className="text-[15px]">{data?.address.country}</h4>
          <h4 className="text-[15px]">{data?.address.city}</h4>
          <h4 className="text-[15px]">{data?.address.phoneNumber}</h4>
        </div>
        <div className="w-full 800px:w-[40%] mb-11">
          <h4 className="pt-3 text-[18px] font-medium">Payment Info</h4>
          <h4>
            Status:{" "}
            {data?.paymentInfo?.status ? data?.paymentInfo?.status : "Not Paid"}
          </h4>
        </div>
      </div>
      <br />
      <div className="flex justify-between items-center">
      <div
        className={`${styles.button} bg-[#000] rounded-[4px] h-11`}
        onClick={handleMessageSubmit}
      >
        <span className="text-[#fff] flex items-center">Send Message</span>
      </div>
      
      {data.status == "Delivered" ||
      data.status == "Returned" ||
      data.status == "Return Request" ? (
        <Button
          className={`${styles.button} rounded-[4px] h-11`}
          variant="contained"
          color="error"
          disabled={
            !isReturnable || data.status == "Returned" ? true : data.return1
          }
          onClick={async () => {
            // Handle return logic here
            console.log("================???????", data);
            const response = await axios.patch(
              `http://localhost:8000/api/v2/kuchvi/update-kuchvi/${data.kuchviId}`,
              {
                return1: true, // Update the stock value in the request body
                returnedAt: Date.now(),
                status: "Return Request",
              }
            );

            if (response.status >= 200 && response.status < 300) {
              console.log("Stock updated successfully");
            } else {
              throw new Error(
                `Failed to update stock - Unexpected status code: ${response.status}`
              );
            }
            window.location.reload();
          }}
        >
          Return
        </Button>
      ) : (
        <Button
          className={`${styles.button} rounded-[4px] h-11`}
          variant="contained"
          color="error"
          disabled={data.status == "cancel Request" ? true : data.cancel}
          // disabled={data.cancel}
          onClick={async () => {
            console.log("================???????", data);
            // const id= data._id
            const orderId = data.orderid;
            const productId = data.productid;
            const size = data.size;
            const qty = 1;
            const userId = data.userId;
            const status = data.status;
            const shopId = data.shopId;
            const shopPrice = data.shopPrice;
            const markedPrice = data.markedPrice;
            const discountPrice = data.discountPrice;
            const shippingAddress = data.address;
            const refundStatus = data.refundStatus;
            const user = data.user;
            const paymentInfo = data.paymentInfo;
            const productName = data.productName;
            const product = data.product;
            const cancel = data.cancel;
            const delivered = data.delivered;
            const img = data.image;
            const kuchviId = data.kuchviId;
            const response = await axios.patch(
              `http://localhost:8000/api/v2/kuchvi/update-kuchvi/${data.kuchviId}`,
              {
                cancel: true, // Update the stock value in the request body
                status: "cancel Request",
              }
            );

            if (response.status >= 200 && response.status < 300) {
              console.log("Stock updated successfully");
            } else {
              throw new Error(
                `Failed to update stock - Unexpected status code: ${response.status}`
              );
            }
            window.location.reload();
          }}
        >
          Cancel
        </Button>
      )}
      </div>
      <br />
    </div>
  );
};

export default UserOrderDetails;
