import { useLocalSearchParams, useRouter } from "expo-router";
import { BarChart3, CheckCircle2, ChevronRight, Copy, ReceiptText } from "lucide-react-native";
import { Alert, StatusBar, Text, TouchableOpacity, View } from "react-native";

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

function buildReceiptId() {
  const rand = Math.floor(Math.random() * 900000 + 100000);
  return `REC-${new Date().getFullYear()}-${rand}`;
}

export default function VoteSuccessScreen() {
  const router = useRouter();
  const { candidateId } = useLocalSearchParams<{ candidateId?: string }>();
  const receiptId = buildReceiptId();

  const handleCopy = () => {
    Alert.alert("Copié", `Identifiant ${receiptId} copié.`);
  };

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

        {/* Receipt card */}
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
          {/* Card header */}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <View
              style={{
                width: 36,
                height: 36,
                borderRadius: 11,
                backgroundColor: '#F3F4F6',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ReceiptText size={17} color="#374151" strokeWidth={2} />
            </View>
            <View>
              <Text style={{ fontSize: 14, fontWeight: '700', color: COLORS.textDark }}>
                Reçu anonyme
              </Text>
              <Text style={{ fontSize: 11, color: COLORS.textMuted }}>
                Conservez cet identifiant
              </Text>
            </View>
          </View>

          {/* Receipt ID row */}
          <View
            style={{
              backgroundColor: COLORS.bg,
              borderRadius: 14,
              paddingHorizontal: 16,
              paddingVertical: 14,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderWidth: 1,
              borderColor: COLORS.border,
              marginBottom: 14,
            }}
          >
            <View>
              <Text style={{ fontSize: 10, fontWeight: '600', color: COLORS.textMuted, letterSpacing: 1, marginBottom: 4 }}>
                IDENTIFIANT DE VÉRIFICATION
              </Text>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: '800',
                  color: COLORS.textDark,
                  letterSpacing: 1,
                }}
              >
                {receiptId}
              </Text>
            </View>
            <TouchableOpacity
              onPress={handleCopy}
              activeOpacity={0.7}
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                backgroundColor: COLORS.surface,
                borderWidth: 1,
                borderColor: COLORS.border,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Copy size={15} color="#374151" strokeWidth={2} />
            </TouchableOpacity>
          </View>

          {/* Disclaimer */}
          <View
            style={{
              backgroundColor: COLORS.greenBg,
              borderRadius: 12,
              padding: 12,
              borderWidth: 1,
              borderColor: '#BBF7D0',
            }}
          >
            <Text style={{ fontSize: 11, color: '#166534', lineHeight: 17, fontWeight: '500' }}>
              🔒 Aucun candidat n&apos;apparaît dans ce reçu. Votre anonymat est garanti.
            </Text>
            {candidateId && (
              <Text style={{ fontSize: 10, color: '#4ADE80', marginTop: 4, letterSpacing: 0.3 }}>
                Réf. interne : {candidateId}
              </Text>
            )}
          </View>
        </View>

        {/* CTA buttons */}
        <TouchableOpacity
          onPress={() => router.push({ pathname: "/receipt/verify", params: { receiptId } })}
          activeOpacity={0.82}
          style={{
            height: 54,
            borderRadius: 16,
            backgroundColor: COLORS.red,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            marginBottom: 10,
            shadowColor: COLORS.red,
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.28,
            shadowRadius: 12,
            elevation: 5,
          }}
        >
          <ReceiptText size={17} color={COLORS.white} strokeWidth={2} />
          <Text style={{ fontSize: 15, fontWeight: '700', color: COLORS.white, letterSpacing: 0.2 }}>
            Vérifier ce reçu
          </Text>
          <ChevronRight size={16} color={COLORS.white} strokeWidth={2.5} />
        </TouchableOpacity>

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