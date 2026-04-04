const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendWelcomeEmail = require("../utils/emailService");


// Register a new user
const registerUser = async (req, res) => {
    try {
        const { name, username, email, password } = req.body;

        const normalizedUsername = username.toLowerCase().trim();
        const normalizedEmail = email.toLowerCase().trim();

        const existingUser = await User.findOne({
            $or: [
                { email: normalizedEmail },
                { username: normalizedUsername }
            ]
        });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name,
            username: normalizedUsername,
            email: normalizedEmail,
            password: hashPassword
        });

        await newUser.save();

        const isSent = await sendWelcomeEmail(normalizedEmail, name);

        if (!isSent) {
            console.log("Email failed but continuing...");
        }

        res.json({ message: "User registered successfully" });
    } catch (err) {
        console.log("EMAIL ERROR FULL:", err);
        console.log("MESSAGE:", err.message);
        console.log("CODE:", err.code);
        return false;
    }
};

// Login user (with email or username)
const loginUser = async (req, res) => {
    try {
        const { credential, password } = req.body;

        if (!credential || !password) {
            return res.status(400).json({ message: "Credential and password are required" });
        }

        const normalizedCredential = credential.toLowerCase().trim();

        // Check if credential is email or username
        const user = await User.findOne({
            $or: [
                { email: normalizedCredential },
                { username: normalizedCredential }
            ]
        });

        if (!user) {
            return res.status(400).json({ message: "Invalid email/username or password" });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email/username or password" });
        }

        // Create JWT token
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "24h" }
        );

        return res.json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Check if username exists
const checkUsernameExists = async (req, res) => {
    try {
        const { username } = req.body;

        if (!username || username.trim().length < 3) {
            return res.status(400).json({ exists: false });
        }

        const normalizedUsername = username.toLowerCase().trim();
        const user = await User.findOne({ username: normalizedUsername });
        res.json({ exists: !!user });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Server error" });
    }
};

// Check if email exists
const checkEmailExists = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email || !email.includes("@")) {
            return res.status(400).json({ exists: false });
        }

        const normalizedEmail = email.toLowerCase().trim();
        const user = await User.findOne({ email: normalizedEmail });
        res.json({ exists: !!user });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Server error" });
    }
};

module.exports = { registerUser, loginUser, checkUsernameExists, checkEmailExists };