const Footer = require('../models/Footer');
const { logger } = require('../utils/Enc_Dec');

const addFooter = async (req, res) => {
    try {
        logger.info('Create Footer request received');
        const { contactInfo, parkHours } = req.body;

        if (!contactInfo || !parkHours) {
            logger.warn('Missing required fields for Footer submission');
            return res.status(400).json({
                success: false,
                message: 'All fields (contactInfo, parkHours) are required',
            });
        }

        let parsedContactInfo, parsedParkHours;

        // Validate contactInfo
        try {
            parsedContactInfo = Array.isArray(contactInfo) ? contactInfo : JSON.parse(contactInfo);
            if (!Array.isArray(parsedContactInfo) || parsedContactInfo.length === 0) {
                throw new Error('contactInfo must be a non-empty array');
            }
            for (const item of parsedContactInfo) {
                if (!item.type || !item.icon || !item.value) {
                    throw new Error('Each contactInfo item must have type, icon, and value');
                }
                if (typeof item.type !== 'string' || typeof item.icon !== 'string' || typeof item.value !== 'string') {
                    throw new Error('contactInfo type, icon, and value must be strings');
                }
            }
        } catch (error) {
            logger.warn(`Invalid contactInfo format: ${error.message}`);
            return res.status(400).json({
                success: false,
                message: 'contactInfo must be a non-empty array of objects with type, icon, and value as strings',
            });
        }

        // Validate parkHours
        try {
            parsedParkHours = Array.isArray(parkHours) ? parkHours : JSON.parse(parkHours);
            if (!Array.isArray(parsedParkHours) || parsedParkHours.length === 0) {
                throw new Error('parkHours must be a non-empty array');
            }
            for (const item of parsedParkHours) {
                if (!item.day || !item.hours) {
                    throw new Error('Each parkHours item must have day and hours');
                }
                if (typeof item.day !== 'string' || typeof item.hours !== 'string') {
                    throw new Error('parkHours day and hours must be strings');
                }
            }
        } catch (error) {
            logger.warn(`Invalid parkHours format: ${error.message}`);
            return res.status(400).json({
                success: false,
                message: 'parkHours must be a non-empty array of objects with day and hours as strings',
            });
        }

        const footer = await Footer.create({ contactInfo: parsedContactInfo, parkHours: parsedParkHours });
        logger.info(`Footer submission created successfully: ${footer._id}`);

        res.status(201).json({
            success: true,
            message: 'Footer submission created successfully',
            data: footer,
        });
    } catch (error) {
        logger.error(`Error creating Footer submission: ${error.message}`);
        res.status(500).json({
            success: false,
            message: 'Error creating Footer submission',
            error: error.message,
        });
    }
};

const getFooter = async (req, res) => {
    try {
        logger.info('Get Footer request received');
        const footer = await Footer.findOne();

        if (!footer) {
            logger.warn('No Footer data found');
            return res.status(404).json({
                success: false,
                message: 'No Footer data found',
            });
        }

        logger.info(`Footer retrieved successfully: ${footer._id}`);
        res.status(200).json({
            success: true,
            message: 'Footer data fetched successfully',
            data: footer,
        });
    } catch (error) {
        logger.error(`Error fetching Footer: ${error.message}`);
        res.status(500).json({
            success: false,
            message: 'Error fetching Footer data',
            error: error.message,
        });
    }
};

const editFooter = async (req, res) => {
    try {
        logger.info('Edit Footer request received');
        const { contactInfo, parkHours } = req.body;

        const updates = {};
        let parsedContactInfo, parsedParkHours;

        // Validate contactInfo if provided
        if (contactInfo) {
            try {
                parsedContactInfo = Array.isArray(contactInfo) ? contactInfo : JSON.parse(contactInfo);
                if (!Array.isArray(parsedContactInfo) || parsedContactInfo.length === 0) {
                    throw new Error('contactInfo must be a non-empty array');
                }
                for (const item of parsedContactInfo) {
                    if (!item.type || !item.icon || !item.value) {
                        throw new Error('Each contactInfo item must have type, icon, and value');
                    }
                    if (typeof item.type !== 'string' || typeof item.icon !== 'string' || typeof item.value !== 'string') {
                        throw new Error('contactInfo type, icon, and value must be strings');
                    }
                }
                updates.contactInfo = parsedContactInfo;
            } catch (error) {
                logger.warn(`Invalid contactInfo format: ${error.message}`);
                return res.status(400).json({
                    success: false,
                    message: 'contactInfo must be a non-empty array of objects with type, icon, and value as strings',
                });
            }
        }

        // Validate parkHours if provided
        if (parkHours) {
            try {
                parsedParkHours = Array.isArray(parkHours) ? parkHours : JSON.parse(parkHours);
                if (!Array.isArray(parsedParkHours) || parsedParkHours.length === 0) {
                    throw new Error('parkHours must be a non-empty array');
                }
                for (const item of parsedParkHours) {
                    if (!item.day || !item.hours) {
                        throw new Error('Each parkHours item must have day and hours');
                    }
                    if (typeof item.day !== 'string' || typeof item.hours !== 'string') {
                        throw new Error('parkHours day and hours must be strings');
                    }
                }
                updates.parkHours = parsedParkHours;
            } catch (error) {
                logger.warn(`Invalid parkHours format: ${error.message}`);
                return res.status(400).json({
                    success: false,
                    message: 'parkHours must be a non-empty array of objects with day and hours as strings',
                });
            }
        }

        // Check if any updates are provided
        if (Object.keys(updates).length === 0) {
            logger.warn('No fields provided for update');
            return res.status(400).json({
                success: false,
                message: 'At least one field (contactInfo, parkHours) must be provided to update',
            });
        }

        // Find the existing Footer document
        const footer = await Footer.findOne();
        if (!footer) {
            logger.warn('No Footer data found to update');
            return res.status(404).json({
                success: false,
                message: 'No Footer data found to update',
            });
        }

        // Update the document
        logger.info(`Updating Footer document with ID: ${footer._id}`);
        const updatedFooter = await Footer.findByIdAndUpdate(
            footer._id,
            { $set: updates },
            { new: true, runValidators: true }
        );

        logger.info(`Footer updated successfully: ${updatedFooter._id}`);
        res.status(200).json({
            success: true,
            message: 'Footer data updated successfully',
            data: updatedFooter,
        });
    } catch (error) {
        logger.error(`Error updating Footer data: ${error.message}`);
        res.status(500).json({
            success: false,
            message: 'Error updating Footer data',
            error: error.message,
        });
    }
};

module.exports = { addFooter, getFooter, editFooter };