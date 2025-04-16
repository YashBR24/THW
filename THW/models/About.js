// models/About.js
const mongoose = require('mongoose');

const aboutSchema = new mongoose.Schema({
    heroTitle: {
        type: String,
        required: [true, 'Hero title is required'],
        trim: true,
    },
    heroSubtitle: {
        type: String,
        required: [true, 'Hero subtitle is required'],
        trim: true,
    },
    everyoneTitle: {
        type: String,
        required: [true, 'Everyone title is required'],
        trim: true,
    },
    everyoneSubtitle: {
        type: String,
        required: [true, 'Everyone subtitle is required'],
        trim: true,
    },
    everyoneList: {
        type: [String],
        required: [true, 'Everyone list is required'],
        validate: {
            validator: (arr) => arr.length > 0,
            message: 'At least one item is required in everyone list',
        },
    },
    wavePoolTitle: {
        type: String,
        required: [true, 'Wave pool title is required'],
        trim: true,
    },
    wavePoolDescription: {
        type: String,
        required: [true, 'Wave pool description is required'],
        trim: true,
    },
    valuesTitle: {
        type: String,
        required: [true, 'Values title is required'],
        trim: true,
    },
    valuesSubtitle: {
        type: String,
        required: [true, 'Values subtitle is required'],
        trim: true,
    },
    valuesDescription: {
        type: String,
        required: [true, 'Values description is required'],
        trim: true,
    },
    valuesList: {
        type: [
            {
                title: {
                    type: String,
                    required: [true, 'Value title is required'],
                    trim: true,
                },
                description: {
                    type: String,
                    required: [true, 'Value description is required'],
                    trim: true,
                },
                color: {
                    type: String,
                    required: [true, 'Value color is required'],
                    trim: true,
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
        required: [true, 'Slideshow images are required'],
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