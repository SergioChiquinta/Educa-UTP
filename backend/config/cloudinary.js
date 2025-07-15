
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
    return {
      folder: 'recursos',
      public_id: `${Date.now()}-${file.originalname}`,
      resource_type: 'raw',
      type: 'upload',
      access_mode: 'public',
    };
  },
});

module.exports = { cloudinary, storage };
