import { useLocalSearchParams, useRouter } from "expo-router";
import { AlertTriangle, ChevronRight, Lock, X } from "lucide-react-native";
import { StatusBar, Text, TouchableOpacity, View } from "react-native";

const COLORS = {
  red: '#F9423A',
  white: '#FFFFFF',
  textDark: '#111827',
  textSecondary: '#6B7280',
  textMuted: '#9CA3AF',
  border: '#E5E7EB',
  bg: '#F9FAFB',
  surface: '#FFFFFF',
};

const CANDIDATE_LABELS: Record<string, { name: string; party: string }> = {
  c1: { name: "Andry R.", party: "Union citoyenne" },
  c2: { name: "Miora L.", party: "Mada verte" },
  c3: { name: "Tiana M.", party: "Justice sociale" },
};

export default function ConfirmVoteScreen() {
  const router = useRouter();
  const { candidateId } = useLocalSearchParams<{ candidateId?: string }>();
  const candidate = candidateId ? CANDIDATE_LABELS[candidateId] : null;

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.bg }}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.red} />

      {/* Header */}
      <View style={{ backgroundColor: COLORS.red, paddingTop: 56, paddingHorizontal: 24, paddingBottom: 52 }}>
        <Text style={{ fontSize: 11, fontWeight: '700', letterSpacing: 1.6, color: 'rgba(255,255,255,0.6)', marginBottom: 6 }}>
          ÉTAPE FINALE
        </Text>
        <Text style={{ fontSize: 26, fontWeight: '800', color: COLORS.white, letterSpacing: -0.5, marginBottom: 6 }}>
          Confirmer{'\n'}votre vote
        </Text>
        <Text style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)' }}>
          Vérifiez votre sélection avant de valider.
        </Text>
      </View>

      <View style={{ paddingHorizontal: 20, paddingTop: 20, flex: 1 }}>

        {/* Warning banner */}
        <View
          style={{
            backgroundColor: '#FEF2F2',
            borderRadius: 18,
            padding: 16,
            flexDirection: 'row',
            alignItems: 'flex-start',
            gap: 12,
            borderWidth: 1,
            borderColor: '#FECACA',
            marginBottom: 14,
          }}
        >
          <View
            style={{
              width: 36,
              height: 36,
              borderRadius: 11,
              backgroundColor: '#FEE2E2',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <AlertTriangle size={17} color="#DC2626" strokeWidth={2.2} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 13, fontWeight: '700', color: '#991B1B', marginBottom: 3 }}>
              Action irréversible
            </Text>
            <Text style={{ fontSize: 12, color: '#B91C1C', lineHeight: 18 }}>
              Après validation, votre vote est définitivement enregistré et ne peut plus être modifié.
            </Text>
          </View>
        </View>

        {/* Selected candidate card */}
        <View
          style={{
            backgroundColor: COLORS.surface,
            borderRadius: 20,
            padding: 20,
            borderWidth: 1,
            borderColor: COLORS.border,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.05,
            shadowRadius: 8,
            elevation: 2,
            marginBottom: 28,
          }}
        >
          <Text style={{ fontSize: 10, fontWeight: '700', letterSpacing: 1.4, color: COLORS.textMuted, marginBottom: 12 }}>
            VOTRE SÉLECTION
          </Text>

          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
            {/* Avatar */}
            <View
              style={{
                width: 52,
                height: 52,
                borderRadius: 16,
                backgroundColor: '#FFF0EF',
                alignItems: 'center',
                justifyContent: 'center',
                borderWidth: 1.5,
                borderColor: '#FECACA',
              }}
            >
              <Text style={{ fontSize: 17, fontWeight: '800', color: COLORS.red }}>
                {candidate?.name.slice(0, 2).toUpperCase() ?? '??'}
              </Text>
            </View>

            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 18, fontWeight: '800', color: COLORS.textDark, letterSpacing: -0.2 }}>
                {candidate?.name ?? candidateId ?? 'Non défini'}
              </Text>
              {candidate?.party && (
                <Text style={{ fontSize: 12, color: COLORS.textMuted, marginTop: 2 }}>
                  {candidate.party}
                </Text>
              )}
            </View>
          </View>

          {/* Divider */}
          <View style={{ height: 1, backgroundColor: COLORS.border, marginVertical: 14 }} />

          {/* Lock row */}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Lock size={13} color={COLORS.textMuted} strokeWidth={2} />
            <Text style={{ fontSize: 11, color: COLORS.textMuted, letterSpacing: 0.2 }}>
              Ce choix sera chiffré et anonymisé
            </Text>
          </View>
        </View>

        {/* CTA buttons */}
        <TouchableOpacity
          onPress={() => router.replace({ pathname: "/election/success", params: { candidateId: candidateId ?? "" } })}
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
          <Text style={{ fontSize: 15, fontWeight: '700', color: COLORS.white, letterSpacing: 0.2 }}>
            Valider mon vote
          </Text>
          <ChevronRight size={17} color={COLORS.white} strokeWidth={2.5} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.back()}
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
          <X size={15} color="#374151" strokeWidth={2.2} />
          <Text style={{ fontSize: 15, fontWeight: '600', color: '#374151' }}>
            Annuler
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}