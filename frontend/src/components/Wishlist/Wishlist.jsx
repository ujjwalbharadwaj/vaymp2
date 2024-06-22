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
      <div className="fixed top-0 right-0 h-full w-[80%] overflow-y-scroll 800px:w-[400px] bg-white flex flex-col justify-between shadow-sm" ref={wishlistRef}>
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
    <div className="border-b p-4 cursor-pointer" onClick={handleProductClick}>
      <div className="w-full flex items-center">
      <RxCross1
          className="cursor-pointer mb-2 ml-2 800px:mb-0 800px:ml-0"
          onClick={(e) => {
            e.stopPropagation(); // Prevent triggering the navigation
            removeFromWishlistHandler(data);
          }}
        />
        <img
          src={`${data?.images[0]?.url}`}
          alt=""
          className="w-[130px] h-min ml-2 mr-2 rounded-[5px]"
        />

        <div className="flex-1 pl-[5px] overflow-hidden">
          <h1>{data.name}</h1>
          <h4 className="py-2 font-[400] text-[15px] text-[#00000082]">
            {/* Displaying the discount amount */}
            {data.originalPrice && (
              <span>
              <del>₹{data.originalPrice}</del>{" "}
              <br className="sm:hidden" /> {/* Line break on small screens */}
              <span className="sm:inline-block">
                (Save ₹{(data.originalPrice - data.discountPrice) * value})
              </span>
            </span>
            )}
          </h4>
          <h4 className="font-[600] pt-3 800px:pt-[3px] text-[17px] text-[#d02222] font-Roboto">
            ₹{totalPrice}
          </h4>
        </div>
        {/* <div>
          <BsCartPlus size={20} className="cursor-pointer" tile="Add to cart"
           onClick={() => addToCartHandler(data)}
          />
        </div> */}
      </div>
    </div>
  );
};

export default Wishlist;