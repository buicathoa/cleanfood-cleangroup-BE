const User = require("./../models/User");
const jwt_decode = require("jwt-decode");
const { handleError, handleSuccess } = require("../utils/handleResponse");
const { to } = require("await-to-js");
const bcrypt = require("bcrypt");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const sharp = require("sharp");
const {
    Weekdays
  } = require("./../models/Weekdays");
const cloudinary = require("cloudinary").v2;
// const redis = require('redis')
// const REDIS_PORT = process.env.PORT || 6379
// const client = redis.createClient(REDIS_PORT)
// client.connect();

// client.on('connect', () => {
//     console.log('connected');
// });
const weekdayController = {
  createWeekdays: async (req, res) => {
    const {weekday_item} = req.body;
    // try{
        const newWeekdays = await new Weekdays({
            weekday_item: weekday_item
        })
        console.log('sai cho nao', newWeekdays)
        newWeekdays.weekday_item instanceof Date;
        const weekday = await newWeekdays.save()
        res.status(200).json(weekday);
    // }
    // catch(err){
    //     console.log('sai r')
    // }
  }
};

module.exports = weekdayController;
