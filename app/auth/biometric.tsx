import * as LocalAuthentication from "expo-local-authentication";
import { useLocalSearchParams, useRouter } from "expo-router";
import { AlertCircle, Fingerprint, ShieldCheck, User } from "lucide-react-native";
import { useState } from "react";
import { Alert, Modal, StatusBar, Text, TouchableOpacity, View } from "react-native";

const COLORS = {
  red: '#F9423A',
  white: '#FFFFFF',
  textDark: '#111827',
  textSecondary: '#6B7280',
  textMuted: '#9CA3AF',
  border: '#E5E7EB',
  bg: '#F9FAFB',
  surface: '#FFFFFF',
};

export default function BiometricScreen() {
  const router = useRouter();
  const { cin } = useLocalSearchParams<{ cin?: string }>();
  const [showNoAccountModal, setShowNoAccountModal] = useState(false);
  const [showNoUserModal, setShowNoUserModal] = useState(false);

  const validateBiometric = async () => {
    // Vérifier si un CIN est fourni
    if (!cin || cin.trim() === "") {
      setShowNoUserModal(true);
      return;
    }

    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    if (!hasHardware) {
      Alert.alert("Biometrie indisponible", "Aucun capteur biométrique n'est disponible sur cet appareil.");
      return;
    }

    const isEnrolled = await LocalAuthentication.isEnrolledAsync();
    if (!isEnrolled) {
      setShowNoAccountModal(true);
      return;
    }

    const availableTypes = await LocalAuthentication.supportedAuthenticationTypesAsync();
    const fingerprintSupported = availableTypes.includes(LocalAuthentication.AuthenticationType.FINGERPRINT);

    if (!fingerprintSupported) {
      Alert.alert("Empreinte indisponible", "Votre appareil ne supporte pas l'authentification par empreinte.");
      return;
    }

    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: "Verifier votre identite par empreinte",
      cancelLabel: "Annuler",
      disableDeviceFallback: false,
    });

    if (!result.success) {
      Alert.alert("Echec de verification", "La verification biométrique a echoue ou a ete annulee.");
      return;
    }

    Alert.alert("Validation", "Verification empreinte reussie.");
    router.replace({ pathname: "/home", params: { cin: cin ?? "" } });
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.surface, paddingHorizontal: 24, paddingTop: 56 }}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.red} />
      <View style={{ backgroundColor: COLORS.red, borderRadius: 16, padding: 20, marginBottom: 32 }}>
        <Text style={{ fontSize: 20, fontWeight: 'bold', color: COLORS.white }}>Vérification biométrique</Text>
        <Text style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)', marginTop: 4 }}>Dernière étape avant accès à l&apos;élection.</Text>
      </View>

      <View style={{ alignItems: 'center', marginBottom: 32 }}>
        <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: '#FEF2F2', alignItems: 'center', justifyContent: 'center' }}>
          <ShieldCheck size={36} color={COLORS.red} />
        </View>
        <Text style={{ fontSize: 16, color: COLORS.textDark, textAlign: 'center', marginTop: 12 }}>CIN: {cin || "***"}</Text>
      </View>

      <TouchableOpacity
        style={{
          height: 56,
          borderRadius: 12,
          backgroundColor: '#F3F4F6',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          marginBottom: 12,
        }}
        onPress={validateBiometric}
      >
        <Fingerprint size={20} color="#374151" />
        <Text style={{ fontSize: 16, fontWeight: '600', color: '#374151' }}>Vérifier par empreinte</Text>
      </TouchableOpacity>

      {/* Modal Aucun utilisateur */}
      <Modal
        visible={showNoUserModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowNoUserModal(false)}
      >
        <View style={{
          flex: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          justifyContent: 'center',
          alignItems: 'center',
          paddingHorizontal: 20,
        }}>
          <View style={{
            backgroundColor: COLORS.surface,
            borderRadius: 20,
            padding: 24,
            alignItems: 'center',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.25,
            shadowRadius: 16,
            elevation: 12,
            minWidth: 300,
            maxWidth: 350,
          }}>
            <View style={{
              width: 56,
              height: 56,
              borderRadius: 28,
              backgroundColor: '#FEF3C7',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 16,
            }}>
              <User size={28} color="#F59E0B" strokeWidth={2} />
            </View>
            <Text style={{
              fontSize: 18,
              fontWeight: '700',
              color: COLORS.textDark,
              textAlign: 'center',
              marginBottom: 8,
              letterSpacing: 0.2,
            }}>
              Aucun utilisateur détecté
            </Text>
            <Text style={{
              fontSize: 14,
              color: COLORS.textSecondary,
              textAlign: 'center',
              lineHeight: 20,
              marginBottom: 20,
            }}>
              Aucun numéro CIN n&apos;a été fourni. Veuillez vous connecter avec vos identifiants ou créer un compte pour accéder à l&apos;application.
            </Text>
            <TouchableOpacity
              onPress={() => {
                setShowNoUserModal(false);
                router.replace('/auth/login');
              }}
              style={{
                backgroundColor: COLORS.red,
                borderRadius: 12,
                paddingHorizontal: 24,
                paddingVertical: 12,
                width: '100%',
                alignItems: 'center',
              }}>
              <Text style={{
                fontSize: 14,
                fontWeight: '600',
                color: COLORS.white,
                letterSpacing: 0.2,
              }}>
                Se connecter
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal Aucun compte biométrique */}
      <Modal
        visible={showNoAccountModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowNoAccountModal(false)}
      >
        <View style={{
          flex: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          justifyContent: 'center',
          alignItems: 'center',
          paddingHorizontal: 20,
        }}>
          <View style={{
            backgroundColor: COLORS.surface,
            borderRadius: 20,
            padding: 24,
            alignItems: 'center',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.25,
            shadowRadius: 16,
            elevation: 12,
            minWidth: 300,
            maxWidth: 350,
          }}>
            <View style={{
              width: 56,
              height: 56,
              borderRadius: 28,
              backgroundColor: '#FEE2E2',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 16,
            }}>
              <AlertCircle size={28} color={COLORS.red} strokeWidth={2} />
            </View>
            <Text style={{
              fontSize: 18,
              fontWeight: '700',
              color: COLORS.textDark,
              textAlign: 'center',
              marginBottom: 8,
              letterSpacing: 0.2,
            }}>
              Aucun compte biométrique
            </Text>
            <Text style={{
              fontSize: 14,
              color: COLORS.textSecondary,
              textAlign: 'center',
              lineHeight: 20,
              marginBottom: 20,
            }}>
              Aucune empreinte ou visage n&apos;est enregistré sur cet appareil. Veuillez configurer l&apos;authentification biométrique dans les paramètres de votre téléphone.
            </Text>
            <TouchableOpacity
              onPress={() => setShowNoAccountModal(false)}
              style={{
                backgroundColor: COLORS.red,
                borderRadius: 12,
                paddingHorizontal: 24,
                paddingVertical: 12,
                width: '100%',
                alignItems: 'center',
              }}>
              <Text style={{
                fontSize: 14,
                fontWeight: '600',
                color: COLORS.white,
                letterSpacing: 0.2,
              }}>
                Compris
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
