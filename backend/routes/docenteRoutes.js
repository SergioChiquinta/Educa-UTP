
// routes/docenteRoutes.js
const express = require('express');
const router = express.Router();
const upload = require('../middlewares/uploadMiddleware');
const { verifyToken } = require('../middlewares/authMiddleware');
const recursoController = require('../controllers/recursoController');
const pool = require('../models/db'); // <-- Agrega esta línea


// Ruta para subir recursos
router.post('/subir-recurso', verifyToken, upload.single('archivo'), recursoController.subirRecurso);

// Clasificación por curso y categoría
// Esto se maneja en el mismo formulario de subida. Pero necesitas rutas para obtener cursos y categorías
router.get('/datos-utiles', verifyToken, async (req, res) => {
  try {
    const [cursos] = await pool.query('SELECT * FROM cursos');
    const [categorias] = await pool.query('SELECT * FROM categorias');

    res.json({ cursos, categorias });
  } catch (error) {
    console.error('Error en /datos-utiles:', error); // <-- Añade este console.error para ver el detalle

    res.status(500).json({ error: 'Error al obtener datos' });
  }
});

// Gestión de recursos subidos
router.get('/mis-recursos', verifyToken, recursoController.obtenerMisRecursos);
router.put('/recurso/:id', verifyToken, recursoController.editarRecurso);
router.delete('/recurso/:id', verifyToken, recursoController.eliminarRecurso);

// Ver recursos compartidos por otros docentes
router.get('/recursos-compartidos', verifyToken, recursoController.obtenerRecursosPublicos);

// Ruta para eliminar recurso
router.delete('/eliminar-recurso/:id_recurso', docenteController.eliminarRecurso);

// Ruta para actualizar recursos
router.put('/recurso/:id_recurso', docenteController.actualizarRecurso);

module.exports = router;
