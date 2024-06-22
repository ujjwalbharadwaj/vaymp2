const express = require("express");
const router = express.Router();
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const { isAuthenticated, isSeller, isAdmin } = require("../middleware/auth");
const Order = require("../model/order");
const Shop = require("../model/shop");
const Product = require("../model/product");
const Kuchvi = require("../model/kuchvi");

const axios = require("axios");
// Create new order
router.post(
  "/create-kuchvi",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { refund, orderId,productId,size,qty,userId,status,shopId,shopPrice,markedPrice,discountPrice,shippingAddress,refundStatus,return1,cancel,delivered,
        productName,product,
        user,
        paymentInfo,
        transferredToDeliveryPartner,
                  outForPick,
                  picked,
                  shopReciveredReturn,
                  returnedToShop,
                  transferedToManager, 
      } = req.body;
       // console.log("order created req.body",cart)
       const shopItemsMap = new Map();

      
      // Create an order for each shop
      const kuchvis = [];
        
        const kuchviData = await Kuchvi.create({

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
          refund,
          return1,
          cancel,
          user,
          delivered,
          paymentInfo,
          productName,
          product,
          transferredToDeliveryPartner,
          outForPick,
          picked,
                  shopReciveredReturn,
                  returnedToShop,
                  transferedToManager, 
        });
        // console.log("order updated",order)
        kuchvis.push(kuchviData);
        res.status(201).json({
            success: true,
            kuchvis,
          });
      console.log("hello",req.body)
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);


// all products --- for admin
router.get(
    "/get-all-admin-kuchvi-request",
    
    catchAsyncErrors(async (req, res, next) => {
      try {
        const kuchvis = await Kuchvi.find();
        // console.log("refunds",refunds)
        const allKuchviRequest=kuchvis.map((i)=>({
            // refundId:i._id,
            kuchviId:i._id,
            orderId: i.orderId,
            productId: i.productId,
            size: i.size,
            qty: i.qty,
            status: i.status,
            shopId: i.shopId,
            user:i.user,
            productName:i.productName,
            product:i.product,
            shopPrice: i.shopPrice,
            markedPrice: i.markedPrice,
            discountPrice: i.discountPrice,
            refundStatus: i.refundStatus,
            deliveredAt: i.deliveredAt,
            retunedAt:i.returnedAt,
            return1:i.return1,
            cancel:i.cancel,
            delivered:i.delivered,
            createdAt: i.createdAt,
            userId:i.userId,
            paymentInfo:i.paymentInfo,
            // productName:i.productName,
            img:i.img,
            shippingAddress:i.shippingAddress,
            // return1:i.return1
        }))
        res.status(201).json({
          success: true,
          allKuchviRequest,
        });
      } catch (error) {
        return next(new ErrorHandler(error.message, 500));
      }
    })
  );
  
  
  
  // Update stock for a single product
  router.patch(
    "/update-kuchvi/:id",
    catchAsyncErrors(async (req, res, next) => {
      try {
        const orderId = req.params.id;
        const { status,cancel,return1, delivered,paymentInfo,deliveredAt,returnedAt,refundStatus,refund } = req.body; // New stock object from the request body
  
        // Find the product by ID in the database
        const kuchvi = await Kuchvi.findById(orderId);
  
        // Check if the product exists
        if (!kuchvi) {
          return next(new ErrorHandler(`Product not found with ID: ${orderId}`, 404));
        }
  
        // Update the product's stock with the new stock array
        // kuchvi.refundStatus = refundStatus;
        // kuchvi.productId = productId;
        // kuchvi.qty = qty;
        if (status !== undefined) {
          kuchvi.status = status;
        }
        if (refund !== undefined) {
          kuchvi.refund = refund;
        }
        if (cancel !== undefined) {
          kuchvi.cancel = cancel;
        }
        if (delivered !== undefined) {
          kuchvi.delivered = delivered;
        }
        if (return1 !== undefined) {
          kuchvi.return1 = return1;
        }
        if (refundStatus !== undefined) {
          kuchvi.refundStatus = refundStatus;
        }
        if (paymentInfo !== undefined) {
          kuchvi.paymentInfo = paymentInfo;
        }
        if (deliveredAt !== undefined) {
          kuchvi.deliveredAt=Date.now();
        }
        if (returnedAt !== undefined) {
          kuchvi.returnedAt=Date.now();
        }
        
  
        // Save the updated product
        await kuchvi.save();
  
        // Send success response
        res.status(200).json({
          success: true,
          message: "Product stock updated successfully",
          kuchvi,
        });
      } catch (error) {
        console.error("Error updating product stock:", error);
        return next(new ErrorHandler(error.message, 500));
      }
    })
  );

  
module.exports = router;
