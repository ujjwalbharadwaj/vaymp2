import React, { useState, useRef, useEffect } from "react";
import styles from "../../styles/styles";
import { categoriesData, productData } from "../../static/data";
import {
  AiOutlineHeart,
  AiOutlineSearch,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { FiChevronDown } from "react-icons/fi";
import { Link, useParams,useLocation,useNavigate } from "react-router-dom";

import { IoIosArrowDown, IoIosArrowForward } from "react-icons/io";
import { BiMenuAltLeft } from "react-icons/bi";
import { CgProfile } from "react-icons/cg";
import DropDown from "./DropDown";
import Navbar from "./Navbar";
import { useSelector } from "react-redux";
import Cart from "../cart/Cart";
import Wishlist from "../Wishlist/Wishlist";
import { RxCross1 } from "react-icons/rx";
import { server } from "../../server";
import axios from "axios";
import { toast } from "react-toastify";

const Header = ({ activeHeading }) => {
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const { isSeller } = useSelector((state) => state.seller);
  const { wishlist } = useSelector((state) => state.wishlist);
  const { cart } = useSelector((state) => state.cart);
  const { allProducts } = useSelector((state) => state.products);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchData, setSearchData] = useState(null);
  const [mobileSearchTerm, mobileSetSearchTerm] = useState("");
  const [mobileSearchData, mobileSetSearchData] = useState(null);
  const [active, setActive] = useState(false);
  const [dropDown, setDropDown] = useState(false);
  const [openCart, setOpenCart] = useState(false);
  const [openWishlist, setOpenWishlist] = useState(false);
  const [open, setOpen] = useState(false);
  const [openAvatarDropdown, setOpenAvatarDropdown] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { orderId } = useParams();
  const searchInputRef = useRef(null);
  const mobileInputRef = useRef(null);
  const location = useLocation();
  const getFirstLetter = (name) => {
    if (!name) return '';
    return name.charAt(0).toUpperCase();
}
  const isActive = (path) => location.pathname === path;
  const [totalCount, setTotalCount] = useState(0);
  useEffect(() => {
    let count = 0;
    cart.forEach(item => {
      item.stock.forEach(stockItem => {
        if (stockItem.isSelected) {
          count += 1;
        }
      });
    });
    setTotalCount(count);
  }, [cart]);

  const navigate = useNavigate();
  const logoutHandler = () => {
    axios
      .get(`${server}/user/logout`, { withCredentials: true })
      .then((res) => {
        toast.success(res.data.message);
        window.location.reload(true);
        navigate("/login");
      })
      .catch((error) => {
        console.log(error.response.data.message);
      });
  };
  // const isActive = (path) => location.pathname === path;
  // const logoutHandler = () => {
  //   axios
  //     .get(`${server}/user/logout`, { withCredentials: true })
  //     .then((res) => {
  //       toast.success(res.data.message);
  //       window.location.reload(true);
  //       navigate("/login");
  //     })
  //     .catch((error) => {
  //       console.log(error.response.data.message);
  //     });
  // };
  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);


    
//     let totalCount = 0;
// // console.log("cart",cart)
//     cart.forEach(item => {
//       item.stock.forEach(stockItem => {
//         if (stockItem.isSelected) {
//           totalCount += 1;
//         }
//       });
//     });
    
//     console.log("totalCount",cart.length);

    // console.log("allllll",term,allProducts)
