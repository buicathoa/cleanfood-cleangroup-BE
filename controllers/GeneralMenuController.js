const User = require("../models/User");
const jwt_decode = require("jwt-decode");
const { handleError, handleSuccess } = require("../utils/handleResponse");
const { to } = require("await-to-js");
const bcrypt = require("bcrypt");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const sharp = require("sharp");
const { Weekdays } = require("../models/Weekdays");
const ComboPackage = require("../models/ComboPackage");
const { removeVietnameseTones } = require("../helper");
var mongoose = require('mongoose');
const {
  GeneralDays,
  GeneralMenus,
  MenuPersonal,
} = require("../models/GeneralMenu");
const cloudinary = require("cloudinary").v2;
const moment = require("moment");

// const redis = require('redis')
// const REDIS_PORT = process.env.PORT || 6379
// const client = redis.createClient(REDIS_PORT)
// client.connect();

// client.on('connect', () => {
//     console.log('connected');
// });
const GeneralMenuController = {
  createGeneralDays: async (req, res) => {
    const { list_general_days } = req.body;
    try {
      list_general_days.map(async (item) => {
        const daysItem = await new GeneralDays({
          title: item.title,
          start: item.start,
          status: item.status,
        });
        daysItem.start instanceof Date;
        await daysItem.save();
      });
      return handleSuccess(res, {}, "Create list days general successfully!");
    } catch (err) {
      return handleError(res, err);
    }
  },
  createGeneralMenus: async (req, res) => {
    const { title, start, extendedProps, menu_expired } = req.body;
    try {
      const generalMenuItem = await GeneralMenus.insertMany({
        title: title,
        start: start,
        menu_expired: menu_expired,
        extendedProps: extendedProps,
      });
      return handleSuccess(res, generalMenuItem, {
        message: "Create menu general successfully!",
      });
    } catch (err) {
      return handleError(res, err);
    }
  },
  getAllMenus: async (req, res) => {
    try {
      const rangeOfDaysAndMenu = await GeneralMenus.find({}).sort({ start: 1 });
      return handleSuccess(res, rangeOfDaysAndMenu, {
        message: "Get menu successfully!",
      });
    } catch (err) {
      return handleError(res, err);
    }
  },
  createMenuPersonal: async (req, res) => {
    const { start_date, end_date } = req.body;
    const decoded = await jwt_decode(req.headers.authorization);
    try {
      const day1 = moment(start_date);
      const day2 = moment(end_date);
      const result = [
        {
          title: "",
          start: moment(day1).format("YYYY-MM-DD"),
          is_expired: false,
          user_id: decoded.id,
          combo_package: "full",
          order_status: "ready",
          extendedProps: {
            ship_address: "107/16 Hà Đặc, phường Trung Mỹ Tây, quận 12",
            ship_time: "08:10 - 10:10",
            list_meals: null,
          },
        },
      ];

      while (day1.date() != day2.date()) {
        day1.add(1, "day");
        if (day1.format("dddd") !== "Sunday") {
          result.push({
            title: "",
            start: moment(day1).format("YYYY-MM-DD"),
            is_reserved: false,
            order_status: "ready",
            user_id: decoded.id,
            extendedProps: {
              ship_address: "107/16 Hà Đặc, phường Trung Mỹ Tây, quận 12",
              ship_time: "08:10 - 10:10",
              list_meals: null,
            },
          });
        }
      }
      result.map(async (item) => {
        const generalMenuFound = await GeneralMenus.findOne({
          start: new Date(item.start),
        });
        if (generalMenuFound) {
          const menuPersonal = await new MenuPersonal({
            ...item,
            user_id: decoded.id,
            order_status: "ready",
            extendedProps: {
              ...item.extendedProps,
              list_meals: generalMenuFound.extendedProps,
            },
          });
          menuPersonal.start instanceof Date;
          await menuPersonal.save();
          await User.updateOne(
            { _id: decoded.id },
            { $push: { list_days_order: menuPersonal._id } }
          );
        } else {
          const menuPersonal = await new MenuPersonal(item);
          await menuPersonal.save();
          await User.updateOne(
            { _id: decoded.id },
            { $push: { list_days_order: menuPersonal._id } }
          );
        }
      });
      return handleSuccess(
        res,
        {},
        { message: "Create menu personal successfully!" }
      );
    } catch (err) {
      return handleError(res, err);
    }
  },
  getAllMenuPersonal: async (req, res) => {
    const { start_date, end_date } = req.body;
    const decoded = await jwt_decode(req.headers.authorization);
    try {
      const pipeline = [
        {
          $match: {
            username: decoded.username,
          },
        },
        {
          $lookup: {
            from: "menupersonals",
            localField: "list_days_order",
            foreignField: "_id",
            as: "list_days_order",
          },
        },
        {
          $project: {
            list_days_order: {
              $filter: {
                input: "$list_days_order",
                as: "day",
                cond: {
                  $and: [
                    { $gte: ["$$day.start", new Date(start_date)] },
                    { $lte: ["$$day.start", new Date(end_date)] },
                  ],
                },
              },
            },
          },
        },
      ];
      const result = await User.aggregate(pipeline);
      return handleSuccess(res, result, {
        message: "Get schedule menu personal successfully!",
      });
    } catch (err) {
      return handleError(res, err);
    }
  },
  updateMenuPersonal: async (req, res) => {
    const { status, id } = req.body;
    const decoded = await jwt_decode(req.headers.authorization);
    try {
      const pipeline = [
        {
          $lookup: {
            from: "menupersonals",
            localField: "list_days_order",
            foreignField: "_id",
            as: "list_days_order",
          },
        },
        {
          $match: {
            username: decoded.username,
            // "list_days_order._id": mongoose.Types.ObjectId(id)
          },
        },
        {
          $unwind: {
            path: '$list_days_order' 
          }
        },
        {
          $match: {
              "list_days_order._id": {$eq: mongoose.Types.ObjectId(id)}
          }
        },
        {
          $set: {
            "list_days_order.order_status": status
          }
        },
        // {
        //   $merge: {
        //     into: "menupersonals",
        //     on: "_id",
        //     whenMatched: [
        //       {$set: {"order_status": status}}
        //     ],
        //     whenNotMatched: "insert"
        //   }
        // }
        // {
        //   $project: {
        //     list_days_order: 1
        //     // list_days_order: "$list_days_order"
        //   }
        // }
      ];

      const result = await User.aggregate(pipeline);

      // const abc = await User.updateMany(
      //   {username: decoded.username},
      //   {$set: {"list_days_order.$[elem].order_status": "delivered"}},
      //   {arrayFilters: [{"elm._id": {$eq: id}}]}
      //   )
      // const c = await abc.list_days_order.find({})
      return handleSuccess(res, result[0].list_days_order, {
        message: "Update meal-plan successfully!",
      });
    } catch (err) {
      return handleError(res, err);
    }
  },
};

module.exports = GeneralMenuController;


// db.examSheet.aggregate([
//   {
//    "$match":{
//      "$and":[
//        {"$or":[
//          {"exam":"halfyr_T","marks.p":{"$gte":"25"}},
//          {"exam":"annual_T","marks.p":{"$gte":"35"}}
//        ]},
//        {"std":"9"},
//        {"year":"2017"}
//      ]
//   }
//  }])