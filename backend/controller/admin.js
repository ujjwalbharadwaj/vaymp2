const express = require("express");
const { isSeller, isAuthenticated, isAdmin } = require("../middleware/auth");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const router = express.Router();
const Product = require("../model/product");
const Order = require("../model/order");
const Shop = require("../model/shop");
const cloudinary = require("cloudinary");
const ErrorHandler = require("../utils/ErrorHandler");


//create product
router.post(
    "/admin-create-product",
    catchAsyncErrors(async (req, res, next) => {
      try {
        const shopId = req.body.shopId;
        const shop = await Shop.findById("65f47168b5e2afaed9be551c");
        
        if (!shop) {
          return next(new ErrorHandler("Shop ID is invalid!", 400));
        }
  
        // Validate other data fields here
        const { name, description, category, originalPrice, discountPrice, stock } = req.body;
        
        if (!name || !description || !category || !originalPrice || !discountPrice || !stock  || !images) {
          return next(new ErrorHandler("Invalid product data. Please provide all required fields.", 400));
        }
  
        let images = [];
  
        if (typeof req.body.images === "string") {
          images.push(req.body.images);
        } else {
          images = req.body.images;
        }
  
        const imagesLinks = [];
        
        for (let i = 0; i < images.length; i++) {
          const result = await cloudinary.v2.uploader.upload(images[i], {
            folder: "products",
          });
        
          imagesLinks.push({
            public_id: result.public_id,
            url: result.secure_url,
          });
        }
  
        const productData = { 
          name, 
          description, 
          category, 
          originalPrice, 
          discountPrice, 
          stock, 
          images: imagesLinks,
          shop: shopId, // Assign the selected shop ID to the product
        };
  
        const product = await Product.create(productData);
  
        res.status(201).json({
          success: true,
          product,
        });
      } catch (error) {
        console.error("Error creating product:", error);
        return next(new ErrorHandler(error.message, 400));
      }
    })
  );
  

// Update product stock by admin or seller
router.put(
    "/update-product-stock/:id",
    isAuthenticated, // Middleware to check if the user is authenticated
    catchAsyncErrors(async (req, res, next) => {
      try {
        const productId = req.params.id; // Correctly get the product ID from request params
        const newStock = req.body.stock; // Assuming the request body contains the new stock value
  
        // Check if the user is an admin or a seller
        if (req.user.role !== 'admin' && req.user.role !== 'seller') {
          return next(new ErrorHandler('Unauthorized access', 401));
        }
  
        // Find the product by ID
        const product = await Product.findById(productId);
  
        if (!product) {
          return next(new ErrorHandler(`Product not found with ID: ${productId}`, 404));
        }
  
        // Update the product's stock
        product.stock = newStock;
  
        // Save the updated product
        await product.save();
  
        res.status(200).json({
          success: true,
          message: "Product stock updated successfully!",
          product,
        });
      } catch (error) {
        return next(new ErrorHandler(error.message, 500));
      }
    })
  );
  

module.exports = router;
