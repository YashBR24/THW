// models/DashboardData.js
const mongoose = require('mongoose');

const dashboardDataSchema = new mongoose.Schema({
    heroTagline: {
        type: String,
    },
    heroSubtitle: {
        type: String,
    },
    facilitiesTitle: {
        type: String,
    },
    facilitiesSubtitle: {
        type: String,
    },
    pricingTitle: {
        type: String,
    },
    pricingSubtitle: {
        type: String,
    },
    comboTitle: {
        type: String,
    },
    comboSubtitle: {
        type: String,
    },
    mapTitle: {
        type: String,
    },
    mapSubtitle: {
        type: String,
    },
    address: {
        type: String,
    },
    phone: {
        type: String,
    },
    email: {
        type: String,
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