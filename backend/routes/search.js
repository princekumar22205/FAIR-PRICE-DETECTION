const express = require('express');
const router = express.Router();
const {search} = require('../controllers/search_controller'); 

router.post('/product',search);

module.exports = router