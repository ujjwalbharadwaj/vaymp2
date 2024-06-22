import { Button } from "@material-ui/core";
import { DataGrid } from "@material-ui/data-grid";
import React, { useEffect } from "react";
import { AiOutlineDelete, AiOutlineEye } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getNewStockshopIsActive } from "../../redux/actions/sellers";
import Loader from "../Layout/Loader";
import axios from "axios";
import { server } from "../../server";
import { useState } from "react";

const ShopStatus = () => {
    const [shops, setShops] = useState([]);
    const [isLoading, setIsLoading] = useState(true);  
    useEffect(() => {
        axios
          .get(`${server}/shopIsActive/admin-shopIsActives`, { withCredentials: true })
          .then((res) => {
            setShops(res.data.shopIsActives);
            setIsLoading(false);
          })
          .catch((error) => {
            console.error("Error fetching new stock shopIsActives:", error);
            setIsLoading(false);
          });
      }, []);

  const columns = [
    { field: "images", headerName: "Image", minWidth: 150, minHeight: 300, flex: 0.7,
      renderCell: (params) => (
        <img src={params.value} alt="Shop Image" style={{ width: 100, height: 100 }} />
      ),
    },
    { field: "shopId", headerName: "Shop Id", minWidth: 150, flex: 0.7 },
    {
      field: "name",
      headerName: "Name",
      minWidth: 180,
      flex: 1.4,
    },
    {
        field: "shopStatus",
        headerName: "Shop Status",
        type: "boolean",
        minWidth: 80,
        flex: 1.4,
        renderCell: (params) => (
            <>
              {params.value ? (
                <span style={{ color: "red", fontWeight: 900, fontSize: "3.7em" }}>&#10008;</span> 
              ) : (
                <span style={{ color: "red", fontWeight: 900, fontSize: "3.7em" }}>&#10003;</span> 
              )}
            </>
          ),
      },
    {
      field: "email",
      headerName: "Email",
      type: "text",
      minWidth: 130,
      flex: 0.7,
    },
    {
      field: "address",
      headerName: "Seller Address",
      type: "text",
      minWidth: 130,
      flex: 0.7,
    },

    {
      field: "joinedAt",
      headerName: "Joined At",
      type: "text",
      minWidth: 130,
      flex: 0.8,
    },



    {
        field: "Preview Shop",
        flex: 1,
        minWidth: 150,
        headerName: "Preview Shop",
        type: "number",
        sortable: false,
        renderCell: (params) => {
          return (
            <>
            <Link to={`/shop/preview/${params.id}`}>
            <Button>
                <AiOutlineEye size={20} />
              </Button>
            </Link>
            </>
          );
        },
      },

  ];

  const row = [];

  shops &&
    shops.forEach((item, index) => {
      row.push({
        id: index + 1, // Assuming index starts from 0, adding 1 to make it unique
        images: item.images,
        shopId: item.shopId, // Renaming shopId to id
        name: item.name,
        newStock: item.shopIsActive, // Assuming shopIsActive indicates new stock status
        email: item.email,
        address: item.address,
        joinedAt: item.joinedAt.slice(0, 10),
      });
    });

  return (
    <>
        <div className="w-full mx-8 pt-1 mt-10 bg-white">
          <DataGrid
            rows={row}
            columns={columns}
            pageSize={10}
            disableSelectionOnClick
            autoHeight
          />
        </div>
    </>
  );
};

export default ShopStatus;