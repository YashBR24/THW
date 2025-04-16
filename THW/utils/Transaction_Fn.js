const Transaction = require('../models/Transaction');
const {logger} = require('./Enc_Dec');

const AddTransaction = async (amount, in_out, description, identification = '', method = 'CASH') => {
    try {
        logger.info(`Adding transaction... Amount: ${amount}, Type: ${in_out}, Method: ${method}`);

        if (!['IN', 'OUT'].includes(in_out)) {
            logger.warn(`Invalid transaction type: ${in_out}`);
            throw new Error("Invalid transaction type. Use 'IN' or 'OUT'.");
        }

        const newTransaction = new Transaction({
            amt_in_out: in_out,
            amount,
            description,
            identification,
            method
        });

        await newTransaction.save();
        logger.info("Transaction added successfully.");
        return newTransaction;
    } catch (error) {
        logger.error(`Error adding transaction: ${error.message}`);
        throw new Error("Error adding transaction");
    }
};

module.exports = { AddTransaction };
