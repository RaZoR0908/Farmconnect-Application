/**
 * Image Upload Service (via Backend API)
 * 
 * All image uploads are now handled through the backend API
 * which securely manages Cloudinary credentials.
 */

import api from '../config/api';

/**
 * Upload image to Cloudinary via backend
 * @param {string} imageUri - Local URI of the image
 * @returns {Promise<string>} - Cloudinary image URL
 */
export const uploadToCloudinary = async (imageUri) => {
  try {
    // Create form data
    const formData = new FormData();
    
    // Get filename from URI
    const filename = imageUri.split('/').pop();
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : 'image/jpeg';

    formData.append('image', {
      uri: imageUri,
      type: type,
      name: filename || 'upload.jpg',
    });

    // Upload via backend API
    const response = await api.post('/upload/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if (response.data.success) {
      return response.data.data.url;
    } else {
      throw new Error(response.data.message || 'Upload failed');
    }
  } catch (error) {
    console.error('Image upload error:', error);
    throw new Error(
      error.response?.data?.message || 
      error.message || 
      'Failed to upload image'
    );
  }
};

/**
 * Upload multiple images to Cloudinary via backend
 * @param {Array<string>} imageUris - Array of local image URIs
 * @param {function} onProgress - Optional callback (index, total)
 * @returns {Promise<Array<string>>} - Array of Cloudinary image URLs
 */
export const uploadMultipleToCloudinary = async (imageUris, onProgress = null) => {
  try {
    // Create form data
    const formData = new FormData();
    
    // Add all images to form data
    imageUris.forEach((imageUri, index) => {
      const filename = imageUri.split('/').pop();
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : 'image/jpeg';

      formData.append('images', {
        uri: imageUri,
        type: type,
        name: filename || `upload-${index}.jpg`,
      });
    });

    // Report progress if callback provided
    if (onProgress) {
      onProgress(0, imageUris.length);
    }

    // Upload via backend API
    // Note: We explicitly set Content-Type to multipart/form-data
    // and axios will add the boundary parameter automatically
    const response = await api.post('/upload/images', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      transformRequest: (data, headers) => {
        // Return the FormData as-is, don't transform it
        return data;
      },
    });

    if (response.data.success) {
      // Report completion
      if (onProgress) {
        onProgress(imageUris.length, imageUris.length);
      }
      
      return response.data.data.urls;
    } else {
      throw new Error(response.data.message || 'Upload failed');
    }
  } catch (error) {
    console.error('Multiple images upload error:', error);
    throw new Error(
      error.response?.data?.message || 
      error.message || 
      'Failed to upload images'
    );
  }
};

/**
 * Get optimized image URL with transformations
 * Cloudinary transformations can be added to the URL
 * @param {string} imageUrl - Original Cloudinary URL
 * @param {Object} options - Transformation options
 * @returns {string} - Transformed image URL
 */
export const getOptimizedImageUrl = (imageUrl, options = {}) => {
  const { width = 400, height = 400, quality = 'auto', crop = 'fill' } = options;
  
  if (!imageUrl || !imageUrl.includes('cloudinary.com')) {
    return imageUrl;
  }

  // Insert transformations into Cloudinary URL
  const transformations = `w_${width},h_${height},c_${crop},q_${quality}`;
  return imageUrl.replace('/upload/', `/upload/${transformations}/`);
};

