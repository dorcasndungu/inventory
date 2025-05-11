import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { Button, Text } from 'react-native-paper';
import { useImagePicker } from '../hooks/useImagePicker';

interface ImagePickerComponentProps {
  onImageSelected: (uri: string) => void;
  existingImageUrl?: string;
}

export const ImagePickerComponent: React.FC<ImagePickerComponentProps> = ({
  onImageSelected,
  existingImageUrl,
}) => {
  const { image, loading, error, takePhoto, pickImage, resetImage } = useImagePicker();
  
  // If an image is selected or an existing image is provided, show it
  const displayImage = image || existingImageUrl;
  
  const handleTakePhoto = async () => {
    const uri = await takePhoto();
    if (uri) {
      onImageSelected(uri);
    }
  };
  
  const handlePickImage = async () => {
    const uri = await pickImage();
    if (uri) {
      onImageSelected(uri);
    }
  };
  
  const handleReset = () => {
    resetImage();
    onImageSelected('');
  };
  
  return (
    <View style={styles.container}>
      {displayImage ? (
        <View style={styles.imagePreviewContainer}>
          <Image
            source={{ uri: displayImage }}
            style={styles.imagePreview}
            contentFit="cover"
          />
          <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
            <Text style={styles.resetButtonText}>✕</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.placeholderContainer}>
          <Text variant="bodyLarge">No image selected</Text>
        </View>
      )}
      
      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          onPress={handleTakePhoto}
          loading={loading}
          style={styles.button}
          icon="camera"
        >
          Camera
        </Button>
        <Button
          mode="contained"
          onPress={handlePickImage}
          loading={loading}
          style={styles.button}
          icon="image"
        >
          Gallery
        </Button>
      </View>
      
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 16,
  },
  placeholderContainer: {
    width: '100%',
    height: 200,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  imagePreviewContainer: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 16,
    position: 'relative',
  },
  imagePreview: {
    width: '100%',
    height: '100%',
  },
  resetButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  resetButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    flex: 1,
    marginHorizontal: 4,
  },
  errorText: {
    color: 'red',
    marginTop: 8,
  },
});
