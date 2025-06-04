
const jwt = require('jsonwebtoken');
const db = require('../models/db');

// Middleware para verificar el token JWT
exports.verifyToken = (req, res, next) => {
  // Obtener el token del header
  const token = req.headers['authorization']?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'Token no proporcionado' });
  }

  // Verificar el token
  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Token inválido o expirado' });
    }

    try {
      // Verificar que el usuario aún existe en la base de datos
      const [user] = await db.promise().query(
        'SELECT id_usuario, nombre_completo, correo, id_rol, estado FROM usuarios WHERE id_usuario = ?',
        [decoded.id]
      );

      if (user.length === 0 || !user[0].estado) {
        return res.status(404).json({ message: 'Usuario no encontrado o desactivado' });
      }

      // Obtener el nombre del rol
      const [rol] = await db.promise().query(
        'SELECT nombre_rol FROM roles WHERE id_rol = ?',
        [user[0].id_rol]
      );

      // Adjuntar información del usuario al request
      req.user = {
        id: user[0].id_usuario,
        nombre: user[0].nombre_completo,
        correo: user[0].correo,
        rol: rol[0].nombre_rol
      };

      next();
    } catch (error) {
      console.error('Error en verificación de token:', error);
      res.status(500).json({ message: 'Error del servidor' });
    }
  });
};

// Middleware para verificar rol de docente
exports.isDocente = (req, res, next) => {
  if (req.user.rol !== 'docente') {
    return res.status(403).json({ 
      message: 'Acceso restringido: solo para docentes' 
    });
  }
  next();
};

// Middleware para verificar rol de administrador
exports.isAdmin = (req, res, next) => {
  if (req.user.rol !== 'admin') {
    return res.status(403).json({ 
      message: 'Acceso restringido: solo para administradores' 
    });
  }
  next();
};

// Middleware para verificar rol de estudiante
exports.isEstudiante = (req, res, next) => {
  if (req.user.rol !== 'estudiante') {
    return res.status(403).json({ 
      message: 'Acceso restringido: solo para estudiantes' 
    });
  }
  next();
};