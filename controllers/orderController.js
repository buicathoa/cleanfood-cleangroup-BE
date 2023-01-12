const jwt_decode = require("jwt-decode");
const { handleError, handleSuccess } = require("../utils/handleResponse");
const OrderModel = require("../models/OrderModel");
const { Cart } = require("./../models/CartModel");
const UserModel = require("../models/UserModel");
var ObjectId = require("mongodb").ObjectId;
const orderController = {
  purchase: async (req, res) => {
    const { line_items, delivery_start_date, delivery_address, pay_method } =
      req.body;
    const decoded = await jwt_decode(req.headers.authorization);
    try {
      for (let item of line_items) {
        await OrderModel.insertMany({
          user_id: decoded.id,
          status: "pending",
          quantity: item.quantity,
          total_price: item.total_price,
          calories: item.calories,
          mealplans: item.mealplans,
          session: item.session,
          product_image: item.product_image,
          product_title: item.product_title,
          delivery_start_date: delivery_start_date,
          pay_method: pay_method,
        });
      }
      const listCartSelected = line_items.map((item) => ObjectId(item.cart_id));
      await Cart.deleteMany({ _id: { $in: listCartSelected } });
      await UserModel.updateOne(
        {
          _id: decoded.id,
        },
        {
          $set: {
            Cart: [],
          },
        }
      );
      // await OrderModel.findOneAndUpdate({user_id: decoded.id}, {$inc: {
      //   frexcoin: 1
      // }})
      // if(coin.type === 'frex'){
      //   await OrderModel.findOneAndUpdate({user_id: decoded.id}, {$inc: {
      //     frexcoin: - coin.quantity
      //   }})
      // } else {
      //   await OrderModel.findOneAndUpdate({user_id: decoded.id}, {$inc: {
      //     frincoin: - coin.quantity
      //   }})
      // }
      return handleSuccess(res, { message: "Order successfully!" });
    } catch (err) {
      return handleError(res, err);
    }
  },
};

module.exports = orderController;
