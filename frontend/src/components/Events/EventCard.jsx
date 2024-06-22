import React, { useState, useEffect } from "react";
import styles from "../../styles/styles";
import CountDown from "./CountDown";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addTocart, updateTocart } from "../../redux/actions/cart";
import { toast } from "react-toastify";

const EventCard = ({ active, data }) => {
  const { cart } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const [selectedSize, setSelectedSize] = useState(""); // State for selected size
  const [count, setCount] = useState(1); // State for quantity

  const addToCartHandler2 = async (data, selectedSize, count) => {
    console.log("addToCartHandler2", data._id, selectedSize, count);
    const selectedProduct = data.stock.find(
      (item) => item.size === selectedSize
    );
    if (!selectedProduct) {
      toast.error("Please select a valid size!");
      return;
    }
    if (selectedProduct.quantity < count) {
      toast.error("Insufficient quantity available for the selected size!");
      return;
    }

    const isItemExists = cart.find((i) => i._id === data._id);
    console.log("item exist", isItemExists);

    if (isItemExists) {
      let newData = JSON.parse(JSON.stringify(isItemExists));
      const isExists = newData.stock.some(
        (val) => val.size === selectedSize && val.isSelected === true
      );

      if (isExists) {
        toast.error("Item already in cart!");
        return;
      }

      newData.stock.forEach((val) => {
        if (val.size === selectedSize) {
          val.isSelected = true;
          val.qty = count;
        }
      });

      let newCart = [...cart];
      const itemIndex = newCart.findIndex((item) => item._id === isItemExists._id);
      if (itemIndex !== -1) {
        newCart[itemIndex] = newData;
      }

      try {
        dispatch(updateTocart(newCart));
        toast.success("Item updated in cart successfully!");
      } catch (error) {
        console.error("Error updating cart:", error.message);
        toast.error("Failed to update item in cart!");
      }
    } else {
      let newData = JSON.parse(JSON.stringify(data));
      newData.stock.forEach((val) => {
        if (val.size === selectedSize) {
          val.isSelected = true;
          val.qty = count;
        } else {
          val.isSelected = false;
          val.qty = 0;
        }
      });

      try {
        dispatch(addTocart(newData));
        toast.success("Item added to cart successfully!");
      } catch (error) {
        console.error("Error adding to cart:", error.message);
        toast.error("Failed to add item to cart!");
      }
    }
  };

  return (
    <div className={`w-full block bg-white rounded-lg ${active ? "unset" : "mb-12"} lg:flex p-2`}>
      <div className="w-full lg:w-[50%] m-auto">
        <img src={`${data.images[0]?.url}`} alt="" />
      </div>
      <div className="w-full lg:w-[50%] flex flex-col justify-center">
        <h2 className={styles.productTitle}>{data.name}</h2>
        <p>{data.description}</p>
        <div className="flex py-2 justify-between">
          <div className="flex">
            <h5 className="font-[500] text-[18px] text-[#d55b45] pr-3 line-through">Rs.{data.originalPrice}</h5>
            <h5 className="font-bold text-[20px] text-[#333] font-Roboto">Rs.{data.discountPrice}</h5>
            <div className="mr-4">
              <label htmlFor="sizeSelect" className="font-medium text-gray-800 text-lg">Select Size:</label>
              <div className="flex flex-wrap mt-8">
                {data.stock.map((item) => {
                  const isAvailable = item.quantity > 0;
                  const sizeButtonClasses = isAvailable
                    ? `mr-2 mb-2 px-3 py-1 border rounded-full focus:outline-none ${selectedSize === item.size ? "bg-blue-600 text-white border-blue-600" : "bg-gray-100 text-gray-800 border-gray-300"}`
                    : `mr-2 mb-2 px-3 py-1 border rounded-full cursor-not-allowed focus:outline-none bg-gray-300 text-gray-400 border-gray-300 line-through`;
                  return (
                    <button
                      key={item.size}
                      className={sizeButtonClasses}
                      onClick={() => {
                        if (isAvailable) {
                          setSelectedSize(item.size);
                        }
                      }}
                    >
                      {item.size}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
          <div
            className={`${styles.button} !mt-6 !rounded !h-11 flex items-center mr-10 bg-slate-200`}
            onClick={() => {
              if (selectedSize === "") {
                toast.error("Please select a size!");
                return;
              }
              addToCartHandler2(data, selectedSize, count);
            }}
          >
            Add to cart
          </div>
        </div>
        <CountDown data={data} />
        <br />
        <div className="flex items-center">
          <Link to={`/product/${data._id}?isEvent=true`}>
            <div className={`${styles.button} text-[#fff]`}>See Details</div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
