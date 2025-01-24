import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useState } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSetAtom } from 'jotai';
import { activeComponentAtom } from '@/store/atoms';
import * as FileSystem from 'expo-file-system';
import { NoteData } from './Note';

interface CameraProps {
  onClose: () => void;
  onPhotoTaken: (note: NoteData) => void;
}

export default function Camera({ onClose, onPhotoTaken }: CameraProps) {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [camera, setCamera] = useState<CameraView | null>(null);
  const setActiveComponent = useSetAtom(activeComponentAtom);

  const takePicture = async () => {
    if (camera) {
      try {
        const photo = await camera.takePictureAsync();
        if (!photo) return;  // Add early return if photo is undefined
        
        // Create a unique filename
        const filename = `${FileSystem.documentDirectory}photos/${Date.now()}.jpg`;
        
        // Ensure directory exists
        await FileSystem.makeDirectoryAsync(
          `${FileSystem.documentDirectory}photos`,
          { intermediates: true }
        );
        
        // Move photo to permanent location
        await FileSystem.moveAsync({
          from: photo.uri,
          to: filename
        });

        // Create a new note with the photo
        const newNote: NoteData = {
          id: Date.now().toString(),
          title: 'Photo Note',
          content: '',
          timestamp: Date.now(),
          color: '#BAE1FF',
          imageUri: filename
        };

        onPhotoTaken(newNote);
        setActiveComponent('none');
      } catch (error) {
        console.error('Error taking picture:', error);
      }
    }
  };

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center' }}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView 
        ref={ref => setCamera(ref)}
        style={styles.camera} 
        facing={facing}
      >
        <TouchableOpacity style={styles.backButton} onPress={onClose}>
          <Text style={styles.backText}>×</Text>
        </TouchableOpacity>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
            <Text style={styles.text}>Flip Camera</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.captureButton]} onPress={takePicture}>
            <View style={styles.captureInner} />
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 64,
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  button: {
    alignItems: 'center',
    padding: 20,
  },
  text: {
    fontSize: 17,
    fontWeight: '600',
    color: 'white',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  backText: {
    color: 'white',
    fontSize: 30,
    fontWeight: 'bold',
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  captureInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#007AFF',
  }
});