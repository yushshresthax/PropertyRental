const Booking = require('../models/BookingSchema.js');
const Notification = require('../models/NotificationSchema.js')
const Cart = require('../models/CartSchema.js');
const mongoose = require('mongoose');
const { ObjectId } = require('mongodb');
const axios = require('axios');

const checkout = async (req, res, next) => {
    try {
        const cart = await Cart.findOne({ user: req.user.id }).populate({
            path: 'items.property',
            select: 'title price currentOwner',
        });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }



        const bookingItems = cart.items.map((item) => {
            // Send notification to property owner
            const notification = new Notification({
                type: 'booking_request',
                user: item.property.currentOwner,
                property: item.property,
                message: `New booking request for ${item.property.title}`,
            });
            notification.save();

            return {
                user: req.user.id,
                property: item.property,
                totalPrice: item.price,
                status: 'requested',
                checkIn: item.checkIn,
                checkOut: item.checkOut
            };
        });

        const newBookings = await Booking.insertMany(bookingItems);

        // Remove booked items from cart
        const bookedItemIds = newBookings.map((booking) => booking.property._id.toString());
        cart.items = cart.items.filter((item) => !bookedItemIds.includes(item.property._id.toString()));
        cart.total = cart.items.reduce((total, item) => total + item.price, 0);

        await cart.save();

        return res.status(200).json({ message: "Checkout Successful" });
    } catch (error) {
        next(error);
    }
};
module.exports.checkout = checkout;



const getForUser = async (req, res, next) => {
    try {
        const bookings = await Booking.find({ user: req.user.id }).populate('property');

        return res.status(200).json({ bookings });
    } catch (error) {
        next(error);
    }
}
module.exports.getForUser = getForUser;

const getRequestedForUser = async (req, res, next) => {
    try {
        const bookings = await Booking.find({
            user: req.user.id,
            status: 'requested'
        }).populate('property').populate('user');

        return res.status(200).json({ bookings });
    } catch (error) {
        next(error);
    }
}

module.exports.getRequestedForUser = getRequestedForUser

const getBookedForUser = async (req, res, next) => {
    try {
        const bookings = await Booking.find({
            user: req.user.id,
            status: 'booked'
        }).populate('property');

        return res.status(200).json({ bookings });
    } catch (error) {
        next(error);
    }
}
module.exports.getBookedForUser = getBookedForUser

const getRejectedForUser = async (req, res, next) => {
    try {
        const bookings = await Booking.find({
            user: req.user.id,
            status: 'rejected'
        }).populate('property');

        return res.status(200).json({ bookings });
    } catch (error) {
        next(error);
    }
}
module.exports.getRejectedForUser = getRejectedForUser

const acceptBooking = async (req, res, next) => {
    try {
        const { bookingId } = req.params;

        const booking = await Booking.findById(bookingId).populate("property");

        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        if (!booking.property) {
            return res.status(500).json({ message: "Booking property not found" });
        }

        if (!req.user || !req.user.id) {
            return res.status(500).json({ message: "User ID not found in request" });
        }

        if (booking.property.currentOwner.toString() !== req.user.id.toString()) {
            return res.status(403).json({ message: "You are not authorized to perform this action" });
        }

        booking.status = "booked";
        await booking.save();

        // Create notification
        const notification = new Notification({
            type: "booking_confirmation",
            user: booking.user,
            property: booking.property,
            message: `Your booking for ${booking.property.title} has been confirmed.`,
        });
        await notification.save();

        return res.status(200).json({ message: "Accepted Booking" });
    } catch (error) {
        next(error);
    }
};

module.exports.acceptBooking = acceptBooking;

const rejectBooking = async (req, res, next) => {
    try {
        const { bookingId } = req.params;

        const booking = await Booking.findById(bookingId).populate('property');

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        if (!booking.property) {
            return res.status(500).json({ message: 'Booking property not found' });
        }

        if (!req.user || !req.user.id) {
            return res.status(500).json({ message: 'User ID not found in request' });
        }

        if (booking.property.currentOwner.toString() !== req.user.id.toString()) {
            return res.status(403).json({ message: 'You are not authorized to perform this action' });
        }

        booking.status = 'rejected';
        await booking.save();

        // Create notification
        const notification = new Notification({
            type: "booking_confirmation",
            user: booking.user,
            property: booking.property,
            message: `Sorry your booking for ${booking.property.title} has been rejected .`,
        });
        await notification.save();

        return res.status(200).json({ message: "Rejected Booking" });
    } catch (error) {
        next(error);
    }
}
module.exports.rejectBooking = rejectBooking

