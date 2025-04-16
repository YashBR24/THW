const mongoose = require('mongoose');

const footerSchema = new mongoose.Schema({
    parkHours: {
        type: [
            {
                day: {
                    type: String,
                },
                hours: {
                    type: String,
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
                },
                icon: {
                    type: String,
                },
                value: {
                    type: String,
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