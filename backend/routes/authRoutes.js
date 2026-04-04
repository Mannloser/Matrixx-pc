const express = require("express");
const sendWelcomeEmail = require("../utils/emailService");

const { registerUser, loginUser, checkUsernameExists, checkEmailExists } = require("../controller/authController.js");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/check-username", checkUsernameExists);
router.post("/check-email", checkEmailExists);

module.exports = router;