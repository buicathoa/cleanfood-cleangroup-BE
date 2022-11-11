const mongoose = require("mongoose");

const comboPackage = new mongoose.Schema(
  {
    package_title:{
        type: String,
        required: true
    },
    package_sub_title:{
        type: String,
        required: true
    },
    package_description: {
        type: String,
        required: true
    },
    package_image: {
        type: String, 
        required: true
    },
    price_per_meal: {
        type: Number
    },
    package_url_generated: {
        type: String
    }
  },
  { timestamps: true }
);

// const sessionOfDay = new mongoose.Schema(
//   {
//     sessionOfDay: {
//       required: true,
//       type: String,
//     },
//   },
//   { timestamps: true }
// );

// const WeekdaySchema = mongoose.model("weekdays", weekdays);
// const SessionOfDaySchema = mongoose.model("sessionOfDay", sessionOfDay);

// module.exports = {
//   Weekdays: WeekdaySchema,
//   SessionOfDay: SessionOfDaySchema,
// };

module.exports = mongoose.model("comboPackage", comboPackage)
