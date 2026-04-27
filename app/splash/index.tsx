import { useRouter } from 'expo-router';
import { ShieldCheck } from 'lucide-react-native';
import React, { useEffect, useRef } from 'react';
import {
  Animated,
  StatusBar,
  Text,
  View,
} from 'react-native';

const COLORS = {
  red: '#F9423A',
  redDark: '#D93530',
  white: '#FFFFFF',
  green: '#00843D',
};

export default function SplashScreen() {
  const router = useRouter();
  const logoScale = useRef(new Animated.Value(0)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const textTranslateY = useRef(new Animated.Value(20)).current;
  const progress = useRef(new Animated.Value(0)).current;
  const badgeOpacity = useRef(new Animated.Value(0)).current;
  const badgeTranslateY = useRef(new Animated.Value(10)).current;

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
        Animated.timing(badgeOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(badgeTranslateY, {
          toValue: 0,
          duration: 500,
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
  }, [logoOpacity, logoScale, progress, router, textOpacity, textTranslateY, badgeOpacity, badgeTranslateY]);

  const progressWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.red, alignItems: 'center', justifyContent: 'center' }}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.red} />

      {/* ── Background geometry ── */}
      {/* Large top-right circle */}
      <View
        style={{
          position: 'absolute',
          width: 360,
          height: 360,
          borderRadius: 180,
          borderWidth: 70,
          borderColor: 'rgba(255,255,255,0.07)',
          top: -110,
          right: -110,
        }}
      />
      {/* Medium inner ring */}
      <View
        style={{
          position: 'absolute',
          width: 220,
          height: 220,
          borderRadius: 110,
          borderWidth: 40,
          borderColor: 'rgba(255,255,255,0.05)',
          top: -40,
          right: -40,
        }}
      />
      {/* Bottom-left circle */}
      <View
        style={{
          position: 'absolute',
          width: 260,
          height: 260,
          borderRadius: 130,
          borderWidth: 55,
          borderColor: 'rgba(0,0,0,0.08)',
          bottom: -90,
          left: -90,
        }}
      />
      {/* Subtle center glow */}
      <View
        style={{
          position: 'absolute',
          width: 280,
          height: 280,
          borderRadius: 140,
          backgroundColor: 'rgba(255,255,255,0.04)',
        }}
      />

      {/* ── Logo ── */}
      <Animated.View
        style={{
          marginBottom: 32,
          transform: [{ scale: logoScale }],
          opacity: logoOpacity,
        }}
      >
        {/* Outer glow ring */}
        <View
          style={{
            position: 'absolute',
            width: 108,
            height: 108,
            borderRadius: 28,
            backgroundColor: 'rgba(255,255,255,0.12)',
            top: -8,
            left: -8,
          }}
        />
        {/* Logo card */}
        <View
          style={{
            width: 92,
            height: 92,
            borderRadius: 24,
            backgroundColor: COLORS.white,
            alignItems: 'center',
            justifyContent: 'center',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 12 },
            shadowOpacity: 0.25,
            shadowRadius: 24,
            elevation: 12,
          }}
        >
          {/* Checkmark — two View segments forming a tick */}
          <View style={{ alignItems: 'center', justifyContent: 'center', width: 40, height: 40 }}>
            {/* Vertical short stroke */}
            <View
              style={{
                position: 'absolute',
                width: 5,
                height: 14,
                backgroundColor: COLORS.red,
                borderRadius: 3,
                bottom: 4,
                left: 8,
                transform: [{ rotate: '45deg' }],
              }}
            />
            {/* Long diagonal stroke */}
            <View
              style={{
                position: 'absolute',
                width: 5,
                height: 26,
                backgroundColor: COLORS.red,
                borderRadius: 3,
                bottom: 4,
                right: 6,
                transform: [{ rotate: '-45deg' }],
              }}
            />
          </View>
        </View>
      </Animated.View>

      {/* ── App name & tagline ── */}
      <Animated.View
        style={{
          alignItems: 'center',
          marginBottom: 60,
          opacity: textOpacity,
          transform: [{ translateY: textTranslateY }],
        }}
      >
        <Text
          style={{
            color: COLORS.white,
            fontSize: 36,
            fontWeight: '800',
            letterSpacing: -1,
            marginBottom: 10,
          }}
        >
          Fidio
        </Text>
        {/* Divider accent */}
        <View
          style={{
            width: 32,
            height: 2.5,
            borderRadius: 10,
            backgroundColor: 'rgba(255,255,255,0.4)',
            marginBottom: 12,
          }}
        />
        <Text
          style={{
            color: 'rgba(255,255,255,0.72)',
            fontSize: 14,
            textAlign: 'center',
            lineHeight: 22,
            letterSpacing: 0.2,
          }}
        >
          Votre vote, votre voix.{'\n'}En toute sécurité.
        </Text>
      </Animated.View>

      {/* ── Secure badge (animated in) ── */}
      <Animated.View
        style={{
          position: 'absolute',
          bottom: 96,
          right: 24,
          opacity: badgeOpacity,
          transform: [{ translateY: badgeTranslateY }],
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 6,
            backgroundColor: COLORS.green,
            paddingHorizontal: 12,
            paddingVertical: 7,
            borderRadius: 20,
            shadowColor: COLORS.green,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.35,
            shadowRadius: 8,
            elevation: 4,
          }}
        >
          <ShieldCheck size={12} color={COLORS.white} strokeWidth={2.5} />
          <Text
            style={{
              color: COLORS.white,
              fontSize: 11,
              fontWeight: '700',
              letterSpacing: 0.5,
            }}
          >
            Chiffré & Sécurisé
          </Text>
        </View>
      </Animated.View>

      {/* ── Progress bar ── */}
      <View
        style={{
          position: 'absolute',
          bottom: 52,
          width: 160,
          alignItems: 'center',
        }}
      >
        {/* Track */}
        <View
          style={{
            width: '100%',
            height: 3,
            backgroundColor: 'rgba(255,255,255,0.2)',
            borderRadius: 10,
            overflow: 'hidden',
          }}
        >
          <Animated.View
            style={{
              height: '100%',
              backgroundColor: COLORS.white,
              borderRadius: 10,
              width: progressWidth,
            }}
          />
        </View>
        {/* "Chargement..." label */}
        <Text
          style={{
            color: 'rgba(255,255,255,0.45)',
            fontSize: 10,
            fontWeight: '600',
            letterSpacing: 1.2,
            marginTop: 8,
          }}
        >
          CHARGEMENT…
        </Text>
      </View>
    </View>
  );
}