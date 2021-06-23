const express = require('express');
const router = express.Router();

const verifyPassword = require('../middleware/verifyPassword');

const limiter = require('../middleware/rateLimit');

const userCtrl = require('../controllers/user');

// user routes
router.post('/signup', verifyPassword, userCtrl.signup);
router.post('/login', limiter, userCtrl.login);

module.exports = router;