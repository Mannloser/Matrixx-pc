const Parts = require('../models/parts');

// Create a new part
const addPart = async (req, res) => {
    try {
        const product = await Parts.create(req.body);
        res.json({
            message: "Part added successfully",
            part: product
        })
    } catch (error) {
        res.status(400).json({ message: "Error adding part", error: error.message });
    }
}

// Get all parts
const getAllParts = async (req, res) => {
    try {
        const { search, category } = req.query;
        const filter = {};
        if (category) {
            filter.category = category;
        }
        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: "i" } },
                { brand: { $regex: search, $options: "i" } }
            ];
        }
        const parts = await Parts.find(filter);
        res.json(parts);
    } catch (error) {
        res.status(500).json({ message: "Error fetching parts", error: error.message });
    }
}

//update a part
const updatePart = async (req, res) => {
    try {
        const part = await Parts.findByIdAndUpdate(req.params.id, req.body, { returnDocument: "after" });
        if (!part) return res.status(404).json({ message: "Part not found" });
        res.json({ message: "Part updated successfully", part });
    } catch (error) {
        res.status(500).json({ message: "Error updating part", error: error.message });
    }
};

//delete a part
const deletePart = async (req, res) => {
    try {
        const part = await Parts.findByIdAndDelete(req.params.id);
        if (!part) return res.status(404).json({ message: "Part not found" });
        res.json({ message: "Part deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting part", error: error.message });
    }
};

module.exports = {addPart, getAllParts, updatePart, deletePart};