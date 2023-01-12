const mongoose = require("mongoose");

const userSchemaNormal = new mongoose.Schema(
  {
    username: {
      unique: true,
      require: true,
      type: String,
    },
    avatar: {
      require: true,
      type: String
    },
    email: {
      type: String,
      required: true,
    },
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    user_count: {
      type: Number,
      required: true
    },
    password: {
      type: String,
      required: true,
    },
    is_active: {
      type: Boolean,
      default: false,
    },
    is_admin: {
      type: Boolean,
      default: false,
    },
    phone_number: {
      type: String,
      require: true,
    },
    gender: {
      type: String
    },
    Cart: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Cart" }
    ],
    order_day_cancel: {
      type: Number
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchemaNormal);
