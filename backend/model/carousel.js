const mongoose = require('mongoose');



// Carousel Schema
const carouselSchema = new mongoose.Schema({
    items: [{
      image: { type: String, required: true },
      title: { type: String, required: true },
      description: { type: String, required: true },
      link: { type: String, required: true }
    }]
  });

  module.exports = mongoose.model("Carousel", carouselSchema);