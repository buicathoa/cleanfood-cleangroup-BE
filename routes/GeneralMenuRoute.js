const GeneralMenuController = require('../controllers/GeneralMenuController');
const authorize = require('../middlewares/authorize');
const router = require("express").Router();

router.post("/menu/create", GeneralMenuController.createGeneralMenus)
router.post("/menu/get-all", GeneralMenuController.getAllMenus)

router.post("/day-register/create", GeneralMenuController.createDaysRegister)
router.post("/day-register/get-all", authorize(),GeneralMenuController.getAllDaysRegister)
router.post("/day-register/get-by-id", authorize(),GeneralMenuController.getOneDayRegister)
router.post("/day-register/update", GeneralMenuController.updateDaysRegister)
router.post("/day-register/cancel", authorize(), GeneralMenuController.cancelDayOrder)
router.post("/day-register/recover", authorize(), GeneralMenuController.recoverDayOrder)
router.post("/day-register/order-cancel/get-all", authorize(), GeneralMenuController.getAllOrderDaysCancel)
router.post("/day-register/order-cancel/create-supplement", authorize(), GeneralMenuController.createDayItemRegister)

module.exports = router