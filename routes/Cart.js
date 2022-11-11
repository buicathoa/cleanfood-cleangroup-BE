const cartController = require('../controllers/CartController');
const authorize = require('../middlewares/authorize');
const router = require("express").Router();

router.post("/add",authorize(), cartController.addToCart)
router.post("/get-cart-by-user", authorize(), cartController.getAllCartListByUser)
router.post("/update-quantity", authorize(), cartController.updateCartByUser)
router.post("/remove-cart-item", authorize(), cartController.removeCartItem)


module.exports = router