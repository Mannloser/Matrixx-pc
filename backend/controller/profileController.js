const User = require("../models/user");
const Build = require("../models/builds");
const bcrypt = require("bcryptjs");

/* ── Get User Profile ── */
const getUserProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).select("-password");
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Get build stats
        const builds = await Build.find({ userId });
        const buildsCreated = builds.length;
        const totalBuildValue = builds.reduce((sum, build) => sum + (build.totalPrice || 0), 0);
        
        // Mock stats (you can expand this later)
        const stats = {
            buildsCreated,
            partsSaved: 12,
            guidesRead: 7,
            totalBuildValue,
        };

        res.json({
            user: {
                id:        user._id,
                name:      user.name,
                username:  user.username,
                email:     user.email,
                bio:       user.bio,
                role:      user.role,
                createdAt: user.createdAt,
            },
            stats,
        });
    } catch (error) {
        console.error("Error fetching profile:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

/* ── Update User Profile ── */
const updateUserProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const { name, username, email, bio, avatar } = req.body;

        const user = await User.findByIdAndUpdate(
            userId,
            { name, username, email, bio },
            { new: true }
        ).select("-password");

        res.json({
            message: "Profile updated successfully",
            user: {
                id:        user._id,
                name:      user.name,
                username:  user.username,
                email:     user.email,
                bio:       user.bio,
                role:      user.role,
                createdAt: user.createdAt,
            },
        });
    } catch (error) {
        console.error("Error updating profile:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

/* ── Change Password ── */
const changePassword = async (req, res) => {
    try {
        const userId = req.user.id;
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ message: "Current and new passwords are required" });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Verify current password
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Current password is incorrect" });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        res.json({ message: "Password changed successfully" });
    } catch (error) {
        console.error("Error changing password:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

/* ── Get User's Builds ── */
const getUserBuilds = async (req, res) => {
    try {
        const userId = req.user.id;
        
        console.log("📋 Fetching builds for user:", userId);
        
        const builds = await Build.find({ userId }).sort({ createdAt: -1 });

        console.log(`✅ Found ${builds.length} builds in database`);
        console.log("Builds:", builds);

        // Only count/include these known part slot keys
        const PART_KEYS = [
            "cpu", "gpu", "motherboard", "memory",
            "storage_primary", "storage_secondary",
            "cpu_cooler", "psu", "case"
        ];

        const formattedBuilds = builds.map((build) => {
            const partsObj = build.parts?.toObject?.() ?? build.parts ?? {};

            // Build a clean map of { slotKey: partId } for slots that are filled
            const filledParts = {};
            PART_KEYS.forEach(key => {
                const val = partsObj[key];
                if (val) filledParts[key] = val.toString();
            });

            return {
                _id:          build._id,
                id:           build._id,
                name:         build.name,
                totalPrice:   build.totalPrice,
                totalWattage: build.totalWattage,
                partsCount:   Object.keys(filledParts).length,
                parts:        filledParts,   // { cpu: "id123", gpu: "id456", ... }
                createdAt:    build.createdAt,
                components:   Object.keys(filledParts).map(key =>
                    key.split('_')
                       .map(w => w.charAt(0).toUpperCase() + w.slice(1))
                       .join(' ')
                ),
            };
        });

        res.json(formattedBuilds);
    } catch (error) {
        console.error("❌ Error fetching builds:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

/* ── Create Build ── */
const createBuild = async (req, res) => {
    try {
        const userId = req.user.id;
        const { name, description, parts, totalPrice, totalWattage } = req.body;

        console.log("📝 Creating build...");
        console.log("User ID:", userId);
        console.log("Build data received:", { name, description, parts, totalPrice, totalWattage });

        if (!name) {
            return res.status(400).json({ message: "Build name is required" });
        }

        const newBuild = new Build({
            userId,
            name,
            description,
            parts: parts || {},
            totalPrice: totalPrice || 0,
            totalWattage: totalWattage || 0,
        });

        console.log("Build object created:", newBuild);

        await newBuild.save();
        
        console.log("✅ Build saved successfully to database");
        console.log("Saved Build ID:", newBuild._id);

        res.status(201).json({
            message: "Build created successfully",
            build: newBuild,
        });
    } catch (error) {
        console.error("❌ Error creating build:", error);
        console.error("Error stack:", error.stack);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

/* ── Update Build ── */
const updateBuild = async (req, res) => {
    try {
        const userId = req.user.id;
        const { buildId } = req.params;
        const { name, description, parts, totalPrice, totalWattage } = req.body;

        const build = await Build.findOne({ _id: buildId, userId });
        if (!build) {
            return res.status(404).json({ message: "Build not found" });
        }

        if (name) build.name = name;
        if (description) build.description = description;
        if (parts) build.parts = parts;
        if (totalPrice !== undefined) build.totalPrice = totalPrice;
        if (totalWattage !== undefined) build.totalWattage = totalWattage;

        await build.save();
        res.json({
            message: "Build updated successfully",
            build,
        });
    } catch (error) {
        console.error("Error updating build:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

/* ── Delete Build ── */
const deleteBuild = async (req, res) => {
    try {
        const userId = req.user.id;
        const { buildId } = req.params;

        console.log("🗑️ Deleting build:", buildId, "for user:", userId);

        const build = await Build.findOneAndDelete({ _id: buildId, userId });
        if (!build) {
            console.warn("⚠️ Build not found:", buildId);
            return res.status(404).json({ message: "Build not found" });
        }

        console.log("✅ Build deleted successfully");
        res.json({ message: "Build deleted successfully" });
    } catch (error) {
        console.error("❌ Error deleting build:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

/* ── Delete Account ── */
const deleteAccount = async (req, res) => {
    try {
        const userId = req.user.id;

        console.log("🗑️ Deleting account for user:", userId);

        // Delete all builds first
        await Build.deleteMany({ userId });
        console.log("✅ Deleted all builds for user");

        // Delete user account
        const user = await User.findByIdAndDelete(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        console.log("✅ Account deleted successfully");
        res.json({ message: "Account deleted successfully" });
    } catch (error) {
        console.error("❌ Error deleting account:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

/* ── Make Build Public (for sharing) ── */
const shareBuild = async (req, res) => {
    try {
        const userId  = req.user.id;
        const { buildId } = req.params;

        const build = await Build.findOne({ _id: buildId, userId });
        if (!build) return res.status(404).json({ message: "Build not found" });

        build.isPublic = true;
        await build.save();

        res.json({ message: "Build is now public", buildId: build._id });
    } catch (error) {
        console.error("Error sharing build:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

/* ── Get a Single Public Build by ID (no auth — anyone with the link can view) ── */
const getPublicBuild = async (req, res) => {
    try {
        const { buildId } = req.params;

        const build = await Build.findById(buildId);
        if (!build)            return res.status(404).json({ message: "Build not found" });
        if (!build.isPublic)   return res.status(403).json({ message: "This build is private" });

        // Return the parts map as plain IDs so the builder can pre-fill
        const partsObj = build.parts?.toObject?.() ?? build.parts ?? {};
        const PART_KEYS = ["cpu","gpu","motherboard","memory","storage_primary","storage_secondary","cpu_cooler","psu","case"];
        const parts = {};
        PART_KEYS.forEach(key => {
            if (partsObj[key]) parts[key] = partsObj[key].toString();
        });

        res.json({
            _id:        build._id,
            name:       build.name,
            totalPrice: build.totalPrice,
            parts,
        });
    } catch (error) {
        console.error("Error fetching public build:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports = {
    getUserProfile,
    updateUserProfile,
    changePassword,
    getUserBuilds,
    createBuild,
    updateBuild,
    deleteBuild,
    deleteAccount,
    shareBuild,
    getPublicBuild,
};