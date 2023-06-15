const Cart = require("../models/CartSchema.js");
const Property = require("../models/Property.js");
const mongoose = require("mongoose");

const addItemToCart = async (req, res, next) => {
    try {
        const { propertyId, checkIn, checkOut } = req.body;

        if (!mongoose.Types.ObjectId.isValid(propertyId)) {
            return res.status(400).json({ message: 'Invalid propertyId' });
        }

        const property = await Property.findById(propertyId);
        if (!property) {
            return res.status(404).json({ message: 'Property not found' });
        }

        const cartItem = {
            property: property._id,
            price: property.price,
            checkIn,
            checkOut
        };

        const cart = await Cart.findOne({ user: req.user.id });
        if (!cart) {
            // Create a new cart if not found
            const newCart = new Cart({
                user: req.user.id,
                items: [cartItem],
                total: cartItem.price
            });
            await newCart.save();
            return res.status(200).json({ message: "Item added to cart" });
        }

        // Update existing cart
        cart.items.push(cartItem);
        cart.total = cart.items.reduce((total, item) => total + item.price, 0);
        await cart.save();
        return res.status(200).json({ message: "Item added to cart" });

    } catch (error) {
        console.log(error)
        next(error);
    }
};
module.exports.addItemToCart = addItemToCart;

const updateCartItem = async (req, res, next) => {
    try {
        const { itemId } = req.params;
        const { quantity, checkIn, checkOut } = req.body;

        const cart = await Cart.findOne({ user: req.user.id });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        const itemIndex = cart.items.findIndex(item => item._id.toString() === itemId);
        if (itemIndex === -1) {
            return res.status(404).json({ message: 'Item not found in cart' });
        }

        const item = cart.items[itemIndex];
        item.checkIn = checkIn;
        item.checkOut = checkOut;

        await cart.save();

        return res.status(200).json(cart);
    } catch (error) {
        next(error);
    }
};
module.exports.updateCartItem = updateCartItem;


const removeCartItem = async (req, res, next) => {
    try {
        const { itemId } = req.params;

        const cart = await Cart.findOneAndUpdate(
            { user: req.user.id },
            { $pull: { items: { _id: itemId } } },
            { new: true }
        );

        if (!cart) {
            return res.status(404).json({ message: 'Item not found in cart' });
        }

        return res.status(200).json({ message: "Item Removed" });
    } catch (error) {
        next(error);
    }
};
module.exports.removeCartItem = removeCartItem;

const getCurrentCart = async (req, res, next) => {
    try {
        const cart = await Cart.findOne({ user: req.user.id }).populate({
            path: 'items.property',
            select: 'title price',
        });
        if (!cart) {
            return res.status(200).json({ items: [], total: 0 });
        }

        const totalPrice = cart.items.reduce(
            (acc, item) => acc + item.price,
            0
        );

        return res.status(200).json({ items: cart.items, total: totalPrice });
    } catch (error) {
        next(error);
    }
};
module.exports.getCurrentCart = getCurrentCart;