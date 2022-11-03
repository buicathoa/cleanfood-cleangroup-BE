const mongoose = require("mongoose");
const { generalDb, historyorderDb, cleanfoodDb } = require("../connections");
const MenuPersonalCleanfood = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    start: {
      type: Date,
    },
    is_expired: {
      type: Boolean,
    },
    order_status: {
      type: String,
    },
    user_id: {
      type: String
    },
    combo_package: {
        type: String
    },
    extendedProps: [
      {
        ship_address: {
          type: String,
        },
        ship_time: {
            type: String
        },
        list_meals: [
            {session: String, meal_name_vi: String, meal_name_en: String}
        ]
      },
    ],
  },
  { timestamps: true }
);

const MenuPersonalHistoryOrder = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    start: {
      type: Date,
    },
    is_expired: {
      type: Boolean,
    },
    order_status: {
      type: String,
    },
    user_id: {
      type: String
    },
    combo_package: {
        type: String
    },
    extendedProps: [
      {
        ship_address: {
          type: String,
        },
        ship_time: {
            type: String
        },
        list_meals: [
            {session: String, meal_name_vi: String, meal_name_en: String}
        ]
      },
    ],
  },
  { timestamps: true }
);

const GeneralMenus = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    start: {
      type: Date, // Ngày đầu tiên
      required: true,
    },
    menu_expired: {
        type: Boolean,
        required: true
    },
    extendedProps: [
      {
        session: String,
        meal_name_vi: String,
        meal_name_en: String
      },
    ],
  },
  { timestamps: true }
);

const MenuPersonalCleanfoodSchema = cleanfoodDb.model("MenuPersonalCleanfood", MenuPersonalCleanfood);
const MenuPersonalHistoryOrderSchema = historyorderDb.model("MenuPersonalHistoryOrder", MenuPersonalHistoryOrder);
const GeneralMenusSchema = cleanfoodDb.model("GeneralMenus", GeneralMenus);

module.exports = {
  MenuPersonalCleanfood: MenuPersonalCleanfoodSchema,
  MenuPersonalHistoryOrder: MenuPersonalHistoryOrderSchema,
  GeneralMenusSchema: GeneralMenusSchema
};
