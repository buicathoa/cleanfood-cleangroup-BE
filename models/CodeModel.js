const mongoose = require("mongoose");

const code = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true
    },
    code: {
      type: Number,
      required: true
    },
    date: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("code", code)
