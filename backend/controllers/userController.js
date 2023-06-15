const express = require("express");
const router = express.Router();
const User = require("../models/User");
const verifyToken = require("../middlewares/verifyToken");
const bcrypt = require("bcrypt");

// Change password
router.put("/change-password", verifyToken, async (req, res) => {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;
    try {
        // Find the user by ID
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }

        // Compare current password with the password in the database
        const isMatch = await bcrypt.compare(currentPassword, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: "Current password is incorrect" });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update the user's password
        user.password = hashedPassword;
        await user.save();

        return res.status(200).json({ message: "Password changed successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Failed to change password" });
    }
});


router.put("/", verifyToken, async (req, res) => {
    const userId = req.user.id
    const { name, email, phone } = req.body;
    try {
        const updatedUser = await User.findById(userId);
        updatedUser.name = name
        updatedUser.email = email
        updatedUser.phone = phone
        await updatedUser.save()
        console.log(updatedUser)

        res.json({ message: "Updated Successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to update user information" });
    }
});

module.exports = router;