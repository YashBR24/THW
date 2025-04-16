const mongoose = require('mongoose');
const About = require('../models/About');
const { logger } = require('../utils/Enc_Dec');
const path = require('path');
const fs = require('fs').promises;

const saveAbout = async (req, res) => {
    try {
        logger.info('Save About request received');
        const {
            heroTitle,
            heroSubtitle,
            everyoneTitle,
            everyoneSubtitle,
            everyoneList,
            wavePoolTitle,
            wavePoolDescription,
            valuesTitle,
            valuesSubtitle,
            valuesDescription,
            valuesList,
        } = req.body;

        // Validate required text fields
        const requiredFields = [
            'heroTitle',
            'heroSubtitle',
            'everyoneTitle',
            'everyoneSubtitle',
            'everyoneList',
            'wavePoolTitle',
            'wavePoolDescription',
            'valuesTitle',
            'valuesSubtitle',
            'valuesDescription',
            'valuesList',
        ];
        for (const field of requiredFields) {
            if (!req.body[field]) {
                logger.warn(`Missing required field: ${field}`);
                return res.status(400).json({
                    success: false,
                    message: `Missing required field: ${field}`,
                });
            }
        }

        // Parse and validate arrays
        let parsedEveryoneList, parsedValuesList;
        try {
            parsedEveryoneList = Array.isArray(everyoneList) ? everyoneList : JSON.parse(everyoneList);
            if (!Array.isArray(parsedEveryoneList) || parsedEveryoneList.length === 0) {
                throw new Error('everyoneList must be a non-empty array');
            }
        } catch (error) {
            logger.warn(`Invalid everyoneList format: ${error.message}`);
            return res.status(400).json({
                success: false,
                message: 'everyoneList must be a non-empty array of strings',
            });
        }

        try {
            parsedValuesList = Array.isArray(valuesList) ? valuesList : JSON.parse(valuesList);
            if (!Array.isArray(parsedValuesList) || parsedValuesList.length === 0) {
                throw new Error('valuesList must be a non-empty array');
            }
            for (const value of parsedValuesList) {
                if (!value.title || !value.description || !value.color) {
                    throw new Error('Each value must have title, description, and color');
                }
            }
        } catch (error) {
            logger.warn(`Invalid valuesList format: ${error.message}`);
            return res.status(400).json({
                success: false,
                message: 'valuesList must be a non-empty array of objects with title, description, and color',
            });
        }

        // Handle image uploads
        let slideshowImages = [];
        if (req.files && req.files.length > 0) {
            const uploadDir = path.join(__dirname, '../public/uploads/about');

            // Rename and move images
            for (let i = 0; i < req.files.length; i++) {
                const file = req.files[i];
                // Verify temporary file exists
                try {
                    await fs.access(file.path);
                } catch (error) {
                    logger.error(`Temporary file not found: ${file.path}`);
                    throw new Error(`Temporary file not found: ${file.originalname}`);
                }

                const imageExt = path.extname(file.originalname);
                const newImageName = `about_id_${Date.now()}_${imageExt}`;
                const newImagePath = path.join(uploadDir, newImageName);

                await fs.rename(file.path, newImagePath);
                slideshowImages.push(`uploads/about/${newImageName}`);
            }
        } else {
            logger.warn('No slideshow images uploaded');
            return res.status(400).json({
                success: false,
                message: 'At least one slideshow image is required',
            });
        }

        // Prepare data
        const data = {
            heroTitle,
            heroSubtitle,
            everyoneTitle,
            everyoneSubtitle,
            everyoneList: parsedEveryoneList,
            wavePoolTitle,
            wavePoolDescription,
            valuesTitle,
            valuesSubtitle,
            valuesDescription,
            valuesList: parsedValuesList,
            slideshowImages,
            updatedAt: Date.now(),
        };

        // Check for existing document
        const existingAbout = await About.findOne();
        let about;

        if (existingAbout) {
            // Delete old images
            if (existingAbout.slideshowImages && existingAbout.slideshowImages.length > 0) {
                for (const imagePath of existingAbout.slideshowImages) {
                    const fullPath = path.join(__dirname, '../public', imagePath);
                    await fs.unlink(fullPath).catch((err) =>
                        logger.warn(`Failed to delete old image: ${err.message}`)
                    );
                }
            }

            // Update existing document
            logger.info(`Updating About document with ID: ${existingAbout._id}`);
            about = await About.findByIdAndUpdate(existingAbout._id, data, {
                new: true,
                runValidators: true,
            });
        } else {
            // Create new document
            logger.info('Creating new About document');
            about = await About.create(data);
        }

        // Add full image URLs to response
        const baseUrl = process.env.BASE_URL || 'http://localhost:5000';
        const aboutWithImageUrls = {
            ...about._doc,
            slideshowImages: about.slideshowImages.map((img) => `${img}`),
        };

        logger.info(`About saved successfully: ${about._id}`);
        res.status(200).json({
            success: true,
            message: 'About data saved successfully',
            data: aboutWithImageUrls,
        });
    } catch (error) {
        logger.error(`Error saving About data: ${error.message}`);
        // Clean up uploaded files on error
        if (req.files) {
            for (const file of req.files) {
                await fs.unlink(file.path).catch(() => {});
            }
        }
        res.status(400).json({
            success: false,
            message: 'Error saving About data',
            error: error.message,
        });
    }
};

