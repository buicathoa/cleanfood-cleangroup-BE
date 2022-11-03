const mongoose = require("mongoose");
const { conn, cleanfoodDb } = require("../connections");

const userSchemaCleanfood = new mongoose.Schema(
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
    Cart: {
      total_price: {
        type: String,
      },
      list: [{ type: mongoose.Schema.Types.ObjectId, ref: "Cart" }],
    },
    list_days_order:
    [{ type: mongoose.Schema.Types.ObjectId, ref: "MenuPersonal" }]
  },
  { timestamps: true }
);

const userSchemaHistoryOrder = new mongoose.Schema(
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
    Cart: {
      total_price: {
        type: String,
      },
      list: [{ type: mongoose.Schema.Types.ObjectId, ref: "Cart" }],
    },
    list_days_order:
    [{ type: mongoose.Schema.Types.ObjectId, ref: "MenuPersonal" }]
  },
  { timestamps: true }
);

const userSchemaCleanfoodSchema = cleanfoodDb.model("userSchemaCleanfood", userSchemaCleanfood);
const userSchemaHistoryOrderSchema = historyorderDb.model("userSchemaHistoryOrder", userSchemaHistoryOrder)

module.exports = {
  userSchemaCleanfood: userSchemaCleanfoodSchema,
  userSchemaHistoryOrder: userSchemaHistoryOrderSchema,
};
