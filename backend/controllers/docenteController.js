
const db = require('../models/db');
const multer = require('multer');
const path = require('path');

// Configuración de Multer para recursos académicos
const storageRecursos = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/recursos/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const uploadRecurso = multer({ 
  storage: storageRecursos,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf' || 
        file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      cb(null, true);
    } else {
      cb(new Error('Solo se permiten archivos PDF o DOCX'), false);
    }
  },
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

exports.uploadRecurso = uploadRecurso;

// Obtener recursos del docente
exports.getRecursosDocente = async (req, res) => {
  try {
    const docenteId = req.user.id;
    
    const query = `
      SELECT r.*, c.nombre_curso, cat.nombre_categoria 
      FROM recursos r
      JOIN cursos c ON r.id_curso = c.id_curso
      JOIN categorias cat ON r.id_categoria = cat.id_categoria
      WHERE r.id_docente = ?
      ORDER BY r.fecha_subida DESC
    `;
    
    const [recursos] = await db.promise().query(query, [docenteId]);
    res.json(recursos);
  } catch (error) {
    console.error('Error al obtener recursos:', error);
    res.status(500).json({ message: 'Error al obtener recursos' });
  }
};

// Subir nuevo recurso
exports.subirRecurso = async (req, res) => {
  try {
    const docenteId = req.user.id;
    const { titulo, descripcion, id_curso, id_categoria } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ message: 'Debes subir un archivo' });
    }
    
    const tipoArchivo = req.file.mimetype === 'application/pdf' ? 'PDF' : 'DOCX';
    
    const query = `
      INSERT INTO recursos 
      (titulo, descripcion, archivo_url, tipo_archivo, id_docente, id_curso, id_categoria)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    
    const [result] = await db.promise().query(query, [
      titulo,
      descripcion,
      req.file.filename,
      tipoArchivo,
      docenteId,
      id_curso,
      id_categoria
    ]);
    
    // Agregar al docente como autor
    await db.promise().query(
      'INSERT INTO autores_recursos (id_recurso, id_autor) VALUES (?, ?)',
      [result.insertId, docenteId]
    );
    
    res.status(201).json({ 
      message: 'Recurso subido exitosamente',
      id_recurso: result.insertId
    });
  } catch (error) {
    console.error('Error al subir recurso:', error);
    res.status(500).json({ message: 'Error al subir recurso' });
  }
};

// Obtener recursos compartidos con el docente
exports.getRecursosCompartidos = async (req, res) => {
  try {
    const docenteId = req.user.id;
    
    const query = `
      SELECT r.*, c.nombre_curso, cat.nombre_categoria, 
             u.nombre_completo AS nombre_autor
      FROM recursos r
      JOIN cursos c ON r.id_curso = c.id_curso
      JOIN categorias cat ON r.id_categoria = cat.id_categoria
      JOIN autores_recursos ar ON r.id_recurso = ar.id_recurso
      JOIN usuarios u ON ar.id_autor = u.id_usuario
      WHERE r.id_docente != ? AND ar.id_autor = ?
      ORDER BY r.fecha_subida DESC
    `;
    
    const [recursos] = await db.promise().query(query, [docenteId, docenteId]);
    res.json(recursos);
  } catch (error) {
    console.error('Error al obtener recursos compartidos:', error);
    res.status(500).json({ message: 'Error al obtener recursos compartidos' });
  }
};

// Obtener cursos y categorías para dropdowns
exports.getCursosYCategorias = async (req, res) => {
  try {
    const [cursos] = await db.promise().query('SELECT * FROM cursos ORDER BY nombre_curso');
    const [categorias] = await db.promise().query('SELECT * FROM categorias ORDER BY nombre_categoria');
    
    res.json({ cursos, categorias });
  } catch (error) {
    console.error('Error al obtener datos:', error);
    res.status(500).json({ message: 'Error al obtener datos' });
  }
};

// Eliminar recurso (solo si es del docente)
exports.eliminarRecurso = async (req, res) => {
  try {
    const docenteId = req.user.id;
    const { id_recurso } = req.params;
    
    // Verificar que el recurso pertenece al docente
    const [recurso] = await db.promise().query(
      'SELECT id_docente FROM recursos WHERE id_recurso = ?',
      [id_recurso]
    );
    
    if (recurso.length === 0) {
      return res.status(404).json({ message: 'Recurso no encontrado' });
    }
    
    if (recurso[0].id_docente !== docenteId) {
      return res.status(403).json({ message: 'No autorizado para eliminar este recurso' });
    }
    
    // Eliminar (ON DELETE CASCADE se encargará de autores_recursos)
    await db.promise().query(
      'DELETE FROM recursos WHERE id_recurso = ?',
      [id_recurso]
    );
    
    res.json({ message: 'Recurso eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar recurso:', error);
    res.status(500).json({ message: 'Error al eliminar recurso' });
  }
};