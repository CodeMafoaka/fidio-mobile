import { CameraType, CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { Camera, CameraOff, Check, Upload, X } from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

const COLORS = {
  red: '#F9423A',
  green: '#00843D',
  white: '#FFFFFF',
  black: '#000000',
  border: '#E5E7EB',
  bg: '#F9FAFB',
  surface: '#FFFFFF',
};

interface FaceRecognitionProps {
  onCapture: (imageUri: string) => void;
  onCancel: () => void;
  title?: string;
  subtitle?: string;
}

export default function FaceRecognition({
  onCapture,
  onCancel,
  title = "Reconnaissance Faciale",
  subtitle = "Positionnez votre visage dans le cadre"
}: FaceRecognitionProps) {
  const [permission, requestPermission] = useCameraPermissions();
  const [cameraType, setCameraType] = useState<CameraType>('front');
  const [isCapturing, setIsCapturing] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const cameraRef = useRef<CameraView>(null);

  const screenWidth = Dimensions.get('window').width;
  const frameSize = screenWidth * 0.6;

  useEffect(() => {
    if (!permission) {
      requestPermission();
    }
  }, [permission]);

  const handleTakePicture = async () => {
    if (!cameraRef.current || isCapturing) return;

    setIsCapturing(true);
    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        base64: false,
        exif: false,
      });

      if (photo?.uri) {
        setCapturedImage(photo.uri);
      }
    } catch (error) {
      console.error('Error taking picture:', error);
      Alert.alert('Erreur', 'Impossible de capturer la photo');
    } finally {
      setIsCapturing(false);
    }
  };

  const handleImagePicker = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        base64: false,
      });

      if (!result.canceled && result.assets[0]?.uri) {
        setCapturedImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Erreur', 'Impossible de sélectionner une image');
    }
  };

  const handleConfirm = () => {
    if (capturedImage) {
      onCapture(capturedImage);
    }
  };

  const handleRetake = () => {
    setCapturedImage(null);
  };

  const toggleCameraType = () => {
    setCameraType(current => (current === 'back' ? 'front' : 'back'));
  };

  if (!permission) {
    return (
      <View style={styles.container}>
        <View style={styles.permissionContainer}>
          <CameraOff size={48} color={COLORS.textMuted} />
          <Text style={styles.permissionText}>Demande d'autorisation caméra...</Text>
        </View>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <View style={styles.permissionContainer}>
          <CameraOff size={48} color={COLORS.red} />
          <Text style={styles.permissionTitle}>Caméra requise</Text>
          <Text style={styles.permissionText}>
            Pour la reconnaissance faciale, nous avons besoin d'accéder à votre caméra
          </Text>
          <TouchableOpacity
            style={styles.permissionButton}
            onPress={requestPermission}
          >
            <Text style={styles.permissionButtonText}>Autoriser</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
            <Text style={styles.cancelButtonText}>Annuler</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>

      {/* Camera or Captured Image */}
      <View style={styles.cameraContainer}>
        {capturedImage ? (
          <View style={[styles.cameraView, { width: frameSize, height: frameSize }]}>
            <View style={styles.capturedPlaceholder}>
              <Check size={48} color={COLORS.green} />
              <Text style={styles.capturedText}>Photo capturée</Text>
            </View>
          </View>
        ) : (
          <View style={[styles.cameraContainer, { width: frameSize, height: frameSize }]}>
            <CameraView
              ref={cameraRef}
              style={[styles.cameraView, { width: frameSize, height: frameSize }]}
              facing={cameraType}
              enableTorch={false}
              mode="picture"
            />
            <View style={[styles.faceFrame, { width: frameSize, height: frameSize }]}>
              <View style={styles.frameCorner} />
              <View style={[styles.frameCorner, styles.frameCornerTopRight]} />
              <View style={[styles.frameCorner, styles.frameCornerBottomLeft]} />
              <View style={[styles.frameCorner, styles.frameCornerBottomRight]} />
            </View>
          </View>
        )}
      </View>

      <View style={styles.controls}>
        {capturedImage ? (
          <View style={styles.capturedControls}>
            <TouchableOpacity
              style={[styles.button, styles.retakeButton]}
              onPress={handleRetake}
            >
              <X size={20} color={COLORS.red} />
              <Text style={styles.retakeButtonText}>Reprendre</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.button, styles.confirmButton]}
              onPress={handleConfirm}
            >
              <Check size={20} color={COLORS.white} />
              <Text style={styles.confirmButtonText}>Confirmer</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.cameraControls}>
            <TouchableOpacity
              style={[styles.button, styles.secondaryButton]}
              onPress={handleImagePicker}
            >
              <Upload size={20} color={COLORS.textMuted} />
              <Text style={styles.secondaryButtonText}>Galerie</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.captureButton]}
              onPress={handleTakePicture}
              disabled={isCapturing}
            >
              {isCapturing ? (
                <ActivityIndicator size={24} color={COLORS.white} />
              ) : (
                <Camera size={24} color={COLORS.white} />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.secondaryButton]}
              onPress={toggleCameraType}
            >
              <CameraOff size={20} color={COLORS.textMuted} />
              <Text style={styles.secondaryButtonText}>Retourner</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
        <Text style={styles.cancelButtonText}>Annuler</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 40,
  },
  header: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.textDark,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 20,
  },
  cameraContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: COLORS.black,
    position: 'relative',
  },
  cameraView: {
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: COLORS.black,
  },
  faceFrame: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  frameCorner: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderColor: COLORS.red,
    top: '25%',
    left: '15%',
  },
  frameCornerTopRight: {
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderLeftWidth: 0,
    left: 'auto',
    right: '15%',
  },
  frameCornerBottomLeft: {
    borderTopWidth: 0,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
    top: 'auto',
    bottom: '25%',
  },
  frameCornerBottomRight: {
    borderTopWidth: 0,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderLeftWidth: 0,
    top: 'auto',
    bottom: '25%',
    left: 'auto',
    right: '15%',
  },
  capturedPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.surface,
  },
  capturedText: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.green,
  },
  controls: {
    width: '100%',
    paddingHorizontal: 40,
  },
  cameraControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  capturedControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 16,
    gap: 8,
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: COLORS.red,
    padding: 0,
  },
  secondaryButton: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textMuted,
  },
  retakeButton: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.red,
  },
  retakeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.red,
  },
  confirmButton: {
    flex: 1,
    backgroundColor: COLORS.green,
  },
  confirmButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.white,
  },
  permissionContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  permissionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.textDark,
    marginTop: 16,
    marginBottom: 8,
  },
  permissionText: {
    fontSize: 14,
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  permissionButton: {
    backgroundColor: COLORS.red,
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 16,
    marginBottom: 16,
  },
  permissionButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    paddingVertical: 12,
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textMuted,
  },
});
