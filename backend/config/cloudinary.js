
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'recursos',   // Carpeta en Cloudinary
    allowed_formats: ['pdf', 'docx'],
    resource_type: 'raw', // Para archivos binarios (PDF, DOCX)
    public_id: (req, file) => `${Date.now()}-${file.originalname.split('.')[0]}`
  },
});

module.exports = { cloudinary, storage };
