
const express = require('express');
const router = express.Router();
const docenteController = require('../controllers/docenteController');
const { verifyToken } = require('../middlewares/authMiddleware');

router.use(verifyToken);

// Ahora todos pueden acceder si están autenticados
router.get('/recursos-compartidos', docenteController.getRecursosCompartidos);

module.exports = router;
