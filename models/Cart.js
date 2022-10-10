const mongoose = require('mongoose');

const CartSchema = new mongoose.Schema({
    mealPlan: {
        require: true,
        type: Number
    },
    calories_quantity: {
        type: Number,
        required: true
    }
}, {timestamps: true})

module.exports = mongoose.model("Cart", CartSchema)