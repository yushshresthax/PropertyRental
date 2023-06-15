const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    username: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    phone: {
        type: String,
        unique: true
    },
    password: {
        type: String,
        required: true,
        min: 6,
    },
    profileImg: {
        type: String,
        default: ''
    }

}, { timestamps: true })

module.exports = mongoose.model("User", UserSchema)