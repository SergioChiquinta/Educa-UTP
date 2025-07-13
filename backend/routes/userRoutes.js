
const express = require('express');
const router = express.Router();
const db = require('../models/db');
const bcrypt = require('bcryptjs');

// Obtener todos los usuarios activos
router.get('/usuarios', (req, res) => {
  const sql = `
    SELECT u.*, r.nombre_rol
    FROM usuarios u
    INNER JOIN roles r ON u.id_rol = r.id_rol
    WHERE u.estado = TRUE
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: 'Error al obtener usuarios' });
    res.json(results);
  });
});

// Crear usuario
router.post('/usuarios', async (req, res) => {
  const { nombre_completo, correo, contrasena, id_rol, area_interes } = req.body;
  try {
    // Generar hash con bcrypt
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(contrasena, salt);

    const sql = `
      INSERT INTO usuarios (nombre_completo, correo, contrasena, id_rol, area_interes)
      VALUES (?, ?, ?, ?, ?)
    `;
    db.query(sql, [nombre_completo, correo, hashedPassword, id_rol, area_interes], (err, result) => {
      if (err) return res.status(500).json({ error: 'Error al crear usuario', details: err });
      res.json({ success: true, id: result.insertId });
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al encriptar contraseña', details: error });
  }
});

// Editar usuario
router.put('/usuarios/:id', (req, res) => {
  const { nombre_completo, correo, id_rol, area_interes } = req.body;
  const sql = `
    UPDATE usuarios
    SET nombre_completo = ?, correo = ?, id_rol = ?, area_interes = ?
    WHERE id_usuario = ?
  `;
  db.query(sql, [nombre_completo, correo, id_rol, area_interes, req.params.id], (err) => {
    if (err) return res.status(500).json({ error: 'Error al actualizar usuario', details: err });
    res.json({ success: true });
  });
});

// "Eliminar" usuario (cambio de estado)
router.delete('/usuarios/:id', (req, res) => {
  const sql = `
    UPDATE usuarios
    SET estado = FALSE
    WHERE id_usuario = ?
  `;
  db.query(sql, [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: 'Error al eliminar usuario', details: err });
    res.json({ success: true });
  });
});

module.exports = router;
