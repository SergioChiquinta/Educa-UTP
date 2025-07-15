
const axios = require('axios');
const express = require('express');
const router = express.Router();
const db = require('../models/db');

router.get('/view-pdf/:id_recurso', async (req, res) => {
  try {
    const { id_recurso } = req.params;

    // Obtener URL de Cloudinary desde DB
    const [rows] = await db.promise().query(
      'SELECT archivo_url FROM recursos WHERE id_recurso = ?',
      [id_recurso]
    );

    if (rows.length === 0) {
      return res.status(404).send('Recurso no encontrado');
    }

    const cloudinaryUrl = rows[0].archivo_url;

    // Descargar archivo desde Cloudinary
    const response = await axios({
      method: 'get',
      url: cloudinaryUrl,
      responseType: 'stream'
    });

    // Setear el header correcto
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline'); // <-- Para abrir en navegador

    // Pipe para enviar al cliente
    response.data.pipe(res);

  } catch (error) {
    console.error('Error al servir PDF:', error);
    res.status(500).send('Error al obtener el PDF');
  }
});

module.exports = router;
