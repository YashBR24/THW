const express = require('express');
const router = express.Router();
const {saveDashboard, editDashboard, getDashboard} = require('../controllers/dashboardDataController');

router.get('/get-details', getDashboard);
router.post('/new-details', saveDashboard);
router.put('/edit-details/:id', editDashboard);

module.exports = router;
