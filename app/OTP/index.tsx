import { useLocalSearchParams, useRouter } from 'expo-router';
import { ChevronLeft, Delete, Smartphone } from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import {
    Alert,
    StatusBar,
    Text,
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
  keyBg: '#F7F7F7',
};

const OTP_LENGTH = 6;
// Simulated OTP (in production this would come from backend)
const SIMULATED_OTP = '473829';

export default function OTPScreen() {
  const router = useRouter();
  const { cin } = useLocalSearchParams<{ cin?: string }>();
  const [otp, setOtp] = useState('');
  const [timeLeft, setTimeLeft] = useState(180); // 3 minutes
  const [canResend, setCanResend] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const maskedPhone = '+261 32 ●●● ●● 47';

  useEffect(() => {
    startTimer();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  const startTimer = () => {
    setTimeLeft(180);
    setCanResend(false);
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current as ReturnType<typeof setInterval>);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleKeyPress = (key: string) => {
    if (key === 'del') {
      setOtp(prev => prev.slice(0, -1));
      return;
    }
    if (otp.length >= OTP_LENGTH) return;
    const newOtp = otp + key;
    setOtp(newOtp);
    if (newOtp.length === OTP_LENGTH) {
      verifyOtp(newOtp);
    }
  };

  const verifyOtp = (code: string) => {
    if (code === SIMULATED_OTP) {
      Alert.alert('Succes', `Connexion validee pour CIN ${cin ?? '***'}.`);
    } else {
      Alert.alert(
        'Code incorrect',
        'Le code saisi est invalide. Veuillez réessayer.',
        [{ text: 'OK', onPress: () => setOtp('') }]
      );
    }
  };

  const handleResend = () => {
    if (!canResend) return;
    setOtp('');
    startTimer();
    Alert.alert('Code renvoyé', `Un nouveau code a été envoyé au ${maskedPhone}`);
  };

  const keys = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['', '0', 'del'],
  ];

  return (
    <View className="flex-1 bg-white">
      <StatusBar barStyle="light-content" backgroundColor={COLORS.red} />

      {/* ── Header ── */}
      <View className="bg-red-500 pt-12 px-5 pb-6">
        <TouchableOpacity onPress={() => router.back()} className="flex-row items-center gap-1 mb-4">
          <ChevronLeft size={22} color="#FFFFFFCC" strokeWidth={2.5} />
          <Text className="text-white/80 text-xs">Retour</Text>
        </TouchableOpacity>
        <Text className="text-white text-[22px] font-bold tracking-tight">Vérification OTP</Text>
        <Text className="text-white/75 text-xs mt-1">Code de sécurité à usage unique</Text>
      </View>

      {/* ── Body ── */}
      <View className="flex-1 px-6 pt-7 items-center">
        {/* Icon */}
        <View className="w-16 h-16 bg-red-50 rounded-2xl items-center justify-center mb-5">
          <Smartphone size={30} color="#F9423A" strokeWidth={2} />
        </View>

        <Text className="text-xs text-gray-500 mb-1">Code envoyé au numéro</Text>
        <Text className="text-base font-semibold text-gray-900 mb-7">{maskedPhone}</Text>

        {/* OTP boxes */}
        <View className="flex-row gap-2.5 mb-5">
          {Array.from({ length: OTP_LENGTH }).map((_, i) => {
            const digit = otp[i];
            const isCurrent = i === otp.length;
            return (
              <View
                key={i}
                className={`w-11 h-[52px] rounded-xl items-center justify-center ${
                  digit ? "border-2 border-red-500 bg-red-50" : 
                  isCurrent ? "border-2 border-red-500 bg-white" : 
                  "border-[1.5px] border-gray-200 bg-white"
                }`}
              >
                <Text className={`text-[22px] font-bold text-red-500 ${!digit && "text-transparent"}`}>
                  {digit ?? '—'}
                </Text>
              </View>
            );
          })}
        </View>

        {/* Timer */}
        <Text className="text-xs text-gray-500 mb-2">
          Expire dans{' '}
          <Text className="text-red-500 font-semibold">{formatTime(timeLeft)}</Text>
        </Text>

        {/* Resend */}
        <TouchableOpacity onPress={handleResend} disabled={!canResend}>
          <Text className="text-xs text-gray-500 mb-1.5">
            Pas reçu ?{' '}
            <Text className={`text-green-600 font-semibold ${!canResend && "text-gray-400"}`}>
              Renvoyer le code
            </Text>
          </Text>
        </TouchableOpacity>

        {/* Dev hint */}
        <Text className="text-[11px] text-gray-300 mb-5 italic">Code de démo : {SIMULATED_OTP}</Text>

        {/* Keypad */}
        <View className="w-full gap-2">
          {keys.map((row, ri) => (
            <View key={ri} className="flex-row gap-2">
              {row.map((key, ki) => (
                <TouchableOpacity
                  key={ki}
                  className={`flex-1 h-12 rounded-xl items-center justify-center ${
                    key === '' ? "bg-transparent" :
                    key === 'del' ? "bg-red-50" :
                    "bg-gray-100"
                  }`}
                  onPress={() => key && handleKeyPress(key)}
                  activeOpacity={key ? 0.6 : 1}
                >
                  <Text className={`text-xl font-medium text-gray-900 ${key === 'del' && "text-base text-red-500"}`}>
                    {key === 'del' ? '' : key}
                  </Text>
                  {key === 'del' && <Delete size={18} color="#EF4444" strokeWidth={2} />}
                </TouchableOpacity>
              ))}
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}