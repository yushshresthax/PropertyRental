const mongoose = require('mongoose');

const CartItemSchema = new mongoose.Schema({
    property: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Property',
        required: true
    },

    price: {

        type: Number,
        required: true,
    },
    checkIn: {
        type: Date,
        required: [true, 'Check-in date is required'],
    },
    checkOut: {
        type: Date,
        required: [true, 'Check-out date is required'],
    }

});

const CartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [CartItemSchema],
    total: {
        type: Number,
        required: true,
    }
});


const Cart = mongoose.model('Cart', CartSchema);
module.exports = Cart;