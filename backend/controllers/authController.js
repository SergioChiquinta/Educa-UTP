
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../models/db');

// === LOGIN ===
// Función mejorada de login
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
        foto_perfil: user.foto_perfil ? `${process.env.BASE_URL}/uploads/${user.foto_perfil}` : null,
        area_interes: user.area_interes
      }
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

// Función para obtener perfil
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

      const userData = results[0];
      // Asegúrate de incluir la URL completa de la imagen si existe
      if (userData.foto_perfil) {
        userData.foto_perfil = `${process.env.BASE_URL}/uploads/${userData.foto_perfil}`;
      }
      
      res.json(userData);
    });
  });
};

// Función para actualizar perfil
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
      // En authController.js, modifica updateProfile:
      db.query(
        'UPDATE usuarios SET nombre_completo = ?, correo = ?, area_interes = ? WHERE id_usuario = ?',
        [nombre_completo, correo, area_interes, userId],
        (err) => {
          if (err) {
            console.error('Error SQL:', err);
            return res.status(500).json({ message: 'Error al actualizar el perfil' });
          }
          res.json({ message: 'Perfil actualizado exitosamente' });
        }
      );
    }
  });
};

// Función para resetear contraseña (simulado)
exports.resetPassword = (req, res) => {
  const { correo } = req.body;

  db.query('SELECT * FROM usuarios WHERE correo = ?', [correo], (err, results) => {
    if (err) return res.status(500).json({ message: 'Error del servidor' });
    if (results.length === 0) return res.status(404).json({ message: 'Usuario no encontrado' });

    res.status(200).json({ message: 'Correo de recuperación enviado (simulado)' });
  });
};

// Funcion para editar foto de perfil
const multer = require('multer');
const path = require('path');

// Configuración de Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // carpeta donde guardarás las imágenes
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname)); // nombre único
  }
});

const upload = multer({ storage: storage });
exports.upload = upload; // exportar para usar en las rutas

exports.updateProfilePicture = (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Token no proporcionado' });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: 'Token inválido' });

    const userId = decoded.id;
    
    console.log('Archivo recibido:', req.file); // 👈 Verifica esto en consola

    if (!req.file) {
      return res.status(400).json({ message: 'No se recibió la imagen' });
    }

    const profileImage = req.file.filename;

    db.query(
      'UPDATE usuarios SET foto_perfil = ? WHERE id_usuario = ?',
      [profileImage, userId],
      (err) => {
        if (err) return res.status(500).json({ message: 'Error al actualizar la foto' });

        res.json({ 
          message: 'Foto actualizada exitosamente',
          filename: profileImage
        });
      }
    );
  });
};