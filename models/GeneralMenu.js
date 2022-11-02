const mongoose = require("mongoose");
const MenuPersonal = new mongoose.Schema(
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

const MenuPersonalSchema = mongoose.model("MenuPersonal", MenuPersonal);
const GeneralMenusSchema = mongoose.model("GeneralMenus", GeneralMenus);

module.exports = {
  MenuPersonal: MenuPersonalSchema,
  GeneralMenus: GeneralMenusSchema,
};
