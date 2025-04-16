const express = require('express');
const router = express.Router();
const {createContact , getAllContacts} = require("../controllers/contactController");

router.get('/get-contact', getAllContacts);
router.post('/post-contact', createContact);

module.exports = router;