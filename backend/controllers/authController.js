
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../models/db');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { cloudinary } = require('../config/cloudinary');

// === LOGIN ===
exports.login = async (req, res) => {
  try {
    const { correo, password } = req.body;

    const query = `
      SELECT u.id_usuario, u.nombre_completo, u.correo, u.contrasena, 
             r.nombre_rol, u.foto_perfil, u.area_interes
      FROM usuarios u
      JOIN roles r ON u.id_rol = r.id_rol
      WHERE u.correo = ? AND u.estado = TRUE
    `;

    const [users] = await db.promise().query(query, [correo]);

    if (users.length === 0) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.contrasena.toString());

    if (!isMatch) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const token = jwt.sign(
      { 
        id: user.id_usuario, 
        rol: user.nombre_rol,
        nombre: user.nombre_completo,
        correo: user.correo
      }, 
      process.env.JWT_SECRET, 
      { expiresIn: '8h' }
    );

    res.json({
      message: `Bienvenido ${user.nombre_completo}`,
      token,
      user: {
        id: user.id_usuario,
        nombre: user.nombre_completo,
        correo: user.correo,
        rol: user.nombre_rol,
        foto_perfil: user.foto_perfil ? user.foto_perfil : null,
        area_interes: user.area_interes
      }
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

// === GET PROFILE ===
exports.getProfile = (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Token no proporcionado' });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: 'Token inválido' });

    const userId = decoded.id;

    const query = `
      SELECT u.id_usuario, u.nombre_completo, u.correo, r.nombre_rol, 
             u.area_interes, u.estado, u.fecha_registro, u.foto_perfil
      FROM usuarios u
      JOIN roles r ON u.id_rol = r.id_rol
      WHERE u.id_usuario = ?
    `;

    db.query(query, [userId], (err, results) => {
      if (err) return res.status(500).json({ message: 'Error de servidor' });
      if (results.length === 0) return res.status(404).json({ message: 'Usuario no encontrado' });

      res.json(results[0]);
    });
  });
};

// === UPDATE PROFILE ===
exports.updateProfile = (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Token no proporcionado' });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: 'Token inválido' });

    const userId = decoded.id;
    const { nombre_completo, correo, password, area_interes } = req.body;

    if (!nombre_completo || !correo) {
      return res.status(400).json({ message: 'Nombre y correo son obligatorios' });
    }

    if (password && password.trim() !== '') {
      bcrypt.hash(password, 10, (err, hash) => {
        if (err) return res.status(500).json({ message: 'Error al encriptar la contraseña' });

        db.query(
          'UPDATE usuarios SET nombre_completo = ?, correo = ?, contrasena = ?, area_interes = ? WHERE id_usuario = ?',
          [nombre_completo, correo, hash, area_interes, userId],
          (err) => {
            if (err) return res.status(500).json({ message: 'Error al actualizar el perfil' });
            res.json({ message: 'Perfil actualizado exitosamente' });
          }
        );
      });
    } else {
      db.query(
        'UPDATE usuarios SET nombre_completo = ?, correo = ?, area_interes = ? WHERE id_usuario = ?',
        [nombre_completo, correo, area_interes, userId],
        (err) => {
          if (err) return res.status(500).json({ message: 'Error al actualizar el perfil' });
          res.json({ message: 'Perfil actualizado exitosamente' });
        }
      );
    }
  });
};

// === RESET PASSWORD SIMULADO ===
exports.resetPassword = (req, res) => {
  const { correo } = req.body;

  db.query('SELECT * FROM usuarios WHERE correo = ?', [correo], (err, results) => {
    if (err) return res.status(500).json({ message: 'Error del servidor' });
    if (results.length === 0) return res.status(404).json({ message: 'Usuario no encontrado' });

    res.status(200).json({ message: 'Correo de recuperación enviado (simulado)' });
  });
};

// === MULTER CON MEMORY STORAGE ===
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
exports.upload = upload;

// === UPDATE PROFILE PICTURE (Cloudinary) ===
exports.updateProfilePicture = async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Token no proporcionado' });

  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) return res.status(403).json({ message: 'Token inválido' });

    if (!req.file) {
      return res.status(400).json({ message: 'No se recibió ninguna imagen' });
    }

    try {
      // Subir a Cloudinary desde buffer
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: 'perfil_usuarios',
            width: 300,
            height: 300,
            crop: 'fill',
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(req.file.buffer);
      });

      const imageUrl = result.secure_url;
      const userId = decoded.id;

      db.query(
        'UPDATE usuarios SET foto_perfil = ? WHERE id_usuario = ?',
        [imageUrl, userId],
        (err) => {
          if (err) return res.status(500).json({ message: 'Error al actualizar la foto' });

          res.json({ 
            message: 'Foto actualizada exitosamente',
            filename: imageUrl
          });
        }
      );
    } catch (error) {
      console.error('Error al subir a Cloudinary:', error);
      res.status(500).json({ message: 'Error al subir la imagen' });
    }
  });
};
