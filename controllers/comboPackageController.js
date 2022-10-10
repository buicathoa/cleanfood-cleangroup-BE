const User = require("./../models/User");
const jwt_decode = require("jwt-decode");
const { handleError, handleSuccess } = require("../utils/handleResponse");
const { to } = require("await-to-js");
const bcrypt = require("bcrypt");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const sharp = require("sharp");
const { Weekdays } = require("./../models/Weekdays");
const ComboPackage = require("../models/ComboPackage");
const { removeVietnameseTones } = require("../helper");
const cloudinary = require("cloudinary").v2;
// const redis = require('redis')
// const REDIS_PORT = process.env.PORT || 6379
// const client = redis.createClient(REDIS_PORT)
// client.connect();

// client.on('connect', () => {
//     console.log('connected');
// });
const comboPackageController = {
  createComboPackage: async (req, res) => {
    const {
      package_title,
      package_description,
      package_sale_price,
      package_original_price,
    } = req.body;
    const image = req.file.path;
    const package_url_gen = removeVietnameseTones(package_title.split("(")[0].trim())
    console.log('package_url_gen', package_url_gen)
    try {
      const newComboPackage = await new ComboPackage({
        package_title: package_title,
        package_description: package_description,
        package_image: image,
        package_url_generated: package_url_gen,
      }); 
      const comboPackage = await newComboPackage.save();
      return handleSuccess(
        res,
        comboPackage,
        "Create combo package successfully!"
      );
    } catch (err) {
      return handleError(err);
    }
  },
  addWeekdayToComboPackage: async (req, res) => {
    const { comboPackage_id, list_weekday_id } = req.body;
    try {
      // const comboPackageFoundAndUpdate = await ComboPackage.findByIdAndUpdate(comboPackage_id, {weekdays: list_weekday_id})
      const comboPackageFoundAndUpdate = await ComboPackage.findByIdAndUpdate(
        comboPackage_id,
        { weekdays: list_weekday_id }
      );

      await comboPackageFoundAndUpdate.save();
      return handleResponse(
        res,
        comboPackageFoundAndUpdate,
        "Update successfully!"
      );
    } catch (err) {
      return handleError(err);
    }
  },
};

module.exports = comboPackageController;
