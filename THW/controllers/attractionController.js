const mongoose = require('mongoose');
const Attraction = require('../models/Attraction');
const {logger} = require('../utils/Enc_Dec');
const path = require('path');
const fs = require('fs').promises;

const saveAttraction = async (req, res) => {
    try {
        logger.info(`Save attraction request received - File type: ${req.file ? req.file.mimetype : 'none'}`);
        const { title, description, features, icon } = req.body;

        // Validate required fields
        if (!title || !description || !features || !icon) {
            logger.warn(`Missing required fields - File type: ${req.file ? req.file.mimetype : 'none'}`);
            return res.status(400).json({
                success: false,
                message: 'All fields (title, description, features, icon) are required',
            });
        }

        // Validate features as an array
        let parsedFeatures;
        try {
            parsedFeatures = Array.isArray(features) ? features : JSON.parse(features);
            if (!Array.isArray(parsedFeatures) || parsedFeatures.length === 0) {
                throw new Error('Features must be a non-empty array');
            }
        } catch (error) {
            logger.warn(`Invalid features format: ${error.message} - File type: ${req.file ? req.file.mimetype : 'none'}`);
            return res.status(400).json({
                success: false,
                message: 'Features must be a non-empty array of strings',
            });
        }

        // Validate image upload
        if (!req.file) {
            logger.warn('No image uploaded');
            return res.status(400).json({
                success: false,
                message: 'Image is required',
            });
        }

        // Get the next image number
        const uploadDir = path.join(__dirname, '../public/uploads');
        const files = await fs.readdir(uploadDir).catch(() => []);
        const imageCount = files.filter((file) => file.startsWith('img_')).length + 1;
        const imageExt = path.extname(req.file.originalname);
        const newImageName = `img_${imageCount}${imageExt}`;
        const newImagePath = path.join(uploadDir, newImageName);

        // Move the uploaded file to the final location
        await fs.rename(req.file.path, newImagePath);

        // Save attraction to database
        const attraction = await Attraction.create({
            title,
            description,
            image: `uploads/${newImageName}`,
            features: parsedFeatures,
            icon,
        });

        logger.info(`Attraction saved successfully: ${attraction._id} - File type: ${req.file.mimetype}`);
        res.status(201).json({
            success: true,
            message: 'Attraction saved successfully',
            data: attraction,
        });
    } catch (error) {
        logger.error(`Error saving attraction: ${error.message} - File type: ${req.file ? req.file.mimetype : 'none'}`);
        if (req.file) {
            // Clean up uploaded file on error
            await fs.unlink(req.file.path).catch(() => {});
        }
        res.status(500).json({
            success: false,
            message: 'Error saving attraction',
            error: error.message,
        });
    }
};

const getAttractions = async (req, res) => {
    try {
        logger.info('Get attractions request received');
        const attractions = await Attraction.find().sort({ createdAt: -1 });

        // Add full image URL to each attraction
        // const baseUrl = process.env.BASE_URL || 'http://localhost:5000';
        const attractionsWithImageUrls = attractions.map((attraction) => ({
            ...attraction._doc,
            image: attraction.image ? `${attraction.image}` : null,
        }));

        logger.info(`Retrieved ${attractions.length} attractions with image URLs`);
        res.status(200).json({
            success: true,
            count: attractionsWithImageUrls.length,
            data: attractionsWithImageUrls,
        });
    } catch (error) {
        logger.error(`Error fetching attractions: ${error.message}`);
        res.status(500).json({
            success: false,
            message: 'Error fetching attractions',
            error: error.message,
        });
    }
};

