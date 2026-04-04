const express = require("express");
const { addPart, getAllParts, updatePart, deletePart } = require("../controller/partsController.js");

const router = express.Router();

router.get("/",       getAllParts);
router.post("/",      addPart);
router.put("/:id",    updatePart);
router.delete("/:id", deletePart);

module.exports = router;