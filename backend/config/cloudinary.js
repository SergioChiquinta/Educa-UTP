
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
    
    // Extraer el nombre del archivo sin extensión
    const originalName = path.parse(file.originalname).name;
    
    return {
      folder: 'recursos',
      public_id: `${Date.now()}-${originalName}`, // Usar solo el nombre sin extensión
      resource_type: isPDF ? 'image' : 'raw',
      type: 'upload',
      access_mode: 'public',
      sign_url: false,
      use_filename: true,
      unique_filename: false,
      format: isPDF ? 'pdf' : undefined, // Forzar formato PDF cuando corresponda
    };
  },
});

module.exports = { cloudinary, storage };
