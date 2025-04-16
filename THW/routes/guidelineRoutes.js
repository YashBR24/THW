const express = require('express');
const router = express.Router();
const { getAllGuideline,createGuideline , editGuideline, deleteGuideline } = require("../controllers/guidelinesController");

router.get('/guidelines', getAllGuideline);
router.post('/post-guideline', createGuideline);
router.put('/guideline/:id', editGuideline);
router.delete('/guideline/:id', deleteGuideline);

module.exports = router;