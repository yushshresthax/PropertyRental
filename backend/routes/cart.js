const express = require("express");
const verifyToken = require('../middlewares/verifyToken')
const {
    addItemToCart,
    getCurrentCart,
    removeCartItem,
    updateCartItem,
} = require("../controllers/cartController");

const router = express.Router();

// Add an item to the cart
router.post('/', verifyToken, addItemToCart);


// Update an item in the cart
router.put('/:itemId', verifyToken, updateCartItem);

// Remove an item from the cart

router.delete('/:itemId', verifyToken, removeCartItem);

// Get the current user's cart
router.get('/', verifyToken, getCurrentCart);

module.exports = router;