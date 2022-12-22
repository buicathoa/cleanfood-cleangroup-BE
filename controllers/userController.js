const jwt_decode = require("jwt-decode");
const { to } = require("await-to-js");
const bcrypt = require("bcrypt");

const User = require("./../models/UserModel");
const { handleError, handleSuccess } = require("../utils/handleResponse");

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
    const decoded = await jwt_decode(req.headers.authorization);
    const image = req.file.path; 
    const [err, result] = await to(
      User.updateOne(
        {
          _id: decoded.id
        },
        { $set: !image ? req.body : {avatar: image} }
      )
    );
    console.log('result', result)
    if (err) {
      return handleError(res, err);
    }
    return handleSuccess(res, "update successfully!");
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
        const decoded = await jwt_decode(req.headers.authorization);
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
      const decoded = await jwt_decode(req.headers.authorization);
      const user = await User.findByIdAndUpdate(decoded.id, {
        avatar: req.file.path,
      });
      user.save();
      return handleSuccess(res, req.file.path, 'Upload avatar successfully!');
    }catch(err){
      return handleError(err)
    }
  },
};

module.exports = userController;
