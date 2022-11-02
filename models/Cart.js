const mongoose = require("mongoose");

const Cart = new mongoose.Schema(
  {
    combo_package: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "comboPackage",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    price: {
      type: String,
      required: true,
    },
    meal_plan: {
      type: String,
      required: true,
    },
    daily_calories: {
      type: String,
      required: true,
    },
    user_id: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Purchase = new mongoose.Schema(
  {
    total_price: {
      type: String,
      required: true,
    },
    quantity_clean_coin: {
      type: Number
    },
    cart_list: {
      total_price: String,
      list_cart: [
        {
          package_title: String,
          list: [
            {
              quantity: Number,
              price: String,
              createDate: Date,
              kcal: String,
              meal_plan: String,
            },
          ],
        },
      ],
    },
  },
  { timestamps: true }
);

const CartSchema = mongoose.model("Cart", Cart);
const PurchaseSchema = mongoose.model("Purchase", Purchase);

module.exports = {
  Cart: CartSchema,
  Purchase: PurchaseSchema,
};
