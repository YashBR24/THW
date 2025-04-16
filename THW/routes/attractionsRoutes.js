const express = require('express');
const router = express.Router();
const {saveAttraction, deleteAttraction , updateAttraction ,getAttractions} = require('../controllers/attractionController');
const multer = require('multer');
const path = require('path');

// Configure multer for image uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads');
    },
    filename: (req, file, cb) => {
        // Temporary filename, renamed in controller
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
router.post('/attractions', upload.single('image'),saveAttraction);
router.get('/get-attractions',getAttractions );
router.put('/attractions/:id', upload.single('image'),updateAttraction );
router.delete('/attractions/:id',deleteAttraction );

module.exports = router;