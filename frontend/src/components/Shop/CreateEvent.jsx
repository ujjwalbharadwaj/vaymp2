import React, { useEffect, useState } from "react";
import { AiOutlinePlusCircle, AiOutlineMinusCircle ,AiOutlineClose} from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createProduct } from "../../redux/actions/product";
import {
  categoriesData,
  subCategory,
  sleeveType,
  neckType,
  color,
  fabric,
  occasion,
  fit,
  gender,  
  listing
} from "../../static/data";
import { useParams } from 'react-router-dom';

import { toast } from "react-toastify";
import { Hourglass } from "react-loader-spinner";

const CreateEvent = () => {
  // const { seller } = useSelector((state) => state.seller);

  let { id } = useParams();
  const seller=id;
  const {user} = useSelector((state) => state.user);

  // console.log("user._id",user._id)
  const { success, error } = useSelector((state) => state.products);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");

  const [tags, setTags] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");
  const [ShopPrice, setShopPrice] = useState("");
  const [discountPrice, setDiscountPrice] = useState("");
  const [selectedSleeveType, setSelectedSleeveType] = useState("");
  const [selectedNeckType, setSelectedNeckType] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedFabric, setSelectedFabric] = useState("");
  const [selectedOccasion, setSelectedOccasion] = useState("");
  const [selectedFit, setSelectedFit] = useState("");
  const [selectedListing, setSelectedListing] = useState("");

  const [selectedGender, setSelectedGender] = useState("");
  const [sizesAndQuantities, setSizesAndQuantities] = useState([{ size: "", quantity: 0 }]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const sizes = [
    '2XS', 'XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL', '6XL', '7XL', '8XL',
    '0 - 1 Month', '1 - 2 Months', '2 - 3 Months', '3 - 4 Months', '4 - 5 Months', '5 - 6 Months', 
    '6 - 7 Months', '7 - 8 Months', '8 - 9 Months', '9 - 10 Months', '10 - 11 Months', '11 - 12 Months', 
    '1 - 2 Years', '2 - 3 Years', '3 - 4 Years', '4 - 5 Years', '5 - 6 Years', '6 - 7 Years', '7 - 8 Years', 
    '8 - 9 Years', '9 - 10 Years', '10 - 11 Years', '11 - 12 Years', '12 - 13 Years', '13 - 14 Years', 
    '14 - 15 Years', '15 - 16 Years'
  ];  

    const handleStartDateChange = (e) => {
    const startDate = new Date(e.target.value);
    const minEndDate = new Date(startDate.getTime() + 3 * 24 * 60 * 60 * 1000);
    setStartDate(startDate);
    document.getElementById("start-date").min = startDate.toISOString().slice(
      0,
      10
    );
    document.getElementById("end-date").min = minEndDate.toISOString().slice(
      0,
      10
    );
  };

  const handleEndDateChange = (e) => {
    const endDate = new Date(e.target.value);
    setEndDate(endDate);
  };

  const today = new Date().toISOString().slice(0, 10);

  const minEndDate = startDate
  ? new Date(startDate.getTime() + 30 * 60 * 1000)
  .toISOString()
        .slice(0, 10)
    : "";


  useEffect(() => {
    if (error) {
      toast.error(error);
    }
    if (success) {
      toast.success("Product created successfully!");
      navigate("/admin-sellers");
      window.location.reload();
    }
  }, [dispatch, error, success]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    setImages([]);

    files.forEach((file) => {
      const reader = new FileReader();

      reader.onload = () => {
        if (reader.readyState === 2) {
          setImages((old) => [...old, reader.result]);
        }
      };
      reader.readAsDataURL(file);
    });
  };
  const handleDeleteImage = (index) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };
  const handleAddSizeQuantity = () => {
    setSizesAndQuantities([...sizesAndQuantities, { size: "", quantity: 0 }]);
  };

  const handleRemoveSizeQuantity = (index) => {
    const updatedSizesAndQuantities = [...sizesAndQuantities];
    updatedSizesAndQuantities.splice(index, 1);
    setSizesAndQuantities(updatedSizesAndQuantities);
  };

  const handleSubmit =  (e) => {
    e.preventDefault();
    setLoading(true);

    const stockData = sizesAndQuantities.map(({ size, quantity }) => ({ size, quantity }));


    const newForm = new FormData();

    images.forEach((image) => {
      newForm.append("images", image);
    });

    newForm.append("name", name);
    newForm.append("description", description);
    newForm.append("tags", tags);
    newForm.append("Shop's Price", ShopPrice);
    newForm.append("originalPrice", originalPrice);
    newForm.append("discountPrice", discountPrice);
    newForm.append("category", category);
    newForm.append("subCategory", selectedSubCategory);
    newForm.append("neckType", selectedNeckType);
    newForm.append("sleeveType", selectedSleeveType);
    newForm.append("brand", selectedBrand);
    newForm.append("color", selectedColor);
    newForm.append("fabric", selectedFabric);
    newForm.append("occasion", selectedOccasion);
    newForm.append("fit", selectedFit);
    newForm.append("startDate", startDate);
    newForm.append("endDate", endDate);
    newForm.append("gender", selectedGender);
    newForm.append("shopId", seller._id);
    newForm.append("adminCreated", user._id);


     dispatch(
        createProduct({
          name,
          description,
          tags,
          ShopPrice,
          originalPrice,
          discountPrice,
          stock: stockData,
          category,
          subCategory:selectedSubCategory,
          neckType: selectedNeckType,
          sleeveType: selectedSleeveType,
          brand: selectedBrand,
          color: selectedColor,
          fabric: selectedFabric,
          occasion: selectedOccasion,
          fit: selectedFit,
          listing:selectedListing,
          gender: selectedGender,
          shopId: seller,
          adminCreated:user,
          images,
          startDate,
          endDate
        })
      );
    } 

