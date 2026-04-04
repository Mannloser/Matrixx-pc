const mongoose = require('mongoose');

const partsSchema = new mongoose.Schema({
    category: {
        type: String, required: true,
        enum: ["CPU", "GPU", "Motherboard", "Memory", "Storage", "CPU Cooler", "PSU", "Case"]
    },
    name:   { type: String, required: true },
    brand:  { type: String, required: true },
    series: { type: String },
    price:  { type: Number, required: true },
    watts:  { type: Number },
    tag:    { type: String },
    specs:  { type: mongoose.Schema.Types.Mixed }

    // specs stores category-specific fields:
    // CPU:         { cores, clock, socket, tdp }
    // GPU:         { vram, boost, tdp }
    // RAM:         { capacity, speed, cl }
    // Storage:     { capacity, type, read, write }
    // Motherboard: { socket, chipset, formFactor, ddr }
    // Case:        { formFactor, color, psu }
    // Cooler:      { type, tdpRating, size }
    // PSU:         { wattage, rating, modular }
}, { timestamps: true });

module.exports = mongoose.model('Parts', partsSchema);