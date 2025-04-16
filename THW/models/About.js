// models/About.js
const mongoose = require('mongoose');

const aboutSchema = new mongoose.Schema({
    heroTitle: {type: String,},
    heroSubtitle: {type: String,},
    everyoneTitle: {type: String,},
    everyoneSubtitle: {type: String,},
    everyoneList: {type: [String],
        validate: {
            validator: (arr) => arr.length > 0,
            message: 'At least one item is required in everyone list',},},
    wavePoolTitle: {type: String},
    wavePoolDescription: {type: String,},
    valuesTitle: {type: String,},
    valuesSubtitle: {type: String,},
    valuesDescription: {type: String,},
    valuesList: {
        type: [
            {
                title: {
                    type: [String]
                },
                description: {
                    type: [String]
                },
                color: {
                    type: [String]
                },
            },
        ],
        required: [true, 'Values list is required'],
        validate: {
            validator: (arr) => arr.length > 0,
            message: 'At least one value is required in values list',
        },
    },
    slideshowImages: {
        type: [String],
        validate: {
            validator: (arr) => arr.length > 0,
            message: 'At least one slideshow image is required',
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

// Ensure only one About document (singleton)
aboutSchema.pre('save', async function (next) {
    if (this.isNew) {
        const count = await this.constructor.countDocuments();
        if (count >= 1) {
            return next(new Error('Only one About document is allowed'));
        }
    }
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('About', aboutSchema);