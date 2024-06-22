const express = require("express");
const router = express.Router();
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const { isAuthenticated, isSeller, isAdmin } = require("../middleware/auth");
const Shop = require("../model/shop");
const axios = require("axios");

// Define the route for updating new stock notification
router.patch(
  "/new-stock-notification",
  isSeller, // Middleware to authenticate the request as a seller
  catchAsyncErrors(async (req, res, next) => {
    try {
      // Extract shopId and newStock from the request body
      const { shopId, newStock } = req.body;

      // Log the received shopId for debugging purposes
      console.log("shopId", shopId);

      // Find the shop by its ID in the database
      const shop = await Shop.findById(shopId);

      // Log the found shop for debugging purposes
      console.log("shop", shop);

      // Check if the shop exists
      if (!shop) {
        return next(new ErrorHandler("Shop Id is invalid!", 400));
      }

      // Update the notification field based on the newStock value
      shop.notification = newStock;

      // Save the updated shop
      await shop.save();

      // Respond with a success message based on the newStock value
      res.status(200).json({
        success: true,
        message: newStock ? "New stock notification enabled" : "New stock notification disabled",
      });
    } catch (error) {
      // Handle any errors that occur during the process
      return next(new ErrorHandler(error.message, 400));
    }
  })
);

router.get(
  "/admin-new-stock-notifications",
  isAuthenticated,
  isAdmin("Admin"), // Middleware to authenticate the request
  catchAsyncErrors(async (req, res, next) => {
    try {
      // Fetch shops where notification is true
      const shops = await Shop.find({ notification: true });

      // Extract new stock notifications from the fetched shops
      const notifications = shops.map((shop) => ({
        shopId: shop._id,
        name: shop.name,
        phoneNumber: shop.phoneNumber,
        email: shop.email,
        address: shop.address,
        joinedAt: shop.createdAt,
        newStock: shop.notification,
        images: shop.avatar.url,
      }));

      // Respond with the list of notifications
      res.status(200).json({
        success: true,
        notifications,
      });
    } catch (error) {
      // Handle any errors that occur during the process
      return next(new ErrorHandler(error.message, 500));
    }
  })
);


module.exports = router;