console.log("category",category)
  return (
<div className="w-[90%] 800px:w-[50%] bg-blue-50 shadow h-[100vh] rounded-[4px] p-3 overflow-y-scroll">     
 <h5 className="text-[30px] font-Poppins text-center">Create Product</h5>
      <form onSubmit={handleSubmit}>
        <br />
        <div>
          <label className="pb-2">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your product name..."
            className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        <br />
        <div>
          <label className="pb-2">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            cols="30"
            required
            rows="8"
            type="text"
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter your product description..."
            className="mt-2 appearance-none block w-full pt-2 px-3 border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          ></textarea>
        </div>
        <br />
        
        <div>
          <label className="pb-2">Tags</label>
          <input
            type="text"
            name="tags"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="Enter your product tags..."
            className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        <br />
        <div>
          <label className="pb-2">Shop's Price</label>
          <input
            type="number"
            name="price"
            value={ShopPrice}
            onChange={(e) => setShopPrice(e.target.value)}
            placeholder="Enter your product price..."
            className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        <br />
        <div>
          <label className="pb-2">Original Price</label>
          <input
            type="number"
            name="price"
            value={originalPrice}
            onChange={(e) => setOriginalPrice(e.target.value)}
            placeholder="Enter your product price..."
            className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        <br />
        <div>
          <label className="pb-2">
            Price (With Discount) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="price"
            value={discountPrice}
            onChange={(e) => setDiscountPrice(e.target.value)}
            placeholder="Enter your product price with discount..."
            className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        <br />
        {category==="Cloths" && <div>
            <label className="pb-2">Size and Quantity</label>
            {sizesAndQuantities.map((item, index) => (
              <div key={index} className="flex mt-2">
                <select
                  className="w-1/2 border h-[35px] rounded-[5px] mr-2"
                  value={item.size}
                  onChange={(e) => {
                    const updatedSizesAndQuantities = [...sizesAndQuantities];
                    updatedSizesAndQuantities[index].size = e.target.value;
                    setSizesAndQuantities(updatedSizesAndQuantities);
                  }}
                >
                  <option value="">Select size</option>
                  {sizes.map((size) => (
                    <option value={size} key={size}>
                      {size}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  value={item.quantity}
                  onChange={(e) => {
                    const updatedSizesAndQuantities = [...sizesAndQuantities];
                    updatedSizesAndQuantities[index].quantity = parseInt(e.target.value, 10);
                    setSizesAndQuantities(updatedSizesAndQuantities);
                  }}
                  placeholder="Enter product quantity..."
                  className="w-1/2 border h-[35px] rounded-[5px] mr-2 px-3"
                />
                {index === sizesAndQuantities.length - 1 && (
                  <AiOutlinePlusCircle
                    size={30}
                    className="mt-1 cursor-pointer"
                    color="#555"
                    onClick={handleAddSizeQuantity}
                  />
                )}
                {index !== sizesAndQuantities.length - 1 && (
                  <AiOutlineMinusCircle
                    size={30}
                    className="mt-1 cursor-pointer"
                    color="red"
                    onClick={() => handleRemoveSizeQuantity(index)}
                  />
                )}
              </div>
            ))}
          </div>}
          <br />
        <div>
          <label className="pb-2">
            Category <span className="text-red-500">*</span>
          </label>
          <select
            className="w-full mt-2 border h-[35px] rounded-[5px]"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">Choose a category</option>
            {categoriesData.map((i) => (
              <option value={i.title} key={i.title}>
                {i.title}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="pb-2">
            subCategory <span className="text-red-500">*</span>
          </label>
          <select
            className="w-full mt-2 border h-[35px] rounded-[5px]"
            value={selectedSubCategory}
            onChange={(e) => setSelectedSubCategory(e.target.value)}
          >
            <option value="">Choose a sub-Category</option>
            {subCategory.map((i) => (
              <option value={i.title} key={i.title}>
                {i.title}
              </option>
            ))}
          </select>
        </div>
        <br />
        <div>
          <label className="pb-2">listing</label>
          <select
            className="w-full mt-2 border h-[35px] rounded-[5px]"
            value={selectedListing}
            onChange={(e) => setSelectedListing(e.target.value)}
          >
            <option value="">Choose listing type</option>
            {listing.map((i) => (
              <option value={i.type} key={i.type}>
                {i.type}
              </option>
            ))}
          </select>
        </div>
        <br />
        <div>
          <label className="pb-2">Neck Type</label>
          <select
            className="w-full mt-2 border h-[35px] rounded-[5px]"
            value={selectedNeckType}
            onChange={(e) => setSelectedNeckType(e.target.value)}
          >
            <option value="">Choose neck type</option>
            {neckType.map((i) => (
              <option value={i.title} key={i.title}>
                {i.title}
              </option>
            ))}
          </select>
        </div>
        <br />
        <div>
          <label className="pb-2">Sleeve Type</label>
          <select
            className="w-full mt-2 border h-[35px] rounded-[5px]"
            value={selectedSleeveType}
            onChange={(e) => setSelectedSleeveType(e.target.value)}
          >
            <option value="">Choose sleeve type</option>
            {sleeveType.map((type) => (
              <option value={type.title} key={type.title}>
                {type.title}
              </option>
            ))}
          </select>
        </div>
        <br />
        <div>
          <label className="pb-2">
            Brand <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={selectedBrand}
            onChange={(e) => setSelectedBrand(e.target.value)}
            placeholder="Enter your product name..."
            className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        <br />
        <div>
          <label className="pb-2">Color</label>
          <select
            className="w-full mt-2 border h-[35px] rounded-[5px]"
            value={selectedColor}
            onChange={(e) => setSelectedColor(e.target.value)}
          >
            <option value="">Choose Color</option>
            {color.map((type) => (
              <option value={type.name} key={type.name}>
                {type.name}
              </option>
            ))}
          </select>
        </div>
        <br />
        <div>
          <label className="pb-2">Fabric</label>
          <select
            className="w-full mt-2 border h-[35px] rounded-[5px]"
            value={selectedFabric}
            onChange={(e) => setSelectedFabric(e.target.value)}
          >
            <option value="">Choose Fabric type</option>
            {fabric.map((i) => (
              <option value={i.type} key={i.type}>
                {i.type}
              </option>
            ))}
          </select>
        </div>
        <br />
        <div>
          <label className="pb-2">Occasion</label>
          <select
            className="w-full mt-2 border h-[35px] rounded-[5px]"
            value={selectedOccasion}
            onChange={(e) => setSelectedOccasion(e.target.value)}
          >
            <option value="">Choose Occasion type</option>
            {occasion.map((i) => (
              <option value={i.type} key={i.type}>
                {i.type}
              </option>
            ))}
          </select>
        </div>
        <br />
        <div>
          <label className="pb-2">fit</label>
          <select
            className="w-full mt-2 border h-[35px] rounded-[5px]"
            value={selectedFit}
            onChange={(e) => setSelectedFit(e.target.value)}
          >
            <option value="">Choose fit type</option>
            {fit.map((i) => (
              <option value={i.type} key={i.type}>
                {i.type}
              </option>
            ))}
          </select>
        </div>
        <br />
        <div>
          <label className="pb-2">Gender</label>
          <select
            className="w-full mt-2 border h-[35px] rounded-[5px]"
            value={selectedGender}
            onChange={(e) => setSelectedGender(e.target.value)}
          >
            <option value="">Choose Gender type</option>
            {gender.map((i) => (
              <option value={i.type} key={i.type}>
                {i.type}
              </option>
            ))}
          </select>
        </div>
        <br />
        <div>
           <label className="pb-2">
             Event Start Date <span className="text-red-500">*</span>
           </label>
           <input
            type="date"
            name="price"
            id="start-date"
            value={startDate ? startDate.toISOString().slice(0, 10) : ""}
            className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            onChange={handleStartDateChange}
            min={today}
            placeholder="Enter your event product stock..."
          />
        </div>
        <br />
        <div>
          <label className="pb-2">
            Event End Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            name="price"
            id="end-date"
            value={endDate ? endDate.toISOString().slice(0, 10) : ""}
            className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            onChange={handleEndDateChange}
            min={minEndDate}
            placeholder="Enter your event product stock..."
          />
        </div>
        <br />
        <div>
          <label className="pb-2">
            Upload Images <span className="text-red-500">*</span>
          </label>
          <input
            type="file"
            name=""
            id="upload"
            className="hidden"
            multiple
            onChange={handleImageChange}
          />
          <div className="w-full flex items-center flex-wrap">
            <label htmlFor="upload">
              <AiOutlinePlusCircle size={30} className="mt-3" color="#555" />
            </label>
            </div>

          {/* Update to display delete buttons next to each image */}
          <div className="w-full flex items-center flex-wrap">
            {images &&
              images.map((image, index) => (
                <div key={index} className="relative">
                  <img
                    src={image}
                    alt={`Product ${index + 1}`}
                    className="h-[120px] w-[120px] object-cover m-2"
                  />
                  <button
                    onClick={() => handleDeleteImage(index)}
                    className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full"
                  >
                    <AiOutlineClose />
                  </button>
                </div>
  ))}

          </div>
        
        </div>

        <div>
        <div>
          {loading ? (
            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
                <Hourglass
                      height={50}
                      width={50}
                      color="cyan"
                      ariaLabel="circles-loading"
                    />
                    </div>
              ) : (
          <input
            type="submit"
            value="Create"
            className="mt-2 cursor-pointer appearance-none text-center block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        )}
        </div>
        </div>
      </form>
    </div>
  );
};

export default CreateEvent;