const { secret } = require('../config/secret');
const cloudinary = require('../utils/cloudinary');
const { Readable } = require('stream');

// cloudinary Image Upload
// const cloudinaryImageUpload = async (image) => {
//   console.log('image service',image)
//   const uploadRes = await cloudinary.uploader.upload(image, {
//     upload_preset: secret.cloudinary_upload_preset,
//   });
//   return uploadRes;
// };

const cloudinaryImageUpload = imageBuffer => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        upload_preset: secret.cloudinary_upload_preset,
        transformation: [
          {
            quality: 'auto',
            fetch_format: 'webp',
            format: 'webp',
            flags: 'lossy',
          },
        ],
      },
      (error, result) => {
        if (error) {
          console.error('Error uploading to Cloudinary:', error);
          reject(error);
        } else {
          resolve(result);
        }
      }
    );

    const bufferStream = new Readable();
    bufferStream.push(imageBuffer);
    bufferStream.push(null);

    bufferStream.pipe(uploadStream);
  });
};

// Handle multiple image uploads
const cloudinaryMultipleImageUpload = async files => {
  try {
    // Process each file one by one to prevent memory issues
    const results = [];
    for (const file of files) {
      try {
        const result = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              upload_preset: secret.cloudinary_upload_preset,
              transformation: [
                {
                  quality: 'auto',
                  fetch_format: 'webp',
                  format: 'webp',
                  flags: 'lossy',
                },
              ],
            },
            (error, result) => {
              if (error) {
                console.error('Error uploading file:', error);
                reject(error);
              } else {
                resolve(result);
              }
            }
          );

          // Create a new readable stream for each file
          const bufferStream = new Readable();
          bufferStream.push(file.buffer);
          bufferStream.push(null);
          bufferStream.pipe(uploadStream);
        });

        results.push(result);
      } catch (error) {
        console.error(`Error uploading file: ${file.originalname}`, error);
        // Continue with next file even if one fails
        continue;
      }
    }

    return results;
  } catch (error) {
    console.error('Error in multiple image upload:', error);
    throw error;
  }
};

// cloudinaryImageDelete
const cloudinaryImageDelete = async public_id => {
  const deletionResult = await cloudinary.uploader.destroy(public_id);
  return deletionResult;
};

exports.cloudinaryServices = {
  cloudinaryImageDelete,
  cloudinaryImageUpload,
  cloudinaryMultipleImageUpload,
};
