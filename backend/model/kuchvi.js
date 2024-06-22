const mongoose = require("mongoose");

const kuchviSchema = new mongoose.Schema({
    // refund:{
    //     type: Array,
    //     default:[]
    // },
//     productdata:{
//       type: Object,
//       default:{}
//   },
img:{
    type: String,
    default:""
},
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
    default:1

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
  shopPrice: {
    type: Number,
    default:0

  },
  markedPrice: {
    type: Number,
    default:0

  },
  
  discountPrice: {
    type: Number,
    default:0
  },
  shippingAddress:{
    type: Object,
    default:{}
},
delivered:{
    type: Boolean,
    default:false
},
cancel:{
    type: Boolean,
    default:false
},
return1:{
    type: Boolean,
    default:false
},
paymentInfo:[{
  status: {
      type: String,
      default:"Not Paid"
  },
  type:{
      type: String,
      default:"Cash On Delivery"
  },
}],

refund:{
    type: Boolean,
    default:false
},
transferredToDeliveryPartner:{
  type: Boolean,
  default:false
},
outForPick:{
  type: Boolean,
  default:false
},
picked:{
  type: Boolean,
  default:false
},
returnedToShop:{
  type: Boolean,
  default:false
},
shopReciveredReturn:{
  type: Boolean,
  default:false
},
transferedToManager:{
  type: Boolean,
  default:false
},
refundStatus:{
    type: Boolean,
    default:false
},
deliveredAt:{
    type: Date,
},
pickededAt:{
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

module.exports = mongoose.model("Kuchvi", kuchviSchema);
