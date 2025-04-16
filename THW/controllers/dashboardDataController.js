const User = require("../models/User");
const mongoose = require('mongoose');
const Dashboard = require('../models/DashboardData');
const{logger} = require('../utils/Enc_Dec');


const saveDashboard = async (req, res) => {
    try {
        logger.info('Save dashboard request received');
        const data = req.body;
        const requiredFields = [
            'heroTagline',
            'heroSubtitle',
            'facilitiesTitle',
            'facilitiesSubtitle',
            'pricingTitle',
            'pricingSubtitle',
            'comboTitle',
            'comboSubtitle',
            'mapTitle',
            'mapSubtitle',
            'address',
            'phone',
            'email',
        ];

        for (const field of requiredFields) {
            if (!data[field]) {
                logger.warn(`Missing required field: ${field}`);
                return res.status(400).json({
                    success: false,
                    message: `Missing required field: ${field}`,
                });
            }
        }

        // Check if a dashboard document exists
        const existingDashboard = await Dashboard.findOne();
        logger.info(`Existing dashboard check: ${existingDashboard ? 'Found' : 'Not found'}`);

        let dashboard;
        if (existingDashboard) {
            // Update existing document
            logger.info(`Updating dashboard with ID: ${existingDashboard._id}`);
            dashboard = await Dashboard.findByIdAndUpdate(
                existingDashboard._id,
                { ...data, updatedAt: Date.now() },
                { new: true, runValidators: true }
            );
        } else {
            // Create new document
            logger.info('Creating new dashboard document');
            dashboard = await Dashboard.create(data);
        }

        logger.info(`Dashboard saved successfully: ${dashboard._id}`);
        res.status(200).json({
            success: true,
            message: 'Dashboard data saved successfully',
            data: dashboard,
        });
    } catch (error) {
        logger.error(`Error saving dashboard data: ${error.message}`);
        res.status(500).json({
            success: false,
            message: 'Error saving dashboard data',
            error: error.message,
        });
    }
};

const getDashboard = async (req, res) => {
    try {
        logger.info('Get dashboard request received');
        const dashboard = await Dashboard.findOne();

        if (!dashboard) {
            logger.warn('No dashboard data found');
            return res.status(404).json({
                success: false,
                message: 'No dashboard data found',
            });
        }

        logger.info(`Dashboard retrieved successfully: ${dashboard._id}`);
        res.status(200).json({
            success: true,
            data: dashboard,
        });
    } catch (error) {
        logger.error(`Error fetching dashboard data: ${error.message}`);
        res.status(500).json({
            success: false,
            message: 'Error fetching dashboard data',
            error: error.message,
        });
    }
};

const editDashboard = async (req, res) => {
    try {
        logger.info('Edit dashboard request received');
        const { id } = req.params;
        const updates = req.body;
        console.log(id)
        console.log(updates)
        // Validate MongoDB ID
        if (!mongoose.Types.ObjectId.isValid(id)) {
            logger.warn(`Invalid dashboard ID: ${id}`);
            return res.status(400).json({
                success: false,
                message: 'Invalid dashboard ID',
            });
        }

        // Check if at least one field is provided
        if (Object.keys(updates).length === 0) {
            logger.warn('No fields provided for update');
            return res.status(400).json({
                success: false,
                message: 'At least one field must be provided to update',
            });
        }

        // Validate provided fields
        const allowedFields = [
            'heroTagline',
            'heroSubtitle',
            'facilitiesTitle',
            'facilitiesSubtitle',
            'pricingTitle',
            'pricingSubtitle',
            'comboTitle',
            'comboSubtitle',
            'mapTitle',
            'mapSubtitle',
            'address',
            'phone',
            'email',
            '_id',
            '__v',
            'updatedAt'
        ];

        for (const field in updates) {
            if (!allowedFields.includes(field)) {
                logger.warn(`Invalid field provided: ${field}`);
                return res.status(400).json({
                    success: false,
                    message: `Invalid field: ${field}`,
                });
            }
        }

        // Since we enforce a singleton, ensure the ID matches the existing document
        const existingDashboard = await Dashboard.findOne();
        if (!existingDashboard) {
            logger.warn('No dashboard data found to update');
            return res.status(404).json({
                success: false,
                message: 'No dashboard data found to update',
            });
        }

        if (existingDashboard._id.toString() !== id) {
            logger.warn(`Provided ID ${id} does not match singleton dashboard ID ${existingDashboard._id}`);
            return res.status(400).json({
                success: false,
                message: 'Provided ID does not match the existing dashboard document',
            });
        }

        // Update the dashboard document
        logger.info(`Updating dashboard with ID: ${id}`);
        const dashboard = await Dashboard.findByIdAndUpdate(
            id,
            { ...updates, updatedAt: Date.now() },
            { new: true, runValidators: true }
        );

        if (!dashboard) {
            logger.warn(`Dashboard not found for ID: ${id}`);
            return res.status(404).json({
                success: false,
                message: 'Dashboard data not found for the provided ID',
            });
        }

        logger.info(`Dashboard updated successfully: ${dashboard._id}`);
        res.status(200).json({
            success: true,
            message: 'Dashboard data updated successfully',
            data: dashboard,
        });
    } catch (error) {
        logger.error(`Error updating dashboard data: ${error.message}`);
        res.status(500).json({
            success: false,
            message: 'Error updating dashboard data',
            error: error.message,
        });
    }
};

module.exports = {saveDashboard , getDashboard, editDashboard};