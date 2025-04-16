const mongoose = require('mongoose');

const footerSchema = new mongoose.Schema({
    parkHours: {
        type: [
            {
                day: {
                    type: String,
                    required: true,
                },
                hours: {
                    type: String,
                    required: true,
                },
            },
        ],
        validate: {
            validator: (arr) => arr.length > 0,
            message: 'At least one value is required in values list',
        },
    },
    contactInfo: {
        type: [
            {
                type: {
                    type: String,
                    required: true,
                },
                icon: {
                    type: String,
                    required: true,
                },
                value: {
                    type: String,
                    required: true,
                },
            },
        ],
        validate: {
            validator: (arr) => arr.length > 0,
            message: 'At least one value is required in values list',
        },
    },
});

module.exports = mongoose.model('Footer', footerSchema);