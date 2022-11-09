const mongoose = require("mongoose");
const MenuPersonal = new mongoose.Schema(
  {
    daily_menu: {
      type: mongoose.Schema.Types.ObjectId, ref: "GeneralMenus"
    },
    date: {
      type: Date
    },
    juice: {
      type: String
    },
    snacks: {
      type: String
    },
    status: {
      type: String
    },
    address: {
      type: String
    },
    shipping_time: {
      type: String
    },
    calories: {
      type: Number
    },
    combo: {
      type: mongoose.Schema.Types.ObjectId, ref: "ComboPackage" 
    },
    combo_status:{
      type: String
    }
  },
  { timestamps: true }
);

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

const UserTest = new mongoose.Schema(
  {
    username: {
      type: String,
    },
    password: {
      type: Date, // Ngày đầu tiên
      required: true,
    },
    list_days_order: [{ type: mongoose.Schema.Types.ObjectId, ref: "MenuPersonal" }],
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
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
  },
  { timestamps: true }
);
const MenuPersonalSchema = mongoose.model("MenuPersonal", MenuPersonal);
const GeneralMenusSchema = mongoose.model("GeneralMenus", GeneralMenus);
const UsertestSchema = mongoose.model("UserTest", UserTest);
const MenuRegisterSchema = mongoose.model("MenuRegister", MenuRegister);



module.exports = {
  MenuPersonal: MenuPersonalSchema,
  GeneralMenus: GeneralMenusSchema,
  Usertest: UsertestSchema,
  MenuRegister: MenuRegisterSchema
};
