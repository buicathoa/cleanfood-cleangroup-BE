const DeliveryController = require('../controllers/DeliveryController');
const validationMiddleware = require('../middlewares/validation');
const { deliverySchema } = require('../validationSchema/delivery.schema');
const router = require("express").Router();

router.post("/create", validationMiddleware(deliverySchema), DeliveryController.createDeliveryAddress)


module.exports = router