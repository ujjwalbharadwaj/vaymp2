import React, { useState } from "react";
import {
  AiFillHeart,
  AiOutlineEye,
  AiOutlineHeart,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { Link } from "react-router-dom";
import styles from "../../../styles/styles";
import { useDispatch, useSelector } from "react-redux";
import ProductDetailsCard from "../ProductDetailsCard/ProductDetailsCard";
import {
  addToWishlist,
  removeFromWishlist,
} from "../../../redux/actions/wishlist";
import { useEffect } from "react";
import { addTocart } from "../../../redux/actions/cart";
import { toast } from "react-toastify";
import Ratings from "../../Products/Ratings";
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

const ProductCard = ({ data, isEvent }) => {
  const { wishlist } = useSelector((state) => state.wishlist);
  const { cart } = useSelector((state) => state.cart);
  const [click, setClick] = useState(false);
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  // const remainingItems =
  //   data?.stock.quantity < 105 && data?.stock.quantity > 0
  //     ? data?.stock.quantity + " items left"
  //     : "";
  // const remainingItems =
  const [isHovered, setIsHovered] = useState(false);
 
  useEffect(() => {
    if (wishlist && wishlist.find((i) => i._id === data._id)) {
      setClick(true);
    } else {
      setClick(false);
    }
  }, [wishlist]);

  const removeFromWishlistHandler = () => {
    setClick(!click);
    dispatch(removeFromWishlist(data));
  };

  const addToWishlistHandler = () => {
    setClick(!click);
    dispatch(addToWishlist(data));
  };

  const addToCartHandler = () => {
    const isItemExists = cart && cart.find((i) => i._id === data._id);
    if (isItemExists) {
      toast.error("Item already in cart!");
    } else {
      if (data.stock.quantity < 1) {
        toast.error("Product stock limited!");
      } else {
        const cartData = { ...data, qty: 1 };
        dispatch(addTocart(cartData));
        toast.success("Item added to cart successfully!");
      }
    }
  };

  return (
    <>
      <div className="w-full h-[340px] bg-white rounded-lg shadow-sm p-3 relative cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex justify-end"></div>
        <a
          href={`${
            isEvent === true
              ? `/product/${data._id}?isEvent=true`
              : `/product/${data._id}`
          }`}
        >
          {isHovered ? (
          <Carousel
            showArrows={false}
            showStatus={false}
            showIndicators={false}
            infiniteLoop
            autoPlay
            interval={2000}
            stopOnHover={false}
            showThumbs={false}
          >
            {data.images.map((image, index) => (
              <div key={index}>
                <img
                  src={image.url}
                  alt=""
                  className="w-full h-[170px] object-contain"
                />
              </div>
            ))}
          </Carousel>
        ) : (
          <img
            src={`${data.images && data.images[0]?.url}`}
            alt=""
            className="w-full h-[170px] object-contain"
          />
        )}
        </a>
        <Link to={`/shop/preview/${data?.shop._id}`}>
          <h5 className={`${styles.shop_name}`}>{data.shop.name}</h5>
        </Link>
        <Link
          to={`${
            isEvent === true
              ? `/product/${data._id}?isEvent=true`
              : `/product/${data._id}`
          }`}
        >
          <h4 className="flex pb-3 text-base font-normal whitespace-nowrap overflow-hidden text-ellipsis max-w-full sm:max-w-[200px] md:max-w-[300px]">
            {data.name.length > 25 ? data.name.slice(0, 25) + "..." : data.name}
          </h4>

          <div className="flex">
            <Ratings rating={data?.ratings} />
          </div>

          <div className="py-2 flex items-center justify-between">
            <div className="flex items-center">
              <h5 className={`${styles.productDiscountPrice} text-base`}>
              ₹{data.originalPrice === 0
                  ? data.originalPrice
                  : data.discountPrice}
              </h5>
              <div className="flex items-center ml-2">
                <h4 className="text-sm text-gray-500 line-through">
                  ₹{data.originalPrice ? data.originalPrice : null}
                </h4>
                <span className="text-sm text-blue-500 font-bold ml-2">
                  ({Math.round(((data.originalPrice - data.discountPrice) / data.originalPrice) * 100)}% off)
                </span>
              </div>
              {/* <h5>{remainingItems}</h5> */}
              {/* <div>
        {data.stock.map((item, index) => (
          <div key={index}>
            <h5>{item.size}: {item.quantity} items left</h5>
          </div>
        ))}
      </div> */}
            </div>
            {/* <span className="font-[400] text-[17px] text-[#68d284]"> */}
              {/* {data?.sold_out} sold */}
            {/* </span> */}
          </div>
        </Link>

        {/* side options */}
        <div>
          {click ? (
            <AiFillHeart
              size={22}
              className="cursor-pointer absolute right-2 top-5"
              onClick={removeFromWishlistHandler}
              color={click ? "red" : "#333"}
              title="Remove from wishlist"
            />
          ) : (
            <AiOutlineHeart
              size={22}
              className="cursor-pointer absolute right-2 top-5"
              onClick={addToWishlistHandler}
              color={click ? "red" : "#333"}
              title="Add to wishlist"
            />
          )}
          <AiOutlineEye
            size={22}
            className="cursor-pointer absolute right-2 top-14"
            onClick={() => setOpen(!open)}
            color="#333"
            title="Quick view"
          />
          <AiOutlineShoppingCart
            size={25}
            className="cursor-pointer absolute right-2 top-24"
            onClick={addToCartHandler}
            color="#444"
            title="Add to cart"
          />
          {open ? <ProductDetailsCard setOpen={setOpen} data={data} /> : null}
        </div>
      </div>
    </>
  );
};

export default ProductCard;