//  const filteredProducts =
//       allProducts &&
//       allProducts.filter((product) => {
//         console.log("kkkk",product.occasion.toLowerCase)
//         let p1 =
//           product.name.toLowerCase().includes(term.toLowerCase()) ||
//           product.category.toLowerCase().includes(term.toLowerCase()) ||
//           product.occasion.toLowerCase().includes(term.toLowerCase()) ||
//           product.tags.toLowerCase().includes(term.toLowerCase());
//         return p1;
//         // return true
//       });
      console.log("allllll",cart)
      

    const filteredProducts =
      allProducts &&
      allProducts.filter((product) => {
        let p1 =
          product.name.toLowerCase().includes(term.toLowerCase()) ||
          product.category.toLowerCase().includes(term.toLowerCase()) ||
          product?.occasion?.toLowerCase().includes(term.toLowerCase()) ||
          product.tags.toLowerCase().includes(term.toLowerCase());
        return p1;
      });
    setSearchData(filteredProducts);
  };
  const handlemobileSearchChange = (e) => {
    const term = e.target.value;
    mobileSetSearchTerm(term);

    const filteredProducts =
      allProducts &&
      allProducts.filter((product) => {
        let p1 =
          product.name.toLowerCase().includes(term.toLowerCase()) ||
          product.category.toLowerCase().includes(term.toLowerCase()) ||
          product.description.toLowerCase().includes(term.toLowerCase()) ||
          product.tags.toLowerCase().includes(term.toLowerCase());
        return p1;
      });
    mobileSetSearchData(filteredProducts);
  };

  const handleSearchSubmit = (e) => {
    if (e.key === "Enter" && searchTerm) {
      navigate(`/search/${searchTerm}`);
      setSearchTerm("");
      setSearchData(null);
    }
  };

  const handleMobileSearchSubmit = (e) => {
    if (e.key === "Enter" && mobileSearchTerm) {
      navigate(`/search/${mobileSearchTerm}`);
      mobileSetSearchTerm("");
      mobileSetSearchData(null);
    }
  };
  const handleMobileSearchClick = () => {
    if (mobileSearchTerm) {
      navigate(`/search/${mobileSearchTerm}`);
      setSearchTerm("");
    }
  };

  const handleSearchClick = () => {
    if (searchTerm) {
      navigate(`/search/${searchTerm}`);
      setSearchTerm("");
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        open &&
        !event.target.closest(".header-sidebar") &&
        !event.target.closest(".search-bar")
      ) {
        setOpen(false);
      }
    };
    if (open) {
      document.addEventListener("click", handleClickOutside);
    } else {
      document.removeEventListener("click", handleClickOutside);
    }
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [open]);
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        searchInputRef.current &&
        !searchInputRef.current.contains(e.target)
      ) {
        setSearchData(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        mobileInputRef.current &&
        !mobileInputRef.current.contains(event.target)
      ) {
        mobileSetSearchData(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <div className="fixed top-0 left-0 w-full z-10 bg-[#f2f2f4] h-[60px]">
        <div
          className={`${styles.section} flex justify-between items-center`}
        ></div>
        <div className={`${styles.section}`}>
          <div className="hidden 800px:h-[40px] 800px:my-[10px] 800px:flex items-center justify-between">
            <div>
              <Link to="/">
                <h1
                  style={{
                    color: "#142337",
                    fontSize: "44px",
                    fontWeight: "bold",
                  }}
                >
                  vaymp
                </h1>{" "}
              </Link>
            </div>
            {/* search box */}
            <div className="w-[50%] relative" ref={searchInputRef}>
              <input
                type="text"
                placeholder="Search Product..."
                value={searchTerm}
                onChange={handleSearchChange}
                onKeyDown={handleSearchSubmit}
                className="h-[40px] w-full px-2 border-[#3957db] border-[2px] rounded-md"
              />
              <AiOutlineSearch
                size={30}
                className="absolute right-2 top-1.5 cursor-pointer" onClick={handleSearchClick}
                />
              {searchData && searchData.length !== 0 ? (
                <div className="absolute min-h-[5vh] bg-slate-50 shadow-sm-2 z-[9] p-4">
                  {searchData &&
                    searchData.map((i, index) => {
                      return (
                        <a href={`/product/${i._id}`}>
                          <div className="w-full flex items-start-py-3">
                            <img
                              src={`${i.images[0]?.url}`}
                              alt=""
                              className="w-[40px] h-[40px] mr-[10px]"
                            />
                            <h1>{i.name}</h1>
                          </div>
                        </a>
                      );
                    })}
                </div>
              ) : null}
            </div>

            <div className={`${styles.button}`}>
              <Link to={`${isSeller ? "/dashboard" : "/shop-create"}`}>
                <h1 className="text-[#fff] flex items-center">
                  {isSeller ? "Go Dashboard" : "Become Seller"}{" "}
                  <IoIosArrowForward className="ml-1" />
                </h1>
              </Link>
            </div>
          </div>
        </div>
        <div
          className={`${
            active === true ? "shadow-sm fixed top-0 left-0 z-10" : null
          } transition hidden 800px:flex items-center justify-between w-full bg-[#3321c8] h-[60px]`}
        >
          <div
            className={`${styles.section} relative ${styles.noramlFlex} justify-between `}
          >
            {/* categories */}
            <div onClick={() => setDropDown(!dropDown)}>
              <div className="relative mt-[1px] h-[50px] w-[270px] hidden 1000px:block">
                <BiMenuAltLeft size={30} className="absolute top-3 left-2" />
                <button
                  className={`h-[100%] w-full flex justify-between items-center pl-10 bg-white font-sans text-lg font-[500] select-none rounded-t-md`}
                >
                  All Categories
                </button>
                <IoIosArrowDown
                  size={20}
                  className="absolute right-2 top-4 cursor-pointer"
                  onClick={() => setDropDown(!dropDown)}
                />
                {dropDown ? (
                  <DropDown
                    categoriesData={categoriesData}
                    setDropDown={setDropDown}
                  />
                ) : null}
              </div>
            </div>
            {/* navitems */}
            <div className={`${styles.noramlFlex}`}>
              <Navbar active={activeHeading} />
            </div>

            <div className="flex">
              <div className={`${styles.noramlFlex}`}>
                <div
                  className="relative cursor-pointer mr-[15px]"
                  onClick={() => setOpenWishlist(true)}
                >
                  <AiOutlineHeart size={30} color="rgb(255 255 255 / 83%)" />
                  <span className="absolute right-0 top-0 rounded-full bg-[#3bc177] w-4 h-4 top right p-0 m-0 text-white font-mono text-[12px] leading-tight text-center">
                    {wishlist && wishlist.length}
                  </span>
                </div>
              </div>

              <div className={`${styles.noramlFlex}`}>
                <div
                  className="relative cursor-pointer mr-[15px]"
                  onClick={() => 
                    {setOpenCart(true)}
                  }
                >
                  <AiOutlineShoppingCart
                    size={30}
                    color="rgb(255 255 255 / 83%)"
                  />
                  <span className="absolute right-0 top-0 rounded-full bg-[#3bc177] w-4 h-4 top right p-0 m-0 text-white font-mono text-[12px] leading-tight text-center">
                    {totalCount}
                  </span>
                </div>
              </div>

              <div className={`${styles.noramlFlex}`}>
  <div
    className="container mx-auto bg-blue p-2 rounded-lg shadow-lg flex items-center justify-between cursor-pointer"
    onMouseEnter={() => setIsDropdownOpen(true)}
    onMouseLeave={() => setIsDropdownOpen(false)}
  >
    <div className="relative">
      {isAuthenticated ? (
        <div className="relative flex items-center">
          <div className="flex items-center cursor-pointer">
          <div className="w-[40px] h-[40px] flex items-center justify-center rounded-full bg-slate-200">
            <div className="w-8 h-8 flex items-center justify-center text-blue-300 text-3xl font-bold">
              {getFirstLetter(user?.name)}
            </div>          
          </div>
            <span className="ml-2 text-white">
            {`${user.name.split(' ')[0]}`}
            </span>
          </div>
          <FiChevronDown className="ml-2 text-white" /> {/* Dropdown icon */}
          {isDropdownOpen && (
            <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-gray-200 rounded shadow-md z-20">
              {/* Dropdown content */}
              <Link
                to="/profile"
                className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
              >
                Profile
              </Link>
              <Link
                to={`/orders`}
                className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
              >
                Orders
              </Link>
              <Link
                 onClick={logoutHandler}
                className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
              >
                LogOut
              </Link>
               {/* Add Orders link */}
            </div>
          )}
        </div>
      ) : (
        <div className="relative flex items-center">
          <div className="flex items-center cursor-pointer">
            <CgProfile size={30} color="rgb(255 255 255 / 83%)" />
            <span className="ml-2 text-white">
              Login
            </span>
          </div>
          <FiChevronDown className="ml-2 text-white" /> {/* Dropdown icon */}
          {isDropdownOpen && (
            <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-gray-200 rounded shadow-md z-20">
              {/* Dropdown content */}
              <Link
                to="/login"
                className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
              >
                Login
              </Link>
              <Link
                to="/sign-up"
                className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
              >
                Register
              </Link> {/* Add Register link */}
            </div>
          )}
        </div>
      )}
    </div>
  </div>
</div>


              {/* cart popup */}
              {openCart ? <Cart setOpenCart={setOpenCart} /> : null}

              {/* wishlist popup */}
              {openWishlist ? (
                <Wishlist setOpenWishlist={setOpenWishlist} />
              ) : null}
            </div>
          </div>
        </div>
      </div>


      <div className="mt-[88px] bg-white w-full md:block hidden">
        <div className="container mx-auto p-4"></div>
      </div>

      {/* mobile header */}
      <div
        className={`sticky top-0 z-[10] bg-white w-full shadow-sm 800px:hidden`}
      >
        <div className="w-full flex items-center justify-between">
          <div>
            <BiMenuAltLeft
              size={40}
              className="ml-4"
              onClick={() => setOpen(true)}
            />
          </div>
          <div>
            <Link to="/">
              <h1
                style={{
                  color: "#142337",
                  fontSize: "44px",
                  fontWeight: "bold",
                }}
              >
                vaymp
              </h1>
            </Link>
          </div>
          <div>
          <div className="flex items-center justify-start space-x-6">
              <div className="relative" onClick={() => setOpenWishlist(true)}>
                <AiOutlineHeart size={30} />
                <span className="absolute right-0 top-0 rounded-full bg-[#3bc177] w-4 h-4 p-0 m-0 text-white font-mono text-[12px] leading-tight text-center">
                  {wishlist && wishlist.length}
                </span>
              </div>
              <div
                className="relative right-2"
                onClick={() => setOpenCart(true)}
              >
                <AiOutlineShoppingCart size={30} />
                <span className="absolute right-0 top-0 rounded-full bg-[#3bc177] w-4 h-4 p-0 m-0 text-white font-mono text-[12px] leading-tight text-center">
                  {totalCount}
                </span>
              </div>
            </div>
          </div>
          {/* cart popup */}
          {openCart && <Cart setOpenCart={setOpenCart} />}
          {/* wishlist popup */}
          {openWishlist && <Wishlist setOpenWishlist={setOpenWishlist} />}
        </div>

        {/* header sidebar */}
        {open && (
          <div
            className={`fixed w-full bg-[#0000005f] z-20 h-full top-0 left-0`}
          >
<div className="fixed w-[70%] bg-[#fff] h-screen top-0 left-0 z-30 overflow-y-scroll header-sidebar">              
<div className="w-full justify-between flex pr-3">
                <div>
                  {/* <div
                    className="relative mr-[15px]"
                    onClick={() => setOpenWishlist(true) || setOpen(false)}
                  >
                    <AiOutlineHeart size={30} className="mt-5 ml-3" />
                    <span class="absolute right-0 top-0 rounded-full bg-[#3bc177] w-4 h-4 top right p-0 m-0 text-white font-mono text-[12px]  leading-tight text-center">
                      {wishlist && wishlist.length}
                    </span>
                  </div> */}
                </div>
                <RxCross1
                  size={30}
                  className="ml-4 mt-5"
                  onClick={() => setOpen(false)}
                />
              </div>

              {/* navbar */}
              <br></br>
              <div className="flex w-full justify-center">
                {isAuthenticated ? (
                  <div>
                    <Link to="/profile">
                    <div className="w-[50px] h-[50px] flex items-center justify-center rounded-full bg-slate-200 border-[3px] border-[#0eae88]">
                      <div className="w-[60px] h-[60px] flex items-center justify-center text-blue-300 text-3xl font-bold">
                        {getFirstLetter(user?.name)}
                      </div>          
                    </div>
                      
                    </Link>
                  </div>
                ) : (
                  <>
                  <div className="inline-block bg-gray-200 px-4 py-2 rounded-md shadow-md cursor-pointer" >
                    <Link
                      to="/login"
                      className="text-[18px] pr-[10px] text-[#000000b7]"
                    >
                      Login /
                    </Link>
                    <Link
                      to="/sign-up"
                      className="text-[18px] text-[#000000b7]"
                    >
                      Sign up
                    </Link>
                    </div>
                  </>
                )}
              </div>
 <br></br>
              {/* navbar */}
              <Navbar active={activeHeading} />
  
              <div className="flex flex-col">
              <Link
                to="/profile"
                className={` ${isActive('/profile') ? "text-[#17dd1f]" : "text-black 800px:text-[#fff]"} pb-[30px] 800px:pb-0 font-[500] px-6 cursor-pointer`}
              >
                Profile
              </Link>
              <Link
                to='/orders'
                className={` ${isActive('/orders')? "text-[#17dd1f]" : "text-black 800px:text-[#fff]"} pb-[30px] 800px:pb-0 font-[500] px-6 cursor-pointer`}
                >
                Orders
                </Link>
              <Link
                to='/Address'
                className={` ${isActive('/Address')? "text-[#17dd1f]" : "text-black 800px:text-[#fff]"} pb-[30px] 800px:pb-0 font-[500] px-6 cursor-pointer`}
                >
                Address
              </Link>
              <Link
                to='/inbox'
                className={` ${isActive('/inbox')? "text-[#17dd1f]" : "text-black 800px:text-[#fff]"} pb-[30px] 800px:pb-0 font-[500] px-6 cursor-pointer`}
                >
                Inbox
              </Link>
              <Link
                to='/Refund'
                className={` ${isActive('/Refund')? "text-[#17dd1f]" : "text-black 800px:text-[#fff]"} pb-[30px] 800px:pb-0 font-[500] px-6 cursor-pointer`}
                >
                Refund
              </Link>
              <Link
                to='/Track'
                className={` ${isActive('/Track')? "text-[#17dd1f]" : "text-black 800px:text-[#fff]"} pb-[30px] 800px:pb-0 font-[500] px-6 cursor-pointer`}
                >
                TrackOrder
              </Link>
               </div>
              <div className={`${styles.button} ml-4 !rounded-[4px]`}>
                <Link to="/shop-create">
                  <h1 className="text-[#fff] flex items-center">
                    Become Seller <IoIosArrowForward className="ml-1" />
                  </h1>
                </Link>
              </div>
              <br />
              <br />
              
            </div>
          </div>
        )}
        {/* search bar */}
        <div
          className={`sticky top-[60px] z-[10] bg-white my-1 w-full m-auto h-[40px relative] block 800px:hidden`}
          ref={mobileInputRef}
        >
          <input
            type="text"
            placeholder="Search Product..."
            value={mobileSearchTerm}
            onChange={handlemobileSearchChange}
            onKeyDown={handleMobileSearchSubmit}
            className="h-[40px] w-[98%] px-2 border-[#3957db] border-[1px] rounded ml-1"
          />
          <AiOutlineSearch
            size={30}
            className="absolute right-2 top-1.5 cursor-pointer" onClick={handleMobileSearchClick}
          />

          {mobileSearchData && mobileSearchData.length > 0 && (
            <div className="absolute bg-[#fff] z-10 shadow w-full left-0 p-3">
              {mobileSearchData.map((i) => (
                <a href={`/product/${i._id}`} key={i._id}>
                  <div className="flex items-center">
                    <img
                      src={i.image_Url?.[0]?.url}
                      alt=""
                      className="w-[50px] mr-2"
                    />
                    <h5>{i.name}</h5>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Header;