const jwt_decode = require("jwt-decode");
const { handleError, handleSuccess } = require("../utils/handleResponse");
const { findWithMultipleQuery, genLocation } = require("../helper");
const {
  GeneralMenusModel,
  MenuRegisterModel,
  OrderCancelModel,
} = require("../models/GeneralMenu");
const moment = require("moment");
const { MongoClient } = require("mongodb");

const { calories, mealPlansSession, mealPlans, uri } = require("../constants");
const UserModel = require("../models/UserModel");
const CodeModel = require("../models/CodeModel");

const GeneralMenuController = {
  createGeneralMenus: async (req, res) => {
    const {
      breakfast_vi,
      breakfast_en,
      lunch_vi,
      lunch_en,
      dinner_vi,
      dinner_en,
      date,
    } = req.body;
    try {
      const generalMenuItem = await GeneralMenusModel.insertMany({
        breakfast_vi: breakfast_vi,
        breakfast_en: breakfast_en,
        lunch_vi: lunch_vi,
        lunch_en: lunch_en,
        dinner_vi: dinner_vi,
        dinner_en: dinner_en,
        date: date,
      });
      generalMenuItem.date instanceof Date;
      return handleSuccess(res, generalMenuItem, {
        message: "Create menu general successfully!",
      });
    } catch (err) {
      return handleError(res, err);
    }
  },
  getAllMenus: async (req, res) => {
    try {
      const rangeOfDaysAndMenu = await GeneralMenusModel.find({}).sort({
        start: 1,
      });
      return handleSuccess(res, rangeOfDaysAndMenu, {
        message: "Get menu successfully!",
      });
    } catch (err) {
      return handleError(res, err);
    }
  },
  createDaysRegister: async (req, res) => {
    const {
      start_date,
      end_date,
      delivery_start_time,
      delivery_end_time,
      phone_number,
      full_name,
      order_id,
      calories,
      session,
      mealplans,
      product,
      province_id,
      district_id,
      ward_id,
      address_detail,
    } = req.body;
    const decoded = await jwt_decode(req.headers.authorization);
    const client = await MongoClient.connect(uri, { useNewUrlParser: true });
    const sessionTransaction = await client.startSession();
    sessionTransaction.startTransaction();

    try {
      const day1 = moment(start_date);
      const day2 = moment(end_date);
      const combineLocation = await genLocation(
        address_detail,
        province_id,
        district_id,
        ward_id
      );
      let recordUpdate;
      while (day1 < day2) {
        const time = moment().format("YYYYMMDD");
        if(day1.format("dddd") !== 'Sunday'){
          recordUpdate =  await CodeModel.findOneAndUpdate({ type: "SH" }, [
            {
              $set: {
                date: {
                  $cond: {
                    if: {
                      $eq: ["$date", time],
                    },
                    then: time,
                    else: time,
                  },
                },
                code: {
                  $cond: {
                    if: {
                      $eq: ["$date", time],
                    },
                    then: {
                      $add: [
                        "$code", 1
                      ]
                    },
                    else: 1,
                  }
                },
              },
            },
          ], {new: true, sessionTransaction});
        }
        if (day1.format("dddd") !== "Sunday") {
          await MenuRegisterModel.insertMany({
            start:
              moment(day1).format("YYYY-MM-DD") + " " + delivery_start_time,
            end: moment(day1).format("YYYY-MM-DD") + " " + delivery_end_time,
            order_status: "wait_confirmed",
            ship_place: combineLocation,
            province_id: province_id,
            district_id: district_id,
            ward_id: ward_id,
            address_detail: address_detail,
            user_id: decoded.id,
            order_id: order_id,
            shipping_code: `SH-${recordUpdate.date}-${recordUpdate.code}`,
            product: product,
            phone_number: phone_number,
            full_name: full_name,
            calories: calories,
            session: session,
            mealplans: mealplans,
          });
          MenuRegisterModel.date instanceof Date;
        }
        day1.add(1, "day");
      }
      await sessionTransaction.commitTransaction();
      await sessionTransaction.endSession();

      return handleSuccess(res, {
        message: "Create timetable register menu successfully!",
      });
    } catch (err) {
      await sessionTransaction.abortTransaction();
      await sessionTransaction.endSession();
      return handleError(res, err);
    }
  },
  getAllDaysRegister: async (req, res) => {
    const decoded = await jwt_decode(req.headers.authorization);
    try {
      const listDaysRegister = await MenuRegisterModel.find({
        ...req.body,
        user_id: decoded.id,
      });
      return handleSuccess(res, listDaysRegister, {
        message: "Get menu-days register successfully!",
      });
    } catch (err) {
      return handleError(res, err);
    }
  },
  getOneDayRegister: async (req, res) => {
    const decoded = await jwt_decode(req.headers.authorization);
    const { order_tracking_id } = req.body;
    try {
      const dayFound = await MenuRegisterModel.findOne({
        _id: order_tracking_id,
        user_id: decoded.id,
      });
      return handleSuccess(res, dayFound, { message: "Get day successfully" });
    } catch (err) {
      return handleError(res, err);
    }
  },
  updateDaysRegister: async (req, res) => {
    const decoded = await jwt_decode(req.headers.authorization);
    const {
      district_id,
      full_name,
      phone_number,
      province_id,
      ward_id,
      order_tracking_id,
      order_status,
      address_detail,
      start,
      end,
    } = req.body;
    try {
      const full_address = await genLocation(
        address_detail,
        province_id,
        district_id,
        ward_id
      );
      await MenuRegisterModel.findOneAndUpdate(
        {
          user_id: decoded.id,
          _id: order_tracking_id,
        },
        {
          $set: {
            district_id: district_id,
            full_name: full_name,
            phone_number: phone_number,
            province_id: province_id,
            ward_id: ward_id,
            order_status: order_status,
            ship_place: full_address,
            address_detail: address_detail,
            start: start,
            end: end,
          },
        }
      );
      return handleSuccess(res, {
        message: "Update meal-plan successfully!",
      });
    } catch (err) {
      return handleError(res, err);
    }
  },
  cancelDayOrder: async (req, res) => {
    const {
      product,
      calories,
      session,
      reason,
      order_day_id,
      mealplans,
      order_id,
    } = req.body;
    try {
      const decoded = await jwt_decode(req.headers.authorization);
      await new OrderCancelModel({
        product: product,
        calories: calories,
        session: session,
        reason: reason,
        mealplans: mealplans,
        order_day_id: order_day_id,
        order_id: order_id,
        user_id: decoded.id,
      }).save();

      await UserModel.findByIdAndUpdate(decoded.id, {
        $inc: {
          order_day_cancel: 1,
        },
      });
      if (order_day_id === "") {
        throw new Error("Invalid order_day_id");
      }
      await MenuRegisterModel.findByIdAndUpdate(order_day_id, {
        $set: {
          order_status: "reject",
        },
      });

      return handleSuccess(res, "Cancel day-order successfully!");
    } catch (err) {
      return handleError(err);
    }
  },
  recoverDayOrder: async (req, res) => {
    const { order_day_id } = req.body;
    try {
      const decoded = await jwt_decode(req.headers.authorization);
      await OrderCancelModel.deleteOne({ order_day_id: order_day_id });
      await UserModel.findByIdAndUpdate(decoded.id, {
        $inc: { order_day_cancel: -1 },
      });
      await MenuRegisterModel.findByIdAndUpdate(order_day_id, {
        $set: { order_status: "pending" },
      });
      return handleSuccess(res, "Recover order-day successfully!");
    } catch (err) {
      return handleError(res, err);
    }
  },
  getAllOrderDaysCancel: async (req, res) => {
    try {
      const decoded = await jwt_decode(req.headers.authorization);
      const listOrderCancelDays = await OrderCancelModel.find({
        user_id: decoded.id,
      });
      return handleSuccess(res, listOrderCancelDays, {
        message: "Get list order days cancel successfully!",
      });
    } catch (err) {
      return handleError(res, err);
    }
  },
  createDayItemRegister: async (req, res) => {
    const {
      delivery_date,
      delivery_start_time,
      delivery_end_time,
      order_status,
      address_info,
      product,
      calories,
      session,
      mealplans,
      order_cancel_id,
      order_id,
    } = req.body;
    try {
      const decoded = await jwt_decode(req.headers.authorization);
      const combineLocation = await genLocation(
        address_info.address_detail,
        address_info.province_id,
        address_info.district_id,
        address_info.ward_id
      );
      let recordUpdate
      if(day1.format("dddd") !== 'Sunday'){
        recordUpdate =  await CodeModel.findOneAndUpdate({ type: "SH" }, [
          {
            $set: {
              date: {
                $cond: {
                  if: {
                    $eq: ["$date", moment().format('YYYYMMDD')],
                  },
                  then: moment().format('YYYYMMDD'),
                  else: moment().format('YYYYMMDD'),
                },
              },
              code: {
                $cond: {
                  if: {
                    $eq: ["$date", moment().format('YYYYMMDD')],
                  },
                  then: {
                    $add: [
                      "$code", 1
                    ]
                  },
                  else: 1,
                }
              },
            },
          },
        ], {new: true, sessionTransaction});
      }

      const dayItemRegister = await new MenuRegisterModel({
        start:
          moment(delivery_date).format("YYYY-MM-DD") +
          " " +
          moment(delivery_start_time).format("HH:mm:ss"),
        end:
          moment(delivery_date).format("YYYY-MM-DD") +
          " " +
          moment(delivery_end_time).format("HH:mm:ss"),
        order_status: order_status,
        user_id: decoded.id,
        province_id: address_info.province_id,
        district_id: address_info.district_id,
        ward_id: address_info.ward_id,
        address_detail: address_info.address_detail,
        ship_place: combineLocation,
        full_name: address_info.full_name,
        phone_number: address_info.phone_number,
        product: product,
        calories: calories,
        session: session,
        mealplans: mealplans,
        order_id: order_id,
        shipping_code: `SH-${recordUpdate.date}-${recordUpdate.code}`,
      }).save();

      await UserModel.findByIdAndUpdate(decoded.id, {
        $inc: {
          order_day_cancel: -1,
        },
      });

      await OrderCancelModel.deleteOne({ _id: order_cancel_id });

      return handleSuccess(res, dayItemRegister, "Create successfully");
    } catch (err) {
      return handleError(res, err);
    }
  },
  confirmRegisterDay: async (req, res) => {},
};

module.exports = GeneralMenuController;
