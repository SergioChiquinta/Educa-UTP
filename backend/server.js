
const express = require('express');
const cors = require('cors');
const app = express();
const path = require('path');

// Configuración mejorada de CORS
app.use(cors({
  origin: 'http://localhost:3001', // Ajusta según tu puerto frontend
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuración de archivos estáticos
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Rutas
const authRoutes = require('./routes/authRoutes');
const docenteRoutes = require('./routes/docenteRoutes');

app.use('/api', authRoutes);
app.use('/api/docente', docenteRoutes);

// Puerto
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});