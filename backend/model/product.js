const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter your product name!"],
  },
  description: {
    type: String,
  },
  tags: {
    type: String,
  },
  ShopPrice:{
    type: Number,
    required:[true, "Please enter shop's Marked price!"],
  },
  originalPrice: {
    type: Number,
    required: [true, "Please enter  product price!"],

  },
  discountPrice: {
    type: Number,
    required: [true, "Please enter your product price!"],
  },
  stock: [{
    size: {
      type: String,
      enum: ['2XS', 'XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL', '6XL', '7XL', '8XL', '0 - 1 Month', '1 - 2 Months', '2 - 3 Months', '3 - 4 Months', '4 - 5 Months', '5 - 6 Months', '6 - 7 Months', '7 - 8 Months', '8 - 9 Months', '9 - 10 Months', '10 - 11 Months', '11 - 12 Months', '1 - 2 Years', '2 - 3 Years', '3 - 4 Years', '4 - 5 Years', '5 - 6 Years', '6 - 7 Years', '7 - 8 Years', '8 - 9 Years', '9 - 10 Years', '10 - 11 Years', '11 - 12 Years', '12 - 13 Years', '13 - 14 Years', '14 - 15 Years', '15 - 16 Years'],
      required: true
    },
    quantity: {
      type: Number,
      default: 0
    },
    required: {
      type: Boolean,
      default: true
    },
    isSelected:{
      type:Boolean,
      default:false
    }
  }], 
  category: {
    type: String,
    required: [true, "Please enter your product category!"],
  },
  subCategory: {
    type: String,
    required: [true, "Please enter your product category!"],
  },
  neckType: {
    type: String,
  },
  sleeveType: {
    type: String,
  },
  
  brand: {
    type: String,
  },
  color: {
    type: String,
    required: [true, "Please select color!"],
  },
  fabric: {
    type: String,
  },
  occasion: {
    type: String,
  },
  
  fit: {
    type: String,
  },
  currentCity:{
    type: String,
    default:"Phagwara"
  },
  currentZipCode:{
    type: Number,
    default:144411
  },
  listing: {
    type: String,
    default:"Product"
  },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
  gender: { 
    type: String,
    required: [true, "Please Select gender"],
  },
  
 
  images: [
    {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
  ],
  reviews: [
    {
      user: {
        type: Object,
      },
      rating: {
        type: Number,
        min: 1, 
        // default: 1,
      },
      
      comment: {
        type: String,
      },
      productId: {
        type: String,
      },
      kuchviId: {
        type: String,
      },
      createdAt:{
        type: Date,
        default: Date.now(),
      }
    },
  ],
  ratings: {
    type: Number,
    default: 5,

  },
  adminCreated:{
    type: String,
    required: true,
  },
  shopId: {
    type: String,
    required: true,
  },
  shop: {
    type: Object,
    required: true,
  },
  sold_out: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("Product", productSchema);
