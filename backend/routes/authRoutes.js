
// backend/routes/authRoutes.js

const express = require('express');
const router = express.Router();
const { login, getProfile, updateProfile, resetPassword } = require('../controllers/authController');

// Rutas existentes
router.post('/login', login);
router.get('/profile', getProfile);
router.put('/profile', updateProfile);

// Nueva ruta para restablecer contraseña
router.post('/reset-password', resetPassword);

module.exports = router;
