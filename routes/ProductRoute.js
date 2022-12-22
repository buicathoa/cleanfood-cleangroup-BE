const { handle } = require('express/lib/application');
const { calories, mealPlans, mealPlansSession } = require('../constants');
const ProductController = require('../controllers/ProductController');
const { uploadImage } = require('../helper');
const { handleSuccess, handleError } = require('../utils/handleResponse');
const router = require("express").Router();

router.post("/create",uploadImage('product').single('image') ,ProductController.createProduct)
router.post("/get-all", ProductController.getAllProduct)
router.post("/get-by-route", ProductController.getProductbyRoute)
router.post('/get-cost', (req, res) => {
    try{
        const {calories_id, mealplans_id, mealplans_session_id} = req.body
        const caloFound = calories.find(item => calories_id === item.value)
        const mealPlanFound = mealPlans.find(item => mealplans_id === item.value)
        const sessionFound = mealPlansSession.find(item => mealplans_session_id === item.value)
        let total = (caloFound?.price * mealPlanFound?.quantity * sessionFound?.quantity) - ((mealPlanFound?.quantity * sessionFound?.quantity * mealPlanFound?.ratio) * 1000 + (sessionFound?.quantity * sessionFound?.ratio  * mealPlanFound?.quantity) * 1000) 
        let originalPrice = caloFound?.price * mealPlanFound?.quantity * sessionFound?.quantity
        return handleSuccess(res, {total_price: total, original_price: mealPlanFound?.ratio === 2 || sessionFound?.ratio === 2 ? originalPrice : 0}, "Get total price successfully!")
    }catch(err) {
        return handleError(res, err)
    }
})

module.exports = router