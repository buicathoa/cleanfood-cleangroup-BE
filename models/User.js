const mongoose = require('mongoose');

const userSchemaNormal = new mongoose.Schema({
    username: {
        unique: true,
        require: true,
        type: String
    },
    email: {
        type: String,
        required: true
    },
    firstname: {
       type: String,
       required: true 
    },
    lastname: {
        type: String,
        required: true 
    },
    password: {
        type: String,
        required: true,
    },
    is_active: {
        type: Boolean,
        default: false
    },
    is_admin: {
        type: Boolean,
        default: false
    },
    phone_number: {
        type: String,
        require: true
    },
    province_id: {
        type: String
    },
    district_id: {
        type: String
    },
    ward_id: {
        type: String
    },
    address_detail: {
        type: String
    },
    full_address:{
        type: String
    }
}, {timestamps: true})

module.exports = mongoose.model("User", userSchemaNormal)