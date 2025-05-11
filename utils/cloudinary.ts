// Cloudinary configuration
export const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/Untitled/upload';
export const CLOUDINARY_UPLOAD_PRESET = 'NDUNGU';

/**
 * Uploads an image to Cloudinary
 * @param imageUri - The local URI of the image to upload
 * @returns The URL of the uploaded image
 */
export const uploadImageToCloudinary = async (imageUri: string): Promise<string> => {
  try {
    // Create form data for the image upload
    const formData = new FormData();
    
    // Get the filename from the URI
    const uriParts = imageUri.split('/');
    const fileName = uriParts[uriParts.length - 1];
    
    // Append the image to the form data
    formData.append('file', {
      uri: imageUri,
      name: fileName,
      type: 'image/jpeg',
    } as any);
    
    // Add the upload preset
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    
    // Upload the image to Cloudinary
    const response = await fetch(CLOUDINARY_URL, {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json',
      },
    });
    
    // Parse the response
    const data = await response.json();
    
    // Return the URL of the uploaded image
    return data.secure_url;
  } catch (error) {
    console.error('Error uploading image to Cloudinary:', error);
    throw error;
  }
};
