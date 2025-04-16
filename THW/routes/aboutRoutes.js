const express = require('express');
const router = express.Router();
const {getAbout,saveAbout, editAbout}  = require('../controllers/aboutController');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;

// Ensure upload directory exists
const uploadDir = path.join(__dirname, '../public/uploads/about');
fs.mkdir(uploadDir, { recursive: true }).catch((err) => {
    console.error(`Failed to create upload directory: ${err.message}`);
});

// Configure multer for multiple image uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, `temp-${Date.now()}${path.extname(file.originalname)}`);
    },
});
const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);
        if (extname && mimetype) {
            return cb(null, true);
        }
        cb(new Error('Only JPEG and PNG images are allowed'));
    },
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

// Routes
router.post('/post-details', upload.array('slideshowImages', 10), saveAbout);
router.get('/details', getAbout);
router.put('/detail/:id',upload.array('slideshowImages',10), editAbout);

module.exports = router;