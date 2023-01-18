const jwt_decode = require("jwt-decode");
const { handleError, handleSuccess } = require("../utils/handleResponse");
const OrderModel = require("../models/OrderModel");
const { Cart } = require("./../models/CartModel");
const UserModel = require("../models/UserModel");
const { MenuRegisterModel } = require("../models/GeneralMenu");
const nodemailer = require("nodemailer");
const moment = require("moment");
var ObjectId = require("mongodb").ObjectId;
const orderController = {
  purchase: async (req, res) => {
    const { line_items, delivery_date, pay_method } = req.body;
    const decoded = await jwt_decode(req.headers.authorization);
    const time = moment().format('YYYYMMDD')
    const orderCode = `DH-${time}-`
    try {
      let orders = [];
      for (let item of line_items) {
        orders.push(
          await OrderModel.insertMany({
            user_id: decoded.id,
            status: "wait_confirmed",
            quantity: item.quantity,
            total_price: item.total_price,
            calories: item.calories,
            product_image: item.product_image,
            product_title: item.product_title,
            delivery_date: delivery_date,
            pay_method: pay_method,
          })
        );
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
      return handleSuccess(res, orders, { message: "Order successfully!" });
    } catch (err) {
      return handleError(res, err);
    }
  },
  getHistoryOrder: async (req, res) => {
    const decoded = await jwt_decode(req.headers.authorization);
    const { limit, page, category } = req.body;
    try {
      const listHistoryOrder = await OrderModel.find({
        user_id: decoded.id,
        status: category,
      })
        .limit(limit)
        .skip(5 * (page - 1))
        .sort({ delivery_date: -1 });
      return handleSuccess(res, listHistoryOrder, {
        message: "Get list history-orders successfully!",
      });
    } catch (err) {
      return handleError(res, err);
    }
  },
  updateStatusOrderAndRegister: async (req, res) => {
    const decoded = await jwt_decode(req.headers.authorization);
    const { order_id, order_status } = req.body;
    try {
      if(!order_status || !order_id){
        return res.status(400).json({message: "Invalid parameters"})
      }
      await OrderModel.updateOne(
        { user_id: decoded.id, _id: ObjectId(order_id) },
        {
          $set: {
            status: order_status,
          },
        }
      );

      await MenuRegisterModel.updateMany(
        { user_id: decoded.id, order_id: ObjectId(order_id) },
        {
          $set: {
            order_status: "pending",
          },
        }
      );

      var transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "ansachdaily@gmail.com",
          pass: "napuyagoncmsrwjt",
        },
        tls: { rejectUnauthorized: false },
      });

      var mailOptions = {
        from: "ansachdaily@gmail.com",
        to: "buicathoa@gmail.com",
        subject: `Verify account email from  Joshtes`,
        html: `<h1 style="color: red; font-weight: bold">Xin chào ${req.body.username}, vui lòng click vào link dưới để xác thực tài khoản</h1>`,
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log("error Mail", error);
        } else {
          console.log("Email sent: " + info.response);
        }
      });

      return handleSuccess(res, { message: "Update successfully!" });
    } catch (err) {
      return handleError(res, err);
    }
  },
};

module.exports = orderController;
