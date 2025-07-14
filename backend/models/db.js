
require('dotenv').config(); // Carga las variables de entorno

const mysql = require('mysql2');

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306
});

db.connect(err => {
  if (err) {
    console.error('Error conectando a la base de datos:', err);
    process.exit(1);
  } else {
    console.log('Conexión a la base de datos exitosa');
  }
});

module.exports = db;
