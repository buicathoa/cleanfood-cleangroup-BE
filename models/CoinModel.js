const mongoose = require("mongoose");

const coin = new mongoose.Schema(
  {
    frexcoin: {
      type: Number
    },
    frincoin: {
      type: Number
    },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("coin", coin)
