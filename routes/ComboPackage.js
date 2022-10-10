const authController = require('./../controllers/authController')
const validationMiddleware = require('../middlewares/validation')
const {userLoginSchema} = require("../validationSchema/user.schema");
const weekdayController = require('../controllers/weekdaysController');
const comboPackageController = require('../controllers/comboPackageController');
const { uploadImage } = require('../helper');
const router = require("express").Router();

router.post("/create",uploadImage('comboPackage').single('image') ,comboPackageController.createComboPackage)
router.post("/insert-weekday-to-combo", comboPackageController.addWeekdayToComboPackage)

// router.post("/login" ,validationMiddleware(userLoginSchema), authController.loginUser)
// router.post("/verify", authController.verifyUser)
// router.post("/forgot-password", authController.forgotPassword)
// router.post("/recovery-password", authController.recoveryPassword)


module.exports = router