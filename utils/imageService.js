import * as ImagePicker from 'expo-image-picker';

// Cloudinary configuration
const CLOUDINARY_CLOUD_NAME = "Untitled";
const CLOUDINARY_UPLOAD_PRESET = "NDUNGU";

/**
 * Pick an image from the device's library
 * @returns {Promise<Object>} - The selected image
 */
export const pickImage = async () => {
  try {
    // Request permission
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== 'granted') {
      throw new Error('Permission to access media library was denied');
    }

    // Pick the image
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (result.canceled) {
      return null;
    }

    return result.assets[0];
  } catch (error) {
    console.error('Error picking image:', error);
    throw error;
  }
};

/**
 * Take a photo with the device's camera
 * @returns {Promise<Object>} - The captured image
 */
export const takePhoto = async () => {
  try {
    // Request permission
    const { status } = await ImagePicker.requestCameraPermissionsAsync();

    if (status !== 'granted') {
      throw new Error('Permission to access camera was denied');
    }

    // Take the photo
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (result.canceled) {
      return null;
    }

    return result.assets[0];
  } catch (error) {
    console.error('Error taking photo:', error);
    throw error;
  }
};

/**
 * Upload an image to Cloudinary
 * @param {string} uri - The URI of the image to upload
 * @returns {Promise<string>} - The URL of the uploaded image
 */
export const uploadImage = async (uri) => {
  try {
    const apiUrl = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

    // Create form data for the upload
    const formData = new FormData();
    formData.append('file', {
      uri,
      type: 'image/jpeg',
      name: 'upload.jpg',
    });
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

    // Upload the image
    const response = await fetch(apiUrl, {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'multipart/form-data',
      },
    });

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error.message);
    }

    return data.secure_url;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};
