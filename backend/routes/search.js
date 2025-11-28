const express = require('express');
const router = express.Router();
const {amazon,ebay} = require('../controllers/search_controller'); 

router.post('/amazon',amazon);
router.post('/ebay',ebay);

module.exports = router