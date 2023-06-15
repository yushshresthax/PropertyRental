const mongoose = require("mongoose");
const { Types } = require("mongoose");
const express = require("express");
const verifyToken = require("../middlewares/verifyToken.js");
const Booking = require("../models/BookingSchema.js");

const { acceptBooking, checkout, getBookedForOwner, getBookedForUser, getForUser, getRequestedForOwner, getRequestedForUser, rejectBooking, verifyPayment, getNotifications, deleteNotifications } = require("../controllers/bookingController.js");
const router = express.Router();

// Checkout Cart
router.post('/checkout', verifyToken, checkout);

// Get all bookings for the current user
router.get('/', verifyToken, getForUser);

// Get requested bookings for the current user
router.get('/requested', verifyToken, getRequestedForUser);

// Get booked bookings for the current user
router.get('/booked', verifyToken, getBookedForUser);

// Get rejected bookings for the current user
router.get('/rejected', verifyToken, getRequestedForUser);

// Accept a booking by Owner
router.patch('/:bookingId/accept', verifyToken, acceptBooking);

// Reject a booking by Owner
router.patch('/:bookingId/reject', verifyToken, rejectBooking);

// Get all requested bookings for the current owner
router.get('/owner/requested', verifyToken, getRequestedForOwner);


// Get all accepted bookings for the current owner
router.get('/owner/booked', verifyToken, getBookedForOwner);

//get notification
router.get('/notification', verifyToken, getNotifications)

// delete notifications
router.delete("/notification", verifyToken, deleteNotifications)

router.get('/:token/:amount/:secretKey', verifyPayment)


// PUT route to update isPaid to true for a booking
router.put("/paid/:id", async (req, res) => {
    try {
        const bookingId = req.params.id;
        const booking = await Booking.findByIdAndUpdate(
            bookingId,
            { $set: { isPaid: true } }, // Update the isPaid field to true
            { new: true }
        );

        if (!booking) {
            return res.status(404).json({ error: "Booking not found" });
        }

        return res.status(200).json({ message: "Booking successfully updated", booking });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Server error" });
    }
});


module.exports = router;
