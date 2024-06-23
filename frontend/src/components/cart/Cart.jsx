import React, { useState, useEffect, useRef } from "react";
import { RxCross1 } from "react-icons/rx";
import { IoBagHandleOutline } from "react-icons/io5";
import { HiOutlineMinus, HiPlus } from "react-icons/hi";
import styles from "../../styles/styles";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  addTocart,
  removeFromCart,
  updateTocart,
} from "../../redux/actions/cart";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { getAllProducts } from "../../redux/actions/product";

const Cart = ({ setOpenCart }) => {
  const { cart } = useSelector((state) => state.cart);
  const cartRef = useRef(null);

  const dispatch = useDispatch();
  console.log("cartjj", cart);
  let totalCount = 0;
  cart.forEach((item) => {
    item.stock.forEach((stockItem) => {
      if (stockItem.isSelected) {
        totalCount += 1;
      }
    });
  });

  console.log(totalCount);
  const removeFromCartHandler = (data, selectedSize) => {
    console.log("removeFromCartHandler", selectedSize);

    let updateCartData = JSON.parse(JSON.stringify(data));
    //addToCartHandler(data._id, data.size, quantity, data, st);
    console.log("5555", selectedSize, data);
    updateCartData.stock.forEach((val) => {
      if (val.size == selectedSize) {
        val.quantity = val.quantity + val.qty;
        val.qty = 0;
        val.isSelected = false;
      }
      //console.log("nmnm",val)
    });
    console.log("nmnm", updateCartData);
    let newCart = JSON.parse(JSON.stringify(cart));
    const itemIndex = newCart.findIndex(
      (item) => item._id === updateCartData._id
    );

    if (itemIndex !== -1) {
      // Update the item at the found index with newData
      newCart[itemIndex] = updateCartData;
      console.log("newCart updated", updateCartData);
    } else {
      console.log("Item not found in newCart array");
    }
    dispatch(updateTocart(newCart));
    newCart.forEach((val5) => {
      let p = false;
      val5.stock.forEach((st) => {
        p = p || st.isSelected;
      });
      if (p === false) {
        dispatch(removeFromCart(val5));
      }
    });
  };
  const totalPrice = cart.reduce((acc, item) => {
    // Calculate the total discounted price for each item based on qty and discountPrice
    const itemTotal = item.stock.reduce(
      (itemAcc, stockItem) => itemAcc + stockItem.qty * item.discountPrice,
      0
    );

    // Add the total discounted price of this item to the accumulator
    return acc + itemTotal;
  }, 0);

  console.log("Total discounted price:", totalPrice);
  const handleCloseClick = (event) => {
    // Check if the click target is the overlay (wishlistRef) itself
    if (cartRef.current === event.target) {
      setOpenCart(false);
    }
  };

  const addToCartHandler = async (id, selectedSize, count, data, st) => {
    let p = JSON.stringify(data);
    let oldData = JSON.parse(p);
    oldData.qty = count;
    // console.log("oldData",oldData.stock,count)
    const l = oldData.stock.map((val) => {
      // console.log("val",val)
      if (val.size == selectedSize) {
        if (st == "inc") {
          console.log("inc", val.quantity);
          val.quantity = val.quantity - 1;
        } else {
          console.log("dec", val.quantity);
          val.quantity = val.quantity + 1;
        }
      }
      return val;
    });
    oldData.stock = l;
    console.log("lllll", oldData);

    try {
      // await updateStockAfterOrderCreation(itemToUpdate);
      dispatch(addTocart(oldData));
      // toast.success("Item added to cart successfully!");
    } catch (error) {
      console.error("Error updating stock:", error.message);
      toast.error("Failed to change item to cart!");
    }
    //       }
    //     }
    //   }
  };

  const quantityChangeHandler = (data, quantity, st, selectedSize) => {
    const updateCartData = JSON.parse(JSON.stringify(data));
    //addToCartHandler(data._id, data.size, quantity, data, st);
    console.log("ffffffff", quantity, st, selectedSize, data);
    updateCartData.stock.forEach((val) => {
      if (val.size == selectedSize) {
        val.qty = quantity;
      }
      //console.log("nmnm",val)
    });
    console.log("nmnm", updateCartData);
    let newCart = JSON.parse(JSON.stringify(cart));
    // Find the index of the item in newCart array
    const itemIndex = newCart.findIndex(
      (item) => item._id === updateCartData._id
    );

    if (itemIndex !== -1) {
      // Update the item at the found index with newData
      newCart[itemIndex] = updateCartData;
      console.log("newCart updated", updateCartData);
    } else {
      console.log("Item not found in newCart array");
    }
    dispatch(updateTocart(newCart));
    // dispatch(addTocart(updateCartData));
  };

  return (
    <div
      ref={cartRef}
      className="fixed top-0 left-0 w-full bg-[#0000004b] h-screen z-20"
      onClick={handleCloseClick}
    >
      <div
        className="fixed top-0 right-0 h-full w-[85%] overflow-y-scroll 450px:w-[400px] 800px:w-[400px] bg-white flex flex-col justify-between shadow-sm"
        ref={cartRef}
      >
        {totalCount === 0 ? (
          <div className="w-full h-screen flex items-center justify-center">
            <div className="flex w-full justify-end pt-5 pr-5 fixed top-3 right-3">
              <RxCross1
                size={25}
                className="cursor-pointer"
                onClick={() => setOpenCart(false)}
              />
            </div>
            <h5>Cart Items is empty!</h5>
          </div>
        ) : (
          <>
            <div>
              <div className="flex w-full justify-end pt-5 pr-5">
                <RxCross1
                  size={25}
                  className="cursor-pointer"
                  onClick={() => setOpenCart(false)}
                />
              </div>
              {/* Item length */}
              <div className={`${styles.noramlFlex} p-4`}>
                <IoBagHandleOutline size={25} />
                <h5 className="pl-2 text-[20px] font-[500]">
                  {totalCount} items
                </h5>
              </div>

              {/* cart Single Items */}
              <br />
              <div className="w-full border-t">
                {cart &&
                  cart.map((item, index) => {
                    //console.log("jjjjjj", item);

                    return (
                      <div key={index}>
                        {item.stock.map((val2, stockIndex) => {
                          if (val2.isSelected) {
                            return (
                              <CartSingle
                                key={val2._id}
                                data={item}
                                val2={val2}
                                quantityChangeHandler={quantityChangeHandler}
                                removeFromCartHandler={removeFromCartHandler}
                              />
                            );
                          } else {
                            return null; // or some placeholder content if needed
                          }
                        })}
                      </div>
                    );
                  })}
              </div>
            </div>

            <div className="px-5 mb-3">
              {/* checkout buttons */}
              <Link to="/checkout">
                <div
                  className={`h-[45px] flex items-center justify-center w-[100%] bg-[#e49e43] rounded-[5px]`}
                >
                  <h1 className="text-[#fff] text-[18px] font-[600]">
                    Checkout Now (₹{totalPrice})
                  </h1>
                </div>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const CartSingle = ({
  val2,
  data,
  quantityChangeHandler,
  removeFromCartHandler,
}) => {
  const [selectedSize, setSelectedSize] = useState(val2.size); // Example: Initialize selected size state
  const [value, setValue] = useState(val2.qty);
  const totalPrice = data.discountPrice * value;
  const { allProducts } = useSelector((state) => state.products);
  const [error, setError] = useState("");
  useEffect(() => {
    // Check if the selected size has a quantity of 0 and remove it from the cart if true
    if (allProducts && Array.isArray(allProducts)) {
      const matchingProduct = allProducts.find(
        (product) => product._id === data._id
      );
      console.log("matchingProduct", matchingProduct);
      if (matchingProduct && matchingProduct.stock) {
        const stockItem = matchingProduct.stock.find(
          (item) => item.size === selectedSize
        );
        console.log("stockItem", stockItem);
        if (stockItem && stockItem.quantity === 0) {
          removeFromCartHandler(data, selectedSize);
          toast.error(
            `The size ${selectedSize} for the product ${data.name} is out of stock and has been removed from the cart.`
          );
        }
      }
    }
  }, [allProducts, data._id, selectedSize, removeFromCartHandler]);

  const increment = () => {
    console.log("mydata", selectedSize);
    const stock = data.stock.find((item) => item.size === selectedSize);
    if (stock && stock.quantity - 1 < value) {
      toast.error("Product stock limited!");
    } else {
      setValue(value + 1);
      quantityChangeHandler(data, value + 1, "inc", selectedSize);
    }
  };

  const decrement = () => {
    setValue(value === 1 ? 1 : value - 1);
    quantityChangeHandler(
      data,
      value === 1 ? 1 : value - 1,
      "dec",
      selectedSize
    );
  };
  const isProductNameShort = data.name.length < 20;
  const navigate = useNavigate();
  const handleProductClick = () => {
    navigate(`/product/${data._id}`);
    window.location.reload();
  };

  return (
    <div className="border-[#928f8f] border-t-[1px] border-b-[1px] p-4">
      <div className="w-full flex items-center">
        <img
          src={`${data?.images?.[0]?.url}`}
          alt=""
          className="w-[90px] h-min ml-1 mr-1 rounded-[5px] cursor-pointer"
          onClick={handleProductClick}
        />
        <div
          className="flex-grow pl-[5px] cursor-pointer"
          onClick={handleProductClick}
        >
          <h1 style={{ marginBottom: "10px" }}>{data.name.slice(0, 20)}</h1>
          <div>Size: {selectedSize}</div>
          <div className="flex items-center whitespace-nowrap">
            <span className="text-[12px] text-green-500 font-bold mr-2">
              (
              {Math.round(
                ((data.originalPrice - data.discountPrice) /
                  data.originalPrice) *
                  100
              )}
              % off)
            </span>
            {data.originalPrice && (
              <span className="flex items-center mr-2">
                <del className="text-[14px] text-[#00000082]">
                  ₹{data.originalPrice}
                </del>
              </span>
            )}
            <span className="font-[500] text-[15px] text-[#000000] font-Roboto">
              ₹{totalPrice}
            </span>
          </div>
        </div>
      </div>
      <div className="flex justify-between">
        <div className="flex items-center">
          <div className="flex items-center mt-2">
            <div
              className="hover:bg-[#eab45dd5] bg-[#a7abb14f] border border-[#e4434373] rounded-full w-[20px] h-[20px] flex items-center justify-center cursor-pointer"
              onClick={decrement}
            >
              <HiOutlineMinus size={16} color="#7d879c" />
            </div>
            <div className="bg-[#f7f7f7] border border-[#e4434373] rounded-t-sm w-[35px] h-[25px] flex justify-center items-center mx-1">
              <span className="text-[15px] text-[#000000] font-Roboto">
                {value}
              </span>
            </div>
            <div
              className="hover:bg-[#eab45dd5] border border-[#e4434373] rounded-full w-[20px] h-[20px] ${styles.noramlFlex} justify-center cursor-pointer"
              onClick={increment}
            >
              <HiPlus size={18} color="#7d879c" />
            </div>
          </div>
        </div>
        <div className="flex justify-end">
          <button
            className="hover:text-[#f06865] border border-[#e4434373] font-Roboto text-[14px] cursor-pointer pl-3 pr-3 py-1 flex items-center justify-center shadow-md"
            onClick={() => removeFromCartHandler(data, selectedSize)}
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
