const authController = require('./../controllers/authController')
const validationMiddleware = require('../middlewares/validation')
const {userLoginSchema} = require("../validationSchema/user.schema");
const weekdayController = require('../controllers/weekdaysController');
const router = require("express").Router();

router.post("/create", weekdayController.createWeekdays)
// router.post("/login" ,validationMiddleware(userLoginSchema), authController.loginUser)
// router.post("/verify", authController.verifyUser)
// router.post("/forgot-password", authController.forgotPassword)
// router.post("/recovery-password", authController.recoveryPassword)


module.exports = router