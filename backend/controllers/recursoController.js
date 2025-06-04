
// controllers/recursoController.js
const pool = require('../models/db');

// Gestión para subir Recursos
exports.subirRecurso = async (req, res) => {
  try {
    const { titulo, descripcion, id_categoria, id_curso, tipo_archivo } = req.body;
    const archivo_url = req.file.filename;
    const id_docente = req.usuario.id_usuario;

    await pool.query(`
      INSERT INTO recursos (titulo, descripcion, archivo_url, tipo_archivo, id_docente, id_categoria, id_curso)
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [titulo, descripcion, archivo_url, tipo_archivo.toUpperCase(), id_docente, id_categoria, id_curso]
    );

    res.status(201).json({ message: 'Recurso subido correctamente' });

  } catch (error) {
    console.error('Error al subir recurso:', error);
    res.status(500).json({ error: 'Error al subir recurso' });
  }
};

// Gestión de recursos subidos
exports.obtenerMisRecursos = async (req, res) => {
  const id_docente = req.usuario.id_usuario;
  try {
    const [recursos] = await pool.query(`
      SELECT r.*, c.nombre_curso, cat.nombre_categoria
      FROM recursos r
      JOIN cursos c ON r.id_curso = c.id_curso
      JOIN categorias cat ON r.id_categoria = cat.id_categoria
      WHERE r.id_docente = ?
    `, [id_docente]);

    res.json(recursos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener recursos' });
  }
};

exports.editarRecurso = async (req, res) => {
  const id_docente = req.usuario.id_usuario;
  const { id } = req.params;
  const { titulo, descripcion, id_categoria, id_curso } = req.body;

  try {
    const [result] = await pool.query(`
      UPDATE recursos SET titulo = ?, descripcion = ?, id_categoria = ?, id_curso = ?
      WHERE id_recurso = ? AND id_docente = ?`,
      [titulo, descripcion, id_categoria, id_curso, id, id_docente]);

    if (result.affectedRows === 0)
      return res.status(403).json({ error: 'No tienes permiso para editar este recurso' });

    res.json({ message: 'Recurso actualizado correctamente' });

  } catch (error) {
    res.status(500).json({ error: 'Error al editar recurso' });
  }
};

exports.eliminarRecurso = async (req, res) => {
  const id_docente = req.usuario.id_usuario;
  const { id } = req.params;

  try {
    const [result] = await pool.query(
      `DELETE FROM recursos WHERE id_recurso = ? AND id_docente = ?`, [id, id_docente]
    );

    if (result.affectedRows === 0)
      return res.status(403).json({ error: 'No tienes permiso para eliminar este recurso' });

    res.json({ message: 'Recurso eliminado correctamente' });

  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar recurso' });
  }
};

// Ver recursos compartidos por otros docentes
exports.obtenerRecursosPublicos = async (req, res) => {
  const id_usuario = req.usuario.id_usuario;

  try {
    const [recursos] = await pool.query(`
      SELECT r.id_recurso, r.titulo, r.descripcion, r.archivo_url, r.tipo_archivo,
             r.fecha_subida, u.nombre_completo AS autor,
             c.nombre_curso, cat.nombre_categoria
      FROM recursos r
      JOIN usuarios u ON r.id_docente = u.id_usuario
      JOIN cursos c ON r.id_curso = c.id_curso
      JOIN categorias cat ON r.id_categoria = cat.id_categoria
      WHERE r.id_docente != ?`, [id_usuario]);

    res.json(recursos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener recursos públicos' });
  }
};
