import { useRouter } from 'expo-router';
import { Lock } from 'lucide-react-native';
import React, { useEffect, useRef } from 'react';
import {
    Animated,
    StatusBar,
    Text,
    View,
} from 'react-native';

// ─── Palette ──────────────────────────────────────────────
const COLORS = {
  red: '#F9423A',
  redDark: '#FC3D32',
  green: '#00843D',
  white: '#FFFFFF',
};

export default function SplashScreen() {
  const router = useRouter();
  const logoScale = useRef(new Animated.Value(0)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const textTranslateY = useRef(new Animated.Value(20)).current;
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.spring(logoScale, {
          toValue: 1,
          tension: 60,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(textOpacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(textTranslateY, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(progress, {
        toValue: 1,
        duration: 1800,
        useNativeDriver: false,
      }),
    ]).start(() => {
      router.replace('/auth/login');
    });
  }, [logoOpacity, logoScale, progress, router, textOpacity, textTranslateY]);

  const progressWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View className="flex-1 bg-red-500 items-center justify-center">
      <StatusBar barStyle="light-content" backgroundColor={COLORS.red} />

      {/* Decorative circles */}
      <View className="absolute w-[300px] h-[300px] rounded-full border-[60px] border-white/10 top-[-80px] right-[-80px]" />
      <View className="absolute w-[200px] h-[200px] rounded-full border-[40px] border-white/5 bottom-[-40px] left-[-40px]" />

      {/* Secure badge */}
      <View className="absolute bottom-24 right-6 bg-green-600 px-3 py-1 rounded-full">
        <View className="flex-row items-center gap-1.5">
          <Lock size={12} color="#FFFFFF" strokeWidth={2.5} />
          <Text className="text-white text-xs font-semibold">Chiffré</Text>
        </View>
      </View>

      {/* Logo */}
      <Animated.View
        className="mb-7"
        style={{ transform: [{ scale: logoScale }], opacity: logoOpacity }}
      >
        <View className="w-21 h-21 bg-white rounded-2xl items-center justify-center shadow-lg">
          {/* Checkmark SVG-like with View */}
          <View className="w-9 h-5 border-b-4 border-l-4 border-red-500 transform -rotate-45 -translate-y-1 rounded-sm" />
        </View>
      </Animated.View>

      {/* App name & tagline */}
      <Animated.View
        className="items-center mb-14"
        style={{ opacity: textOpacity, transform: [{ translateY: textTranslateY }] }}
      >
        <Text className="text-white text-[28px] font-bold tracking-tight mb-2">VotoSecure</Text>
        <Text className="text-white/75 text-sm text-center leading-5">
          Votre vote, votre voix.{'\n'}En toute sécurité.
        </Text>
      </Animated.View>

      {/* Progress bar */}
      <View className="absolute bottom-14 w-[140px] h-1 bg-white/25 rounded-full overflow-hidden">
        <Animated.View className="h-full bg-white rounded-full" style={{ width: progressWidth }} />
      </View>
    </View>
  );
}