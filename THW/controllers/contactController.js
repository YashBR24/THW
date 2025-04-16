// controllers/contactController.js
const Contact = require('../models/Contact');
const { logger } = require('../utils/Enc_Dec');

const createContact = async (req, res) => {
    try {
        logger.info('Create contact request received');
        const { name, email, message } = req.body;

        // Validate required fields
        if (!name || !email || !message) {
            logger.warn('Missing required fields for contact submission');
            return res.status(400).json({
                success: false,
                message: 'All fields (name, email, message) are required',
            });
        }

        const contact = await Contact.create({ name, email, message });
        logger.info(`Contact submission created successfully: ${contact._id}`);

        res.status(201).json({
            success: true,
            message: 'Contact submission created successfully',
        });
    } catch (error) {
        logger.error(`Error creating contact submission: ${error.message}`);
        res.status(500).json({
            success: false,
            message: 'Error creating contact submission',
            error: error.message,
        });
    }
};

const getAllContacts = async (req, res) => {
    try {
        logger.info('Get all contacts request received');
        const contacts = await Contact.find().sort({ createdAt: -1 });

        logger.info(`Retrieved ${contacts.length} contacts successfully`);
        res.status(200).json({
            success: true,
            message: 'All contacts fetched successfully',
            data: contacts,
        });
    } catch (error) {
        logger.error(`Error fetching contacts: ${error.message}`);
        res.status(500).json({
            success: false,
            message: 'Error fetching contacts',
            error: error.message,
        });
    }
};

module.exports = { createContact, getAllContacts };