const mongoose = require("mongoose");

const buildSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: ""
    },
    parts: {
        type: {
            cpu: mongoose.Schema.Types.ObjectId,
            gpu: mongoose.Schema.Types.ObjectId,
            motherboard: mongoose.Schema.Types.ObjectId,
            memory: mongoose.Schema.Types.ObjectId,
            storage_primary: mongoose.Schema.Types.ObjectId,
            storage_secondary: mongoose.Schema.Types.ObjectId,
            cpu_cooler: mongoose.Schema.Types.ObjectId,
            psu: mongoose.Schema.Types.ObjectId,
            case: mongoose.Schema.Types.ObjectId,
        },
        default: {}
    },
    totalPrice: {
        type: Number,
        default: 0
    },
    totalWattage: {
        type: Number,
        default: 0
    },
    isPublic: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Build', buildSchema);
