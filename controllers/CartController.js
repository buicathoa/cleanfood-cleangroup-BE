const UserModel = require("./../models/UserModel");
const jwt_decode = require("jwt-decode");
const { handleError, handleSuccess } = require("../utils/handleResponse");
const { Cart } = require("./../models/CartModel");
const { calories, mealPlansSession, mealPlans } = require("../constants");
var ObjectId = require("mongodb").ObjectId;

const cartController = {
  addToCart: async (req, res) => {
    const {
      product_id,
      quantity,
      calories_id,
      price,
      session_id,
      mealplans_id,
    } = req.body;

    const decoded = await jwt_decode(req.headers.authorization);
    const productFound = await Cart.findOne({
      $and: [
        { product_id: ObjectId(product_id) },
        { calories: calories_id },
        { session: session_id },
        { mealplans: mealplans_id },
        { username: decoded.username },
      ],
    });
    try {
      if (productFound) {
        const newCart = await Cart.updateOne(
          { _id: productFound._id },
          { quantity: productFound.quantity + quantity }
        );
        return handleSuccess(res, newCart, { message: "Add to cart successfully!" });
      } else {
        const newItemInCart = await new Cart({
          user_id: decoded.id,
          product_id: product_id,
          quantity: quantity,
          price: price,
          calories: calories.find((item) => item.value === calories_id)?.label,
          session: mealPlansSession.find((item) => item.value === session_id)
            ?.label,
          mealplans: mealPlans.find((item) => item.value === mealplans_id)
            ?.label,
        }).save();
        await UserModel.updateOne(
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
    const decoded = await jwt_decode(req.headers.authorization);
    try {
      if(quantity){
        const updateItem = await Cart.findOneAndUpdate(
          {
            $and: [{ _id: cart_id }, { user_id: decoded.id }],
          },
          { quantity: quantity },
          {new: true}
        )
        return handleSuccess(res, updateItem, { message: "Update quantity successfully!" });
      } else {
        const updateItem = await Cart.findOneAndUpdate(
          { $and: [{ _id: cart_id }, { user_id: decoded.id }] },
          { $inc: { quantity: inc_quantity } },
          {new: true}
        )
        return handleSuccess(res, updateItem, { message: "Update quantity successfully!" });
      }
    } catch (err) {
      return handleError(res, err);
    }
  },

  removeCartItem: async (req, res) => {
    const { cart_id } = req.body;
    try {
      await Cart.findByIdAndRemove(cart_id);
      return handleSuccess(res, { message: "Remove item successfully!" });
    } catch (err) {
      return handleError(res, err);
    }
  },

  getAllCartListByUser: async (req, res) => {
    const decoded = await jwt_decode(req.headers.authorization);
    const listCart = await UserModel.findById(decoded.id);
    try {
      if (listCart?.Cart?.length > 0) {
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
            $unwind: {
              path: "$Cart",
            },
          },
          {
            $lookup: {
              from: "products",
              localField: "Cart.product_id",
              foreignField: "_id",
              as: "Cart.product_info",
            },
          },
          {
            $project: {
              calories_id: "$Cart.calories",
              mealplans_id: "$Cart.mealplans",
              session_id: "$Cart.session",
              price: "$Cart.price",
              quantity: "$Cart.quantity",
              cart_id: "$Cart._id",
              product_info: {
                $arrayElemAt: ["$Cart.product_info", 0],
              },
            },
          },
        ];
        await UserModel.aggregate(pipeline).exec((err, pipelines) => {
          if (err) {
            return handleError(res, err);
          }
          const dataReturn = pipelines.map((item) => {
            return {
              _id: item?.cart_id,
              product_info: item?.product_info,
              quantity: item?.quantity,
              price: item?.price,
              daily_calories: item?.calories_id,
              session: item?.session_id,
              mealplans: item?.mealplans_id,
              total_price: item?.quantity * item?.price,
            };
          });
          return handleSuccess(
            res,
            {
              list_carts: dataReturn,
              total_price: dataReturn
                .map((item) => item.total_price)
                .reduce((prev, curr) => prev + curr, 0),
              total_quantity: dataReturn
                .map((item) => item.quantity)
                .reduce((prev, curr) => prev + curr, 0),
            },
            "Get list cart successfully!"
          );
        });
      } else {
        return handleSuccess(
          res,
          { list_carts: [] },
          { message: "Empty Cart" }
        );
      }
    } catch (err) {
      return handleError(res, err);
    }
  },
};

module.exports = cartController;
