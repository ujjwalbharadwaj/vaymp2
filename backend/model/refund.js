const mongoose = require("mongoose");

const refundSchema = new mongoose.Schema({
   
  orderId: {
    type: String,
    default:""

  },
  productId: {
    type: String,
    default:""

  },
  size: {
    type: String,
    default:""

  },
  qty:{
    type: Number,
    default:0

  },
  userId: {
    type: String,
    default:""

  },
  status: {
    type: String,
    default:""

  },
  shopId: {
    type: String,
    default:""

  },
  shopPrice: {
    type: Number,
    default:0

  },
  markedPrice: {
    type: Number,
    default:0

  },
  paymentInfo:{
    id:{
        type: String,
    },
    status: {
        type: String,
        default:"Not Paid"
    },
    type:{
        type: String,
        default:"Cash On Delivery"
    },
  },
  user: {
    type: Object,
    default:{}
},
  productName:{
    type:String,
    default:"",
  },
  product:{
    type: Object,
    default:{}
  },
  discountPrice: {
    type: Number,
    default:0
  },
  shippingAddress:{
    type: Object,
    default:{}
},
refundStatus:{
    type: String,
    default:""

},
delivered:{
  type: Boolean,
  default:true
},
cancel:{
  type: Boolean,
  default:true
},
img:{
  type: String,
  default:""
},
deliveredAt:{
  type: Date,
},
returnedAt:{
type: Date,
},
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("Refund", refundSchema);
