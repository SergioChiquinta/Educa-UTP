
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const path = require('path');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const isPDF = file.mimetype === 'application/pdf';
    const isDOCX = file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    
    // Extraer información del archivo
    const parsed = path.parse(file.originalname);
    
    return {
      folder: 'recursos',
      public_id: isPDF ? `${Date.now()}-${parsed.name}` : file.originalname, // Mantener extensión para DOCX
      resource_type: isPDF ? 'image' : 'raw',
      type: 'upload',
      access_mode: 'public',
      sign_url: false,
      use_filename: !isPDF, // Usar nombre completo para DOCX
      unique_filename: false,
      format: isPDF ? 'pdf' : undefined,
    };
  },
});

module.exports = { cloudinary, storage };