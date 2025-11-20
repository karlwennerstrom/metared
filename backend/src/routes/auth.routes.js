const express = require('express');
const router = express.Router();
const { login, me } = require('../controllers/auth.controller');
const { autenticar } = require('../middleware/auth.middleware');

// POST /api/auth/login - Login user
router.post('/login', login);

// GET /api/auth/me - Get current user info
router.get('/me', autenticar, me);

module.exports = router;
