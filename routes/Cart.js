const authController = require('./../controllers/authController')
const validationMiddleware = require('../middlewares/validation')
const {userLoginSchema} = require("../validationSchema/user.schema");
const weekdayController = require('../controllers/weekdaysController');
const comboPackageController = require('../controllers/comboPackageController');
const { uploadImage } = require('../helper');
const cartController = require('../controllers/CartController');
const router = require("express").Router();

router.post("/add", cartController.addToCart)
router.post("/get-cart-by-user", cartController.getAllCartListByUser)
// router.post("/get-by-route", comboPackageController.getComboPackageByRoute)


module.exports = router