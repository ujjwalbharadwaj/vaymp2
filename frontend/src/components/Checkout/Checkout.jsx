import React, { useState, useEffect } from "react";
import styles from "../../styles/styles";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { updatUserAddress } from "../../redux/actions/user"; // Import your action
import axios from "axios";
import { server } from "../../server";

const Checkout = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const { cart } = useSelector((state) => state.cart);
  const [username, setUsername] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [city, setCity] = useState("");
  const [userInfo, setUserInfo] = useState(false);
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [zipCode, setZipCode] = useState(null);
  const [couponCode, setCouponCode] = useState("");
  const [couponCodeData, setCouponCodeData] = useState(null);
  const [discountPrice, setDiscountPrice] = useState(null);
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("checkout cart data", cart);
  }, [cart]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const paymentSubmit = async () => {
    if (
      username === "" ||
      address1 === "" ||
      zipCode === null ||
      phoneNumber === "" ||
      city === ""
    ) {
      toast.error("Please choose your delivery address!");
    } else {
      const shippingAddress = {
        userName: username,
        address1,
        address2,
        zipCode,
        phoneNumber,
        city,
        isLastUsed: true,
      };

      const orderData = {
        cart,
        totalPrice,
        subTotalPrice,
        shipping,
        discountPrice,
        shippingAddress,
        user,
      };

      if (selectedAddressIndex === null) {
        dispatch(
          updatUserAddress(
            {
              userName: username, 
              phoneNumber,
              city,
              address1,
              address2,
              zipCode,
              addressType: "Home",
              isLastUsed: true
            }
          )
        ); // Dispatch action
      } else {
        const selectedAddress = user.addresses[selectedAddressIndex];
        dispatch(
          updatUserAddress(
            {
              ...selectedAddress,
              isLastUsed: true
            }
          )
        );
      }

      localStorage.setItem("latestOrder", JSON.stringify(orderData));
      navigate("/payment");
    }
  };

  const subTotalPrice = cart.reduce((acc, item) => {
    const itemTotal = item.stock.reduce(
      (itemAcc, stockItem) => itemAcc + stockItem.qty * item.discountPrice,
      0
    );
    return acc + itemTotal;
  }, 0);

  const shipping = subTotalPrice * 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const name = couponCode;

    await axios.get(`${server}/coupon/get-coupon-value/${name}`).then((res) => {
      const shopId = res.data.couponCode?.shopId;
      const couponCodeValue = res.data.couponCode?.value;
      if (res.data.couponCode !== null) {
        const isCouponValid = cart && cart.filter((item) => item.shopId === shopId);

        if (isCouponValid.length === 0) {
          toast.error("Coupon code is not valid for this shop");
          setCouponCode("");
        } else {
          const eligiblePrice = isCouponValid.reduce(
            (acc, item) => acc + item.qty * item.discountPrice,
            0
          );
          const discountPrice = (eligiblePrice * couponCodeValue) / 100;
          setDiscountPrice(discountPrice);
          setCouponCodeData(res.data.couponCode);
          setCouponCode("");
        }
      } 
      if (res.data.couponCode === null) {       
        toast.error("Coupon code doesn't exist!");
        setCouponCode("");
      }
    });
  };

  const discountPercentenge = couponCodeData ? discountPrice : "";

  const totalPrice = couponCodeData
    ? (subTotalPrice + shipping - discountPercentenge).toFixed(2)
    : (subTotalPrice + shipping).toFixed(2);

  console.log(discountPercentenge);

  return (
    <div className="w-full flex flex-col items-center py-8">
      <div className="w-[90%] 1000px:w-[70%] block 800px:flex">
        <div className="w-full 800px:w-[65%]">
          <ShippingInfo
            user={user}
            username={username}
            setUsername={setUsername}
            phoneNumber={phoneNumber}
            setPhoneNumber={setPhoneNumber}
            city={city}
            setCity={setCity}
            userInfo={userInfo}
            setUserInfo={setUserInfo}
            address1={address1}
            setAddress1={setAddress1}
            address2={address2}
            setAddress2={setAddress2}
            zipCode={zipCode}
            setZipCode={setZipCode}
            selectedAddressIndex={selectedAddressIndex}
            setSelectedAddressIndex={setSelectedAddressIndex}
          />
        </div>
        <div className="w-full 800px:w-[35%] 800px:mt-0 mt-8">
          <CartData
            handleSubmit={handleSubmit}
            totalPrice={totalPrice}
            shipping={shipping}
            subTotalPrice={subTotalPrice}
            couponCode={couponCode}
            setCouponCode={setCouponCode}
            discountPercentenge={discountPercentenge}
          />
        </div>
      </div>
      <div
        className={`${styles.button} w-[150px] 800px:w-[280px] mt-10`}
        onClick={paymentSubmit}
      >
        <h5 className="text-white">Go to Payment</h5>
      </div>
    </div>
  );
};

