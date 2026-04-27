import { useLocalSearchParams } from "expo-router";
import { CheckCircle2, Lock, SearchCheck, ShieldCheck } from "lucide-react-native";
import { useMemo } from "react";
import { StatusBar, Text, View } from "react-native";

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

export default function VerifyReceiptScreen() {
  const { receiptId } = useLocalSearchParams<{ receiptId?: string }>();
  const id = useMemo(() => receiptId || "REC-2026-123456", [receiptId]);

  const [prefix, year, code] = id.split('-');

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.bg }}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.green} />

      {/* Header — green = valid context */}
      <View
        style={{
          backgroundColor: COLORS.green,
          paddingTop: 56,
          paddingHorizontal: 24,
          paddingBottom: 60,
          alignItems: 'center',
        }}
      >
        {/* Background ring */}
        <View
          style={{
            position: 'absolute',
            width: 240,
            height: 240,
            borderRadius: 120,
            backgroundColor: 'rgba(255,255,255,0.06)',
            top: -60,
            right: -60,
          }}
        />

        {/* Icon card */}
        <View
          style={{
            width: 72,
            height: 72,
            borderRadius: 22,
            backgroundColor: 'rgba(255,255,255,0.18)',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 16,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.18,
            shadowRadius: 16,
            elevation: 7,
          }}
        >
          <SearchCheck size={34} color={COLORS.white} strokeWidth={1.8} />
        </View>

        <Text
          style={{
            fontSize: 26,
            fontWeight: '800',
            color: COLORS.white,
            letterSpacing: -0.5,
            marginBottom: 6,
          }}
        >
          Vérification du reçu
        </Text>
        <Text
          style={{
            fontSize: 13,
            color: 'rgba(255,255,255,0.68)',
            textAlign: 'center',
          }}
        >
          Contrôle d&apos;authenticité du bulletin
        </Text>
      </View>

      <View style={{ paddingHorizontal: 20, paddingTop: 20 }}>

        {/* Status banner */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
            backgroundColor: COLORS.greenBg,
            borderRadius: 16,
            padding: 14,
            borderWidth: 1,
            borderColor: '#BBF7D0',
            marginBottom: 14,
          }}
        >
          <CheckCircle2 size={20} color={COLORS.green} strokeWidth={2} />
          <View>
            <Text style={{ fontSize: 13, fontWeight: '700', color: '#166534' }}>
              Reçu valide
            </Text>
            <Text style={{ fontSize: 11, color: '#4ADE80', marginTop: 1 }}>
              Authentification réussie
            </Text>
          </View>
        </View>

        {/* Receipt card */}
        <View
          style={{
            backgroundColor: COLORS.surface,
            borderRadius: 22,
            padding: 20,
            borderWidth: 1,
            borderColor: COLORS.border,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.05,
            shadowRadius: 8,
            elevation: 2,
            marginBottom: 14,
          }}
        >
          <Text
            style={{
              fontSize: 10,
              fontWeight: '700',
              letterSpacing: 1.4,
              color: COLORS.textMuted,
              marginBottom: 14,
            }}
          >
            IDENTIFIANT DE VÉRIFICATION
          </Text>

          {/* ID broken into segments */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 6,
              backgroundColor: COLORS.bg,
              borderRadius: 14,
              padding: 14,
              borderWidth: 1,
              borderColor: COLORS.border,
              marginBottom: 16,
            }}
          >
            {[prefix, year, code].map((segment, i) => (
              <View key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Text
                  style={{
                    fontSize: i === 0 ? 13 : 20,
                    fontWeight: '800',
                    color: i === 0 ? COLORS.textMuted : COLORS.textDark,
                    letterSpacing: i === 0 ? 1.5 : 1,
                  }}
                >
                  {segment}
                </Text>
                {i < 2 && (
                  <Text style={{ fontSize: 16, color: COLORS.border, fontWeight: '300' }}>–</Text>
                )}
              </View>
            ))}
          </View>

          {/* Meta rows */}
          <View style={{ gap: 10 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ fontSize: 12, color: COLORS.textMuted }}>Type</Text>
              <Text style={{ fontSize: 12, fontWeight: '600', color: COLORS.textDark }}>
                Vote présidentiel 2026
              </Text>
            </View>
            <View style={{ height: 1, backgroundColor: COLORS.border }} />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ fontSize: 12, color: COLORS.textMuted }}>Enregistrement</Text>
              <Text style={{ fontSize: 12, fontWeight: '600', color: COLORS.textDark }}>
                Confirmé
              </Text>
            </View>
            <View style={{ height: 1, backgroundColor: COLORS.border }} />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ fontSize: 12, color: COLORS.textMuted }}>Candidat</Text>
              <Text style={{ fontSize: 12, fontWeight: '600', color: COLORS.textMuted, fontStyle: 'italic' }}>
                Anonymisé
              </Text>
            </View>
          </View>
        </View>

        {/* Anonymity notice */}
        <View
          style={{
            backgroundColor: COLORS.surface,
            borderRadius: 18,
            padding: 16,
            flexDirection: 'row',
            alignItems: 'flex-start',
            gap: 12,
            borderWidth: 1,
            borderColor: COLORS.border,
          }}
        >
          <View
            style={{
              width: 34,
              height: 34,
              borderRadius: 10,
              backgroundColor: '#F3F4F6',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <ShieldCheck size={16} color="#374151" strokeWidth={2} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 13, fontWeight: '700', color: COLORS.textDark, marginBottom: 3 }}>
              Anonymat garanti
            </Text>
            <Text style={{ fontSize: 12, color: COLORS.textMuted, lineHeight: 18 }}>
              Ce reçu confirme qu&apos;un vote a bien été enregistré, sans jamais révéler le choix effectué.
            </Text>
          </View>
        </View>

      </View>
    </View>
  );
}