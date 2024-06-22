import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Button } from "@material-ui/core";
import { AiOutlineArrowRight } from "react-icons/ai";
import { getAllOrdersOfUser } from "../redux/actions/order";
import OrderCard from "../components/Profile/OrderCard";
import Header from "../components/Layout/Header";
import Footer from "../components/Layout/Footer";
import axios from "axios";
import { server } from "../server";

const AllOrders = () => {
  const { user } = useSelector((state) => state.user);
  const { orders,isLoading } = useSelector((state) => state.order);

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

  // const columns = [
  //   {
  //     field: "image",
  //     headerName: "Product Image",
  //     minWidth: 180,
  //     flex: 0.7,
  //     renderCell: (params) => {
  //       return (
  //         <Link to={`/product/${params.id}`}>
  //           <img src={params.value} alt="Product" style={{ width: 50, height: 50 }} />
  //         </Link>
  //       );
  //     },
  //   },
  //   {
  //     field: "orderid",
  //     headerName: "order id",
  //     type: "number",
  //     minWidth: 260,
  //     flex: 0.7,
  //   },
  //   {
  //     field: "status",
  //     headerName: "Status9999",
  //     minWidth: 180,
  //     flex: 0.7,
  //     cellClassName: (params) => {
  //       return params.getValue(params.id, "status") === "Delivered"
  //         ? "greenColor"
  //         : "redColor";
  //     },
  //   },
  //   {
  //     field: "itemsQty",
  //     headerName: "Items Qty",
  //     type: "number",
  //     minWidth: 130,
  //     flex: 0.7,
  //   },
  //   {
  //     field: "total",
  //     headerName: "Total",
  //     type: "number",
  //     minWidth: 130,
  //     flex: 0.8,
  //   },
  //   {
  //     field: " ",
  //     flex: 1,
  //     minWidth: 150,
  //     headerName: "",
  //     type: "number",
  //     sortable: false,
  //     renderCell: (params) => {
  //       return (
  //         <Link to={`/user/order/${params.row?.productid}`}>
  //           <Button>
  //             <AiOutlineArrowRight size={20} />
  //           </Button>
  //         </Link>
  //       );
  //     },
  //   },
  // ];
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

  // orders &&
  //   orders.forEach((item) => {
  //     rows.push({
  //       id: item._id,
  //       name:
  //       image
  //       itemsQty: item.cart.length,
  //       total: "Rs" + item.totalPrice,
  //       status: item.status,
  //     });
  //   });


    return (
      <>
        <Header />
        {isLoading ? (
          <div className="loading">Loading...</div>
        ) : (
          <div className="">
            {rows.map((row) => (
              <OrderCard key={row.id} order={row} />
            ))}
          </div>
        )}
        <Footer />
      </>
    );
};

export default AllOrders;
