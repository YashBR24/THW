const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // Import the CORS library
require('dotenv').config();
const path = require('path');
const fs = require('fs');
const app = express();
// CORS configuration: allow everything
app.use(cors({
    origin: '*', // Allow all origins
    methods: '*', // Allow all HTTP methods
    allowedHeaders: '*', // Allow all headers
    credentials: true, // Allow cookies if needed for authentication
}));
app.options('*', cors());

// Middleware
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log('MongoDB connection error:', err));

// Serve static files from 'public' folder
app.use(express.static(path.join(__dirname, 'public')));
app.use('/about', express.static(path.join(__dirname, 'public/uploads/about')));

// Create uploads directory if it doesn't exist
const uploadDirs = [
    path.join(__dirname, 'public/uploads'),
    path.join(__dirname, 'public/uploads/about'),
];
uploadDirs.forEach((dir) => fs.mkdirSync(dir, { recursive: true }));

//FUNCTIONAL ROUTES
app.use('/thw/api/contact',require('./routes/contactRoutes'));
app.use('/thw/api/dashboard', require('./routes/dashboardRoutes'));
app.use('/thw/api/attractions', require('./routes/attractionsRoutes'));
app.use('/thw/api/about', require('./routes/aboutRoutes'));
app.use('/thw/api/guideline', require('./routes/guidelineRoutes'));
app.use('/thw/api/footer',require('./routes/footerRoutes'));
//STATIC ROUTES
app.use('/thw/employee/photos', express.static('emp_photos'));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

