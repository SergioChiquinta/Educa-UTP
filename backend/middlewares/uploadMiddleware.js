
// middlewares/uploadMiddleware.js

// Middleware: multer para manejo de archivos
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: 'uploads/recursos/',
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = ['.pdf', '.docx', '.pptx'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowed.includes(ext)) cb(null, true);
  else cb(new Error('Formato de archivo no permitido'), false);
};

const upload = multer({ storage, fileFilter });

module.exports = upload;
