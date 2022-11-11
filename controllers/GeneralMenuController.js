const jwt_decode = require("jwt-decode");
const { handleError, handleSuccess } = require("../utils/handleResponse");
const { findWithMultipleQuery } = require("../helper");
const {
  GeneralMenus,
  Usertest,
  MenuRegister,
} = require("../models/GeneralMenu");
const moment = require("moment");

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
      const generalMenuItem = await GeneralMenus.insertMany({
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
      const rangeOfDaysAndMenu = await GeneralMenus.find({}).sort({ start: 1 });
      return handleSuccess(res, rangeOfDaysAndMenu, {
        message: "Get menu successfully!",
      });
    } catch (err) {
      return handleError(res, err);
    }
  },
  createDaysRegister: async (req, res) => {
    const { start_date, end_date, list_days_order } = req.body;
    const decoded = await jwt_decode(req.headers.authorization);
    try {
      const day1 = moment(start_date);
      const day2 = moment(end_date);

      while (day1 < day2) {
        if (day1.format("dddd") !== "Sunday") {
          await MenuRegister.insertMany({
            date: moment(day1).format("YYYY-MM-DD"),
            order_status: "ready",
            ship_place: "107/16 Hà đặc, phường Trung mỹ tây, quận 12",
            ship_time: "08:30 - 09:30",
            user_id: decoded.id,
          });
          MenuRegister.date instanceof Date;
        }
        day1.add(1, "day");
      }
      return handleSuccess(
        res,
        {},
        { message: "Create timetable register menu successfully!" }
      );
    } catch (err) {
      return handleError(res, err);
    }
  },
  getDaysRegister: async (req, res) => {
    const decoded = await jwt_decode(req.headers.authorization);
    const { ship_place, ship_time, date, order_status } = req.body;
    try {
      const listDaysRegister = await MenuRegister.find({
        $and: [
          findWithMultipleQuery("ship_place", "$eq", ship_place),
          findWithMultipleQuery("ship_time", "$eq", ship_time),
          findWithMultipleQuery("date", "$eq", date),
          findWithMultipleQuery("order_status", "$eq", order_status),
          findWithMultipleQuery("user_id", "$eq", decoded.id),
        ],
      });
      return handleSuccess(res, listDaysRegister, {
        message: "Get menu-days register successfully!",
      });
    } catch (err) {
      return handleError(res, err);
    }
  },
  updateDaysRegister: async (req, res) => {
    const { order_status, id, date, ship_time, ship_place } = req.body;
    const decoded = await jwt_decode(req.headers.authorization);
    try {
      const updateDaysRegister = await MenuRegister.findOneAndUpdate(
        {
          user_id: decoded.id,
          _id: id
        },
        {
          $set: {
            date: date,
            ship_time: ship_time,
            ship_place: ship_place,
            order_status: order_status,
            user_id: decoded.id
          },
        }
      );
      return handleSuccess(
        res,
        updateDaysRegister,
        {
          message: "Update meal-plan successfully!",
        }
      );
    } catch (err) {
      return handleError(res, err);
    }
  },
  fakeUserTest: async (req, res) => {
    try {
      for (var i = 0; i < 1000; i++) {
        await Usertest.insertMany({
          username: `username${i}`,
          password: i,
        });
      }
      return handleSuccess(res, {}, "OK");
    } catch (err) {
      return handleError(res, err);
    }
  },
  insertMenuToFakeUser: async (req, res) => {
    try {
      (await Usertest.find({})).forEach((cols) => {
        console.log("Usertest", cols);
      });
      return handleSuccess(res, {}, "OK");
    } catch (err) {
      return handleError(res, err);
    }
  },
};

module.exports = GeneralMenuController;
