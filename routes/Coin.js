const CoinController = require('../controllers/CoinController');
const router = require("express").Router();

router.post("/get-all",CoinController.getAllCoin)


module.exports = router