
const axios = require('axios');
const express = require('express');
const router = express.Router();
const db = require('../models/db');

router.get('/download/:id_recurso', async (req, res) => {
  try {
    const { id_recurso } = req.params;

    // Obtener info del recurso
    const [rows] = await db.promise().query(
      'SELECT archivo_url, titulo, tipo_archivo FROM recursos WHERE id_recurso = ?',
      [id_recurso]
    );

    if (rows.length === 0) {
      return res.status(404).send('Recurso no encontrado');
    }

    const resource = rows[0];
    const cloudinaryUrl = resource.archivo_url;

    // Descargar desde Cloudinary
    const response = await axios({
      method: 'get',
      url: cloudinaryUrl,
      responseType: 'stream'
    });

    // Forzar header de descarga
    const fileName = `${resource.titulo}.${resource.tipo_archivo.toLowerCase()}`;

    res.setHeader('Content-Type', response.headers['content-type'] || 'application/octet-stream');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);

    // Pipe al cliente
    response.data.pipe(res);

  } catch (error) {
    console.error('Error al descargar recurso:', error);
    res.status(500).send('Error al descargar el recurso');
  }
});

module.exports = router;
