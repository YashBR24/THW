// controllers/guidelineController.js
const mongoose = require('mongoose');
const Guideline = require('../models/Guidelines');
const { logger } = require('../utils/Enc_Dec');

const createGuideline = async (req, res) => {
    try {
        logger.info('Create guideline request received');
        const { points, title, icon } = req.body;

        // Validate required fields
        if (!icon || !title || !points) {
            logger.warn('Missing required fields for guideline');
            return res.status(400).json({
                success: false,
                message: 'Required fields: icon, title, points',
            });
        }

        // Validate points as an array
        let parsedPoints;
        try {
            parsedPoints = Array.isArray(points) ? points : JSON.parse(points);
            if (!Array.isArray(parsedPoints) || parsedPoints.length === 0) {
                throw new Error('Points must be a non-empty array');
            }
        } catch (error) {
            logger.warn(`Invalid points format: ${error.message}`);
            return res.status(400).json({
                success: false,
                message: 'Points must be a non-empty array of strings',
            });
        }

        const guideline = await Guideline.create({ points: parsedPoints, title, icon });
        logger.info(`Guideline created successfully: ${guideline._id}`);

        return res.status(201).json({
            success: true,
            message: 'Guideline created successfully',
            data: guideline,
        });
    } catch (error) {
        logger.error(`Error creating guideline: ${error.message}`);
        return res.status(500).json({
            success: false,
            message: 'Error creating guideline',
            error: error.message,
        });
    }
};

const getAllGuideline = async (req, res) => {
    try {
        logger.info('Get all guidelines request received');
        const guidelines = await Guideline.find().sort({ createdAt: -1 });

        logger.info(`Retrieved ${guidelines.length} guidelines successfully`);
        res.status(200).json({
            success: true,
            message: 'All guidelines fetched successfully',
            count: guidelines.length,
            data: guidelines,
        });
    } catch (error) {
        logger.error(`Error fetching guidelines: ${error.message}`);
        res.status(500).json({
            success: false,
            message: 'Error fetching guidelines',
            error: error.message,
        });
    }
};

const editGuideline = async (req, res) => {
    try {
        logger.info(`Edit guideline request received for ID: ${req.params.id}`);
        const { id } = req.params;
        const { icon, title, points } = req.body;

        // Validate ID
        if (!mongoose.Types.ObjectId.isValid(id)) {
            logger.warn(`Invalid guideline ID: ${id}`);
            return res.status(400).json({
                success: false,
                message: 'Invalid guideline ID',
            });
        }

        // Validate required fields
        if (!icon || !title || !points) {
            logger.warn('Missing required fields for guideline update');
            return res.status(400).json({
                success: false,
                message: 'Required fields: icon, title, points',
            });
        }

        // Validate points as an array
        let parsedPoints;
        try {
            parsedPoints = Array.isArray(points) ? points : JSON.parse(points);
            if (!Array.isArray(parsedPoints) || parsedPoints.length === 0) {
                throw new Error('Points must be a non-empty array');
            }
        } catch (error) {
            logger.warn(`Invalid points format: ${error.message}`);
            return res.status(400).json({
                success: false,
                message: 'Points must be a non-empty array of strings',
            });
        }

        // Find and update guideline
        const guideline = await Guideline.findByIdAndUpdate(
            id,
            { icon, title, points: parsedPoints, updatedAt: Date.now() },
            { new: true, runValidators: true }
        );

        if (!guideline) {
            logger.warn(`Guideline not found: ${id}`);
            return res.status(404).json({
                success: false,
                message: 'Guideline not found',
            });
        }

        logger.info(`Guideline updated successfully: ${guideline._id}`);
        return res.status(200).json({
            success: true,
            message: 'Guideline updated successfully',
            data: guideline,
        });
    } catch (error) {
        logger.error(`Error updating guideline: ${error.message}`);
        return res.status(500).json({
            success: false,
            message: 'Error updating guideline',
            error: error.message,
        });
    }
};

const deleteGuideline = async (req, res) => {
    try {
        logger.info(`Delete guideline request received for ID: ${req.params.id}`);
        const { id } = req.params;

        // Validate ID
        if (!mongoose.Types.ObjectId.isValid(id)) {
            logger.warn(`Invalid guideline ID: ${id}`);
            return res.status(400).json({
                success: false,
                message: 'Invalid guideline ID',
            });
        }

        // Find and delete guideline
        const guideline = await Guideline.findByIdAndDelete(id);

        if (!guideline) {
            logger.warn(`Guideline not found: ${id}`);
            return res.status(404).json({
                success: false,
                message: 'Guideline not found',
            });
        }

        logger.info(`Guideline deleted successfully: ${id}`);
        return res.status(200).json({
            success: true,
            message: 'Guideline deleted successfully',
        });
    } catch (error) {
        logger.error(`Error deleting guideline: ${error.message}`);
        return res.status(500).json({
            success: false,
            message: 'Error deleting guideline',
            error: error.message,
        });
    }
};

module.exports = { createGuideline, getAllGuideline, editGuideline, deleteGuideline };