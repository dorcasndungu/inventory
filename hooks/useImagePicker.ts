import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';

export const useImagePicker = () => {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Request permissions for camera and media library
  const requestPermissions = async (): Promise<boolean> => {
    try {
      const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
      const mediaLibraryPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (!cameraPermission.granted || !mediaLibraryPermission.granted) {
        setError('Permission to access camera or media library was denied');
        return false;
      }
      
      return true;
    } catch (err) {
      console.error('Error requesting permissions:', err);
      setError('Failed to request permissions');
      return false;
    }
  };

  // Take a photo with the camera
  const takePhoto = async (): Promise<string | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const hasPermission = await requestPermissions();
      if (!hasPermission) return null;
      
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });
      
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const uri = result.assets[0].uri;
        setImage(uri);
        return uri;
      }
      
      return null;
    } catch (err) {
      console.error('Error taking photo:', err);
      setError('Failed to take photo');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Pick an image from the gallery
  const pickImage = async (): Promise<string | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const hasPermission = await requestPermissions();
      if (!hasPermission) return null;
      
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });
      
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const uri = result.assets[0].uri;
        setImage(uri);
        return uri;
      }
      
      return null;
    } catch (err) {
      console.error('Error picking image:', err);
      setError('Failed to pick image');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Reset the image
  const resetImage = () => {
    setImage(null);
    setError(null);
  };

  return {
    image,
    loading,
    error,
    takePhoto,
    pickImage,
    resetImage,
  };
};
