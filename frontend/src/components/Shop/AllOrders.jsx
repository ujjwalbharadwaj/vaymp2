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
import { useDispatch, useSelector } from "react-redux";

const AllOrders = () => {
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [withdrawData, setWithdrawData] = useState();
  const [withdrawStatus,setWithdrawStatus] = useState('Processing');
  const { seller} = useSelector((state) => state.seller);
  console.log("mwwwwwwwwwwwwwwww",seller)
  const { orders } = useSelector((state) => state.order);
  const dispatch = useDispatch();
  const [kuchvi, setkuchvi] = useState([]);
  const [rows, setRows] = useState([]);
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
    { field: "kuchviId", headerName: "Order ID", minWidth: 150, flex: 0.7 },
    {
      field: "image",
      headerName: "Image",
      minWidth: 100,
      flex: 0.7,
      // renderCell: (params) => <img src={params.row.image} alt="Product" />,

      renderCell: (params) => (
        <img
          src={params.row.image}
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
      headerName: "Status999",
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
            <Link to={`/order/${params?.row?.kuchviId}`}>
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
        console.log("shop",val.shopId)
        // console.log("useriddd",user._id)
        // console.log("user",val.userId)
        console.log("shopiddd",seller._id)

        if (val.shopId == seller._id) {
          console.log("hhhhhhhh",val)
          newRows.push({
            id: ind, // Ensure the unique ID for DataGrid is unique
            orderid: val.orderId,
            productid: val.productId,
            size: val.size,
            image: val.img, // Replace with actual image URL if available
            itemsQty: 1,
            total: "US$ " + val.markedPrice,
            status: val.status,
            address: val.shippingAddress,
            userId:val.userId,
            shopId:val.shopId,
            delivered:val.delivered,
            cancel:val.cancel,
            user:val.user,
            paymentInfo:val.paymentInfo,
            productName:val.productName,
            product:val.product,
            refundStatus:val.refundStatus,
            markedPrice:val.markedPrice,
            discountPrice:val.discountPrice,
            shopPrice:val.shopPrice,
            kuchviId:val.kuchviId,
            return1:val.return1
          });
        }
        else{
          console.log("vvvvvvvvvvvvvvvvvvv")
        }
      });
      setRows(newRows);
    };

    updateRows();
  }, [kuchvi, seller._id]);



  
  return (
    <div className="w-full flex items-center pt-5 justify-center">
      <div className="w-[95%] bg-white">
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={50}
          disableSelectionOnClick
          autoHeight
        />
      </div>
      {/* {open && (
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
      )} */}
    </div>
  );
};

export default AllOrders;