const getAbout = async (req, res) => {
    try {
        logger.info('Get About request received');
        const about = await About.findOne();

        if (!about) {
            logger.warn('No About data found');
            return res.status(404).json({
                success: false,
                message: 'No About data found',
            });
        }

        // Add full image URLs to response
        const baseUrl = process.env.BASE_URL || 'http://localhost:5000';
        const aboutWithImageUrls = {
            ...about._doc,
            slideshowImages: about.slideshowImages.map((img) => `${img}`),
        };

        logger.info(`About retrieved successfully: ${about._id}`);
        res.status(200).json({
            success: true,
            data: aboutWithImageUrls,
        });
    } catch (error) {
        logger.error(`Error fetching About data: ${error.message}`);
        res.status(500).json({
            success: false,
            message: 'Error fetching About data',
            error: error.message,
        });
    }
};

const editAbout = async (req, res) => {
    try {
        logger.info('Edit About request received');
        const {
            heroTitle,
            heroSubtitle,
            everyoneTitle,
            everyoneSubtitle,
            everyoneList,
            wavePoolTitle,
            wavePoolDescription,
            valuesTitle,
            valuesSubtitle,
            valuesDescription,
            valuesList,
            imagesToRemove,
        } = req.body;

        // Prepare update object
        const updates = {};
        if (heroTitle) updates.heroTitle = heroTitle;
        if (heroSubtitle) updates.heroSubtitle = heroSubtitle;
        if (everyoneTitle) updates.everyoneTitle = everyoneTitle;
        if (everyoneSubtitle) updates.everyoneSubtitle = everyoneSubtitle;
        if (wavePoolTitle) updates.wavePoolTitle = wavePoolTitle;
        if (wavePoolDescription) updates.wavePoolDescription = wavePoolDescription;
        if (valuesTitle) updates.valuesTitle = valuesTitle;
        if (valuesSubtitle) updates.valuesSubtitle = valuesSubtitle;
        if (valuesDescription) updates.valuesDescription = valuesDescription;
        updates.updatedAt = Date.now();

        // Validate and parse everyoneList if provided
        if (everyoneList) {
            try {
                const parsedEveryoneList = Array.isArray(everyoneList)
                    ? everyoneList
                    : JSON.parse(everyoneList);
                if (!Array.isArray(parsedEveryoneList) || parsedEveryoneList.length === 0) {
                    throw new Error('everyoneList must be a non-empty array');
                }
                updates.everyoneList = parsedEveryoneList;
            } catch (error) {
                logger.warn(`Invalid everyoneList format: ${error.message}`);
                return res.status(400).json({
                    success: false,
                    message: 'everyoneList must be a non-empty array of strings',
                });
            }
        }

        // Validate and parse valuesList if provided
        if (valuesList) {
            try {
                const parsedValuesList = Array.isArray(valuesList) ? valuesList : JSON.parse(valuesList);
                if (!Array.isArray(parsedValuesList) || parsedValuesList.length === 0) {
                    throw new Error('valuesList must be a non-empty array');
                }
                for (const value of parsedValuesList) {
                    if (!value.title || !value.description || !value.color) {
                        throw new Error('Each value must have title, description, and color');
                    }
                }
                updates.valuesList = parsedValuesList;
            } catch (error) {
                logger.warn(`Invalid valuesList format: ${error.message}`);
                return res.status(400).json({
                    success: false,
                    message: 'valuesList must be a non-empty array of objects with title, description, and color',
                });
            }
        }

        // Find existing About document
        const about = await About.findOne();
        if (!about) {
            logger.warn('No About data found to update');
            return res.status(400).json({
                success: false,
                message: 'No About data found to update',
            });
        }

        // Handle image removals
        let slideshowImages = [...about.slideshowImages];
        if (imagesToRemove) {
            let indicesToRemove;
            try {
                indicesToRemove = Array.isArray(imagesToRemove)
                    ? imagesToRemove
                    : JSON.parse(imagesToRemove);
                if (!Array.isArray(indicesToRemove)) {
                    throw new Error('imagesToRemove must be an array');
                }

                // Validate indices
                for (const index of indicesToRemove) {
                    if (
                        isNaN(index) ||
                        index < 0 ||
                        index >= slideshowImages.length
                    ) {
                        throw new Error(`Invalid index for removal: ${index}`);
                    }
                }

                // Remove images and delete files
                const imagesToDelete = indicesToRemove.map((index) => slideshowImages[index]);
                for (const imagePath of imagesToDelete) {
                    const fullPath = path.join(__dirname, '../public', imagePath);
                    await fs.unlink(fullPath).catch((err) =>
                        logger.warn(`Failed to delete image: ${err.message}`)
                    );
                }

                // Update slideshowImages by filtering out removed indices
                slideshowImages = slideshowImages.filter(
                    (_, idx) => !indicesToRemove.includes(idx)
                );
            } catch (error) {
                logger.warn(`Invalid imagesToRemove format: ${error.message}`);
                return res.status(400).json({
                    success: false,
                    message: 'imagesToRemove must be a valid array of indices',
                });
            }
        }

        // Handle image uploads if provided
        if (req.files && req.files.length > 0) {
            const uploadDir = path.join(__dirname, '../public/uploads/about');

            // Append new images
            for (let i = 0; i < req.files.length; i++) {
                const file = req.files[i];
                try {
                    await fs.access(file.path);
                } catch (error) {
                    logger.error(`Temporary file not found: ${file.path}`);
                    throw new Error(`Temporary file not found: ${file.originalname}`);
                }

                const imageExt = path.extname(file.originalname);
                const newImageName = `about_id_${Date.now()}${imageExt}`;
                const newImagePath = path.join(uploadDir, newImageName);

                await fs.rename(file.path, newImagePath);
                slideshowImages.push(`uploads/about/${newImageName}`);
            }
        }

        // Update slideshowImages in updates object
        updates.slideshowImages = slideshowImages;

        // Check if any updates are provided
        if (Object.keys(updates).length === 1 && updates.updatedAt) {
            logger.warn('No fields provided for update');
            return res.status(400).json({
                success: false,
                message: 'At least one field must be provided to update',
            });
        }

        // Update document
        logger.info(`Updating About document with ID: ${about._id}`);
        const updatedAbout = await About.findByIdAndUpdate(about._id, updates, {
            new: true,
            runValidators: true,
        });

        // Add full image URLs to response
        const aboutWithImageUrls = {
            ...updatedAbout._doc,
            slideshowImages: updatedAbout.slideshowImages.map((img) => `${img}`),
        };

        logger.info(`About updated successfully: ${updatedAbout._id}`);
        res.status(200).json({
            success: true,
            message: 'About data updated successfully',
            data: aboutWithImageUrls,
        });
    } catch (error) {
        logger.error(`Error updating About data: ${error.message}`);
        // Clean up uploaded files on error
        if (req.files) {
            for (const file of req.files) {
                await fs.unlink(file.path).catch(() => {});
            }
        }
        res.status(400).json({
            success: false,
            message: 'Error updating About data',
            error: error.message,
        });
    }
};

module.exports = { saveAbout, getAbout, editAbout };