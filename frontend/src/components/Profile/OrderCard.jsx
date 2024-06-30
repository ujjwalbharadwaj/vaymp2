import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@material-ui/core";
import { AiOutlineRight } from "react-icons/ai";

const OrderCard = ({ order }) => {
  const {
    id,
    image,
    name,
    status,
    total,
    size,
    productid,
    kuchviId
  } = order;
console.log("zzzz",order)
  return (
    <Link to={`/user/order/${id}`} className="">
    <div className="bg-white ml-2 p-4 rounded shadow flex items-start gap-4">
    <div className="flex items-start flex-grow">
          {image && (
            <div className="flex-none w-34">
              <img src={image} alt={name} className="w-[70px] h-[90px] object-cover rounded" />
            </div>
          )}
          <div className="flex flex-col justify-between flex-grow ml-4">
            <div className="mb-2">
              <Link to={`/user/order/${id}`} className="text-blue-500 hover:underline">
                {name}
              </Link>
            </div>
            <div className="text-sm text-gray-600">Status: {status}</div>
            <div className="text-sm text-gray-600">Total: {total}</div>
            <div className="text-sm text-gray-600">Size: {size}</div>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row-reverse items-center mt-6">
        <Link to={`/user/order/${kuchviId}`} className="">
        <Button 
              variant="contained" 
              style={{ 
                backgroundColor: 'transparent', 
                color: 'inherit', 
                boxShadow: 'none' 
              }}
              endIcon={<AiOutlineRight />}
            >
            </Button>
          </Link>
        </div>
      </div>
    </Link>
  );
};

export default OrderCard;
