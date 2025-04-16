// models/Attraction.js
const mongoose = require('mongoose');

const attractionSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true,
        minlength: [3, 'Title must be at least 3 characters long'],
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        trim: true,
        minlength: [10, 'Description must be at least 10 characters long'],
    },
    image: {
        type: String,
        required: [true, 'Image is required'],
        trim: true,
    },
    features: {
        type: [String],
        required: [true, 'Features are required'],
        validate: {
            validator: (arr) => arr.length > 0,
            message: 'At least one feature is required',
        },
    },
    icon: {
        type: String,
        required: [true, 'Icon is required'],
        trim: true,
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