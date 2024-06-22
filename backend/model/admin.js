const mongoose = require('mongoose');
const userSchema = require('./user'); 
const productSchema = require('./product'); 
const shopSchema = require('./shop'); 
const conversationSchema = require('./conversation'); 
const withdrawSchema = require('./withdraw'); 
const orderSchema = require('./order'); 
const messagesSchema = require('./message');
const eventSchema = require('./event'); 
const couponCodeSchema = require('./couponCode'); 
const carouselSchema = require('./carousel'); 
const notificationSchema = require('./notification');


// Include all properties from userSchema
const adminSchema = new mongoose.Schema({
  User: {
    type: userSchema,
    required: true,
  },
  Product: [{
    type: productSchema,
    required: true,
  }],
  Shop: [{
    type: shopSchema,
    required: true,
  }],
  Conversation: [{
    type: conversationSchema,
    required: true,
  }],
  Withdraw: [{
    type: withdrawSchema,
    required: true,
  }],
  Order: [{
    type: orderSchema,
    required: true,
  }],
  Messages: [{
    type: messagesSchema,
    required: true,
  }],
  Event: [{
    type: eventSchema,
    required: true,
  }],
  CouponCode: [{
    type: couponCodeSchema,
    required: true,
  }],
  Carousel: [{
    type: carouselSchema,
    required: true,
  }],
  Notification: [{
    type: notificationSchema,
    required: true,
  }],
  isAdmin: {
    type: Boolean,
    default: true,
  },
});

// Export the models 
module.exports = mongoose.model("Admin", adminSchema);
