const mongoose = require("mongoose");

const GeneralMenus = new mongoose.Schema(
  {
    breakfast_vi: {
      type: String,
    },
    breakfast_en: {
      type: String,
    },
    lunch_vi: {
      type: String,
    },
    lunch_en: {
      type: String,
    },
    dinner_vi: {
      type: String,
    },
    dinner_en: {
      type: String,
    },
    date: {
      type: Date,
    },
  },
  { timestamps: true }
);

const MenuRegister = new mongoose.Schema(
  {
    start: {
      type: Date,
    },
    end: {
      type: Date,
    },
    order_status: {
      type: String,
    },
    ship_place: {
      type: String,
      required: true,
    },
    province_id: {
      type: String,
      required: true,
    },
    district_id: {
      type: String,
      required: true,
    },
    ward_id: {
      type: String,
      required: true,
    },
    address_detail: {
      type: String,
    },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    full_name: {
      type: String,
      required: true,
    },
    phone_number: { type: String, required: true },
    product: {
      type: String,
    },
    calories: {
      type: String,
      required: true,
    },
    session: {
      type: String,
      required: true,
    },
    mealplans: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const OrderCancel = new mongoose.Schema(
  {
    product: {
      type: String,
      required: true
    },
    calories: {
      type: String,
      required: true
    },
    session: {
        type: String,
        required: true
    },
    mealplans: {
      type: String,
      required: true
    },
    reason: {
        type: String,
        required: true
    },
    order_day_id: {
      type: String,
      required: true
    },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
  },
  { timestamps: true }
);
const GeneralMenusSchema = mongoose.model("GeneralMenus", GeneralMenus);
const MenuRegisterSchema = mongoose.model("MenuRegister", MenuRegister);
const OrderCancelSchema = mongoose.model("OrderCancel", OrderCancel);

module.exports = {
  GeneralMenusModel: GeneralMenusSchema,
  MenuRegisterModel: MenuRegisterSchema,
  OrderCancelModel: OrderCancelSchema
};
