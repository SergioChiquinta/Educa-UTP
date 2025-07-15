
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    let ext = 'pdf';
    if (file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      ext = 'docx';
    }

    return {
      folder: 'recursos',
      format: ext,
      public_id: `${Date.now()}-${file.originalname.split('.')[0]}`,
      resource_type: 'raw',
      type: 'upload', // Esto hace el archivo público y solucionará el error 401
      access_mode: 'public'
    };
  },
});

module.exports = { cloudinary, storage };
