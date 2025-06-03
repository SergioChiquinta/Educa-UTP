
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Rutas
router.post('/login', authController.login);
router.get('/profile', authController.getProfile);
router.put('/profile', authController.updateProfile);
router.post('/reset-password', authController.resetPassword);

// Ruta para subir foto de perfil
router.put('/profile/picture', authController.upload.single('profile_image'), authController.updateProfilePicture);

module.exports = router;
