import { useRouter } from 'expo-router';
import { Check, Eye, EyeOff, Fingerprint, ScanFace, ShieldCheck, UserRound } from 'lucide-react-native';
import React, { useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StatusBar,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

// ─── Palette ──────────────────────────────────────────────
const COLORS = {
  red: '#F9423A',
  redLight: '#FFF0EF',
  green: '#00843D',
  white: '#FFFFFF',
  textDark: '#1A1A1A',
  textMuted: '#888888',
  border: '#E8E8E8',
  bg: '#F7F7F7',
};

export default function LoginScreen() {
  const router = useRouter();
  const [cin, setCin] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [cinFocused, setCinFocused] = useState(false);
  const [pwdFocused, setPwdFocused] = useState(false);

  const handleLogin = () => {
    if (!cin.trim()) {
      Alert.alert('Champ requis', 'Veuillez saisir votre numéro CIN.');
      return;
    }
    if (!password.trim()) {
      Alert.alert('Champ requis', 'Veuillez saisir votre mot de passe.');
      return;
    }
    router.push({ pathname: '/OTP', params: { cin } });
  };

  const handleBiometricFingerprint = () => {
    Alert.alert('Info', 'Ecran biometrie non implemente pour le moment.');
  };

  const handleBiometricFace = () => {
    Alert.alert('Info', 'Ecran biometrie non implemente pour le moment.');
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar barStyle="light-content" backgroundColor={COLORS.red} />
      <ScrollView
        className="flex-1"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* ── Header ── */}
        <View className="bg-red-500 pt-12 px-5 pb-10">
          <Text className="text-white/65 text-xs font-semibold tracking-widest mb-1.5">BIENVENUE</Text>
          <Text className="text-white text-[22px] font-bold tracking-tight mb-1.5">Connexion électeur</Text>
          <Text className="text-white/80 text-sm">
            Entrez votre CIN pour accéder au scrutin
          </Text>
        </View>

        {/* ── Avatar ── */}
        <View className="items-center mt-[-26px] mb-5">
          <View className="w-13 h-13 rounded-full bg-white border-3 border-white items-center justify-center shadow-lg shadow-red-500/20">
            <UserRound size={24} color="#F9423A" strokeWidth={2} />
          </View>
        </View>

        {/* ── Form ── */}
        <View className="px-5 pb-8">
          {/* CIN */}
          <View className="mb-3.5">
            <Text className="text-xs text-gray-500 font-semibold tracking-wide mb-1.5">NUMÉRO CIN</Text>
            <View className={`flex-row items-center h-12 border-[1.5px] ${
              cinFocused ? "border-red-500" : "border-gray-200"
            } rounded-xl px-3.5 bg-white`}>
              <TextInput
                className="flex-1 text-sm text-gray-900 font-medium"
                placeholder="Ex : 101 234 567 890"
                placeholderTextColor={COLORS.textMuted}
                value={cin}
                onChangeText={setCin}
                keyboardType="numeric"
                onFocus={() => setCinFocused(true)}
                onBlur={() => setCinFocused(false)}
                maxLength={18}
              />
              {cin.length >= 10 && (
                <View className="ml-2">
                  <Check size={16} color="#16A34A" strokeWidth={2.5} />
                </View>
              )}
            </View>
          </View>

          {/* Password */}
          <View className="mb-3.5">
            <Text className="text-xs text-gray-500 font-semibold tracking-wide mb-1.5">MOT DE PASSE</Text>
            <View className={`flex-row items-center h-12 border-[1.5px] ${
              pwdFocused ? "border-red-500" : "border-gray-200"
            } rounded-xl px-3.5 bg-white`}>
              <TextInput
                className="flex-1 text-sm text-gray-900 font-medium"
                placeholder="Votre mot de passe"
                placeholderTextColor={COLORS.textMuted}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                onFocus={() => setPwdFocused(true)}
                onBlur={() => setPwdFocused(false)}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                className="ml-2 p-0.5"
              >
                {showPassword ? (
                  <EyeOff size={18} color="#6B7280" strokeWidth={2} />
                ) : (
                  <Eye size={18} color="#6B7280" strokeWidth={2} />
                )}
              </TouchableOpacity>
            </View>
          </View>

          {/* CTA */}
          <TouchableOpacity className="h-13 bg-red-500 rounded-[14px] items-center justify-center mt-2 shadow-lg shadow-red-500/30" onPress={handleLogin} activeOpacity={0.85}>
            <View className="flex-row items-center gap-2">
              <ShieldCheck size={18} color="#FFFFFF" strokeWidth={2.2} />
              <Text className="text-white text-[15px] font-bold tracking-wide">Se connecter</Text>
            </View>
          </TouchableOpacity>

          {/* Divider */}
          <View className="flex-row items-center my-4 gap-2.5">
            <View className="flex-1 h-px bg-gray-100" />
            <Text className="text-xs text-gray-300">ou continuer avec</Text>
            <View className="flex-1 h-px bg-gray-100" />
          </View>

          {/* Biometric buttons */}
          <View className="flex-row gap-2.5">
            <TouchableOpacity
              className="flex-1 h-12 border-[1.5px] border-gray-200 rounded-xl items-center justify-center flex-row gap-1.5 bg-white"
              onPress={handleBiometricFingerprint}
              activeOpacity={0.7}
            >
              <Fingerprint size={18} color="#4B5563" strokeWidth={2} />
              <Text className="text-sm text-gray-600 font-medium">Empreinte</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-1 h-12 border-[1.5px] border-gray-200 rounded-xl items-center justify-center flex-row gap-1.5 bg-white"
              onPress={handleBiometricFace}
              activeOpacity={0.7}
            >
              <ScanFace size={18} color="#4B5563" strokeWidth={2} />
              <Text className="text-sm text-gray-600 font-medium">Facial</Text>
            </TouchableOpacity>
          </View>

          {/* Support link */}
          <TouchableOpacity className="items-center mt-4">
            <Text className="text-xs text-gray-500">
              Problème d&apos;accès ?{' '}
              <Text className="text-red-500 font-semibold">Contacter le support</Text>
            </Text>
          </TouchableOpacity>

          <TouchableOpacity className="items-center mt-3" onPress={() => router.push("/auth/register")}>
            <Text className="text-xs text-gray-500">
              Nouveau ici ? <Text className="text-red-500 font-semibold">Créer un compte</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}