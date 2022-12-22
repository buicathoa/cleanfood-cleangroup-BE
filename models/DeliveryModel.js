const mongoose = require("mongoose");

const delivery = new mongoose.Schema(
  {
    province_id: {
      type: String,
      required: true
    },
    district_id: {
      type: String,
      required: true
    },
    ward_id: {
        type: String,
        required: true
    },
    address_detail: {
        type: String,
        required: true
    },
    full_address: {
        type: String
    },
    default_address: {
      type: Boolean
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId, ref: "User"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("delivery", delivery)
