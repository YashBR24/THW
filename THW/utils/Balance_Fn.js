require('dotenv').config();
const Balance = require('../models/Balance');
const {logger} = require('./Enc_Dec');

const bal_id = process.env.BAL_ID;

const FetchBalance = async () => {
    try {
        logger.info("Fetching balance...");
        const Bal = await Balance.findById(bal_id).select('balance');
        if (!Bal) {
            logger.warn("Balance record not found.");
            return null;
        }
        logger.info(`Balance fetched successfully: ${Bal.balance}`);
        return Bal.balance;
    } catch (error) {
        logger.error(`Error fetching balance: ${error.message}`);
        throw new Error("Error fetching balance");
    }
};

const UpdateBalance = async (amount, in_out) => {
    try {
        logger.info(`Updating balance... Amount: ${amount}, Type: ${in_out}`);

        const balanceDoc = await Balance.findById(bal_id);
        if (!balanceDoc) {
            logger.warn("Balance record not found.");
            throw new Error("Balance record not found");
        }

        if (in_out === 'in') {
            balanceDoc.balance += amount; // Add amount for "in"
        } else if (in_out === 'out') {
            if (balanceDoc.balance < amount) {
                logger.warn("Insufficient balance for withdrawal.");
                throw new Error("Insufficient balance");
            }
            balanceDoc.balance -= amount; // Subtract amount for "out"
        } else {
            logger.warn(`Invalid transaction type: ${in_out}`);
            throw new Error("Invalid transaction type. Use 'in' or 'out'.");
        }

        await balanceDoc.save();
        logger.info(`Balance updated successfully: New Balance = ${balanceDoc.balance}`);
        return balanceDoc.balance;
    } catch (error) {
        logger.error(`Error updating balance: ${error.message}`);
        throw new Error("Error updating balance");
    }
};

module.exports = { FetchBalance, UpdateBalance };
