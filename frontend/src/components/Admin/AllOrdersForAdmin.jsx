import axios from "axios";
import React, { useEffect, useState } from "react";
import {
    AiOutlineArrowRight,
    AiOutlineCamera,
    AiOutlineDelete
  } from "react-icons/ai";
import { server } from "../../server";
import { Link } from "react-router-dom";
import { DataGrid } from "@material-ui/data-grid";
import { BsPencil } from "react-icons/bs";
import { RxCross1 } from "react-icons/rx";
import styles from "../../styles/styles";
import { toast } from "react-toastify";
import { Button } from "@material-ui/core";

const AllOrdersForAdmin = () => {
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [withdrawData, setWithdrawData] = useState();
  const [withdrawStatus,setWithdrawStatus] = useState('Processing');
  useEffect(() => {
    axios
      .get(`${server}/kuchvi/get-all-admin-kuchvi-request`, {
        withCredentials: true,
      })
      .then((res) => {
        console.log("jklllllllllll989",res.data)
      
        setData(res.data.allKuchviRequest);
      })
      .catch((error) => {
        console.log(error.response);
      });
  }, []);


  const columns = [
    { field: "orderId", headerName: "Order ID", minWidth: 150, flex: 0.7 },
    {
      field: "image",
      headerName: "Image",
      minWidth: 100,
      flex: 0.7,
      // renderCell: (params) => <img src={params.row.image} alt="Product" />,

      renderCell: (params) => (
        <img
          src={params.row.img}
          alt="Product"
          style={{ height: "40px", width: "40px" }}
        />
      )
    },
    {
      field: "size",
      headerName: "Size",
      minWidth: 100,
      flex: 0.7
    },
    {
      field: "status",
      headerName: "Status99",
      minWidth: 130,
      flex: 0.7,
      cellClassName: (params) => {
        return params.getValue(params.id, "status") === "Delivered"
          ? "greenColor"
          : "redColor";
      }
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
            <Link to={`/user/order/${params.row?.orderId}`}>
              <Button>
                <AiOutlineArrowRight size={20} />
              </Button>
            </Link>
          </>
        );
      }
    },
    {
      field: "delete",
      headerName: "Delete",
      minWidth: 100,
      flex: 0.7,
      renderCell: (params) => (
        
        <Button
        variant="contained"
        color="error"
        disabled={params.row.status== "processing"?false:true}
        onClick={async() =>{
          console.log("================",params.row)
          // const id=params.row._id;
          const orderId = params.row.orderId;
          const productId=params.row.productId;
          const size = params.row.size;
          const qty=1;
          const userId=params.row.userId;
          const status=params.row.status
          const shopId=params.row.shopId;
          const shopPrice=params.row.shopPrice;
          const markedPrice=params.row.markedPrice;
          const discountPrice=params.row.discountPrice;
          const shippingAddress=params.row.address;
          const refundStatus=params.row.refundStatus;
          const user=params.row.user;
          const paymentInfo=params.row.paymentInfo;
          const productName=params.row.productName;
          const product=params.row.product;
          const cancel=params.row.cancel
          const delivered=params.row.delivered
          const img=params.row.image
          console.log("params.row.kuchviId",params.row.kuchviId)
         const response=await axios.patch(`http://localhost:8000/api/v2/kuchvi/update-kuchvi/${params.row.kuchviId}`, {
          status: "Delivered",
          deliveredAt:Date.now(),
          delivered:true,
          paymentInfo:{ status: "Paid" }, // Update the stock value in the request body
          });
  
          if (response.status >= 200 && response.status < 300) {
            // console.log("Stock updated successfully");
          } else {
            throw new Error(`Failed to update stock - Unexpected status code: ${response.status}`);
          }
          window.location.reload();
         
          }}
      >
        Delivered
      </Button>
      ),
    },
       {
        field: "delete4",
        headerName: "Delete4",
        minWidth: 100,
        flex: 0.7,
        renderCell: (params) => (
          
            <Button
              variant="contained"
              color="error"
              disabled={params.row.status== "Cancelled"?true:params.row.cancel}
              // disabled={params.row.cancel}
              onClick={async () => {
                console.log("================???????", params.row);
                // const id=params.row._id;
                const orderId = params.row.orderid;
                const productId = params.row.productid;
                const size = params.row.size;
                const qty = 1;
                const userId = params.row.userId;
                const status = params.row.status;
                const shopId = params.row.shopId;
                const shopPrice = params.row.shopPrice;
                const markedPrice = params.row.markedPrice;
                const discountPrice = params.row.discountPrice;
                const user=params.row.user;
                const paymentInfo=params.row.paymentInfo;
                const shippingAddress = params.row.address;
                const refundStatus = params.row.refundStatus;
                const cancel = params.row.cancel;
                const delivered = params.row.delivered;
                const img = params.row.image;
                const productName=params.row.productName;
                const product=params.row.product;

                const kuchviId=params.row.kuchviId
                const response=await axios.patch(`http://localhost:8000/api/v2/kuchvi/update-kuchvi/${params.row.kuchviId}`, {
                  cancel:true, // Update the stock value in the request body
                  status:"cancel Request"
                  });
          
                  if (response.status >= 200 && response.status < 300) {
                     console.log("Stock updated successfully");
                  } else {
                    throw new Error(`Failed to update stock - Unexpected status code: ${response.status}`);
                  }
                  window.location.reload();
                
              }}
            >
              Cancel11
            </Button>
          )
    
    
    },
  ]

  const handleSubmit = async () => {
    // await axios
    //   .put(`${server}/withdraw/update-withdraw-request/${withdrawData.id}`,{
    //     sellerId: withdrawData.shopId,
    //   },{withCredentials: true})
    //   .then((res) => {
    //     toast.success("Withdraw request updated successfully!");
    //     setData(res.data.withdraws);
    //     setOpen(false);
    //   });
  };

  const row = [];

  data &&
    data.forEach((item,index) => {
        row.push({
            id: index + 1,
            // refundId: item.refundId,
            orderId: item.orderId,
            productId: item.productId,
            size: item.size,
            qty: item.qty,
            status: item.status,
            shopId: item.shopId,
            shopPrice: "Rs. " + item.shopPrice,
            markedPrice: "Rs. " + item.markedPrice,
            discountPrice: "Rs. " + item.discountPrice,
            refundStatus: item.refundStatus,
            user:item.user,
            paymentInfo:item.paymentInfo,
            productName:item.productName,
            product:item.product,
            deliveredAt: item.deliveredAt?.slice(0, 10),
            returnedAt: item.returnedAt?.slice(0, 10),
            createdAt: item.createdAt?.slice(0, 10),

            img:item.img,
            cancel:item.cancel,
            delivered:item.delivered,
            kuchviId:item.kuchviId
          });
    });
    console.log("llllmmmnnnnnnrow",row)
  return (
    <div className="w-full flex items-center pt-5 justify-center">
      <div className="w-[95%] bg-white">
        <DataGrid
          rows={row}
          columns={columns}
          pageSize={50}
          disableSelectionOnClick
          autoHeight
        />
      </div>
      {open && (
        <div className="w-full fixed h-screen top-0 left-0 bg-[#00000031] z-[9999] flex items-center justify-center">
          <div className="w-[50%] min-h-[40vh] bg-white rounded shadow p-4">
            <div className="flex justify-end w-full">
              <RxCross1 size={25} onClick={() => setOpen(false)} />
            </div>
            <h1 className="text-[25px] text-center font-Poppins">
              Update Withdraw status
            </h1>
            <br />
            <select
              name=""
              id=""
              onChange={(e) => setWithdrawStatus(e.target.value)}
              className="w-[200px] h-[35px] border rounded"
            >
              <option value={withdrawStatus}>{withdrawData.status}</option>
              <option value={withdrawStatus}>Succeed</option>
            </select>
            <button
              type="submit"
              className={`block ${styles.button} text-white !h-[42px] mt-4 text-[18px]`}
              onClick={handleSubmit}
            >
              Update
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllOrdersForAdmin;
