import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';

const COLORS = {
  red: '#F9423A',
  white: '#FFFFFF',
  textDark: '#111827',
  textMuted: '#6B7280',
  bg: '#F9FAFB',
  surface: '#FFFFFF',
};

interface LoaderProps {
  visible: boolean;
  message?: string;
  size?: 'small' | 'large';
  overlay?: boolean;
}

export default function Loader({ 
  visible, 
  message = 'Chargement...', 
  size = 'large',
  overlay = true 
}: LoaderProps) {
  if (!visible) return null;

  const LoaderContent = () => (
    <View
      style={{
        backgroundColor: COLORS.surface,
        borderRadius: 16,
        padding: 24,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 8,
        minWidth: 200,
      }}
    >
      {/* Animated spinner */}
      <View
        style={{
          width: size === 'large' ? 48 : 32,
          height: size === 'large' ? 48 : 32,
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 16,
        }}
      >
        <ActivityIndicator
          size={size === 'large' ? 'large' : 'small'}
          color={COLORS.red}
        />
      </View>

      {/* Message */}
      <Text
        style={{
          fontSize: 14,
          fontWeight: '500',
          color: COLORS.textDark,
          textAlign: 'center',
          letterSpacing: 0.2,
        }}
      >
        {message}
      </Text>
    </View>
  );

  if (overlay) {
    return (
      <View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
        }}
      >
        <LoaderContent />
      </View>
    );
  }

  return (
    <View
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
      }}
    >
      <LoaderContent />
    </View>
  );
}

// Success loader for post-login/register
export function SuccessLoader({ visible, message }: { visible: boolean; message?: string }) {
  if (!visible) return null;

  return (
    <View
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
    >
      <View
        style={{
          backgroundColor: COLORS.surface,
          borderRadius: 16,
          padding: 24,
          alignItems: 'center',
          shadowColor: COLORS.red,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.15,
          shadowRadius: 12,
          elevation: 8,
          minWidth: 200,
        }}
      >
        {/* Success icon */}
        <View
          style={{
            width: 48,
            height: 48,
            borderRadius: 24,
            backgroundColor: '#DCFCE7',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 16,
          }}
        >
          <Text style={{ fontSize: 24, color: COLORS.red }}>✓</Text>
        </View>

        {/* Success message */}
        <Text
          style={{
            fontSize: 16,
            fontWeight: '600',
            color: COLORS.textDark,
            textAlign: 'center',
            letterSpacing: 0.2,
            marginBottom: 8,
          }}
        >
          {message || 'Opération réussie'}
        </Text>

        <Text
          style={{
            fontSize: 12,
            color: COLORS.textMuted,
            textAlign: 'center',
          }}
        >
          Redirection en cours...
        </Text>
      </View>
    </View>
  );
}
