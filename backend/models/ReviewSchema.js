const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
    {
        userId: { type: String, required: true, ref: "User" },
        comment: { type: String, required: true, max: 150 },
        rating: { type: Number, required: true, max: 5 },
        propertyId: { type: String, required: true, ref: "Property" }
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Review", reviewSchema);