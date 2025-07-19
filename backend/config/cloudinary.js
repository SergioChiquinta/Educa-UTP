
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
    const isPDF = file.mimetype === 'application/pdf';

    return {
      folder: 'recursos',
      public_id: `${Date.now()}-${file.originalname}`,
      resource_type: isPDF ? 'image' : 'raw',
      type: 'upload',
      access_mode: 'public',
      sign_url: false,
      use_filename: true,
      unique_filename: false,
    };
  },
});

module.exports = { cloudinary, storage };
