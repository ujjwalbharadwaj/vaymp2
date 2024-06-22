import React, { useEffect, useState } from "react";
import { Button, FormControl, MenuItem, Select } from "@material-ui/core";
import { DataGrid } from "@material-ui/data-grid";
import { AiOutlineDelete, AiOutlineEye } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getAllProductsShop, deleteProduct, updateProductStock } from "../../redux/actions/product";
import Loader from "../Layout/Loader";

const AllProducts = () => {
  const { products, isLoading } = useSelector((state) => state.products);
  const { seller } = useSelector((state) => state.seller);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllProductsShop(seller._id));
  }, [dispatch, seller._id]);

  // Filter products where listing is not equal to "Event"
  const filteredProducts = products && products.filter((product) => product.listing !== "Event");

  // Define state for selected size and quantity
  const [selectedSize, setSelectedSize] = useState({});
  const [selectedQuantity, setSelectedQuantity] = useState({});

  // Event handler for size change
  const handleSizeChange = (productId, size) => {
    setSelectedSize((prevSize) => ({ ...prevSize, [productId]: size }));
    // Update selected quantity based on selected size
    const product = products.find((item) => item._id === productId);
    if (product && product.stock && product.stock.length > 0) {
      const stockItem = product.stock.find((stock) => stock.size === size);
      setSelectedQuantity((prevQuantity) => ({
        ...prevQuantity,
        [productId]: stockItem ? stockItem.quantity : 0,
      }));
    }
  };

  // Event handler for quantity change
  const handleQuantityChange = (productId, quantity) => {
    setSelectedQuantity((prevQuantity) => ({
      ...prevQuantity,
      [productId]: quantity,
    }));
  };

  // Event handler for quantity increment
  const handleQuantityIncrement = (productId) => {
    setSelectedQuantity((prevQuantity) => ({
      ...prevQuantity,
      [productId]: (prevQuantity[productId] || 0) + 1,
    }));
  };

  // Event handler for quantity decrement
  const handleQuantityDecrement = (productId) => {
    const currentQuantity = selectedQuantity[productId] || 0;
    if (currentQuantity > 0) {
      setSelectedQuantity((prevQuantity) => ({
        ...prevQuantity,
        [productId]: currentQuantity - 1,
      }));
    }
  };

  // Event handler for updating product stock
  const handleUpdate = async (productId) => {
    const quantityToUpdate = selectedQuantity[productId];
    const sizeToUpdate = selectedSize[productId];

    if (quantityToUpdate !== undefined && sizeToUpdate) {
      try {
        await dispatch(updateProductStock(productId, sizeToUpdate, quantityToUpdate));
        console.log(`Successfully updated quantity for size ${sizeToUpdate} of product ${productId}`);
      } catch (error) {
        console.error(`Error updating quantity for size ${sizeToUpdate} of product ${productId}:`, error);
      }
    } else {
      console.error(`Quantity or size for product ${productId} is missing.`);
    }
  };

  return (
    <div className="container mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading ? (
          <Loader />
        ) : (
          !filteredProducts || filteredProducts.length === 0 ? (
            <p>No products found.</p>
          ) : (
            filteredProducts.map((product) => (

              <div key={product._id} className="border rounded-lg p-4 shadow-md">
                <Link to={`/product/${product._id}`}>
                  <img src={product.images[0]?.url} alt="Product" className="w-full h-64 object-contain rounded mb-2" />
                  <div className="cursor-pointer absolute right-2 top-5">
                    <Link to={`/product/${product._id}`}>
                      <button className="text-blue-500 hover:text-blue-700"><AiOutlineEye size={20} /></button>
                    </Link>
                  </div>
                </Link>
                <Link to={`/product/${product._id}`} className="text-lg font-semibold hover:text-blue-500">{product.name}</Link>
                <p className="text-gray-600">Price: Rs. {product.discountPrice}</p>
                <div className="flex">
                  <select
                    className="mt-2 border p-1 rounded-md w-1/2"
                    value={selectedSize[product._id] || ""}
                    onChange={(e) => handleSizeChange(product._id, e.target.value)}
                  >
                    <option value="">Select Size</option>
                    {product.stock.map((stockItem, index) => (
                      <option key={`${stockItem.size}-${index}`} value={stockItem.size}>{stockItem.size}</option>
                    ))}
                  </select>
                  <div className="flex justify-between mt-2 ml-3">
                    <button
                      className="bg-blue-500 text-white font-extrabold text-xl px-2 py-1 rounded-md hover:bg-blue-600"
                      onClick={() => handleQuantityDecrement(product._id)}
                      disabled={selectedQuantity[product._id] === 0}
                    >
                      &#x2212;
                    </button>
                    <input
                      type="number"
                      className="border text-center w-1/2 px-1"
                      value={selectedQuantity[product._id] || ""}
                      onChange={(e) => handleQuantityChange(product._id, e.target.value)}
                    />
                    <button
                      className="bg-blue-500 text-white font-extrabold text-xl px-2 py-1 rounded-md hover:bg-blue-600"
                      onClick={() => handleQuantityIncrement(product._id)}
                    >
                      &#x002B;
                    </button>
                  </div>
                </div>
                <div className="flex justify-between mt-2">
                  <button
                    className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                    onClick={() => handleUpdate(product._id)}
                  >
                    Update
                  </button>
                  <div className="mt-6">
                    <Link to={`/product/${product._id}`}>
                      <button className="text-blue-500 hover:text-blue-700"><AiOutlineEye size={20} /></button>
                    </Link>
                    {/* Uncomment below if you want to include delete functionality */}
                    {/* <button className="text-red-500 hover:text-red-700 ml-2" onClick={() => handleDelete(product._id)}><AiOutlineDelete size={20} /></button> */}
                  </div>
                </div>
              </div>
            ))
          )
        )}
      </div>
    </div>
  );
};

export default AllProducts;

