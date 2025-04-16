
const mongoose = require('mongoose');
const Balance = require('../models/Balance')
const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/the_hill_waterfall', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};
connectDB();
const bal = new Balance({
    balance: 0,
    _id : new mongoose.Types.ObjectId('67c7167522a5493df574d09f'),
    createdAt: Date.now(),
});
bal.save()