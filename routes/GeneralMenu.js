const authController = require('../controllers/authController')
const validationMiddleware = require('../middlewares/validation')
const {userLoginSchema} = require("../validationSchema/user.schema");
const weekdayController = require('../controllers/weekdaysController');
const GeneralMenuController = require('../controllers/GeneralMenuController');
const router = require("express").Router();

router.post("/create", GeneralMenuController.createGeneralDays)
router.post("/menu/create", GeneralMenuController.createGeneralMenus)
router.post("/menu/get-all", GeneralMenuController.getAllMenus)

router.post("/menu-personal/create", GeneralMenuController.createMenuPersonal)
router.post("/menu-personal/get-all", GeneralMenuController.getAllMenuPersonal)
router.post("/menu-personal/update", GeneralMenuController.updateMenuPersonal)
// router.post("/login" ,validationMiddleware(userLoginSchema), authController.loginUser)
// router.post("/verify", authController.verifyUser)
// router.post("/forgot-password", authController.forgotPassword)
// router.post("/recovery-password", authController.recoveryPassword)


module.exports = router