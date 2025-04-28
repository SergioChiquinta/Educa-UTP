const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const authRoutes = require('./routes/authRoutes');
require('dotenv').config();

const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());

// Rutas
app.use('', authRoutes); // Asegúrate de que esta línea esté PRESENTE y SIN ERRORES TIPOGRÁFICOS

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});