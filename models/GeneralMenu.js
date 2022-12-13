const mongoose = require("mongoose");

const GeneralMenus = new mongoose.Schema(
  {
    breakfast_vi: {
      type: String
    },
    breakfast_en: {
      type: String
    },
    lunch_vi: {
      type: String
    },
    lunch_en: {
      type: String
    },
    dinner_vi: {
      type: String,
    },
    dinner_en: {
      type: String
    },
    date: {
      type: Date
    }
  },
  { timestamps: true }
);


const MenuRegister = new mongoose.Schema(
  {
    date: {
      type: Date
    },
    ship_time: {
      type: String
    },
    ship_place: {
      type: String
    },
    order_status: {
      type: String
    },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    combo_package: {
      type: mongoose.Schema.Types.ObjectId, ref: "comboPackage"
    },
    calories: {
      type: Number,
      required: true
    }
  },
  { timestamps: true }
);
const GeneralMenusSchema = mongoose.model("GeneralMenus", GeneralMenus);
const MenuRegisterSchema = mongoose.model("MenuRegister", MenuRegister);



module.exports = {
  GeneralMenus: GeneralMenusSchema,
  MenuRegister: MenuRegisterSchema
};
