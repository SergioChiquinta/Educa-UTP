
const db = require('../models/db');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configuración de Multer para recursos académicos
const { storage } = require('../config/cloudinary');

const uploadRecurso = multer({ 
  storage: storage,
  limits: { 
    fileSize: 25 * 1024 * 1024,
    files: 1,
    parts: 10
  }
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

// Modifica la función subirRecurso en docenteController.js
exports.subirRecurso = async (req, res) => {
  try {
    console.log('Iniciando subida de recurso...'); // Log de depuración
    console.log('Cuerpo de la solicitud:', req.body); // Ver qué datos llegan
    console.log('Archivo recibido:', req.file); // Ver el archivo recibido

    const docenteId = req.user.id;
    const { titulo, descripcion, id_curso, id_categoria } = req.body;
    
    if (!req.file) {
      console.error('No se recibió archivo');
      return res.status(400).json({ message: 'Debes subir un archivo' });
    }
    
    // Validar tipos de archivo permitidos
    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(req.file.mimetype)) {
      console.error('Tipo de archivo no permitido:', req.file.mimetype);
      return res.status(400).json({ message: 'Solo se permiten archivos PDF o DOCX' });
    }
    
    const tipoArchivo = req.file.mimetype === 'application/pdf' ? 'PDF' : 'DOCX';
    
    const query = `
      INSERT INTO recursos 
      (titulo, descripcion, archivo_url, tipo_archivo, id_docente, id_curso, id_categoria)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    
    console.log('Ejecutando query con:', [titulo, descripcion, req.file.path, tipoArchivo, docenteId, id_curso, id_categoria]);
    
    await db.promise().query(query, [
      titulo,
      descripcion,
      req.file.path, // Solo la URL final pública de Cloudinary
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
    
    console.log('Recurso subido exitosamente con ID:', result.insertId);
    
    res.status(201).json({ 
      message: 'Recurso subido exitosamente',
      id_recurso: result.insertId
    });
  } catch (error) {
    console.error('Error detallado al subir recurso:', error);
    res.status(500).json({ 
      message: 'Error al subir recurso',
      error: error.message,
      stack: error.stack
    });
  }
};

// Obtener recursos compartidos con el docente
exports.getRecursosCompartidos = async (req, res) => {
  try {
    const query = `
      SELECT 
        r.*, 
        c.nombre_curso, 
        cat.nombre_categoria
      FROM recursos r
      JOIN cursos c ON r.id_curso = c.id_curso
      JOIN categorias cat ON r.id_categoria = cat.id_categoria
      ORDER BY r.fecha_subida DESC
    `;
    
    const [recursos] = await db.promise().query(query);
    res.json(recursos);
  } catch (error) {
    console.error('Error al obtener recursos:', error);
    res.status(500).json({ 
      message: 'Error al obtener recursos',
      error: error.message 
    });
  }
};

// Registrar descargas hechas
exports.registrarDescarga = async (req, res) => {
  try {
    const { id_recurso } = req.body;
    const id_usuario = req.user.id;
    
    await db.promise().query(
      'INSERT INTO estadisticas_descarga (id_usuario, id_recurso) VALUES (?, ?)',
      [id_usuario, id_recurso]
    );
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error al registrar descarga:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error al registrar descarga' 
    });
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
    // Eliminar descargas asociadas
    await db.promise().query(
      'DELETE FROM estadisticas_descarga WHERE id_recurso = ?',
      [id_recurso]
    );

    // Ahora eliminar recurso
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

// Actualizar recurso existente
exports.actualizarRecurso = async (req, res) => {
  try {
    const docenteId = req.user.id;
    const { id_recurso } = req.params;
    const { titulo, descripcion, id_curso, id_categoria } = req.body;

    // Verificar que el recurso pertenece al docente
    const [recurso] = await db.promise().query(
      'SELECT id_docente FROM recursos WHERE id_recurso = ?',
      [id_recurso]
    );
    
    if (recurso.length === 0) {
      return res.status(404).json({ message: 'Recurso no encontrado' });
    }
    
    if (recurso[0].id_docente !== docenteId) {
      return res.status(403).json({ message: 'No autorizado para editar este recurso' });
    }

    // Validar que curso y categoría existen
    const [curso] = await db.promise().query('SELECT id_curso FROM cursos WHERE id_curso = ?', [id_curso]);
    const [categoria] = await db.promise().query('SELECT id_categoria FROM categorias WHERE id_categoria = ?', [id_categoria]);
    
    if (curso.length === 0 || categoria.length === 0) {
      return res.status(400).json({ message: 'Curso o categoría no válidos' });
    }

    // Actualizar el recurso con todos los campos
    await db.promise().query(
      'UPDATE recursos SET titulo = ?, descripcion = ?, id_curso = ?, id_categoria = ? WHERE id_recurso = ?',
      [titulo, descripcion, id_curso, id_categoria, id_recurso]
    );

    // Obtener el recurso actualizado con información adicional
    const [updatedRecurso] = await db.promise().query(`
      SELECT r.*, c.nombre_curso, cat.nombre_categoria 
      FROM recursos r
      JOIN cursos c ON r.id_curso = c.id_curso
      JOIN categorias cat ON r.id_categoria = cat.id_categoria
      WHERE r.id_recurso = ?
    `, [id_recurso]);

    res.json({ 
      message: 'Recurso actualizado exitosamente',
      recurso: updatedRecurso[0]
    });
  } catch (error) {
    console.error('Error al actualizar recurso:', error);
    res.status(500).json({ 
      message: 'Error al actualizar recurso',
      error: error.message 
    });
  }
};

// Obtener estadísticas del docente y Admin
exports.getEstadisticasDocente = async (req, res) => {
  try {
    const docenteId = req.user.id;
    
    // Recursos subidos por el docente
    const [recursosSubidos] = await db.promise().query(
      'SELECT COUNT(*) as total FROM recursos WHERE id_docente = ?',
      [docenteId]
    );
    
    // Descargas hechas por el docente
    const [descargasHechas] = await db.promise().query(
      'SELECT COUNT(*) as total FROM estadisticas_descarga WHERE id_usuario = ?',
      [docenteId]
    );
    
    // Cantidad de Usuarios Registrados para el Admin
    const [usuariosRegistrados] = await db.promise().query(
      'SELECT COUNT(*) as total FROM usuarios WHERE estado = TRUE'
    );
    
    res.json({
      recursosSubidos: recursosSubidos[0].total,
      descargasHechas: descargasHechas[0].total,
      usuariosRegistrados: usuariosRegistrados[0].total
    });
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    res.status(500).json({ message: 'Error al obtener estadísticas' });
  }
};
