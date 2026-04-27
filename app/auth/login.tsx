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

const COLORS = {
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

// ─── Reusable Input Field ───────────────────────────────────
interface InputFieldProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  keyboardType?: 'default' | 'numeric' | 'phone-pad' | 'email-address';
  secureTextEntry?: boolean;
  maxLength?: number;
  showToggle?: boolean;
  showValid?: boolean;
  isValid?: boolean;
  onFocus?: () => void;
  onBlur?: () => void;
  focused?: boolean;
  rightElement?: React.ReactNode;
}

function InputField({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType = 'default',
  secureTextEntry = false,
  maxLength,
  showValid = false,
  isValid = false,
  onFocus,
  onBlur,
  focused = false,
  rightElement,
}: InputFieldProps) {
  return (
    <View className="mb-4">
      <Text
        className="text-[10px] font-bold tracking-[1.5px] mb-2"
        style={{ color: focused ? COLORS.red : COLORS.textSecondary }}
      >
        {label}
      </Text>
      <View
        className="flex-row items-center h-[52px] rounded-2xl px-4"
        style={{
          backgroundColor: focused ? '#FFFBFB' : COLORS.surface,
          borderWidth: focused ? 1.5 : 1,
          borderColor: focused ? COLORS.borderFocus : COLORS.border,
          shadowColor: focused ? COLORS.red : '#000',
          shadowOffset: { width: 0, height: focused ? 4 : 1 },
          shadowOpacity: focused ? 0.08 : 0.04,
          shadowRadius: focused ? 8 : 3,
          elevation: focused ? 3 : 1,
        }}
      >
        <TextInput
          className="flex-1 text-[14px] font-medium"
          style={{ color: COLORS.textDark, letterSpacing: 0.1 }}
          placeholder={placeholder}
          placeholderTextColor={COLORS.textMuted}
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
          secureTextEntry={secureTextEntry}
          onFocus={onFocus}
          onBlur={onBlur}
          maxLength={maxLength}
        />
        {showValid && isValid && (
          <View
            className="w-5 h-5 rounded-full items-center justify-center ml-2"
            style={{ backgroundColor: '#DCFCE7' }}
          >
            <Check size={11} color={COLORS.green} strokeWidth={3} />
          </View>
        )}
        {rightElement}
      </View>
    </View>
  );
}

