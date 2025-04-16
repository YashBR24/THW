// models/Attraction.js
const mongoose = require('mongoose');

const attractionSchema = new mongoose.Schema({
    title: {
        type: String,
    },
    description: {
        type: String,
    },
    image: {
        type: String,
    },
    features: {
        type: [String],
        validate: {
            validator: (arr) => arr.length > 0,
            message: 'At least one feature is required',
        },
    },
    icon: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

// Update `updatedAt` on save
attractionSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Attraction', attractionSchema);