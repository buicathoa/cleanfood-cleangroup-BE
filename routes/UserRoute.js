// const authController = require('../controllers/authController')
const userController = require("../controllers/userController");
const jwt_decode = require("jwt-decode");
const { userUpdateSchema } = require("../validationSchema/user.schema");
const User = require("./../models/UserModel");
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const authorize = require("../middlewares/authorize");
const { uploadImage } = require("../helper");
const router = require("express").Router();

router.post("/delete", authorize(), userController.deleteUser);
router.post("/update", authorize(), userController.updateUser);
router.post("/get-all", authorize(["admin"]), userController.getAllUser);
router.post("/get-user-info", authorize('personal'), userController.getUser);
router.post("/upload-avatar", authorize('personal'),uploadImage('avatar').single('image'), userController.uploadImageUser);

router.post("/change-password", userController.changePassword);


module.exports = router;
