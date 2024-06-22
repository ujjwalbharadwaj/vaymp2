const express = require("express");
const router = express.Router();
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const { isAuthenticated, isSeller, isAdmin } = require("../middleware/auth");
const Order = require("../model/order");
const Shop = require("../model/shop");
const Product = require("../model/product");
const Refund = require("../model/refund");

const axios = require("axios");
// Create new order
router.post(
  "/create-refund",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { orderId,productId,size,qty,userId,status,shopId,shopPrice,
        user,
        paymentInfo,
        markedPrice,discountPrice,shippingAddress,refundStatus,cancel,delivered,img,
        productName,product
      } = req.body;
       // console.log("order created req.body",cart)
       const shopItemsMap = new Map();

      
      // Create an order for each shop
      const refunds = [];
        
        const refundData = await Refund.create({
          orderId,
          productId,
          size,
          qty,
          userId,
          status,
          shopId,
          shopPrice,
          markedPrice,
          discountPrice,
          shippingAddress,
          refundStatus,
          cancel,
          delivered,
          img,
          user,
          paymentInfo,
          productName,
          product
        });
        // console.log("order updated",order)
        refunds.push(refundData);
        res.status(201).json({
            success: true,
            refunds,
          });
      console.log("hello",req.body)
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);


// all products --- for admin
router.get(
    "/get-all-admin-refund-request",
    
    catchAsyncErrors(async (req, res, next) => {
      try {
        const refunds = await Refund.find();
        console.log("refunds",refunds)
        const allRefundRequest=refunds.map((i)=>({
            refundId:i._id,
            orderId: i.orderId,
            productId: i.productId,
            size: i.size,
            qty: i.qty,
            status: i.status,
            shopId: i.shopId,
            shopPrice: i.shopPrice,
            markedPrice: i.markedPrice,
            discountPrice: i.discountPrice,
            refundStatus: i.refundStatus,
            user:i.user,
            paymentInfo:i.paymentInfo,
            productName:i.productName,
            product:i.product,
            deliveredAt: i.deliveredAt,
            retunedAt:i.returnedAt,
            createdAt: i.createdAt,
            cancel:i.cancel,
            delivered:i.delivered,
            img:i.img

        }))
        res.status(201).json({
          success: true,
          allRefundRequest,
        });
      } catch (error) {
        return next(new ErrorHandler(error.message, 500));
      }
    })
  );
  
  
  
  // Update stock for a single product
  router.patch(
    "/update-refund/:id",
    catchAsyncErrors(async (req, res, next) => {
      try {
        const orderId = req.params.id;
        const { refundStatus } = req.body; // New stock object from the request body
  
        // Find the product by ID in the database
        const refund = await Refund.findById(orderId);
  
        // Check if the product exists
        if (!refund) {
          return next(new ErrorHandler(`Product not found with ID: ${orderId}`, 404));
        }
  
        // Update the product's stock with the new stock array
        refund.refundStatus = true;
        refund.deliveredAt=Date.now();
        refund.returnedAt=Date.now();
  
        // Save the updated product
        await refund.save();
  
        // Send success response
        res.status(200).json({
          success: true,
          message: "Product stock updated successfully",
          refund,
        });
      } catch (error) {
        console.error("Error updating product stock:", error);
        return next(new ErrorHandler(error.message, 500));
      }
    })
  );

  
module.exports = router;
