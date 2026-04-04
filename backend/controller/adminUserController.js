const express = require("express");
const User  = require("../models/user");
const Build = require("../models/builds");

const getAllUsers = async (req, res) => {
    try {
        const { search } = req.query;

        let filter = {};

        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: "i" } },
                { username: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } }
            ];
        }

        const users = await User.find(filter);

        res.json(users);

    } catch (error) {
        res.status(500).json({ message: "Error fetching users", error: error.message });
    }
};

// Get all builds (with user info populated)
const getAllBuilds = async (req, res) => {
    try {
        const builds = await Build.find()
            .populate("userId", "name username email")
            .sort({ createdAt: -1 });

        res.json(builds);
    } catch (error) {
        res.status(500).json({ message: "Error fetching builds", error: error.message });
    }
};

// Delete a user
const deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ message: "User not found" });
        
        // Delete all builds associated with this user (cascade delete)
        await Build.deleteMany({ userId: user._id });
        
        res.json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting user", error: error.message });
    }
};

// Update a user
const updateUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { returnDocument: "after" });
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json({ message: "User updated successfully", user });
    } catch (error) {
        res.status(500).json({ message: "Error updating user", error: error.message });
    }
};

module.exports = { getAllUsers, getAllBuilds, deleteUser, updateUser };
