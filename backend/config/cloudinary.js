
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
    const ext = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, ext);

    return {
      folder: 'recursos',
      public_id: `${Date.now()}-${baseName}`, // ✅ sin extensión repetida
      resource_type: 'raw',
      type: 'upload',
      access_mode: 'public',
    };
  },
});

module.exports = { cloudinary, storage };
