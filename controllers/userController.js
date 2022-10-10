const User = require("./../models/User");
const jwt_decode = require("jwt-decode");
const { handleError, handleSuccess } = require("../utils/handleResponse");
const { to } = require("await-to-js");
const bcrypt = require("bcrypt");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const sharp = require("sharp");
const cloudinary = require("cloudinary").v2;
// const redis = require('redis')
// const REDIS_PORT = process.env.PORT || 6379
// const client = redis.createClient(REDIS_PORT)
// client.connect();

// client.on('connect', () => {
//     console.log('connected');
// });
const userController = {
  deleteUser: async (req, res) => {
    const user = await User.findOne({ _id: req.body.id });
    if (user) {
      const [err, result] = await to(
        User.findByIdAndRemove({ _id: req.body.id })
      );
      if (err) {
        console.log("user ne", err);
        return handleError(res, err);
      }
      return handleSuccess(res, "delete successfully!");
    } else {
      return handleError(res, { code: 400, message: "this user not exists!" });
    }
  },
  updateUser: async (req, res) => {
    const user = await User.findById(req.body.id);
    const [err, result] = await to(
      user.updateOne(
        {
          firstname: req.body.firstname,
          address: req.body.address,
          lastname: req.body.lastname,
        },
        { $set: { username: req.body.username } }
      )
    );
    if (err) {
      return handleError(res, err);
    }
    const userResponse = {
      ...user._doc,
      firstname: req.body.firstname,
      address: req.body.address,
      lastname: req.body.lastname,
    };
    return handleSuccess(res, userResponse, "update successfully!");
  },
  getAllUser: async (req, res) => {
    const province = await User.find({})
    await User.find({})
      .then((data) => {
        return handleSuccess(res, data, "Get list user successfully!");
      })
      .catch((err) => {
        return handleError(res, {
          code: 400,
          message: "Can't get list all users!",
        });
      });
  },
  getUser: async (req, res) => {
    try{      
      const decoded = await jwt_decode(req.headers.authorization);
      if(decoded){
        const user = await User.findById(decoded.id);
        delete user._doc.password
        return handleSuccess(res, user, "Get user successfully!");
      }
    }
    catch(err){
      return handleError(res, err);
    }
  },
  changePassword: async (req, res) => {
    try {
      if (req.body.newPassword === req.body.confirmPassword) {
        const decoded = await jwt_decode(req.headers.token);
        const user = await User.findOne({ username: decoded.username });
        if (!bcrypt.compareSync(req.body.oldPassword, user.password)) {
          return handleError(res, { code: 400, message: "Wrong password!" });
        } else {
          const salt = await bcrypt.genSalt(10);
          const hashed = await bcrypt.hash(req.body.newPassword, salt);
          const userFounded = await User.findByIdAndUpdate(user.id, {
            password: hashed,
          });
          await userFounded.save();
          return res.status(200).json("Update password success!");
        }
      } else {
        return handleError(res, {
          code: 400,
          message: "Password confirm was wrong!",
        });
      }
    } catch (err) {
      return res.status(500).json(err);
    }
  },

  uploadImageUser: async (req, res) => {
    try{
      const decoded = await jwt_decode(req.headers.token);
      const user = await User.findByIdAndUpdate(decoded.id, {
        avatar: req.file.path,
      });
      user.save();
      if (userInfo.avatar) {
        cloudinary.uploader.destroy(`avatar/${userInfo.avatar.split('avatar/')[1].split('.')[0]}`, function (error, result) {
          if(error){
            console.log('errorne', error)
          }else {
            console.log('resultne', result)
          }
        });
      }
      return handleSuccess(res);
    }catch(err){
      return handleError(err)
    }
  },
};

module.exports = userController;
