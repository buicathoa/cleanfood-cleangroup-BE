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
const {
  Cart,
  Purchase
} = require("./../models/Cart");
// client.on('connect', () => {
//     console.log('connected');
// });
const cartController = {
  addToCart: async (req, res) => {
    const { combo_package, quantity, price, meal_plan, daily_calories } =
      req.body;
      const combo_package_found = await ComboPackage.findById(combo_package)
      try {
        if(combo_package_found._doc) {
          const decoded = await jwt_decode(req.headers.authorization);
          const positionComboPackageInCart = await Cart.find({combo_package: combo_package_found._id, meal_plan: meal_plan, daily_calories: daily_calories, price: price})
          if(positionComboPackageInCart.length > 0){
            await Cart.updateOne({combo_package: combo_package_found._id}, {$set: {quantity: positionComboPackageInCart[0].quantity + quantity}})
            const listCart = await Cart.find({})
            await User.findByIdAndUpdate(decoded.id, {
              Cart: {
                list: listCart,
                total_price:listCart.length > 1 ? listCart.map(item => parseInt(item.price) * item.quantity).reduce((prev, next) => prev + next) : parseInt(listCart[0].price) * listCart[0].quantity
              }
            })
            return handleSuccess(res, {message: "Add product to cart successfully!"})
          } else {
            const newItemInCart = await new Cart({
              combo_package: combo_package,
              quantity: quantity,
              total_price: price,
              meal_plan: meal_plan,
              daily_calories: daily_calories,
              user_id: decoded.id
            }).save()
            const listCart = await Cart.find({user_id: decoded.id})
            await User.findByIdAndUpdate(decoded.id, {
              Cart: {
                list: listCart,
                total_price:listCart.length > 1 ? listCart.map(item => parseInt(item.price) * item.quantity).reduce((prev, next) => prev + next)
                 : parseInt(listCart[0].price) * listCart[0].quantity
              }
            })
            return handleSuccess(res, newItemInCart, {message: "Add product to cart successfully!"})
          }
        } else {
            return res.status(404).json({message: "Can't find meal combo"})
        }
    } catch (err) {
      return handleError(res, err);
    }
  },
  getAllCartListByUser: async (req, res) => {
    const decoded = await jwt_decode(req.headers.authorization);
    try{
      const userFound = await User.findById(decoded.id).populate('Cart.list').populate({
        path: 'Cart.list',
        populate: {path: 'combo_package'}
      });
      // const userFoundPopulateCart = userFound.Cart.list.populate('list')
      return handleSuccess(res, userFound.Cart, {message: "Get list cart successfully."});
    }catch(err){
      return handleError(res,err)
    }
  }
};

module.exports = cartController;
