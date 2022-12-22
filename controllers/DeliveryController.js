const jwt_decode = require("jwt-decode");
const { handleError, handleSuccess } = require("../utils/handleResponse");
const DeliveryModel = require("../models/DeliveryModel");
const UserModel = require("../models/UserModel");
const { genLocation } = require("../helper");

const DeliveryController = {
  createDeliveryAddress: async (req, res) => {
    const {
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
                if(!default_address){
                    const delivery_address = await new DeliveryModel({
                      province_id: province_id,
                      district_id: district_id,
                      ward_id: ward_id,
                      address_detail: address_detail,
                      full_address: combineLocation,
                      default_address: false,
                      user_id: decoded.id,
                    }).save();
      
                    delete delivery_address.user_id;
      
                    await UserModel.updateOne(
                      { _id: decoded.id },
                      {
                        $push: {
                          delivery_address: delivery_address,
                        },
                      }
                    );
                    return handleSuccess(
                      res,
                      delivery_address,
                      "Tạo địa chỉ giao hàng thành công"
                    );
                }
                else {
                    await DeliveryModel.updateMany({_id: decoded.id}, {
                        $set: {
                            default_address: false
                        }
                    })
                    const delivery_address = await new DeliveryModel({
                        province_id: province_id,
                        district_id: district_id,
                        ward_id: ward_id,
                        address_detail: address_detail,
                        full_address: combineLocation,
                        default_address: true,
                        user_id: decoded.id,
                      }).save();
                    return handleSuccess(res, delivery_address, "Create Address successfully")
                }
              }
            }
          });
    } catch (err) {
      return handleError(res, err);
    }
  },
};

module.exports = DeliveryController;
