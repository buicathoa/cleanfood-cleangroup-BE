// const authController = require('../controllers/authController')
const userController = require("../controllers/userController");
const jwt_decode = require("jwt-decode");
const { userUpdateSchema } = require("../validationSchema/user.schema");
const User = require("./../models/User");
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const { CloudinaryStorage } = require("multer-storage-cloudinary");
// const redisMiddleware = require("../middlewares/redisMiddleware");

const multer = require("multer");
const cloudinary = require("cloudinary").v2;

const validationMiddleware = require("../middlewares/validation");
const authorize = require("../middlewares/authorize");
const router = require("express").Router();
const { handleError, handleSuccess } = require("../utils/handleResponse");
// const { uploadImage } = require("../helper");


console.log("");
router.post("/delete", authorize(), userController.deleteUser);
router.post("/update", authorize(), userController.updateUser);
router.post("/get-all", authorize(["admin"]), userController.getAllUser);
router.post("/get-user-info", authorize('personal'), userController.getUser);
router.post("/change-password", userController.changePassword);
// router.post(
//   "/upload-avatar",
//   uploadImage('avatar').single("avatar"),
//   async (req, res) => {
//     userController.uploadImage(req,res)
//   }
// );

module.exports = router;
