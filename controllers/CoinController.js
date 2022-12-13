const jwt_decode = require("jwt-decode");
const { handleError, handleSuccess } = require("../utils/handleResponse");
const CoinModel = require("../models/CoinModel");

const CoinController = {
  getAllCoin: async (req, res) => {
    const decoded = await jwt_decode(req.headers.authorization);
    try {
        const listCoin = await CoinModel.findOne({user_id: decoded.id})
      return handleSuccess(
        res,
        listCoin,
        "Get list coins successfully!"
      );
    } catch (err) {
      return handleError(res,err);
    }
  },
};

module.exports = CoinController;