const ShippingInfo = ({
  user,
  username,
  setUsername,
  city,
  setCity,
  userInfo,
  setUserInfo,
  address1,
  setAddress1,
  address2,
  setAddress2,
  phoneNumber,
  setPhoneNumber,
  zipCode,
  setZipCode,
  selectedAddressIndex,
  setSelectedAddressIndex
}) => {
  const handleSavedAddressClick = (index, item) => {
    setSelectedAddressIndex(index);
    setUsername(item.userName);
    setAddress1(item.address1);
    setAddress2(item.address2);
    setZipCode(item.zipCode);
    setPhoneNumber(item.phoneNumber);
    setCity(item.city);
  };

  return (
    <div className="w-full 800px:w-[95%] bg-white rounded-md p-5 pb-8">
      <h5 className="text-[18px] font-[500]">Shipping Address</h5>
      <br />
      <form>
        <div className="w-full flex pb-3">
          <div className="w-[50%]">
            <label className="block pb-2">Full Name</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className={`${styles.input} !w-[95%]`}
            />
          </div>
          <div className="w-[50%]">
            <label className="block pb-2">City</label>
            <input
              type="city"
              required
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className={`${styles.input} !w-[95%]`}
            />
          </div>
        </div>

        <div className="w-full flex pb-3">
          <div className="w-[50%]">
            <label className="block pb-2">Phone Number</label>
            <input
              type="number"
              required
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className={`${styles.input} !w-[95%]`}
            />
          </div>
          <div className="w-[50%]">
            <label className="block pb-2">Zip Code</label>
            <input
              type="number"
              required
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              className={`${styles.input} !w-[95%]`}
            />
          </div>
        </div>

        <div className="w-full flex pb-3">
          <div className="w-[50%]">
            <label className="block pb-2">Address 1</label>
            <input
              type="address"
              required
              value={address1}
              onChange={(e) => setAddress1(e.target.value)}
              className={`${styles.input} !w-[95%]`}
            />
          </div>

          <div className="w-[50%]">
            <label className="block pb-2">Landmark</label>
            <input
              type="address"
              value={address2}
              onChange={(e) => setAddress2(e.target.value)}
              className={`${styles.input} !w-[95%]`}
            />
          </div>
        </div>

        
      <br />
        <button
          className="text-[18px] cursor-pointer inline-block bg-gradient-to-r from-purple-400 to-blue-500 text-white px-4 py-2 rounded-md shadow-lg hover:from-blue-500 hover:to-purple-400 transition duration-300"
          onClick={() => setUserInfo(!userInfo)}
        >
          Choose From saved address
        </button>
        {userInfo && (
          <div>
            {user &&
              user.addresses.map((item, index) => (
                <div className="w-full flex mt-1" key={index}>
                  <input
                    type="checkbox"
                    className="mr-3"
                    value={item.addressType}
                    checked={selectedAddressIndex === index}
                    onChange={() => handleSavedAddressClick(index, item)}
                  />
                  <h2>{`${item.addressType} ${item.address1} ${item.address2}`}</h2>
                </div>
              ))}
          </div>
        )}
      </form>
    </div>
  );
};

const CartData = ({
  handleSubmit,
  totalPrice,
  shipping,
  subTotalPrice,
  couponCode,
  setCouponCode,
  discountPercentenge
}) => {
  return (
    <div className="w-full bg-white rounded-md p-5">
      <div className="flex justify-between">
        <h5 className="text-[18px] font-[500]">Cart Summary</h5>
        <h5 className="text-[16px] font-[400]">
          Total: <span className="font-[600]">${totalPrice}</span>
        </h5>
      </div>
      <br />
      <form onSubmit={handleSubmit}>
        <div className="w-full flex pb-3">
          <input
            type="text"
            placeholder="Coupon Code"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            className={`${styles.input} !w-[60%]`}
          />
          <button type="submit" className={`${styles.button} !w-[30%] ml-3`}>
            Apply
          </button>
        </div>
      </form>
      <br />
      <div className="flex justify-between">
        <h5 className="text-[16px] font-[400]">Subtotal:</h5>
        <h5 className="text-[16px] font-[400]">${subTotalPrice}</h5>
      </div>
      <br />
      <div className="flex justify-between">
        <h5 className="text-[16px] font-[400]">Shipping:</h5>
        <h5 className="text-[16px] font-[400]">${shipping}</h5>
      </div>
      <br />
      <div className="flex justify-between">
        <h5 className="text-[16px] font-[400]">Discount:</h5>
        <h5 className="text-[16px] font-[400]">${discountPercentenge}</h5>
      </div>
      <br />
    </div>
  );
};
export default Checkout;
