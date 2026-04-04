const mongoose = require("mongoose");

const prebuildsSchema = new mongoose.Schema({
    name:     { type: String, required: true },
    category: { type: String, enum: ["Gaming", "Workstation", "Streaming", "Budget"], default: "Gaming" },
    tier:     { type: String, enum: ["Entry", "Mid", "High"], default: "Entry" },
    tierClass:{ type: String, default: "entry" },
    price:    { type: String, required: true },
    emoji:    { type: String, default: "🖥️" },
    tagline:  { type: String, default: "" },
    accentColor: { type: String, default: "#3b82f6" },
    tags:     [{ type: String }],
    pros:     [{ type: String }],
    perfTargets: [{
        label: { type: String },
        value: { type: String }
    }],
    parts: {
        type: {
            cpu:              { type: mongoose.Schema.Types.ObjectId, ref: "Parts" },
            gpu:              { type: mongoose.Schema.Types.ObjectId, ref: "Parts" },
            motherboard:      { type: mongoose.Schema.Types.ObjectId, ref: "Parts" },
            memory:           { type: mongoose.Schema.Types.ObjectId, ref: "Parts" },
            storage_primary:  { type: mongoose.Schema.Types.ObjectId, ref: "Parts" },
            storage_secondary:{ type: mongoose.Schema.Types.ObjectId, ref: "Parts" },
            cpu_cooler:       { type: mongoose.Schema.Types.ObjectId, ref: "Parts" },
            psu:              { type: mongoose.Schema.Types.ObjectId, ref: "Parts" },
            case:             { type: mongoose.Schema.Types.ObjectId, ref: "Parts" },
        },
        default: {}
    },
    totalPrice:   { type: Number, default: 0 },
    totalWattage: { type: Number, default: 0 },
    builds:       { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Prebuilds', prebuildsSchema);