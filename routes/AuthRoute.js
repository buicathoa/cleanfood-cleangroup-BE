const authController = require('../controllers/AuthController')
const validationMiddleware = require('../middlewares/validation')
const {userLoginSchema} = require("../validationSchema/user.schema")
const router = require("express").Router();

router.post("/register", authController.registerUser)
router.post("/login" ,validationMiddleware(userLoginSchema), authController.loginUser)
// router.post("/verify", authController.verifyUser)
// router.post("/forgot-password", authController.forgotPassword)
// router.post("/recovery-password", authController.recoveryPassword)


module.exports = router