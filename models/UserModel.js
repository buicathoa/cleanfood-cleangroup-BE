const mongoose = require("mongoose");

const userSchemaNormal = new mongoose.Schema(
  {
    username: {
      unique: true,
      require: true,
      type: String,
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
    province_id: {
      type: String,
    },
    district_id: {
      type: String,
    },
    ward_id: {
      type: String,
    },
    address_detail: {
      type: String,
    },
    full_address: {
      type: String,
    },
    Cart: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Cart" }
    ],
    // list_days_order:
    // [{ type: mongoose.Schema.Types.ObjectId, ref: "MenuPersonal" }]
    //  [
    //   {
    //     title: String,
    //     start: String,
    //     is_reserved: Boolean,
    //     extendedProps: {
    //       ship_address: String,
    //       ship_time: Date,
    //       list_meals: [
    //         { session: String, meal_name_vi: String, meal_name_en: String },
    //       ],
    //     },
    //   },
    // ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchemaNormal);
