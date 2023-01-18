const authorize = require('../middlewares/authorize');
const orderController = require('../controllers/orderController');
const router = require("express").Router();

router.post("/purchase",authorize(), orderController.purchase)
router.post("/get-history",authorize(), orderController.getHistoryOrder)
//admin
router.post("/update-status",authorize(), orderController.updateStatusOrderAndRegister)

module.exports = router