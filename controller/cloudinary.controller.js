const fs = require('fs');
const { cloudinaryServices } = require('../services/cloudinary.service');

// add image
const saveImageCloudinary = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded',
      });
    }

    const result = await cloudinaryServices.cloudinaryImageUpload(
      req.file.buffer
    );

    res.status(200).json({
      success: true,
      message: 'Image uploaded and optimized successfully',
      data: {
        url: result.secure_url,
        id: result.public_id,
        format: result.format,
        size: result.bytes,
        original_filename: result.original_filename,
      },
    });
  } catch (err) {
    console.error('Error uploading image:', err);
    next(err);
  }
};

// add multiple images
const addMultipleImageCloudinary = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No files uploaded',
      });
    }

    // Check if number of files exceeds limit
    if (req.files.length > 10) {
      return res.status(400).json({
        success: false,
        message: 'Maximum 10 files can be uploaded at once',
      });
    }

    // Log the files being processed
    console.log(`Processing ${req.files.length} files for upload`);

    const results = await cloudinaryServices.cloudinaryMultipleImageUpload(
      req.files
    );

    // Check if we got any successful uploads
    if (!results || results.length === 0) {
      return res.status(500).json({
        success: false,
        message: 'Failed to upload any images',
      });
    }

    // Log successful uploads
    console.log(`Successfully uploaded ${results.length} files`);

    res.status(200).json({
      success: true,
      message: `Successfully uploaded ${results.length} images`,
      data: results.map(result => ({
        url: result.secure_url,
        id: result.public_id,
        format: result.format,
        size: result.bytes,
        original_filename: result.original_filename,
      })),
    });
  } catch (err) {
    console.error('Error in multiple image upload controller:', err);
    next(err);
  }
};

// cloudinary ImageDelete
const cloudinaryDeleteController = async (req, res) => {
  try {
    const { folder_name, id } = req.query;
    if (!folder_name || !id) {
      return res.status(400).json({
        success: false,
        message: 'Missing folder_name or id parameter',
      });
    }

    const public_id = `${folder_name}/${id}`;
    const result = await cloudinaryServices.cloudinaryImageDelete(public_id);

    res.status(200).json({
      success: true,
      message: 'Image deleted successfully',
      data: result,
    });
  } catch (err) {
    console.error('Error deleting image:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to delete image',
      error: err.message,
    });
  }
};

exports.cloudinaryController = {
  cloudinaryDeleteController,
  saveImageCloudinary,
  addMultipleImageCloudinary,
};
