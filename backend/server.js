
const express = require('express');
const cors = require('cors');
const app = express();
const path = require('path');

// Configuración mejorada de CORS
app.use(cors({
  origin: ['http://localhost:3001', 'http://127.0.0.1:3001'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Cache-Control'],
  exposedHeaders: ['Content-Disposition']
}));

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuración de archivos estáticos con middleware personalizado
app.use('/uploads', (req, res, next) => {
  // Forzar descarga para archivos PDF cuando se agrega ?download=true
  if (req.path.endsWith('.pdf') && req.query.download === 'true') {
    res.setHeader('Content-Disposition', 'attachment');
  }
  express.static(path.join(__dirname, 'uploads'))(req, res, next);
});

// Rutas
const authRoutes = require('./routes/authRoutes');
const docenteRoutes = require('./routes/docenteRoutes');
const sharedRoutes = require('./routes/sharedRoutes');
const userRoutes = require('./routes/userRoutes');

app.use('/api', authRoutes);
app.use('/api/docente', docenteRoutes);
app.use('/api/general', sharedRoutes);
app.use('/api', userRoutes);

// Puerto
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});