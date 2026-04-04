const express = require("express");
const {
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
} = require("../controller/profileController");
const { auth } = require("../middleware/auth");

const router = express.Router();

/* ── User Profile Routes ── */
router.get("/my-profile", auth, getUserProfile);
router.put("/update-profile", auth, updateUserProfile);
router.post("/change-password", auth, changePassword);
router.delete("/delete-account", auth, deleteAccount);

/* ── Builds Routes ── */
router.get("/my-builds", auth, getUserBuilds);
router.post("/create-build", auth, createBuild);
router.put("/update-build/:buildId", auth, updateBuild);
router.delete("/delete-build/:buildId", auth, deleteBuild);

/* ── Sharing Routes ── */
router.patch("/share-build/:buildId", auth, shareBuild);  // mark as public
router.get("/build/:buildId", getPublicBuild);             // public — no auth needed

module.exports = router;