const getRequestedForOwner = async (req, res, next) => {
    try {
        const currentOwnerId = new ObjectId(req.user.id);

        const bookings = await Booking.aggregate([
            {
                $lookup: {
                    from: 'properties',
                    localField: 'property',
                    foreignField: '_id',
                    as: 'property'
                }
            },
            {
                $unwind: '$property'
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'property.currentOwner',
                    foreignField: '_id',
                    as: 'property.currentOwner'
                }
            },
            {
                $unwind: '$property.currentOwner'
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'user',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            {
                $unwind: '$user'
            },
            {
                $match: {
                    'property.currentOwner._id': currentOwnerId,
                    status: 'requested'
                }
            },
            {
                $project: {
                    user: {
                        _id: '$user._id',
                        username: '$user.username',
                        email: '$user.email',
                    },
                    _id: 1,
                    status: 1,
                    startDate: 1,
                    totalPrice: 1,
                    checkOut: 1,
                    checkIn: 1,
                    endDate: 1,
                    property: {
                        _id: '$property._id',
                        title: '$property.title',
                        address: '$property.address',
                        image: '$property.image',
                        currentOwner: {
                            _id: '$property.currentOwner._id',
                            firstName: '$property.currentOwner.firstName',
                            lastName: '$property.currentOwner.lastName',
                            email: '$property.currentOwner.email'
                        }
                    }
                }
            }
        ]);

        return res.status(200).json({ bookings });
    } catch (error) {
        next(error);
    }
}


module.exports.getRequestedForOwner = getRequestedForOwner


const getBookedForOwner = async (req, res, next) => {
    try {
        const currentOwnerId = new ObjectId(req.user.id);

        const bookings = await Booking.aggregate([
            {
                $lookup: {
                    from: 'properties',
                    localField: 'property',
                    foreignField: '_id',
                    as: 'property'
                }
            },
            {
                $unwind: '$property'
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'property.currentOwner',
                    foreignField: '_id',
                    as: 'property.currentOwner'
                }
            },
            {
                $unwind: '$property.currentOwner'
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'user',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            {
                $unwind: '$user'
            },
            {
                $match: {
                    'property.currentOwner._id': currentOwnerId,
                    status: 'booked'
                }
            },
            {
                $project: {
                    user: {
                        _id: '$user._id',
                        username: '$user.username',
                        email: '$user.email',
                    },
                    _id: 1,
                    status: 1,
                    startDate: 1,
                    totalPrice: 1,
                    checkOut: 1,
                    checkIn: 1,
                    isPaid: 1,
                    endDate: 1,
                    property: {
                        _id: '$property._id',
                        title: '$property.title',
                        address: '$property.address',
                        image: '$property.image',
                        currentOwner: {
                            _id: '$property.currentOwner._id',
                            firstName: '$property.currentOwner.firstName',
                            lastName: '$property.currentOwner.lastName',
                            email: '$property.currentOwner.email'
                        }
                    }
                }
            }
        ]);

        return res.status(200).json({ bookings });
    } catch (error) {
        next(error);
    }
}
module.exports.getBookedForOwner = getBookedForOwner


const verifyPayment = async (req, res, next) => {
    try {
        const { token, amount, secretKey } = req.params;

        let data = {
            "token": token,
            "amount": amount
        };

        let config = {
            headers: { 'Authorization': `Key ${secretKey}` }
        };


        axios.post("https://khalti.com/api/v2/payment/verify/", data, config)
            .then(response => {
                return res.status(200).json(response.data);

            })
            .catch(error => {
                console.log(error);
            });




    } catch (error) {
        next(error);
    }
}
module.exports.verifyPayment = verifyPayment

// GET /api/notifications
const getNotifications = async (req, res, next) => {
    try {
        const notifications = await Notification.find({ user: req.user.id })
            .populate('property', 'title')
            .sort('-createdAt')
            .exec();
        return res.status(200).json(notifications);
    } catch (error) {
        next(error);
    }
};
module.exports.getNotifications = getNotifications;


const deleteNotifications = async (req, res, next) => {
    try {
        await Notification.deleteMany({ user: req.user.id });
        return res.status(200).json({ message: "All notifications deleted" });
    } catch (error) {
        next(error);
    }
};

module.exports.deleteNotifications = deleteNotifications;