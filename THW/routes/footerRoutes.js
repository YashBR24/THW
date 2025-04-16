const express = require('express');
const router = express.Router();
const { addFooter, getFooter, editFooter} = require('../controllers/footerController');

router.post('/add-footer',addFooter);
router.get('/footers',getFooter);
router.put('/footer/:id',editFooter);

module.exports = router;

