const mongoose = require('mongoose');

const guidelineSchema = new mongoose.Schema({
    icon: {
        type: String,
    },
    title: {
        type: String,
    },
    points: {
        type: [String],
        validate: {
            validator: (arr) => arr.length > 0,
            message: 'At least one point is required',
        },
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

// Update updatedAt on save
guidelineSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Guideline', guidelineSchema);