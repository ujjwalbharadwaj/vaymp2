import { Button } from "@material-ui/core";
import { DataGrid } from "@material-ui/data-grid";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { AiOutlineDelete, AiOutlineEye } from "react-icons/ai";
import { Link } from "react-router-dom";
import { server } from "../../server";
import { deleteEvent } from "../../redux/actions/event";
import { useDispatch } from "react-redux";

const AllEvents = () => {
  const [events, setEvents] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    axios.get(`${server}/event/admin-all-events`, { withCredentials: true })
      .then((res) => {
        // Check if res.data and res.data.products exist
        if (res.data && res.data.products) {
          // No need to filter here since the server already does that
          setEvents(res.data.products);
        } else {
          console.error("Unexpected response structure", res);
        }
      }).catch((error) => {
        console.error("Error fetching events", error);
      });
  }, []);
  

  const handleDelete = (id) => {
    console.log("id", id);
    dispatch(deleteEvent(id));
    window.location.reload();
  };

  const columns = [
    { field: "id", headerName: "Event Id", minWidth: 150, flex: 0.7 },
    { field: "name", headerName: "Name", minWidth: 180, flex: 1.4 },
    { field: "price", headerName: "Price", minWidth: 100, flex: 0.6 },
    {
      field: "Stock",
      headerName: "Stock",
      minWidth: 150,
      flex: 1.2,
      renderCell: (params) => {
        const { stock } = params.row;
        if (!stock || stock.length === 0) {
          return "N/A";
        }
        return stock.map((item) => `${item.size}: ${item.quantity}`).join(", ");
      },
    },
    {
      field: "sold",
      headerName: "Sold out",
      type: "number",
      minWidth: 130,
      flex: 0.6,
    },
    {
      field: "Preview",
      flex: 0.8,
      minWidth: 100,
      headerName: "",
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <Link to={`/product/${params.id}?isEvent=true`}>
              <Button>
                <AiOutlineEye size={20} />
              </Button>
            </Link>
          </>
        );
      },
    },
    {
      field: "Delete",
      flex: 0.8,
      minWidth: 120,
      headerName: "",
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <Button onClick={() => handleDelete(params.id)}>
              <AiOutlineDelete size={20} />
            </Button>
          </>
        );
      },
    },
  ];

  const rows = events.map((item) => ({
    id: item._id,
    name: item.name,
    price: "Rs " + item.discountPrice,
    Stock: item.stock,
    sold: item.sold_out,
  }));

  return (
    <div className="w-full mx-8 pt-1 mt-10 bg-white">
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={10}
        disableSelectionOnClick
        autoHeight
      />
    </div>
  );
};

export default AllEvents;
