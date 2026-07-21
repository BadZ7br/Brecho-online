const express = require('express');
const router = express.Router();
const { registerUser, registerStore, login, getMe, logout } = require('../controllers/authController');
const { requireAuth } = require('../middleware/auth');

// Cadastro
router.post('/register/user', registerUser);
router.post('/register/store', registerStore);

// Login / Logout
router.post('/login', login);
router.post('/logout', requireAuth, logout);

// Sessão atual
router.get('/me', requireAuth, getMe);

module.exports = router;
