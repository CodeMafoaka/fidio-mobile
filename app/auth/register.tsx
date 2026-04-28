import Loader, { SuccessLoader } from '@/components/ui/Loader';
import { useRouter } from "expo-router";
import { Check, CircleCheckBig, Eye, EyeOff, UserPlus } from "lucide-react-native";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { useAuth } from "../../hooks/useAuth";

const COLORS = {
  red: '#F9423A',
  redDark: '#D93530',
  green: '#00843D',
  white: '#FFFFFF',
  textDark: '#111827',
  textMuted: '#9CA3AF',
  textSecondary: '#6B7280',
  border: '#E5E7EB',
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
  isValid?: boolean;
  showValid?: boolean;
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
  isValid = false,
  showValid = false,
  rightElement,
}: InputFieldProps) {
  const [focused, setFocused] = useState(false);

  return (
    <View className="mb-4">
      <Text
        className="text-[10px] font-bold tracking-[1.5px] mb-2"
        style={{ color: focused ? COLORS.red : COLORS.textSecondary }}
      >
        {label}
      </Text>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          height: 52,
          borderRadius: 16,
          paddingHorizontal: 16,
          backgroundColor: focused ? '#FFFBFB' : COLORS.surface,
          borderWidth: focused ? 1.5 : 1,
          borderColor: focused ? COLORS.red : COLORS.border,
          shadowColor: focused ? COLORS.red : '#000',
          shadowOffset: { width: 0, height: focused ? 4 : 1 },
          shadowOpacity: focused ? 0.08 : 0.04,
          shadowRadius: focused ? 8 : 3,
          elevation: focused ? 3 : 1,
        }}
      >
        <TextInput
          style={{
            flex: 1,
            fontSize: 14,
            fontWeight: '500',
            color: COLORS.textDark,
            letterSpacing: 0.1,
          }}
          placeholder={placeholder}
          placeholderTextColor={COLORS.textMuted}
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
          secureTextEntry={secureTextEntry}
          maxLength={maxLength}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
        {showValid && isValid && (
          <View
            style={{
              width: 20,
              height: 20,
              borderRadius: 10,
              backgroundColor: '#DCFCE7',
              alignItems: 'center',
              justifyContent: 'center',
              marginLeft: 8,
            }}
          >
            <Check size={11} color={COLORS.green} strokeWidth={3} />
          </View>
        )}
        {rightElement}
      </View>
    </View>
  );
}

// ─── Progress Steps indicator ───────────────────────────────
function StepDots({ total, current }: { total: number; current: number }) {
  return (
    <View style={{ flexDirection: 'row', gap: 5, alignItems: 'center' }}>
      {Array.from({ length: total }).map((_, i) => (
        <View
          key={i}
          style={{
            height: 4,
            width: i === current ? 20 : 6,
            borderRadius: 10,
            backgroundColor: i <= current ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.3)',
          }}
        />
      ))}
    </View>
  );
}

