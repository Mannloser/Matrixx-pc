const express = require("express");
const router = express.Router();
const { getAllPrebuilds } = require("../controller/adminPrebuildsController");

// Public route (no auth)
router.get("/", getAllPrebuilds);

module.exports = router;