const LocationController = require('./../controllers/LocationController')
const validationMiddleware = require('../middlewares/validation')
const {userLoginSchema} = require("../validationSchema/user.schema")
const router = require("express").Router();

router.post("/province/create", LocationController.createProvince)
router.post("/district/create", LocationController.createDistrict)
router.post("/ward/create", LocationController.createWards)

router.post("/province/get-all", LocationController.getAllProvince)
router.post("/district/get-by-id", LocationController.getDistrictByProvinceId)
router.post("/ward/get-by-id", LocationController.getWardsByDistrictsId)
module.exports = router