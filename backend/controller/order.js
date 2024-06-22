// async function updateStockAfterOrderCreation(item) {
//   const productId = item._id;
//   const newStock = item.stock; // Assuming item.stock contains the updated stock array
//   // console.log("newStock", newStock);
//   console.log("newstock",newStock)
//   console.log("productId",productId)


//   try {
//     for (const stockItem of newStock) {
//       // Check if the item is selected and has quantity to update
//       const product = await Product.findById(productId);
//       const sid=stockItem._id;
//       if(product.stock._id===sid){
//         stockItem.quantity =product.stock.quantity
      
//       if (stockItem.isSelected && stockItem.qty > 0  && product.stock.quantity>0) {
//         // const product = await Product.findById(productId);
//         // const sid=stockItem._id
//         // if(product.stock._id===sid)
//         stockItem.quantity -= stockItem.qty; // Update the quantity based on item.qty
//         stockItem.isSelected = false; // Set isSelected to false after updating stock
//         stockItem.qty = 0; // Reset qty to 0
// // console.log("newstock111",newStock)
//         // Make HTTP PUT request to update stock using Axios
//         const response = await axios.patch(
//           `http://localhost:8000/api/v2/product/update-stock/${productId}`,
//           {
//             stock: newStock // Update the stock value in the request body
//           }
//         );
//       };
//         if (response.status >= 200 && response.status < 300) {
//           // console.log("Stock updated successfully");
//         } else {
//           throw new Error(
//             `Failed to update stock - Unexpected status code: ${response.status}`
//           );
//         }
//       } else {
//         // If item is not selected or qty is 0, do nothing
//         console.log("Item is not selected for updating stock or qty is 0.");
//       }
//     }
//   } catch (error) {
//     // console.error("Error updating stock:", error.message);
//     throw new Error("Failed to update stock");
//   }
// }


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
  "/create-order",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { cart, shippingAddress, user, totalPrice, paymentInfo } = req.body;

      // Check stock for each item in the cart
      for (const item of cart) {
        const product = await Product.findById(item._id);
        if (!product) {
          return next(new ErrorHandler(`${item.name}${" "}not found in product`, 404));
        }

        let stockItemFound = false;

        for (const stockItem of item.stock) {
          for (const productStockItem of product.stock) {
            if (productStockItem._id.toString() === stockItem._id.toString()) {
              if (productStockItem.quantity < stockItem.qty) {
                return next(new ErrorHandler(`${item.name} in size  ${productStockItem.size}${" "}is out of stock`, 400));
              }
              stockItemFound = true;
              break;
            }
          }
        }

        if (!stockItemFound) {
          return next(new ErrorHandler(`${item.name}${" "}not found in product`, 404));
        }
      }

      // Group cart items by shopId
      const shopItemsMap = new Map();
      for (const item of cart) {
        const shopId = item.shopId;
        if (!shopItemsMap.has(shopId)) {
          shopItemsMap.set(shopId, []);
        }
        shopItemsMap.get(shopId).push(item);
      }

      // Create an order for each shop
      const orders = [];
      const kuchvis = [];
      for (const [shopId, items] of shopItemsMap) {
        const order = await Order.create({
          cart: items,
          shippingAddress,
          user,
          totalPrice,
          paymentInfo,
        });
        orders.push(order);

        for (const item of items) {
          for (const stockItem of item.stock) {
            if (stockItem.isSelected) {
              let myqty = stockItem.qty;
              while (myqty > 0) {
                const kuchviData = await Kuchvi.create({
                  orderId: order._id,
                  productId: item._id,
                  size: stockItem.size,
                  qty: 1,
                  userId: user._id,
                  status: "processing",
                  user: user,
                  shopId: item.shop._id,
                  img: item.images[0].url,
                  shopPrice: item.ShopPrice,
                  paymentInfo: paymentInfo,
                  productName: item.name,
                  product: item,
                  markedPrice: item.originalPrice,
                  discountPrice: item.discountPrice,
                  shippingAddress: shippingAddress,
                  refundStatus: false,
                  delivered: false,
                  cancel: false,
                  return1: false,
                  refund: false,
                  transferredToDeliveryPartner:false,
                  outForPick:false,
                  picked:false,
                  shopReciveredReturn:false,
                  returnedToShop:false,
                  transferedToManager:false,
                  
                });

                kuchvis.push(kuchviData);
                myqty--;
              }
            }
          }
        }
      }

      // Update stock for each item in the cart
      for (const item of cart) {
        await updateStockAfterOrderCreation(item);
      }

      res.status(201).json({
        success: true,
        orders,
        kuchvis,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

async function updateStockAfterOrderCreation(item) {
  const productId = item._id;
  const newStock = item.stock; // Assuming item.stock contains the updated stock array

  try {
    const product = await Product.findById(productId);
    if (!product) {
      throw new Error(`Product with ID ${productId} not found`);
    }

    for (const stockItem of newStock) {
      console.log("Processing stock item:", stockItem);

      if (stockItem.isSelected && stockItem.qty > 0) {
        let stockItemFound = false;

        for (const productStockItem of product.stock) {
          if (productStockItem._id.toString() === stockItem._id.toString()) {
            if (productStockItem.quantity >= stockItem.qty) {
              productStockItem.quantity -= stockItem.qty;
              stockItemFound = true;
              break;
            } else {
              throw new Error(`${item.name}${" "}is out of stock`);
            }
          }
        }

        if (!stockItemFound) {
          throw new Error(`${stockItem.name} ${stockItem.size} is out of stock`);
        }

        console.log("Updated stock item:", stockItem);
      } else {
        console.log("Item is not selected for updating stock or qty is 0.");
      }
    }

    await product.save();
    console.log("Stock updated successfully");
  } catch (error) {
    console.error("Error updating stock:", error.message);
    throw new Error("Out of Stock");
  }
}


// Function to update stock after order creation
async function updateStockCancel(item, size) {
  const productId = item._id;
  const newStock = item.stock; // Assuming item.stock contains the updated stock array
  console.log("newStock", newStock);

  try {
    for (const stockItem of newStock) {
      // Check if the item is selected and has quantity to update
      if (stockItem.isSelected && stockItem.qty > 0 && stockItem.size == size) {
        if (stockItem.qty == 1) {
          stockItem.isSelected = false;
        }
        stockItem.quantity += 1; // Update the quantity based on item.qty
        // Set isSelected to false after updating stock
        stockItem.qty -= 1; // Reset qty to 0

        // Make HTTP PUT request to update stock using Axios
        const response = await axios.patch(
          `http://localhost:8000/api/v2/product/update-stock/${productId}`,
          {
            stock: newStock // Update the stock value in the request body
          }
        );

        if (response.status >= 200 && response.status < 300) {
          // console.log("Stock updated successfully");
        } else {
          throw new Error(
            `Failed to update stock - Unexpected status code: ${response.status}`
          );
        }
      } else {
        // If item is not selected or qty is 0, do nothing
        console.log("Item is not selected for updating stock or qty is 0.");
      }
    }
  } catch (error) {
    // console.error("Error updating stock:", error.message);
    throw new Error("Failed to update stock");
  }
}

// get all orders of user
router.get(
  "/get-all-orders/:userId",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const orders = await Order.find({ "user._id": req.params.userId }).sort({
        createdAt: -1
      });

      res.status(200).json({
        success: true,
        orders
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// get all orders of seller
router.get(
  "/get-seller-all-orders/:shopId",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const orders = await Order.find({
        "cart.shopId": req.params.shopId
      }).sort({
        createdAt: -1
      });

      res.status(200).json({
        success: true,
        orders
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// update order status for seller
router.put(
  "/update-order-status/:id",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const order = await Order.findById(req.params.id);

      if (!order) {
        return next(new ErrorHandler("Order not found with this id", 400));
      }
      console.log(req.body.status);
      if (req.body.status === "Transferred to delivery partner") {
        order.cart.forEach(async (o) => {
          await updateOrder(o._id, o.qty);
        });
      }

      order.status = req.body.status;

      if (req.body.status === "Delivered") {
        order.deliveredAt = Date.now();
        order.paymentInfo.status = "Succeeded";
        // const serviceCharge = order.totalPrice * .10;
        // await updateSellerInfo(order.totalPrice - serviceCharge);
        // const serviceCharge = order.totalPrice ;
        await updateSellerInfo(order.totalPrice);
      }

      await order.save({ validateBeforeSave: false });

      res.status(200).json({
        success: true,
        order
      });

      async function updateOrder(id, qty) {
        const product = await Product.findById(id);

        product.stock -= qty;
        product.sold_out += qty;

        await product.save({ validateBeforeSave: false });
      }

      async function updateSellerInfo(amount) {
        const seller = await Shop.findById(req.seller.id);

        seller.availableBalance = amount;

        await seller.save();
      }
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// give a refund ----- user
router.put(
  "/order-refund/:id",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const order = await Order.findById(req.params.id);

      if (!order) {
        return next(new ErrorHandler("Order not found with this id", 400));
      }

      order.status = req.body.status;

      await order.save({ validateBeforeSave: false });

      res.status(200).json({
        success: true,
        order,
        message: "Order Refund Request successfully!"
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// give a refund ----- user
router.put(
  "/order-del-qty/:id",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const order = await Order.findById(req.params.id);
      // console.log("lllllllllllllll3", req.body.itemList);

      if (!order) {
        return next(new ErrorHandler("Order not found with this id", 400));
      }
      const cartItemIndex = order.cart.findIndex(
        (item) => item._id == req.body.itemList._id
      );
      console.log("cartItemIndex", cartItemIndex);
      if (cartItemIndex === -1) {
        return next(new ErrorHandler("Cart item not found in the order2", 404));
      }
      order.cart[cartItemIndex] = req.body.itemList;
      await order.save({ validateBeforeSave: false });

      res.status(200).json({
        success: true,
        order,
        message: "Order Refund Request successfully!"
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// accept the refund ---- seller
router.put(
  "/order-refund-success/:id",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const order = await Order.findById(req.params.id);

      if (!order) {
        return next(new ErrorHandler("Order not found with this id", 400));
      }

      order.status = req.body.status;

      await order.save();

      res.status(200).json({
        success: true,
        message: "Order Refund successfull!"
      });

      if (req.body.status === "Refund Success") {
        order.cart.forEach(async (o) => {
          await updateOrder(o._id, o.qty);
        });
      }

      async function updateOrder(id, qty) {
        const product = await Product.findById(id);

        product.stock += qty;
        product.sold_out -= qty;

        await product.save({ validateBeforeSave: false });
      }
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// all orders --- for admin
router.get(
  "/admin-all-orders",
  isAuthenticated,
  isAdmin("Admin"),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const orders = await Order.find().sort({
        deliveredAt: -1,
        createdAt: -1
      });
      res.status(201).json({
        success: true,
        orders
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

module.exports = router;
