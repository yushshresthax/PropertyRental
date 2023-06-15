const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const cors = require("cors");
const app = express();
const authController = require('./controllers/authController')
const propertyController = require('./controllers/propertyController')
const uploadController = require('./controllers/uploadController');
const cartRoute = require('./routes/cart')
const bookingRoute = require('./routes/booking')
const userController = require('./controllers/userController')
const reviewRoute = require('./routes/review')
// db connecting
mongoose.set('strictQuery', false)
const connect = async () => {
    try {
        await mongoose.connect(process.env.MONGO_CONNECT)
        console.log('Connected to mongoDB')
    } catch (error) {
        throw error;
    }
}
mongoose.connection.on("disconnected", () => {
    console.log('MongoDB Disconnected')
})

// middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/images', express.static('public/images'))

app.use("/auth", authController);
app.use("/property", propertyController);
app.use('/upload', uploadController)
app.use("/user", userController)
app.use("/cart", cartRoute);
app.use("/booking", bookingRoute)
app.use("/review", reviewRoute)

// starting server
const port = process.env.PORT || 5000;
app.listen(port, () => {
    connect()
    console.log("Server has been started")
})