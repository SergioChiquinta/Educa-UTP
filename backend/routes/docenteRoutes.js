
const express = require('express');
const router = express.Router();
const docenteController = require('../controllers/docenteController');
const { verifyToken, isDocente } = require('../middlewares/authMiddleware');

// Middleware para verificar token y rol de docente
router.use(verifyToken);
router.use(isDocente);

// Rutas para recursos del docente
router.get('/recursos', docenteController.getRecursosDocente);
// router.get('/recursos-compartidos', docenteController.getRecursosCompartidos); -> Sólo para docentes, pero este es general así q lo quitaremos
router.get('/datos-utiles', docenteController.getCursosYCategorias);

// Ruta para subir recurso (con middleware de multer)
router.post('/subir-recurso', 
  docenteController.uploadRecurso.single('archivo'), 
  docenteController.subirRecurso
);

// Ruta para eliminar recurso
router.delete('/eliminar-recurso/:id_recurso', docenteController.eliminarRecurso);

// Ruta para actualizar recursos
router.put('/recurso/:id_recurso', docenteController.actualizarRecurso);

// Ruta para registrar descargas
//router.post('/registrar-descarga', docenteController.registrarDescarga); -> Sólo para docentes, pero este es general así q lo quitaremos

// Ruta para obtener estadísticas del docente
// router.get('/estadisticas', docenteController.getEstadisticasDocente); -> Sólo para docentes, pero este es general así q lo quitaremos

module.exports = router;