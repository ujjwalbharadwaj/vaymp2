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

const TrackOrderr = () => {
    const { user } = useSelector((state) => state.user);
    const { orders } = useSelector((state) => state.order);
    const dispatch = useDispatch();

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
      <>
      <Header/>
      <div className="pl-8 pt-1">
        <DataGrid
          rows={row}
          columns={columns}
          pageSize={10}
          disableSelectionOnClick
          autoHeight
        />
      </div>
      <Footer/>
      </>
    );
  };
export default TrackOrderr;