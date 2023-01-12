const DeliveryController = require('../controllers/DeliveryController');
const authorize = require('../middlewares/authorize');
const validationMiddleware = require('../middlewares/validation');
const { deliverySchema } = require('../validationSchema/delivery.schema');
const router = require("express").Router();

router.post("/create", validationMiddleware(deliverySchema), DeliveryController.createDeliveryAddress)
router.post("/update", authorize('personal') , DeliveryController.updateDefaultDeliveryAddress)
router.post("/get-all", authorize('personal'), DeliveryController.getAll)

module.exports = router