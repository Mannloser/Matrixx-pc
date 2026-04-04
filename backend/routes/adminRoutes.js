const express = require("express");
const { getAllUsers, getAllBuilds, deleteUser, updateUser } = require("../controller/adminUserController");
const { getAllPrebuilds, createPrebuilds, updatePrebuilds, deletePrebuilds, incrementPrebuildsUse } = require("../controller/adminPrebuildsController");
const { auth, adminOnly } = require("../middleware/auth");
const router = express.Router();

// ── Public routes (no auth needed) ──
router.get("/prebuilds", getAllPrebuilds);
router.patch("/prebuilds/:id/use", incrementPrebuildsUse);

// ── All routes below require valid token AND admin role ──
router.use(auth, adminOnly);

// Users routes
router.get("/users", getAllUsers);
router.delete("/users/:id", deleteUser);
router.put("/users/:id", updateUser);

// Builds routes
router.get("/builds", getAllBuilds);

// Prebuilds admin routes (create, update, delete)
router.post("/prebuilds", createPrebuilds);
router.put("/prebuilds/:id", updatePrebuilds);
router.delete("/prebuilds/:id", deletePrebuilds);

module.exports = router;
