import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, StatusBar, View } from 'react-native';
import FaceRecognition from '../../components/FaceRecognition';
import faceRecognitionService from '../../services/faceRecognitionService';

const COLORS_LOCAL = {
  red: '#F9423A',
  redLight: '#FFF0EF',
  redDark: '#D93530',
  green: '#00843D',
  white: '#FFFFFF',
  textDark: '#111827',
  textMuted: '#9CA3AF',
  textSecondary: '#6B7280',
  border: '#E5E7EB',
  borderFocus: '#F9423A',
  bg: '#F9FAFB',
  surface: '#FFFFFF',
};

export default function FaceRecognitionScreen() {
  const router = useRouter();
  const { cin, mode = 'verify' } = useLocalSearchParams<{ cin?: string; mode?: 'verify' | 'register' }>();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFaceCapture = async (imageUri: string) => {
    if (!cin) {
      Alert.alert('Erreur', 'Numéro CIN requis');
      return;
    }

    setIsProcessing(true);

    try {
      const qualityCheck = await faceRecognitionService.analyzeImageQuality(imageUri);
      
      if (!qualityCheck.isGoodQuality) {
        Alert.alert(
          'Qualité insuffisante',
          `L'image n'est pas assez claire. ${qualityCheck.recommendations.join('. ')}`,
          [{ text: 'OK', style: 'default' }]
        );
        setIsProcessing(false);
        return;
      }

      if (mode === 'register') {
        const result = await faceRecognitionService.registerFaceWithImage(
          `user_${cin}`,
          cin,
          imageUri
        );

        if (result.success) {
          Alert.alert(
            'Succès',
            'Votre visage a été enregistré avec succès. Vous pouvez maintenant utiliser la reconnaissance faciale.',
            [
              {
                text: 'OK',
                onPress: () => router.back(),
              },
            ]
          );
        } else {
          Alert.alert('Erreur', result.error || 'Impossible d\'enregistrer votre visage');
        }
      } else {
        const result = await faceRecognitionService.verifyFaceLocally(imageUri, `user_${cin}`, cin);

        if (result.success && result.confidence && result.confidence > 0.75) {
          Alert.alert(
            'Authentification réussie',
            'Votre visage a été vérifié avec succès.',
            [
              {
                text: 'Continuer',
                onPress: () => {
                  router.push({ pathname: '/OTP', params: { cin, verified: 'true' } });
                },
              },
            ]
          );
        } else if (result.success && result.confidence && result.confidence <= 0.75) {
          Alert.alert(
            'Confiance faible',
            `La correspondance est faible (${Math.round(result.confidence * 100)}%). Veuillez réessayer.`,
            [{ text: 'OK', style: 'default' }]
          );
        } else {
          Alert.alert(
            'Échec de la vérification',
            result.error || 'Visage non reconnu. Veuillez réessayer.',
            [{ text: 'OK', style: 'default' }]
          );
        }
      }
    } catch (error) {
      console.error('Face recognition error:', error);
      Alert.alert(
        'Erreur technique',
        'Une erreur technique est survenue. Veuillez réessayer plus tard.',
        [{ text: 'OK', style: 'default' }]
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS_LOCAL.bg }}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS_LOCAL.red} />
      
      <FaceRecognition
        onCapture={handleFaceCapture}
        onCancel={handleCancel}
        title={
          mode === 'register'
            ? "Enregistrement Faciale"
            : "Vérification Faciale"
        }
        subtitle={
          mode === 'register'
            ? "Positionnez votre visage clairement dans le cadre pour l'enregistrement"
            : "Positionnez votre visage dans le cadre pour l'authentification"
        }
      />
    </View>
  );
}
