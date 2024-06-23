import React, { useState, useRef } from "react";
import { RxCross1 } from "react-icons/rx";
// import { BsCartPlus } from "react-icons/bs";
import styles from "../../styles/styles";
import { AiOutlineHeart } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { removeFromWishlist } from "../../redux/actions/wishlist";
// import { addTocart } from "../../redux/actions/cart";
import { useNavigate } from "react-router-dom";


const Wishlist = ({ setOpenWishlist }) => {
  const { wishlist } = useSelector((state) => state.wishlist);
  const wishlistRef = useRef(null);
  const dispatch = useDispatch();

  const handleCloseClick = (event) => {
    // Check if the click target is the overlay (wishlistRef) itself
    if (wishlistRef.current === event.target) {
      setOpenWishlist(false);
    }
  };

  const removeFromWishlistHandler = (data) => {
    dispatch(removeFromWishlist(data));
  };


  // const addToCartHandler = (data) => {
  //   const newData = {...data, qty:1};
  //   dispatch(addTocart(newData));
  //   setOpenWishlist(false);
  // }

  return (
    <div
      ref={wishlistRef}
      className="fixed top-0 left-0 w-full h-screen z-20 flex items-center justify-center bg-[#0000004b]"
      onClick={handleCloseClick}
    >
      <div className="fixed top-0 right-0 h-full w-[85%] overflow-y-scroll 450px:w-[400px] 800px:w-[400px] bg-white flex flex-col justify-between shadow-sm" ref={wishlistRef}>
        {wishlist && wishlist.length === 0 ? (
          <div className="w-full h-screen flex items-center justify-center">
            <div className="flex w-full justify-end pt-5 pr-5 fixed top-3 right-3">
              <RxCross1
                size={25}
                className="cursor-pointer"
                onClick={() => setOpenWishlist(false)}
              />
            </div>
            <h5>Wishlist Items is empty!</h5>
          </div>
        ) : (
          <>
            <div>
              <div className="flex w-full justify-end pt-5 pr-5">
                <RxCross1
                  size={25}
                  className="cursor-pointer"
                  onClick={() => setOpenWishlist(false)}
                />
              </div>
              {/* Item length */}
              <div className={`${styles.noramlFlex} p-4`}>
                <AiOutlineHeart size={25} />
                <h5 className="pl-2 text-[20px] font-[500]">
                  {wishlist && wishlist.length} items
                </h5>
              </div>

              {/* cart Single Items */}
              <br />
              <div className="w-full border-t">
                {wishlist &&
                  wishlist.map((i, index) => (
                    <CartSingle
                      key={index}
                      data={i}
                      removeFromWishlistHandler={removeFromWishlistHandler}
                      />
                  ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const CartSingle = ({ data,removeFromWishlistHandler }) => {
  const [value] = useState(1);
  const totalPrice = data.discountPrice * value;
  const navigate = useNavigate();
  const handleProductClick = () => {
    navigate(`/product/${data._id}`);
    window.location.reload();
    
  };

  return (
    <div className="border-[#928f8f] border-t-[1px] border-b-[1px] p-4 cursor-pointer" onClick={handleProductClick}>
      <div className="w-full flex items-center">
        <img
          src={`${data?.images[0]?.url}`}
          alt=""
          className="w-[90px] h-min ml-2 mr-2 rounded-[5px]"
        />

        <div className="flex-1 pl-[5px] overflow-hidden">
        <h1 style={{ marginBottom: "10px" }}>{data.name.slice(0, 20)}</h1>
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
          <div className="flex justify-end mt-5">
            <button
              className="hover:text-[#f06865] border border-[#e4434373] font-Roboto text-[14px] cursor-pointer pl-3 pr-3 py-1 flex items-center justify-center shadow-md"
              onClick={() => removeFromWishlistHandler(data)}
            >
              Remove
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Wishlist;