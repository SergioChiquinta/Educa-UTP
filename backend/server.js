
const express = require('express');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors());  // <--- HABILITA CORS
app.use(express.json());

// Rutas
const authRoutes = require('./routes/authRoutes');
app.use('/api', authRoutes);

// Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});