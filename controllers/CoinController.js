const jwt_decode = require("jwt-decode");
const { handleError, handleSuccess } = require("../utils/handleResponse");
const Coin = require("../models/Coin");

const CoinController = {
  getAllCoin: async (req, res) => {
    const decoded = await jwt_decode(req.headers.authorization);
    try {
        const listCoin = await Coin.findOne({user_id: decoded.id})
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
