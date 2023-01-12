const mongoose = require("mongoose");

const order = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    status:{
        type: String, //success, pend: default, reject
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    total_price: {
        type: Number,
        required: true
    },
    calories: {
        type: String,
        required: true
    },
    mealplans: {
        type: String,
        required: true
    },
    session: {
        type: String,
        required: true
    },
    product_image: {
        type: String,
        required: true
    },
    product_title: {
        type: String,
        required: true
    },
    delivery_start_date: {
        type: Date,
        required: true
    },
    pay_method: {
        type: String,
        required: true
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", order)
