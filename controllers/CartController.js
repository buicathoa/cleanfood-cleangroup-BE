const User = require("./../models/User");
const jwt_decode = require("jwt-decode");
const { handleError, handleSuccess } = require("../utils/handleResponse");
const { Cart } = require("./../models/Cart");
var ObjectId = require("mongodb").ObjectId;

const cartController = {
  addToCart: async (req, res) => {
    const { combo_package, quantity, daily_calories, price, session_register } =
      req.body;
    const combo_package_id = ObjectId(combo_package);
    const combo_package_found = await Cart.findOne({
      combo_package: combo_package_id,
      daily_calories: daily_calories,
    });
    const decoded = await jwt_decode(req.headers.authorization);
    try {
      if (combo_package_found) {
        await Cart.updateOne(
          { _id: combo_package_found._id },
          { quantity: combo_package_found.quantity + quantity }
        );
        return handleSuccess(res, {}, { message: "Add to cart successfully!" });
      } else {
        const newItemInCart = await new Cart({
          user_id: decoded.id,
          combo_package: combo_package,
          quantity: quantity,
          price: price,
          daily_calories: daily_calories,
          session_register: session_register
        }).save();
        await User.updateOne(
          { _id: decoded.id },
          { $push: { Cart: newItemInCart } }
        );
        return handleSuccess(res, newItemInCart, {
          message: "Add product to cart successfully!",
        });
      }
    } catch (err) {
      return handleError(res, err);
    }
  },

  updateCartByUser: async (req, res) => {
    const { cart_id, quantity, inc_quantity } = req.body;
    try {
      quantity
        ? await Cart.findOneAndUpdate({ _id: cart_id }, { quantity: quantity })
        : await Cart.findOneAndUpdate(
            { _id: cart_id },
            { $inc: { quantity: inc_quantity } }
          );
      return handleSuccess(res, { message: "Update quantity successfully!" });
    } catch (err) {
      return handleError(res, err);
    }
  },

  removeCartItem: async (req, res) => {
    const {cart_id} = req.body;
    try{
      await Cart.findByIdAndRemove(cart_id)
      return handleSuccess(res, {message: "Remove item successfully!"})
    }
    catch(err){
      return handleError(res,err)
    }
  },

  getAllCartListByUser: async (req, res) => {
    const decoded = await jwt_decode(req.headers.authorization);
    const listCart = await User.findById(decoded.id);
    try {
      if (listCart._doc.Cart?.length > 0) {
        const pipeline = [
          {
            $match: {
              _id: ObjectId(decoded.id),
            },
          },
          {
            $lookup: {
              from: "carts",
              localField: "Cart",
              foreignField: "_id",
              as: "Cart",
            },
          },
          {
            $project: {
              line_items: "$Cart",
            },
          },
          {
            $unset: ["_id"],
          },
          {
            $unwind: {
              path: "$line_items",
            },
          },
          {
            $lookup: {
              from: "combopackages",
              localField: "line_items.combo_package",
              foreignField: "_id",
              as: "line_items.combo_package",
            },
          },
        ];
        await User.aggregate(pipeline).exec((err, pipelines) => {
          if (err) {
            return handleError(res, err);
          }
          const dataReturn = pipelines.map((item) => {
            return {
              _id: item?.line_items?._id,
              combo_package: item?.line_items?.combo_package[0],
              quantity: item?.line_items?.quantity,
              price: item?.line_items?.price,
              daily_calories: item?.line_items?.daily_calories,
              total_price: item?.line_items?.quantity * item?.line_items?.price
            };
          });
          return handleSuccess(
            res,
            { line_items: dataReturn, total_price: dataReturn.map(item => item.total_price).reduce((prev, curr) => prev + curr, 0)},
            "Get list cart successfully!"
          );
        });
      } else {
        return handleSuccess(
          res,
          { line_items: [] },
          { message: "Empty Cart" }
        );
      }
    } catch (err) {
      return handleError(res, err);
    }
  },
};

module.exports = cartController;
