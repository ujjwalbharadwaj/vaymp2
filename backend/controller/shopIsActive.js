const express = require("express");
const router = express.Router();
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const { isAuthenticated, isSeller, isAdmin } = require("../middleware/auth");
const Shop = require("../model/shop");
const Product = require("../model/product");
const Event = require("../model/event");

const axios = require("axios");

// Define the route for updating new stock shopIsActive
router.patch(
  "/shopIsActive",
  isSeller, // Middleware to authenticate the request as a seller
  catchAsyncErrors(async (req, res, next) => {
    try {
      // Extract shopId and shopStatus from the request body
      const { shopId, shopStatus } = req.body;

      // Log the received shopId for debugging purposes
      console.log("shopId", shopId);

      // Find the shop by its ID in the database
      const shop = await Shop.findById(shopId);
      if (!shop) {
        return next(new ErrorHandler("Shop Id is invalid!", 400));
      }

      // Update the shopIsActive field in the shop record
      shop.shopIsActive = shopStatus;
      await shop.save();

      // Update the shopIsActive field in all product records associated with the shopId
      const updateResultForProduct = await Product.updateMany(
        { shopId: shopId },
        { $set: { "shop.shopIsActive": shopStatus } }
      );
      const updateResultForEvents = await Event.updateMany(
        { shopId: shopId },
        { $set: { "shop.shopIsActive": shopStatus } }
      );

      // Log the update result for debugging purposes
      console.log("updateResultForProduct", updateResultForProduct);
      console.log("updateResultForEvents", updateResultForEvents);

      // Respond with a success message based on the shopStatus value
      res.status(200).json({
        success: true,
        message: shopStatus ? "shopIsActive enabled" : "shopIsActive disabled",
      });
    } catch (error) {
      // Handle any errors that occur during the process
      return next(new ErrorHandler(error.message, 400));
    }
  })
);




router.get(
  "/admin-shopIsActives",
  isAuthenticated,
  isAdmin("Admin"), // Middleware to authenticate the request
  catchAsyncErrors(async (req, res, next) => {
    try {
      // Fetch shops where shopIsActive is true
      const shops = await Shop.find({ shopIsActive: true });

      // Extract new stock shopIsActives from the fetched shops
      const shopIsActives = shops.map((shop) => ({
        shopId: shop._id,
        name: shop.name,
        email: shop.email,
        address: shop.address,
        joinedAt: shop.createdAt,
        shopStatus: shop.shopIsActive,
        images: shop.avatar.url,
      }));

      // Respond with the list of shopIsActives
      res.status(200).json({
        success: true,
        shopIsActives,
      });
    } catch (error) {
      // Handle any errors that occur during the process
      return next(new ErrorHandler(error.message, 500));
    }
  })
);


module.exports = router;