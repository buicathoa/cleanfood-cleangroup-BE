const mongoose = require("mongoose");

const Product = new mongoose.Schema(
  {
    title:{
        type: String,
        required: true
    },
    sub_title:{
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String, 
        required: true
    },
    price_per_meal: {
        type: Number
    },
    url_generated: {
        type: String
    },
    product_type: {
        type: String,
        required: true
    }

  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", Product)
