const multer = require('multer');
const path = require('path');

const uploader = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    // Check mime type
    const supportedMimes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp',
    ];
    if (supportedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          `Unsupported file type. Only jpeg, jpg, png, and webp images are allowed`
        )
      );
    }
  },
  limits: {
    fileSize: 4000000, // 4MB
  },
});

module.exports = uploader;
