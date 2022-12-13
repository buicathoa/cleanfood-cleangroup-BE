const authorize = require('../middlewares/authorize');
const orderController = require('../controllers/orderController');
const router = require("express").Router();

router.post("/purchase",authorize(), orderController.purchase)


module.exports = router