const express = require('express');
const { getUserInfo } = require('../controllers/userController');
const router = express.Router();

// Route to get user info
router.get('/info', getUserInfo);

module.exports = router;