// ─── Main Screen ────────────────────────────────────────────
export default function RegisterScreen() {
  const router = useRouter();
  const { register, isLoading, error, clearError } = useAuth();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [cin, setCin] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showSuccessLoader, setShowSuccessLoader] = useState(false);
  const [showErrorLoader, setShowErrorLoader] = useState(false);

  const handleRegister = async () => {
    if (!firstName.trim() || !lastName.trim() || !cin.trim() || !password.trim()) {
      setShowErrorLoader(true);
      setTimeout(() => {
        setShowErrorLoader(false);
      }, 2000);
      return;
    }

    clearError();
    
    const result = await register({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      gid: cin.trim(),
      password: password.trim(),
    });

    if (result) {
      setShowSuccessLoader(true);
      setTimeout(() => {
        setShowSuccessLoader(false);
        router.replace({ pathname: "/home", params: { cin } });
      }, 2000);
    } else if (error) {
      setShowErrorLoader(true);
      setTimeout(() => {
        setShowErrorLoader(false);
      }, 2000);
    }
  };

  const isFormValid =
    firstName.trim().length >= 2 &&
    lastName.trim().length >= 2 &&
    cin.trim().length >= 10 &&
    password.trim().length >= 4;

  // Password strength
  const pwdStrength =
    password.length === 0 ? 0 :
    password.length < 6 ? 1 :
    password.length < 10 ? 2 : 3;

  const pwdStrengthColor = ['#E5E7EB', '#F87171', '#FBBF24', '#22C55E'][pwdStrength];
  const pwdStrengthLabel = ['', 'Faible', 'Moyen', 'Fort'][pwdStrength];

  return (
    <KeyboardAvoidingView
      className="flex-1"
      style={{ backgroundColor: COLORS.bg }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <StatusBar barStyle="light-content" backgroundColor={COLORS.red} />
      <ScrollView
        className="flex-1"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* ── Header ── */}
        <View
          style={{ backgroundColor: COLORS.red, paddingTop: 56, paddingHorizontal: 24, paddingBottom: 56 }}
        >
          {/* Step indicator */}
          <View style={{ marginBottom: 20 }}>
            <StepDots total={3} current={0} />
          </View>

          <Text
            style={{
              fontSize: 28,
              fontWeight: '800',
              color: COLORS.white,
              letterSpacing: -0.5,
              lineHeight: 34,
              marginBottom: 8,
            }}
          >
            Créer votre{'\n'}compte électeur
          </Text>
          <Text
            style={{
              fontSize: 13,
              color: 'rgba(255,255,255,0.72)',
              lineHeight: 20,
            }}
          >
            Accès sécurisé au vote électronique
          </Text>
        </View>

        {/* ── Avatar chip ── */}
        <View style={{ alignItems: 'center', marginTop: -24 }}>
          <View
            style={{
              width: 48,
              height: 48,
              borderRadius: 24,
              backgroundColor: COLORS.white,
              borderWidth: 3,
              borderColor: COLORS.white,
              alignItems: 'center',
              justifyContent: 'center',
              shadowColor: COLORS.red,
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: 0.22,
              shadowRadius: 12,
              elevation: 6,
            }}
          >
            <UserPlus size={20} color={COLORS.red} strokeWidth={2.2} />
          </View>
        </View>

        {/* ── Card Form ── */}
        <View
          style={{
            marginHorizontal: 20,
            marginTop: 20,
            borderRadius: 24,
            backgroundColor: COLORS.surface,
            paddingHorizontal: 20,
            paddingTop: 24,
            paddingBottom: 20,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.06,
            shadowRadius: 10,
            elevation: 3,
          }}
        >
          <InputField
            label="PRÉNOM"
            value={firstName}
            onChangeText={setFirstName}
            placeholder="Ex : Jean"
            showValid
            isValid={firstName.trim().length >= 2}
          />

          <InputField
            label="NOM"
            value={lastName}
            onChangeText={setLastName}
            placeholder="Ex : Rakoto"
            showValid
            isValid={lastName.trim().length >= 2}
          />

          <InputField
            label="NUMÉRO CIN"
            value={cin}
            onChangeText={setCin}
            placeholder="Ex : 101 234 567 890"
            keyboardType="numeric"
            showValid
            isValid={cin.trim().length >= 10}
          />

          {/* Password with strength indicator */}
          <InputField
            label="MOT DE PASSE"
            value={password}
            onChangeText={setPassword}
            placeholder="Définir un mot de passe"
            secureTextEntry={!showPassword}
            rightElement={
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={{ marginLeft: 8, padding: 4 }}
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

          {/* Password strength bar */}
          {password.length > 0 && (
            <View style={{ marginTop: -12, marginBottom: 16 }}>
              <View style={{ flexDirection: 'row', gap: 4, marginBottom: 5 }}>
                {[1, 2, 3].map((level) => (
                  <View
                    key={level}
                    style={{
                      flex: 1,
                      height: 3,
                      borderRadius: 10,
                      backgroundColor: pwdStrength >= level ? pwdStrengthColor : '#E5E7EB',
                    }}
                  />
                ))}
              </View>
              <Text
                style={{
                  fontSize: 10,
                  fontWeight: '600',
                  color: pwdStrengthColor,
                  letterSpacing: 0.5,
                }}
              >
                {pwdStrengthLabel}
              </Text>
            </View>
          )}

          {/* CTA */}
          <TouchableOpacity
            onPress={handleRegister}
            disabled={isLoading || !isFormValid}
            activeOpacity={0.82}
            style={{
              height: 52,
              borderRadius: 16,
              backgroundColor: (isFormValid && !isLoading) ? COLORS.red : '#F3F4F6',
              alignItems: 'center',
              justifyContent: 'center',
              shadowColor: (isFormValid && !isLoading) ? COLORS.red : 'transparent',
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: (isFormValid && !isLoading) ? 0.3 : 0,
              shadowRadius: 12,
              elevation: (isFormValid && !isLoading) ? 4 : 0,
              flexDirection: 'row',
              gap: 8,
              opacity: (isLoading || !isFormValid) ? 0.6 : 1,
            }}
          >
            {isLoading ? (
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: '700',
                  letterSpacing: 0.3,
                  color: COLORS.textMuted,
                }}
              >
                Inscription...
              </Text>
            ) : (
              <>
                <CircleCheckBig
                  size={17}
                  color={isFormValid ? COLORS.white : COLORS.textMuted}
                  strokeWidth={2.2}
                />
                <Text
                  style={{
                    fontSize: 15,
                    fontWeight: '700',
                    letterSpacing: 0.3,
                    color: isFormValid ? COLORS.white : COLORS.textMuted,
                  }}
                >
                  S&apos;inscrire
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* ── Footer ── */}
        <View style={{ alignItems: 'center', marginTop: 24, marginBottom: 40 }}>
          <TouchableOpacity
            onPress={() => router.replace("/auth/login")}
            hitSlop={{ top: 8, bottom: 8 }}
          >
            <Text style={{ fontSize: 12, color: COLORS.textMuted }}>
              Déjà inscrit ?{' '}
              <Text style={{ color: COLORS.red, fontWeight: '700' }}>
                Se connecter
              </Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      
      {/* Loaders */}
      <Loader 
        visible={isLoading} 
        message="Inscription en cours..." 
        size="large" 
      />
      
      <SuccessLoader 
        visible={showSuccessLoader} 
        message="Inscription réussie !" 
      />
      
      <Loader 
        visible={showErrorLoader} 
        message={error || "Veuillez remplir tous les champs"} 
        size="small" 
      />
    </KeyboardAvoidingView>
  );
}