// ─── Main Screen ────────────────────────────────────────────
export default function LoginScreen() {
  const router = useRouter();
  const [cin, setCin] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [cinFocused, setCinFocused] = useState(false);
  const [pwdFocused, setPwdFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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

  const isFormValid = cin.trim().length >= 10 && password.trim().length >= 4;

  return (
    <KeyboardAvoidingView
      className="flex-1"
      style={{ backgroundColor: COLORS.bg }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar barStyle="light-content" backgroundColor={COLORS.red} />
      <ScrollView
        className="flex-1"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* ── Header ── */}
        <View
          className="pt-14 px-6 pb-14"
          style={{ backgroundColor: COLORS.red }}
        >
          {/* Badge */}
          <View
            className="self-start flex-row items-center gap-1.5 px-3 py-1.5 rounded-full mb-5"
            style={{ backgroundColor: 'rgba(255,255,255,0.18)' }}
          >
            <ShieldCheck size={11} color="rgba(255,255,255,0.9)" strokeWidth={2.5} />
            <Text
              className="text-[10px] font-bold tracking-[1.8px]"
              style={{ color: 'rgba(255,255,255,0.9)' }}
            >
              PLATEFORME SÉCURISÉE
            </Text>
          </View>

          <Text
            className="text-[28px] font-bold mb-2 leading-tight"
            style={{ color: COLORS.white, letterSpacing: -0.5 }}
          >
            Connexion{'\n'}électeur
          </Text>
          <Text
            className="text-[13px] leading-5"
            style={{ color: 'rgba(255,255,255,0.72)' }}
          >
            Entrez vos identifiants pour accéder{'\n'}au scrutin électronique
          </Text>
        </View>

        {/* ── Avatar chip ── */}
        <View className="items-center" style={{ marginTop: -24 }}>
          <View
            className="w-12 h-12 rounded-full items-center justify-center"
            style={{
              backgroundColor: COLORS.white,
              borderWidth: 3,
              borderColor: COLORS.white,
              shadowColor: COLORS.red,
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: 0.22,
              shadowRadius: 12,
              elevation: 6,
            }}
          >
            <UserRound size={22} color={COLORS.red} strokeWidth={2} />
          </View>
        </View>

        {/* ── Card Form ── */}
        <View
          className="mx-5 mt-5 rounded-3xl px-5 pt-6 pb-5"
          style={{
            backgroundColor: COLORS.surface,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.06,
            shadowRadius: 10,
            elevation: 3,
          }}
        >
          {/* CIN */}
          <InputField
            label="NUMÉRO CIN"
            value={cin}
            onChangeText={setCin}
            placeholder="Ex : 101 234 567 890"
            keyboardType="numeric"
            maxLength={18}
            focused={cinFocused}
            onFocus={() => setCinFocused(true)}
            onBlur={() => setCinFocused(false)}
            showValid
            isValid={cin.length >= 10}
          />

          {/* Password */}
          <InputField
            label="MOT DE PASSE"
            value={password}
            onChangeText={setPassword}
            placeholder="Votre mot de passe"
            secureTextEntry={!showPassword}
            focused={pwdFocused}
            onFocus={() => setPwdFocused(true)}
            onBlur={() => setPwdFocused(false)}
            rightElement={
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                className="ml-2 p-1"
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                {showPassword ? (
                  <EyeOff size={17} color={COLORS.textMuted} strokeWidth={2} />
                ) : (
                  <Eye size={17} color={COLORS.textMuted} strokeWidth={2} />
                )}
              </TouchableOpacity>
            }
          />

          {/* Forgot password */}
          <TouchableOpacity className="self-end mb-5 -mt-2">
            <Text
              className="text-[12px] font-semibold"
              style={{ color: COLORS.red }}
            >
              Mot de passe oublié ?
            </Text>
          </TouchableOpacity>

          {/* CTA */}
          <TouchableOpacity
            onPress={handleLogin}
            activeOpacity={0.82}
            disabled={isLoading}
            style={{
              height: 52,
              borderRadius: 16,
              backgroundColor: isFormValid ? COLORS.red : '#F3F4F6',
              alignItems: 'center',
              justifyContent: 'center',
              shadowColor: isFormValid ? COLORS.red : 'transparent',
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: isFormValid ? 0.3 : 0,
              shadowRadius: 12,
              elevation: isFormValid ? 4 : 0,
            }}
          >
            <View className="flex-row items-center gap-2">
              <ShieldCheck
                size={17}
                color={isFormValid ? '#FFFFFF' : '#9CA3AF'}
                strokeWidth={2.2}
              />
              <Text
                className="text-[15px] font-bold tracking-wide"
                style={{ color: isFormValid ? COLORS.white : COLORS.textMuted }}
              >
                Se connecter
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* ── Biometric section ── */}
        <View className="mx-5 mt-4">
          {/* Divider */}
          <View className="flex-row items-center gap-3 mb-4">
            <View className="flex-1 h-px" style={{ backgroundColor: COLORS.border }} />
            <Text
              className="text-[11px] font-medium"
              style={{ color: COLORS.textMuted }}
            >
              ou continuer avec
            </Text>
            <View className="flex-1 h-px" style={{ backgroundColor: COLORS.border }} />
          </View>

          <View className="flex-row gap-3">
            <TouchableOpacity
              onPress={handleBiometricFingerprint}
              activeOpacity={0.7}
              style={{
                flex: 1,
                height: 50,
                borderRadius: 14,
                backgroundColor: COLORS.surface,
                borderWidth: 1,
                borderColor: COLORS.border,
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'row',
                gap: 7,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.04,
                shadowRadius: 4,
                elevation: 1,
              }}
            >
              <Fingerprint size={17} color="#374151" strokeWidth={2} />
              <Text
                className="text-[13px] font-semibold"
                style={{ color: '#374151' }}
              >
                Empreinte
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleBiometricFace}
              activeOpacity={0.7}
              style={{
                flex: 1,
                height: 50,
                borderRadius: 14,
                backgroundColor: COLORS.surface,
                borderWidth: 1,
                borderColor: COLORS.border,
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'row',
                gap: 7,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.04,
                shadowRadius: 4,
                elevation: 1,
              }}
            >
              <ScanFace size={17} color="#374151" strokeWidth={2} />
              <Text
                className="text-[13px] font-semibold"
                style={{ color: '#374151' }}
              >
                Facial
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ── Footer links ── */}
        <View className="items-center mt-6 mb-10 gap-3">
          <TouchableOpacity hitSlop={{ top: 6, bottom: 6 }}>
            <Text className="text-[12px]" style={{ color: COLORS.textMuted }}>
              Problème d&apos;accès ?{' '}
              <Text className="font-bold" style={{ color: COLORS.red }}>
                Contacter le support
              </Text>
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push('/auth/register')}
            hitSlop={{ top: 6, bottom: 6 }}
          >
            <Text className="text-[12px]" style={{ color: COLORS.textMuted }}>
              Nouveau ici ?{' '}
              <Text className="font-bold" style={{ color: COLORS.red }}>
                Créer un compte
              </Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}