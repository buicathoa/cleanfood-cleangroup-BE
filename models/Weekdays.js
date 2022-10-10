const mongoose = require("mongoose");

const weekdays = new mongoose.Schema(
  {
    weekday_item: {
      required: true,
      type: Date,
      sessionOfDay: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "sessionOfDay"
        }
      ]
    },
  },
  { timestamps: true }
);

const sessionOfDay = new mongoose.Schema(
  {
    sessionOfDay: {
      required: true,
      type: String,
    },
  },
  { timestamps: true }
);

const WeekdaySchema = mongoose.model("weekdays", weekdays);
const SessionOfDaySchema = mongoose.model("sessionOfDay", sessionOfDay);

module.exports = {
  Weekdays: WeekdaySchema,
  SessionOfDay: SessionOfDaySchema,
};

// module.exports = mongoose.model("Weekdays", weekdays)
