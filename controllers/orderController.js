const jwt_decode = require("jwt-decode");
const { handleError, handleSuccess } = require("../utils/handleResponse");
const OrderModel = require("../models/OrderModel");
const CoinModel = require("../models/CoinModel");

const orderController = {
  purchase: async (req, res) => {
    const { status, line_items_combo, line_items_retail, shipping_address, pay_method, sub_total, coin } = req.body;
    const decoded = await jwt_decode(req.headers.authorization);
    try {
      const newOrder = await new OrderModel({
        user_id: decoded.id,
        status: status,
        date: moment(new Date()).format('YYYY-MM-DD'),
        line_items_combo: line_items_combo,
        line_items_retail: line_items_retail,
        shipping_address: shipping_address,
        pay_method: pay_method,
        sub_total: sub_total,
      }); 
      await newOrder.save();
      await OrderModel.findOneAndUpdate({user_id: decoded.id}, {$inc: {
        frexcoin: 1
      }})
      if(coin.type === 'frex'){
        await OrderModel.findOneAndUpdate({user_id: decoded.id}, {$inc: {
          frexcoin: - coin.quantity
        }})
      } else {
        await OrderModel.findOneAndUpdate({user_id: decoded.id}, {$inc: {
          frincoin: - coin.quantity
        }})
      }
      return handleSuccess(res, newOrder, {message: "Order successfully!"})
    } catch (err) {
      return handleError(res, err);
    }
  },
};

module.exports = orderController;
