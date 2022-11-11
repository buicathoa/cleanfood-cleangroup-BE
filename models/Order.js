const mongoose = require("mongoose");

const order = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    status:{
        type: String, //success, pend: default, reject
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    line_items_combo: [
        {
            combo_id: {
                type: mongoose.Schema.Types.ObjectId, ref: "ComboPackage"
            },
            quantity: {
                type: Number,
                required: true
            },
            daily_calories: {
                type: String
            }
        }
    ],
    line_items_retail: [
        {
            product_id: {
                type: String
            },
            quantity: {
                type: Number
            }
        }
    ],
    shipping_address: {
        full_address: {
            type: String
        },
        city: {
            type: String
        },
        district: {
            type: String
        },
        ward: {
            type: String
        }
    },
    pay_method: {
        status: {
            type: String
        },
        number: {
            type: String
        }
    },
    sub_total: {
        type: Number
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("order", order)
