const jwt_decode = require("jwt-decode");
const { handleError, handleSuccess } = require("../utils/handleResponse");
const DeliveryModel = require("../models/DeliveryModel");
const UserModel = require("../models/UserModel");
const { genLocation } = require("../helper");

const DeliveryController = {
  createDeliveryAddress: async (req, res) => {
    const {
      full_name,
      phone_number,
      delivery_time,
      province_id,
      district_id,
      ward_id,
      address_detail,
      default_address,
    } = req.body;
    const decoded = await jwt_decode(req.headers.authorization);
    try {
      const combineLocation = await genLocation(
        address_detail,
        province_id,
        district_id,
        ward_id
      );
      const pipeline = [
        {
          $match: {
            username: decoded.username,
          },
        },
        {
          $lookup: {
            from: "deliveries",
            localField: "delivery_address",
            foreignField: "_id",
            as: "delivery_address",
          },
        },
        {
          $project: {
            is_dupplicate_address: {
              $in: [combineLocation, "$delivery_address.full_address"],
            },
          },
        },
      ];

      await UserModel.aggregate(pipeline).exec(async (err, pipelines) => {
        if (err) throw err;
        else {
          if (pipelines[0]?.is_dupplicate_address) {
            return handleSuccess(res, "Địa chỉ này hiện tại đã được tạo");
          } else {
            if (!default_address) {
              const delivery_address = await new DeliveryModel({
                full_name: full_name,
                phone_number: phone_number,
                delivery_time: delivery_time,
                province_id: province_id,
                district_id: district_id,
                ward_id: ward_id,
                address_detail: address_detail,
                full_address: combineLocation,
                default_address: false,
                user_id: decoded.id,
              }).save();

              delete delivery_address.user_id;

              return handleSuccess(
                res,
                delivery_address,
                "Tạo địa chỉ giao hàng thành công"
              );
            } else {
              await DeliveryModel.updateMany(
                { user_id: decoded.id },
                {
                  $set: {
                    default_address: false,
                  },
                }
              );
              const delivery_address = await new DeliveryModel({
                full_name: full_name,
                phone_number: phone_number,
                delivery_time: delivery_time,
                province_id: province_id,
                district_id: district_id,
                ward_id: ward_id,
                address_detail: address_detail,
                full_address: combineLocation,
                default_address: true,
                user_id: decoded.id,
              }).save();
              return handleSuccess(
                res,
                delivery_address,
                "Create Address successfully"
              );
            }
          }
        }
      });
    } catch (err) {
      return handleError(res, err);
    }
  },
  updateDefaultDeliveryAddress: async (req, res) => {
    const decoded = await jwt_decode(req.headers.authorization);
    const { delivery_address_id } = req.body;
    try {
      const deliveryFound = await DeliveryModel.findOne({
        _id: delivery_address_id,
      });
      const combineLocation = await genLocation(
        req.body.address_detail,
        req.body.province_id,
        req.body.district_id,
        req.body.ward_id
      );
      if (deliveryFound.default_address === req.body.default_address) {
        await DeliveryModel.updateOne(
          { _id: delivery_address_id },
          {
            $set: { ...req.body, full_address: combineLocation },
          }
        );
      } else {
        await DeliveryModel.updateMany(
          { user_id: decoded.id },
          {
            $set: {
              default_address: false,
            },
          }
        );
        await DeliveryModel.updateOne(
          { user_id: decoded.id, _id: delivery_address_id },
          {
            $set: {
              ...req.body,
              full_address: combineLocation,
              default_address: req.body.default_address,
            },
          }
        );
      }
      return handleSuccess(res, combineLocation, "Update Thành công!");
    } catch (err) {
      return handleError(res, err);
    }
  },
  getAll: async (req, res) => {
    const decoded = await jwt_decode(req.headers.authorization);
    try{
      const listDelivery = await DeliveryModel.find({user_id: decoded.id})
      return handleSuccess(res, listDelivery, 'Lấy danh sách địa chỉ thành công !')
    }catch(err){
      return handleError(res, err);
    }
  }
};

module.exports = DeliveryController;
