import { useLocalSearchParams, useRouter } from "expo-router";
import { BarChart3, CheckCircle2 } from "lucide-react-native";
import { StatusBar, Text, TouchableOpacity, View } from "react-native";

const COLORS = {
  red: '#F9423A',
  green: '#16A34A',
  greenLight: '#DCFCE7',
  greenBg: '#F0FDF4',
  white: '#FFFFFF',
  textDark: '#111827',
  textSecondary: '#6B7280',
  textMuted: '#9CA3AF',
  border: '#E5E7EB',
  bg: '#F9FAFB',
  surface: '#FFFFFF',
};

export default function VoteSuccessScreen() {
  const router = useRouter();
  const { candidateId } = useLocalSearchParams<{ candidateId?: string }>();

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.bg }}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.green} />

      {/* Header — green for success */}
      <View
        style={{
          backgroundColor: COLORS.green,
          paddingTop: 56,
          paddingHorizontal: 24,
          paddingBottom: 60,
          alignItems: 'center',
        }}
      >
        {/* Glow ring */}
        <View
          style={{
            position: 'absolute',
            width: 260,
            height: 260,
            borderRadius: 130,
            backgroundColor: 'rgba(255,255,255,0.05)',
            top: -60,
            right: -60,
          }}
        />

        {/* Icon */}
        <View
          style={{
            width: 76,
            height: 76,
            borderRadius: 24,
            backgroundColor: 'rgba(255,255,255,0.18)',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 18,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.2,
            shadowRadius: 16,
            elevation: 8,
          }}
        >
          <CheckCircle2 size={38} color={COLORS.white} strokeWidth={1.8} />
        </View>

        <Text
          style={{
            fontSize: 26,
            fontWeight: '800',
            color: COLORS.white,
            letterSpacing: -0.5,
            marginBottom: 8,
          }}
        >
          Vote enregistré !
        </Text>
        <Text
          style={{
            fontSize: 13,
            color: 'rgba(255,255,255,0.7)',
            textAlign: 'center',
            lineHeight: 20,
          }}
        >
          Votre bulletin est validé et définitivement{'\n'}enregistré de façon anonyme.
        </Text>
      </View>

      <View style={{ paddingHorizontal: 20, paddingTop: 20, flex: 1 }}>

        {/* Confirmation message */}
        <View
          style={{
            backgroundColor: COLORS.surface,
            borderRadius: 22,
            padding: 20,
            marginBottom: 14,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.06,
            shadowRadius: 10,
            elevation: 3,
          }}
        >
          <Text style={{ fontSize: 14, fontWeight: '700', color: COLORS.textDark, marginBottom: 8 }}>
            Vote confirmé
          </Text>
          <Text style={{ fontSize: 12, color: COLORS.textMuted, lineHeight: 18 }}>
            Votre choix a été enregistré de manière sécurisée et anonyme dans le système de vote électronique.
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => router.push("/results/live")}
          activeOpacity={0.7}
          style={{
            height: 54,
            borderRadius: 16,
            backgroundColor: COLORS.surface,
            borderWidth: 1,
            borderColor: COLORS.border,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
          }}
        >
          <BarChart3 size={17} color="#374151" strokeWidth={2} />
          <Text style={{ fontSize: 15, fontWeight: '600', color: '#374151' }}>
            Résultats en direct
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}