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
    const packageUrlgen = removeVietnameseTones(package_title.split("(")[0].trim()).toLowerCase()
    .split(" ")
    .join("-")
    try {
      const newComboPackage = await new ComboPackage({
        package_title: package_title,
        package_description: package_description,
        package_image: image,
        package_url_generated: packageUrlgen,
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
  getAllComboPackage: async (req, res) => {;
    try {
      // const comboPackageFoundAndUpdate = await ComboPackage.findByIdAndUpdate(comboPackage_id, {weekdays: list_weekday_id})
      const allComboPackage = await ComboPackage.find({});
      return handleSuccess(
        res,
        allComboPackage,
        "Get all combo package successfully!"
      );
    } catch (err) {
      return handleError(err);
    }
  },
  getComboPackageByRoute: async (req, res) => {
    const {route} = req.body
    try {
      // const comboPackageFoundAndUpdate = await ComboPackage.findByIdAndUpdate(comboPackage_id, {weekdays: list_weekday_id})
      const ComboPackageFound = await ComboPackage.find({package_url_generated: route});
      console.log('ComboPackageFound', ComboPackageFound)
      if(ComboPackageFound.length === 0) {
        return res.status(404).json("Can't find combo package")
      } else {
        return handleSuccess(
          res,
          ComboPackageFound,
          "Get combo package successfully"
        );
      }
    } catch (err) {
      return handleError(err);
    }
  },
};

module.exports = comboPackageController;
