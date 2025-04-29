
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../models/db'); // ⚡ Correcto: db.js no está en models, sino directamente

// Función para ingresar/login
exports.login = (req, res) => {
  const { correo, password } = req.body;

  db.query('SELECT * FROM usuarios WHERE correo = ?', [correo], (err, results) => {
    if (err) return res.status(500).json({ message: 'Error de servidor' });
    if (results.length === 0) return res.status(401).json({ message: 'Credenciales inválidas' });

    const user = results[0];

    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) return res.status(500).json({ message: 'Error en el servidor' });
      if (!isMatch) return res.status(401).json({ message: 'Contraseña incorrecta' });

      // Si es correcto, generamos un JWT
      const token = jwt.sign({ id: user.id, rol: user.rol }, process.env.JWT_SECRET, { expiresIn: '1h' });

      return res.json({
        message: `Bienvenido ${user.rol}`,
        rol: user.rol,
        token
      });
    });
  });
};

// Función para obtener perfil
exports.getProfile = (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Token no proporcionado' });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: 'Token inválido' });

    const userId = decoded.id;
    db.query('SELECT id, nombre, correo, rol FROM usuarios WHERE id = ?', [userId], (err, results) => {
      if (err) return res.status(500).json({ message: 'Error de servidor' });
      if (results.length === 0) return res.status(404).json({ message: 'Usuario no encontrado' });

      res.json(results[0]);
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
    const { nombre, correo, password, rol } = req.body;

    if (password) {
      bcrypt.hash(password, 10, (err, hash) => {
        if (err) return res.status(500).json({ message: 'Error al encriptar la contraseña' });

        db.query(
          'UPDATE usuarios SET nombre = ?, correo = ?, password = ?, rol = ? WHERE id = ?',
          [nombre, correo, hash, rol, userId],
          (err, result) => {
            if (err) return res.status(500).json({ message: 'Error al actualizar el perfil' });
            res.json({ message: 'Perfil actualizado exitosamente' });
          }
        );
      });
    } else {
      db.query(
        'UPDATE usuarios SET nombre = ?, correo = ?, rol = ? WHERE id = ?',
        [nombre, correo, rol, userId],
        (err, result) => {
          if (err) return res.status(500).json({ message: 'Error al actualizar el perfil' });
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
    if (err) {
      console.error('Error al buscar el usuario:', err);
      return res.status(500).json({ message: 'Error del servidor' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Simulando envío de correo
    return res.status(200).json({ message: 'Se ha enviado un correo de recuperación (simulado).' });
  });
};
