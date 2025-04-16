// models/DashboardData.js
const mongoose = require('mongoose');

const dashboardDataSchema = new mongoose.Schema({
    heroTagline: {
        type: String,
        required: [true, 'Hero tagline is required'],
        trim: true,
    },
    heroSubtitle: {
        type: String,
        required: [true, 'Hero subtitle is required'],
        trim: true,
    },
    facilitiesTitle: {
        type: String,
        required: [true, 'Facilities title is required'],
        trim: true,
    },
    facilitiesSubtitle: {
        type: String,
        required: [true, 'Facilities subtitle is required'],
        trim: true,
    },
    pricingTitle: {
        type: String,
        required: [true, 'Pricing title is required'],
        trim: true,
    },
    pricingSubtitle: {
        type: String,
        required: [true, 'Pricing subtitle is required'],
        trim: true,
    },
    comboTitle: {
        type: String,
        required: [true, 'Combo title is required'],
        trim: true,
    },
    comboSubtitle: {
        type: String,
        required: [true, 'Combo subtitle is required'],
        trim: true,
    },
    mapTitle: {
        type: String,
        required: [true, 'Map title is required'],
        trim: true,
    },
    mapSubtitle: {
        type: String,
        required: [true, 'Map subtitle is required'],
        trim: true,
    },
    address: {
        type: String,
        required: [true, 'Address is required'],
        trim: true,
    },
    phone: {
        type: String,
        required: [true, 'Phone number is required'],
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        trim: true,
        lowercase: true,
        validate: {
            validator: function (v) {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
            },
            message: 'Please provide a valid email',
        },
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

// Ensure only one dashboard document is created, but allow updates
dashboardDataSchema.pre('save', async function (next) {
    // Only enforce singleton rule for new documents
    if (this.isNew) {
        const count = await this.constructor.countDocuments();
        if (count >= 1) {
            return next(new Error('Only one dashboard document is allowed'));
        }
    }
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('DashboardData', dashboardDataSchema);