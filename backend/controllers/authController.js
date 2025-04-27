
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../models/db.js');

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
