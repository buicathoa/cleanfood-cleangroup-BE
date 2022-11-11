const GeneralMenuController = require('../controllers/GeneralMenuController');
const router = require("express").Router();

router.post("/menu/create", GeneralMenuController.createGeneralMenus)
router.post("/menu/get-all", GeneralMenuController.getAllMenus)

router.post("/menu-personal/fake-user", GeneralMenuController.fakeUserTest)
router.post("/menu-personal/fake-update", GeneralMenuController.insertMenuToFakeUser)

router.post("/day-register/create", GeneralMenuController.createDaysRegister)
router.post("/day-register/get", GeneralMenuController.getDaysRegister)
router.post("/day-register/update", GeneralMenuController.updateDaysRegister)

module.exports = router