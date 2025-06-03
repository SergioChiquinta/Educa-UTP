
// routes/docenteRoutes.js
const express = require('express');
const router = express.Router();
const upload = require('../middlewares/uploadMiddleware');
const { verifyToken } = require('../middlewares/authMiddleware');
const recursoController = require('../controllers/recursoController');

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
    res.status(500).json({ error: 'Error al obtener datos' });
  }
});

// Gestión de recursos subidos
router.get('/mis-recursos', verifyToken, recursoController.obtenerMisRecursos);
router.put('/recurso/:id', verifyToken, recursoController.editarRecurso);
router.delete('/recurso/:id', verifyToken, recursoController.eliminarRecurso);

// Ver recursos compartidos por otros docentes
router.get('/recursos-compartidos', verifyToken, recursoController.obtenerRecursosPublicos);

// Rutas para descargar (opcional)
router.get('/descargar/:filename', (req, res) => {
  const file = path.join(__dirname, '..', 'uploads/recursos', req.params.filename);
  res.download(file);
});

module.exports = router;
