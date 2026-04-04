const Prebuilds = require("../models/prebuilds");
const Parts = require("../models/parts");

const getAllPrebuilds = async (req, res) => {
    try {
        const prebuilds = await Prebuilds.find()
            .populate([
                { path: "parts.cpu" },
                { path: "parts.gpu" },
                { path: "parts.motherboard" },
                { path: "parts.memory" },
                { path: "parts.storage_primary" },
                { path: "parts.storage_secondary" },
                { path: "parts.cpu_cooler" },
                { path: "parts.psu" },
                { path: "parts.case" }
            ])
            .sort({ createdAt: -1 });
        res.json(prebuilds);
    } catch (error) {
        res.status(500).json({ message: "Error fetching prebuilds", error: error.message });
    }
};

const createPrebuilds = async (req, res) => {
    try {
        const { name, category, tier, tierClass, price, emoji, tagline,
                accentColor, tags, pros, perfTargets, parts: partIds } = req.body;

        if (!name) return res.status(400).json({ message: "Name is required" });

        let totalPrice = 0;
        let totalWattage = 0;

        if (partIds) {
            for (const [key, partId] of Object.entries(partIds)) {
                if (partId) {
                    const part = await Parts.findById(partId);
                    if (!part) return res.status(400).json({ message: `Part ${key} not found` });
                    totalPrice    += part.price   || 0;
                    totalWattage  += part.watts    || 0;
                }
            }
        }

        const prebuild = new Prebuilds({
            name, category, tier, tierClass, price, emoji, tagline,
            accentColor, tags, pros, perfTargets,
            parts: partIds || {},
            totalPrice, totalWattage, builds: 0
        });

        await prebuild.save();

        const populated = await Prebuilds.findById(prebuild._id).populate([
            { path: "parts.cpu" }, { path: "parts.gpu" }, { path: "parts.motherboard" },
            { path: "parts.memory" }, { path: "parts.storage_primary" }, { path: "parts.storage_secondary" },
            { path: "parts.cpu_cooler" }, { path: "parts.psu" }, { path: "parts.case" }
        ]);

        res.status(201).json({ message: "Prebuild created successfully", prebuilds: populated });
    } catch (error) {
        res.status(500).json({ message: "Error creating prebuild", error: error.message });
    }
};

const updatePrebuilds = async (req, res) => {
    try {
        const { name, category, tier, tierClass, price, emoji, tagline,
                accentColor, tags, pros, perfTargets, parts: partIds } = req.body;

        let totalPrice = 0;
        let totalWattage = 0;

        if (partIds) {
            for (const [key, partId] of Object.entries(partIds)) {
                if (partId) {
                    const part = await Parts.findById(partId);
                    if (!part) return res.status(400).json({ message: `Part ${key} not found` });
                    totalPrice   += part.price || 0;
                    totalWattage += part.watts  || 0;
                }
            }
        }

        const prebuild = await Prebuilds.findByIdAndUpdate(req.params.id, {
            name, category, tier, tierClass, price, emoji, tagline,
            accentColor, tags, pros, perfTargets,
            parts: partIds || {},
            totalPrice, totalWattage
        }, { new: true }).populate([
            { path: "parts.cpu" }, { path: "parts.gpu" }, { path: "parts.motherboard" },
            { path: "parts.memory" }, { path: "parts.storage_primary" }, { path: "parts.storage_secondary" },
            { path: "parts.cpu_cooler" }, { path: "parts.psu" }, { path: "parts.case" }
        ]);

        if (!prebuild) return res.status(404).json({ message: "Prebuild not found" });
        res.json({ message: "Prebuild updated successfully", prebuilds: prebuild });
    } catch (error) {
        res.status(500).json({ message: "Error updating prebuild", error: error.message });
    }
};

const deletePrebuilds = async (req, res) => {
    try {
        const prebuilds = await Prebuilds.findByIdAndDelete(req.params.id);
        if (!prebuilds) return res.status(404).json({ message: "Prebuilds not found" });
        res.json({ message: "Prebuilds deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting prebuilds", error: error.message });
    }
};

const incrementPrebuildsUse = async (req, res) => {
    try {
        const prebuild = await Prebuilds.findByIdAndUpdate(
            req.params.id,
            { $inc: { builds: 1 } },
            { new: true }
        );
        if (!prebuild) return res.status(404).json({ message: "Prebuild not found" });
        res.json({ builds: prebuild.builds });
    } catch (error) {
        res.status(500).json({ message: "Error updating build count", error: error.message });
    }
};

module.exports = { getAllPrebuilds, createPrebuilds, updatePrebuilds, deletePrebuilds, incrementPrebuildsUse };