const updateAttraction = async (req, res) => {
    try {
        logger.info(`Update attraction request received - File type: ${req.file ? req.file.mimetype : 'none'}`);
        const { id } = req.params;
        const { title, description, features, icon } = req.body;

        // Validate MongoDB ID
        if (!mongoose.Types.ObjectId.isValid(id)) {
            logger.warn(`Invalid attraction ID: ${id} - File type: ${req.file ? req.file.mimetype : 'none'}`);
            return res.status(400).json({
                success: false,
                message: 'Invalid attraction ID',
            });
        }

        // Validate at least one field is provided
        if (!title && !description && !features && !icon && !req.file) {
            logger.warn(`No fields provided for update - File type: ${req.file ? req.file.mimetype : 'none'}`);
            return res.status(400).json({
                success: false,
                message: 'At least one field must be provided to update',
            });
        }

        // Validate features if provided
        let parsedFeatures;
        if (features) {
            try {
                parsedFeatures = Array.isArray(features) ? features : JSON.parse(features);
                if (!Array.isArray(parsedFeatures) || parsedFeatures.length === 0) {
                    throw new Error('Features must be a non-empty array');
                }
            } catch (error) {
                logger.warn(`Invalid features format: ${error.message} - File type: ${req.file ? req.file.mimetype : 'none'}`);
                return res.status(400).json({
                    success: false,
                    message: 'Features must be a non-empty array of strings',
                });
            }
        }

        // Prepare update object
        const updates = {};
        if (title) updates.title = title;
        if (description) updates.description = description;
        if (parsedFeatures) updates.features = parsedFeatures;
        if (icon) updates.icon = icon;
        updates.updatedAt = Date.now();

        console.log(updates);

        // Handle image update if provided
        if (req.file) {
            const uploadDir = path.join(__dirname, '../public/uploads');
            const files = await fs.readdir(uploadDir).catch(() => []);
            const imageCount = files.filter((file) => file.startsWith('img_')).length + 1;
            const imageExt = path.extname(req.file.originalname);
            const newImageName = `img_${imageCount}${imageExt}`;
            const newImagePath = path.join(uploadDir, newImageName);

            // Move the uploaded file
            await fs.rename(req.file.path, newImagePath);
            updates.image = `uploads/${newImageName}`;
        }

        // Update attraction
        logger.info(`Updating attraction with ID: ${id} - File type: ${req.file ? req.file.mimetype : 'none'}`);
        const attraction = await Attraction.findByIdAndUpdate(id, updates, {
            new: true,
            runValidators: true,
        });

        if (!attraction) {
            logger.warn(`Attraction not found for ID: ${id} - File type: ${req.file ? req.file.mimetype : 'none'}`);
            if (req.file) {
                // Clean up uploaded file on error
                await fs.unlink(path.join(__dirname, `../public/${updates.image}`)).catch(() => {});
            }
            return res.status(404).json({
                success: false,
                message: 'Attraction not found',
            });
        }

        // Add full image URL to response
        // const baseUrl = process.env.BASE_URL;
        const attractionWithImageUrl = {
            ...attraction._doc,
            image: attraction.image ? `${attraction.image}` : null,
        };

        logger.info(`Attraction updated successfully: ${attraction._id} - File type: ${req.file ? req.file.mimetype : 'none'}`);
        res.status(200).json({
            success: true,
            message: 'Attraction updated successfully',
            data: attractionWithImageUrl,
        });
    } catch (error) {
        logger.error(`Error updating attraction: ${error.message} - File type: ${req.file ? req.file.mimetype : 'none'}`);
        if (req.file) {
            // Clean up uploaded file on error
            await fs.unlink(req.file.path).catch(() => {});
        }
        res.status(500).json({
            success: false,
            message: 'Error updating attraction',
            error: error.message,
        });
    }
};

const deleteAttraction = async (req, res) => {
    try {
        logger.info('Delete attraction request received');
        const { id } = req.params;

        // Validate MongoDB ID
        if (!mongoose.Types.ObjectId.isValid(id)) {
            logger.warn(`Invalid attraction ID: ${id}`);
            return res.status(400).json({
                success: false,
                message: 'Invalid attraction ID',
            });
        }

        // Find and delete attraction
        logger.info(`Deleting attraction with ID: ${id}`);
        const attraction = await Attraction.findByIdAndDelete(id);

        if (!attraction) {
            logger.warn(`Attraction not found for ID: ${id}`);
            return res.status(404).json({
                success: false,
                message: 'Attraction not found',
            });
        }

        // Delete associated image
        if (attraction.image) {
            const imagePath = path.join(__dirname, '../public', attraction.image);
            await fs.unlink(imagePath).catch((err) => logger.warn(`Failed to delete image: ${err.message}`));
        }

        logger.info(`Attraction deleted successfully: ${id}`);
        res.status(200).json({
            success: true,
            message: 'Attraction deleted successfully',
        });
    } catch (error) {
        logger.error(`Error deleting attraction: ${error.message}`);
        res.status(500).json({
            success: false,
            message: 'Error deleting attraction',
            error: error.message,
        });
    }
};

module.exports = { saveAttraction, deleteAttraction, updateAttraction, getAttractions };