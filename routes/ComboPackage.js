const authController = require('./../controllers/authController')
const validationMiddleware = require('../middlewares/validation')
const {userLoginSchema} = require("../validationSchema/user.schema");
const weekdayController = require('../controllers/weekdaysController');
const comboPackageController = require('../controllers/comboPackageController');
const { uploadImage } = require('../helper');
const router = require("express").Router();

router.post("/create",uploadImage('comboPackage').single('image') ,comboPackageController.createComboPackage)
router.post("/get-all", comboPackageController.getAllComboPackage)
router.post("/get-by-route", comboPackageController.getComboPackageByRoute)


module.exports = router